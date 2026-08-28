import { LeaveRequest } from '../models/LeaveRequest.model.js';
import { User } from '../models/User.model.js';
import { MESSAGES } from '../utils/messages.js';

const calculateDays = (fromDate, toDate, isHalfDay) => {
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isHalfDay ? 0.5 : diffDays;
};

const updateLeaveBalance = async (employeeId, leaveType, days) => {
    const user = await User.findById(employeeId);
    if (!user) {
        throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    const balanceIndex = user.leaveBalances.findIndex(b => b.leaveType === leaveType);
    if (balanceIndex === -1) {
        throw new Error('Leave type not found in balance');
    }

    if (user.leaveBalances[balanceIndex].remaining < days) {
        throw new Error('Insufficient leave balance');
    }

    user.leaveBalances[balanceIndex].used += days;
    user.leaveBalances[balanceIndex].remaining -= days;

    await user.save();
};

export const applyLeave = async (employeeId, leaveData) => {
    const user = await User.findById(employeeId);
    if (!user) {
        throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    const daysCount = calculateDays(
        new Date(leaveData.fromDate),
        new Date(leaveData.toDate),
        leaveData.isHalfDay
    );

    const leaveRequest = new LeaveRequest({
        employeeId,
        leaveType: leaveData.leaveType,
        fromDate: new Date(leaveData.fromDate),
        toDate: new Date(leaveData.toDate),
        isHalfDay: leaveData.isHalfDay || false,
        halfDaySession: leaveData.halfDaySession || null,
        reason: leaveData.reason,
        daysCount,
        status: 'pending',
    });

    await leaveRequest.save();
    return leaveRequest;
};

export const getMyLeaveRequests = async (employeeId) => {
    const leaves = await LeaveRequest.find({ employeeId })
        .sort({ createdAt: -1 });
    return leaves;
};

export const getAllLeaveRequests = async (filters = {}) => {
    const { status, page = 1, limit = 20 } = filters;

    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leaves, total] = await Promise.all([
        LeaveRequest.find(query)
            .populate('employeeId', 'fullName email employeeId')
            .populate('approvedBy', 'fullName email')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 }),
        LeaveRequest.countDocuments(query),
    ]);

    return {
        data: leaves,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

export const approveLeave = async (leaveId, adminId) => {
    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) {
        throw new Error('Leave request not found');
    }

    if (leave.status !== 'pending') {
        throw new Error('Leave request already processed');
    }

    await updateLeaveBalance(leave.employeeId, leave.leaveType, leave.daysCount);

    leave.status = 'approved';
    leave.approvedBy = adminId;
    leave.approvedAt = new Date();

    await leave.save();
    return leave;
};

export const rejectLeave = async (leaveId, adminId) => {
    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) {
        throw new Error('Leave request not found');
    }

    if (leave.status !== 'pending') {
        throw new Error('Leave request already processed');
    }

    leave.status = 'rejected';
    leave.approvedBy = adminId;
    leave.approvedAt = new Date();

    await leave.save();
    return leave;
};

export const getLeaveBalance = async (employeeId) => {
    const user = await User.findById(employeeId);
    if (!user) {
        throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    return user.leaveBalances;
};