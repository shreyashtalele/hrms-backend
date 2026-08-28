import { AttendanceLog } from '../models/AttendanceLog.model.js';
import { User } from '../models/User.model.js';
import { LeaveRequest } from '../models/LeaveRequest.model.js';
import { Holiday } from '../models/Holiday.model.js';
import { config } from '../config/env.js';
import { MESSAGES } from '../utils/messages.js';

const OFFICE_START_TIME = config.OFFICE_START_TIME || '09:30';

const getDateOnly = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

const calculateWorkingHours = (punches) => {
    let totalMinutes = 0;
    let breakMinutes = 0;

    for (let i = 0; i < punches.length - 1; i++) {
        if (punches[i].type === 'in' && punches[i + 1].type === 'out') {
            const diff = (punches[i + 1].time - punches[i].time) / (1000 * 60);
            totalMinutes += diff;
        }
        if (punches[i].type === 'out' && punches[i + 1].type === 'in') {
            const diff = (punches[i + 1].time - punches[i].time) / (1000 * 60);
            breakMinutes += diff;
        }
    }

    return {
        workingHours: parseFloat((totalMinutes / 60).toFixed(2)),
        breakHours: parseFloat((breakMinutes / 60).toFixed(2)),
        totalMinutes,
        breakMinutes,
    };
};

const getStatusForDay = (employeeId, date, punches) => {
    // This will be enhanced when we have holidays and leave requests
    if (!punches || punches.length === 0) {
        return 'absent';
    }

    const totalHours = calculateWorkingHours(punches).workingHours;

    if (totalHours >= 4) {
        return 'present';
    } else if (totalHours > 0 && totalHours < 4) {
        return 'half-day';
    }

    return 'present';
};

export const punchIn = async (employeeId) => {
    const user = await User.findById(employeeId);
    if (!user) {
        throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    const today = getDateOnly(new Date());

    let attendance = await AttendanceLog.findOne({ employeeId, date: today });

    if (!attendance) {
        attendance = new AttendanceLog({
            employeeId,
            date: today,
            punches: [],
            status: 'absent',
        });
    }

    const lastPunch = attendance.punches[attendance.punches.length - 1];
    if (lastPunch && lastPunch.type === 'in') {
        throw new Error('You are already punched in. Please punch out first.');
    }

    const now = new Date();
    attendance.punches.push({ type: 'in', time: now });

    const officeStartMinutes = parseTimeToMinutes(OFFICE_START_TIME);
    const punchMinutes = now.getHours() * 60 + now.getMinutes();

    if (punchMinutes > officeStartMinutes) {
        attendance.isLate = true;
        attendance.lateMinutes = punchMinutes - officeStartMinutes;
    }

    await attendance.save();
    return attendance;
};

export const punchOut = async (employeeId) => {
    const user = await User.findById(employeeId);
    if (!user) {
        throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    const today = getDateOnly(new Date());
    const attendance = await AttendanceLog.findOne({ employeeId, date: today });

    if (!attendance) {
        throw new Error('You have not punched in today.');
    }

    const lastPunch = attendance.punches[attendance.punches.length - 1];
    if (!lastPunch || lastPunch.type !== 'in') {
        throw new Error('You are not punched in. Please punch in first.');
    }

    const now = new Date();
    attendance.punches.push({ type: 'out', time: now });

    const { workingHours, breakHours } = calculateWorkingHours(attendance.punches);
    attendance.totalWorkingHours = workingHours;
    attendance.totalBreakHours = breakHours;
    attendance.status = getStatusForDay(employeeId, today, attendance.punches);

    await attendance.save();
    return attendance;
};

export const getTodayStats = async (employeeId) => {
    const today = getDateOnly(new Date());
    const attendance = await AttendanceLog.findOne({ employeeId, date: today });

    if (!attendance) {
        return {
            date: today,
            status: 'absent',
            totalWorkingHours: 0,
            totalBreakHours: 0,
            isLate: false,
            lateMinutes: 0,
            punches: [],
        };
    }

    return attendance;
};

export const getAttendanceHistory = async (employeeId, filters = {}) => {
    const { month, year, page = 1, limit = 30 } = filters;

    const query = { employeeId };

    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query.date = { $gte: startDate, $lte: endDate };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [attendance, total] = await Promise.all([
        AttendanceLog.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .skip(skip),
        AttendanceLog.countDocuments(query),
    ]);

    return {
        data: attendance,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

export const getCalendarData = async (employeeId, month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await AttendanceLog.find({
        employeeId,
        date: { $gte: startDate, $lte: endDate },
    });

    const holidays = await Holiday.find({
        date: { $gte: startDate, $lte: endDate },
    });

    const leaves = await LeaveRequest.find({
        employeeId,
        status: 'approved',
        fromDate: { $lte: endDate },
        toDate: { $gte: startDate },
    });

    const calendarData = {};

    attendance.forEach(record => {
        const dateKey = record.date.toISOString().split('T')[0];
        calendarData[dateKey] = {
            status: record.status,
            details: {
                totalWorkingHours: record.totalWorkingHours,
                totalBreakHours: record.totalBreakHours,
                isLate: record.isLate,
                lateMinutes: record.lateMinutes,
                punches: record.punches,
            },
        };
    });

    holidays.forEach(holiday => {
        const dateKey = holiday.date.toISOString().split('T')[0];
        if (!calendarData[dateKey]) {
            calendarData[dateKey] = { status: 'holiday' };
        }
        calendarData[dateKey].holiday = {
            name: holiday.name,
            description: holiday.description,
        };
    });

    leaves.forEach(leave => {
        const current = new Date(leave.fromDate);
        const end = new Date(leave.toDate);
        while (current <= end) {
            const dateKey = current.toISOString().split('T')[0];
            if (!calendarData[dateKey]) {
                calendarData[dateKey] = { status: 'leave' };
            }
            calendarData[dateKey].leave = {
                type: leave.leaveType,
                isHalfDay: leave.isHalfDay,
                session: leave.halfDaySession,
            };
            current.setDate(current.getDate() + 1);
        }
    });

    return calendarData;
};

export const getAdminAttendance = async (filters = {}) => {
    const { employeeId, month, year, page = 1, limit = 20 } = filters;

    const query = {};

    if (employeeId) query.employeeId = employeeId;
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query.date = { $gte: startDate, $lte: endDate };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [attendance, total] = await Promise.all([
        AttendanceLog.find(query)
            .populate('employeeId', 'fullName email employeeId')
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .skip(skip),
        AttendanceLog.countDocuments(query),
    ]);

    return {
        data: attendance,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};