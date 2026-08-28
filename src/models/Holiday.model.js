import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

holidaySchema.index({ date: 1 });

export const Holiday = mongoose.model('Holiday', holidaySchema);