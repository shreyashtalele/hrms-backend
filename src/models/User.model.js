import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dateOfJoining: {
        type: Date,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    monthlySalary: {
        type: Number,
        required: true,
    },
    employmentType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentType',
        required: true,
    },
    reportingManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    leaveBalances: [
        {
            leaveType: String,
            total: Number,
            used: Number,
            remaining: Number,
        },
    ],
    refreshTokenVersion: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export const User = mongoose.model('User', userSchema);