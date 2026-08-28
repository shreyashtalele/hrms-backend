import PDFDocument from 'pdfkit';
import { Payroll } from '../models/Payroll.model.js';
import { User } from '../models/User.model.js';

const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
};

const formatCurrency = (amount) => {
    return `Rs. ${amount.toFixed(2)}`;
};

const generateSalarySlipPDF = async (payrollId) => {
    const payroll = await Payroll.findById(payrollId)
        .populate('employeeId', 'fullName email employeeId designation monthlySalary')
        .populate('createdBy', 'fullName email');

    if (!payroll) {
        throw new Error('Payroll not found');
    }

    const employee = payroll.employeeId;
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    return new Promise((resolve, reject) => {
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });
        doc.on('error', reject);

        // Header - Company Name
        doc.fontSize(20)
            .text('HRMS Company Pvt. Ltd.', { align: 'center' })
            .fontSize(10)
            .text('123 Business Park, City, Country', { align: 'center' })
            .moveDown();

        // Title - Salary Slip
        doc.fontSize(16)
            .text('Salary Slip', { align: 'center' })
            .moveDown();

        // Separator Line
        doc.moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();
        doc.moveDown();

        // Employee Details
        doc.fontSize(12);
        doc.text(`Employee Name: ${employee.fullName}`, { continued: true })
            .text(`  Employee ID: ${employee.employeeId}`, { align: 'right' });
        doc.text(`Designation: ${employee.designation}`);
        doc.text(`Email: ${employee.email}`);
        doc.text(`Payroll Period: ${formatMonth(payroll.month)}`);
        doc.text(`Payment Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`);
        doc.moveDown();

        // Separator Line
        doc.moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();
        doc.moveDown();

        // Salary Details
        doc.fontSize(14).text('Salary Details', { underline: true }).moveDown();
        doc.fontSize(12);
        doc.text(`Gross Salary: ${formatCurrency(payroll.grossSalary)}`, { continued: true })
            .text(`  Working Days: ${payroll.workingDaysInMonth}`, { align: 'right' });
        doc.text(`Per Day Salary: ${formatCurrency(payroll.perDaySalary)}`);
        doc.moveDown();

        // Deductions Breakdown
        doc.fontSize(14).text('Deduction Details', { underline: true }).moveDown();
        doc.fontSize(12);

        const deductions = payroll.deductions;
        let hasDeductions = false;

        if (deductions.unpaidLeave.days > 0) {
            doc.text(`Unpaid Leave (${deductions.unpaidLeave.days} days): ${formatCurrency(deductions.unpaidLeave.amount)}`);
            hasDeductions = true;
        }
        if (deductions.absentDays.days > 0) {
            doc.text(`Absent Days (${deductions.absentDays.days} days): ${formatCurrency(deductions.absentDays.amount)}`);
            hasDeductions = true;
        }
        if (deductions.lateMarkDeductions.halfDays > 0) {
            doc.text(`Late Mark Deductions (${deductions.lateMarkDeductions.halfDays} half-days): ${formatCurrency(deductions.lateMarkDeductions.amount)}`);
            hasDeductions = true;
        }
        if (deductions.paidLeaveUsed.days > 0) {
            doc.text(`Paid Leave Used (${deductions.paidLeaveUsed.days} days): ${formatCurrency(deductions.paidLeaveUsed.amount)}`);
            hasDeductions = true;
        }

        if (!hasDeductions) {
            doc.text('No deductions applied.');
        }

        doc.text(`Total Deduction: ${formatCurrency(deductions.totalDeduction)}`, { bold: true });
        doc.moveDown();

        // Separator Line
        doc.moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();
        doc.moveDown();

        // Net Salary
        doc.fontSize(16)
            .text(`Net Salary: ${formatCurrency(payroll.netSalary)}`, { align: 'center', bold: true });
        doc.moveDown();

        // Footer
        doc.fontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'left' });
        doc.text(`Slip ID: ${payroll._id}`, { align: 'right' });
        doc.moveDown();
        doc.text('This is a system-generated salary slip.', { align: 'center', color: 'grey' });

        doc.end();
    });
};

export const generateAndDownloadSlip = async (payrollId) => {
    const pdfBuffer = await generateSalarySlipPDF(payrollId);
    return pdfBuffer;
};