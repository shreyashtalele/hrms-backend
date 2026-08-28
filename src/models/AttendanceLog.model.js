import mongoose from 'mongoose';

const punchSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['in', 'out'],
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
}, { _id: false });

const attendanceLogSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    punches: [punchSchema],
    totalWorkingHours: {
        type: Number,
        default: 0,
    },
    totalBreakHours: {
        type: Number,
        default: 0,
    },
    isLate: {
        type: Boolean,
        default: false,
    },
    lateMinutes: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day', 'holiday', 'leave'],
        default: 'absent',
    },
    leaveRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveRequest',
        default: null,
    },
    holidayId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Holiday',
        default: null,
    },
}, {
    timestamps: true,
});

attendanceLogSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema);