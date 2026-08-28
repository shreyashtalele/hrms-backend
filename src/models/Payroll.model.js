import mongoose from 'mongoose';

const deductionSchema = new mongoose.Schema({
    unpaidLeave: {
        days: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
    },
    absentDays: {
        days: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
    },
    lateMarkDeductions: {
        halfDays: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
    },
    paidLeaveUsed: {
        days: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
    },
    totalDeduction: { type: Number, default: 0 },
}, { _id: false });

const payrollSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    month: {
        type: String,
        required: true,
        index: true,
    },
    grossSalary: {
        type: Number,
        required: true,
    },
    workingDaysInMonth: {
        type: Number,
        required: true,
    },
    perDaySalary: {
        type: Number,
        required: true,
    },
    deductions: {
        type: deductionSchema,
        default: {},
    },
    netSalary: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'finalized'],
        default: 'draft',
    },
    finalizedAt: {
        type: Date,
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

payrollSchema.index({ employeeId: 1, month: 1 }, { unique: true });

export const Payroll = mongoose.model('Payroll', payrollSchema);