import {
    runPayroll,
    getPayrollHistory,
    getPayrollById,
    finalizePayroll
} from '../services/payroll.service.js';
import { STATUS } from '../utils/statusCodes.js';
import { MESSAGES } from '../utils/messages.js';

export const run = async (req, res, next) => {
    try {
        const { month, year } = req.body;
        const adminId = req.user.userId;

        if (!month || !year) {
            throw new Error('Month and year are required');
        }

        const payrolls = await runPayroll(parseInt(month), parseInt(year), adminId);
        res.status(STATUS.CREATED).json({
            success: true,
            message: `Payroll run successfully for ${month}/${year}`,
            data: payrolls,
        });
    } catch (error) {
        next(error);
    }
};

export const history = async (req, res, next) => {
    try {
        const { employeeId, month, page, limit } = req.query;
        const result = await getPayrollHistory({ employeeId, month, page, limit });
        res.status(STATUS.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const payroll = await getPayrollById(req.params.id);
        res.status(STATUS.OK).json({
            success: true,
            data: payroll,
        });
    } catch (error) {
        next(error);
    }
};

export const finalize = async (req, res, next) => {
    try {
        const payroll = await finalizePayroll(req.params.id);
        res.status(STATUS.OK).json({
            success: true,
            message: 'Payroll finalized successfully',
            data: payroll,
        });
    } catch (error) {
        next(error);
    }
};