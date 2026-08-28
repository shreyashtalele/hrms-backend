import {
    applyLeave,
    getMyLeaveRequests,
    getAllLeaveRequests,
    approveLeave,
    rejectLeave,
    getLeaveBalance
} from '../services/leave.service.js';
import { STATUS } from '../utils/statusCodes.js';
import { MESSAGES } from '../utils/messages.js';

export const apply = async (req, res, next) => {
    try {
        const employeeId = req.user.userId;
        const leave = await applyLeave(employeeId, req.body);
        res.status(STATUS.CREATED).json({
            success: true,
            message: 'Leave applied successfully',
            data: leave,
        });
    } catch (error) {
        next(error);
    }
};

export const myRequests = async (req, res, next) => {
    try {
        const employeeId = req.user.userId;
        const leaves = await getMyLeaveRequests(employeeId);
        res.status(STATUS.OK).json({
            success: true,
            data: leaves,
        });
    } catch (error) {
        next(error);
    }
};

export const allRequests = async (req, res, next) => {
    try {
        const { status, page, limit } = req.query;
        const result = await getAllLeaveRequests({ status, page, limit });
        res.status(STATUS.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const approve = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const leave = await approveLeave(req.params.id, adminId);
        res.status(STATUS.OK).json({
            success: true,
            message: 'Leave approved successfully',
            data: leave,
        });
    } catch (error) {
        next(error);
    }
};

export const reject = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const leave = await rejectLeave(req.params.id, adminId);
        res.status(STATUS.OK).json({
            success: true,
            message: 'Leave rejected successfully',
            data: leave,
        });
    } catch (error) {
        next(error);
    }
};

export const balance = async (req, res, next) => {
    try {
        const employeeId = req.params.employeeId || req.user.userId;
        const balances = await getLeaveBalance(employeeId);
        res.status(STATUS.OK).json({
            success: true,
            data: balances,
        });
    } catch (error) {
        next(error);
    }
};