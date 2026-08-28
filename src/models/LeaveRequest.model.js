import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    leaveType: {
        type: String,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    isHalfDay: {
        type: Boolean,
        default: false,
    },
    halfDaySession: {
        type: String,
        enum: ['first', 'second'],
        default: null,
    },
    reason: {
        type: String,
        required: true,
    },
    daysCount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    approvedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

leaveRequestSchema.index({ employeeId: 1, status: 1 });
leaveRequestSchema.index({ fromDate: -1, toDate: -1 });

export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);