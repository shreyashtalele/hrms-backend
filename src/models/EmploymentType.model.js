import mongoose from 'mongoose';

const employmentTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    leavePolicies: [
        {
            leaveType: {
                type: String,
                required: true,
            },
            annualDays: {
                type: Number,
                default: 0,
            },
            isUnlimited: {
                type: Boolean,
                default: false,
            },
        },
    ],
}, {
    timestamps: true,
});

export const EmploymentType = mongoose.model('EmploymentType', employmentTypeSchema);