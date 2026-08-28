import { Payroll } from '../models/Payroll.model.js';
import { User } from '../models/User.model.js';
import { AttendanceLog } from '../models/AttendanceLog.model.js';
import { LeaveRequest } from '../models/LeaveRequest.model.js';
import { Holiday } from '../models/Holiday.model.js';
import { config } from '../config/env.js';
import { MESSAGES } from '../utils/messages.js';

const getWorkingDaysInMonth = async (year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const holidays = await Holiday.find({
        date: { $gte: startDate, $lte: endDate }
    });
    const holidayDates = holidays.map(h => h.date.toISOString().split('T')[0]);

    let workingDays = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
        const dayOfWeek = current.getDay();
        const dateStr = current.toISOString().split('T')[0];
        const isWeekend = config.WEEKEND_DAYS.includes(['sunday', 'saturday'][dayOfWeek]);
        if (!isWeekend && !holidayDates.includes(dateStr)) {
            workingDays++;
        }
        current.setDate(current.getDate() + 1);
    }
    return workingDays;
};

const getEmployeeAttendance = async (employeeId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const attendance = await AttendanceLog.find({
        employeeId,
        date: { $gte: startDate, $lte: endDate }
    });
    return attendance;
};

const getEmployeeLeaves = async (employeeId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const leaves = await LeaveRequest.find({
        employeeId,
        status: 'approved',
        fromDate: { $lte: endDate },
        toDate: { $gte: startDate }
    });
    return leaves;
};

export const runPayroll = async (month, year, adminId) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    const employees = await User.find({ role: 'employee', status: 'active' });
    const results = [];

    for (const employee of employees) {
        const workingDays = await getWorkingDaysInMonth(year, month);
        const perDaySalary = employee.monthlySalary / workingDays;

        const attendance = await getEmployeeAttendance(employee._id, year, month);
        const leaves = await getEmployeeLeaves(employee._id, year, month);

        let unpaidLeaveDays = 0;
        let absentDays = 0;
        let lateMarks = 0;

        const presentDays = attendance.filter(a => a.status === 'present').length;
        const halfDays = attendance.filter(a => a.status === 'half-day').length;

        attendance.forEach(record => {
            if (record.isLate) lateMarks++;
            if (record.status === 'absent') absentDays++;
        });

        // Calculate late mark deductions (3 marks = 0.5 day)
        const lateMarkHalfDays = Math.floor(lateMarks / 3);
        const lateMarkAmount = lateMarkHalfDays * perDaySalary * 0.5;

        // Check paid leave balance
        const paidLeaveBalance = employee.leaveBalances.find(
            b => b.leaveType === 'Paid Leave'
        );
        let paidLeaveUsed = 0;
        let leaveAdjustmentDays = 0;

        // If employee has absent days, try to use paid leave first
        if (absentDays > 0 && paidLeaveBalance && paidLeaveBalance.remaining > 0) {
            leaveAdjustmentDays = Math.min(absentDays, paidLeaveBalance.remaining);
            paidLeaveUsed = leaveAdjustmentDays;
            absentDays -= leaveAdjustmentDays;

            // Update paid leave balance
            paidLeaveBalance.used += paidLeaveUsed;
            paidLeaveBalance.remaining -= paidLeaveUsed;
            await employee.save();
        }

        // Calculate deductions
        const unpaidLeaveAmount = absentDays * perDaySalary;
        const absentAmount = absentDays * perDaySalary;
        const halfDayAmount = halfDays * perDaySalary * 0.5;

        const totalDeduction = unpaidLeaveAmount + absentAmount + lateMarkAmount + halfDayAmount;
        const netSalary = employee.monthlySalary - totalDeduction;

        const payroll = new Payroll({
            employeeId: employee._id,
            month: monthStr,
            grossSalary: employee.monthlySalary,
            workingDaysInMonth: workingDays,
            perDaySalary,
            deductions: {
                unpaidLeave: { days: absentDays, amount: unpaidLeaveAmount },
                absentDays: { days: absentDays, amount: absentAmount },
                lateMarkDeductions: { halfDays: lateMarkHalfDays, amount: lateMarkAmount },
                paidLeaveUsed: { days: paidLeaveUsed, amount: 0 },
                totalDeduction,
            },
            netSalary,
            status: 'draft',
            createdBy: adminId,
        });

        await payroll.save();
        results.push(payroll);
    }

    return results;
};

export const getPayrollHistory = async (filters = {}) => {
    const { employeeId, month, page = 1, limit = 20 } = filters;

    const query = {};
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = month;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payrolls, total] = await Promise.all([
        Payroll.find(query)
            .populate('employeeId', 'fullName email employeeId')
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip),
        Payroll.countDocuments(query),
    ]);

    return {
        data: payrolls,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

export const getPayrollById = async (payrollId) => {
    const payroll = await Payroll.findById(payrollId)
        .populate('employeeId', 'fullName email employeeId designation monthlySalary')
        .populate('createdBy', 'fullName email');

    if (!payroll) {
        throw new Error('Payroll not found');
    }

    return payroll;
};

export const finalizePayroll = async (payrollId) => {
    const payroll = await Payroll.findById(payrollId);
    if (!payroll) {
        throw new Error('Payroll not found');
    }

    if (payroll.status === 'finalized') {
        throw new Error('Payroll is already finalized');
    }

    payroll.status = 'finalized';
    payroll.finalizedAt = new Date();
    await payroll.save();

    return payroll;
};