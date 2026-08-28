import {
    punchIn,
    punchOut,
    getTodayStats,
    getAttendanceHistory,
    getCalendarData,
    getAdminAttendance
} from '../services/attendance.service.js';
import { STATUS } from '../utils/statusCodes.js';

export const punchInController = async (req, res, next) => {
    try {
        const employeeId = req.user.userId;
        const attendance = await punchIn(employeeId);
        res.status(STATUS.OK).json({
            success: true,
            message: 'Punched in successfully',
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
};

export const punchOutController = async (req, res, next) => {
    try {
        const employeeId = req.user.userId;
        const attendance = await punchOut(employeeId);
        res.status(STATUS.OK).json({
            success: true,
            message: 'Punched out successfully',
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
};

export const todayStats = async (req, res, next) => {
    try {
        const employeeId = req.user.userId;
        const stats = await getTodayStats(employeeId);
        res.status(STATUS.OK).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

export const history = async (req, res, next) => {
    try {
        const employeeId = req.user.userId;
        const { month, year, page, limit } = req.query;
        const result = await getAttendanceHistory(employeeId, { month, year, page, limit });
        res.status(STATUS.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const calendar = async (req, res, next) => {
    try {
        const employeeId = req.user.userId;
        const { month, year } = req.params;
        const calendarData = await getCalendarData(employeeId, parseInt(month), parseInt(year));
        res.status(STATUS.OK).json({
            success: true,
            data: calendarData,
        });
    } catch (error) {
        next(error);
    }
};

export const adminAttendance = async (req, res, next) => {
    try {
        const { employeeId, month, year, page, limit } = req.query;
        const result = await getAdminAttendance({ employeeId, month, year, page, limit });
        res.status(STATUS.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};