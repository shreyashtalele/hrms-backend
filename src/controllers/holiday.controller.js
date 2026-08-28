import { Holiday } from '../models/Holiday.model.js';
import { STATUS } from '../utils/statusCodes.js';
import { MESSAGES } from '../utils/messages.js';

export const list = async (req, res, next) => {
    try {
        const { year } = req.query;
        const query = {};
        if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            query.date = { $gte: startDate, $lte: endDate };
        }
        const holidays = await Holiday.find(query).sort({ date: 1 });
        res.status(STATUS.OK).json({
            success: true,
            data: holidays,
        });
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const { name, date, description } = req.body;

        const existingHoliday = await Holiday.findOne({ date: new Date(date) });
        if (existingHoliday) {
            throw new Error('Holiday already exists on this date');
        }

        const holiday = new Holiday({
            name,
            date: new Date(date),
            description: description || '',
        });
        await holiday.save();
        res.status(STATUS.CREATED).json({
            success: true,
            message: 'Holiday created successfully',
            data: holiday,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const { name, date, description } = req.body;
        const holiday = await Holiday.findById(req.params.id);
        if (!holiday) {
            throw new Error('Holiday not found');
        }
        if (name) holiday.name = name;
        if (date) holiday.date = new Date(date);
        if (description !== undefined) holiday.description = description;
        await holiday.save();
        res.status(STATUS.OK).json({
            success: true,
            message: 'Holiday updated successfully',
            data: holiday,
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const holiday = await Holiday.findById(req.params.id);
        if (!holiday) {
            throw new Error('Holiday not found');
        }
        await holiday.deleteOne();
        res.status(STATUS.OK).json({
            success: true,
            message: 'Holiday deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};