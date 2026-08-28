import bcrypt from 'bcryptjs';
import { User } from '../models/User.model.js';
import { EmploymentType } from '../models/EmploymentType.model.js';
import { MESSAGES } from '../utils/messages.js';
import { config } from '../config/env.js';

const generateEmployeeId = async () => {
    const lastUser = await User.findOne().sort({ createdAt: -1 });
    if (!lastUser) return 'EMP001';
    const lastId = parseInt(lastUser.employeeId.replace('EMP', ''), 10);
    const newId = String(lastId + 1).padStart(3, '0');
    return `EMP${newId}`;
};

const getLeaveBalancesFromPolicy = (leavePolicies) => {
    return leavePolicies.map(policy => ({
        leaveType: policy.leaveType,
        total: policy.isUnlimited ? 999 : policy.annualDays,
        used: 0,
        remaining: policy.isUnlimited ? 999 : policy.annualDays,
    }));
};

export const createEmployee = async (employeeData) => {
    const existingUser = await User.findOne({ email: employeeData.email });
    if (existingUser) {
        throw new Error(MESSAGES.EMPLOYEE_EMAIL_EXISTS);
    }

    const employmentType = await EmploymentType.findById(employeeData.employmentType);
    if (!employmentType) {
        throw new Error(MESSAGES.EMPLOYMENT_TYPE_NOT_FOUND);
    }

    const employeeId = await generateEmployeeId();

    let reportingManager = null;
    if (employeeData.reportingManager) {
        const manager = await User.findById(employeeData.reportingManager);
        if (!manager) {
            throw new Error(MESSAGES.REPORTING_MANAGER_NOT_FOUND);
        }
        reportingManager = employeeData.reportingManager;
    }

    const hashedPassword = await bcrypt.hash(employeeData.password, config.BCRYPT_SALT_ROUNDS);

    const user = new User({
        employeeId,
        email: employeeData.email,
        password: hashedPassword,
        fullName: employeeData.fullName,
        phone: employeeData.phone,
        dateOfJoining: new Date(employeeData.dateOfJoining),
        designation: employeeData.designation,
        monthlySalary: employeeData.monthlySalary,
        employmentType: employmentType._id,
        reportingManager,
        role: 'employee',
        status: employeeData.status || 'active',
        leaveBalances: getLeaveBalancesFromPolicy(employmentType.leavePolicies),
    });

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

export const getEmployees = async (filters = {}) => {
    const { search, status, employmentType, page = 1, limit = 20 } = filters;

    const query = { role: 'employee' };

    if (status) query.status = status;
    if (employmentType) query.employmentType = employmentType;

    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { employeeId: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [employees, total] = await Promise.all([
        User.find(query)
            .select('-password')
            .populate('employmentType', 'name')
            .populate('reportingManager', 'fullName email employeeId')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 }),
        User.countDocuments(query),
    ]);

    return {
        data: employees,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

export const getEmployeeById = async (id) => {
    const user = await User.findOne({ _id: id, role: 'employee' })
        .populate('employmentType', 'name leavePolicies')
        .populate('reportingManager', 'fullName email employeeId');

    if (!user) {
        throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

export const updateEmployee = async (id, updateData) => {
    const user = await User.findOne({ _id: id, role: 'employee' });
    if (!user) {
        throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser) {
            throw new Error(MESSAGES.EMPLOYEE_EMAIL_EXISTS);
        }
    }

    if (updateData.employmentType) {
        const employmentType = await EmploymentType.findById(updateData.employmentType);
        if (!employmentType) {
            throw new Error(MESSAGES.EMPLOYMENT_TYPE_NOT_FOUND);
        }
        user.employmentType = updateData.employmentType;
        user.leaveBalances = getLeaveBalancesFromPolicy(employmentType.leavePolicies);
    }

    if (updateData.reportingManager) {
        const manager = await User.findById(updateData.reportingManager);
        if (!manager) {
            throw new Error(MESSAGES.REPORTING_MANAGER_NOT_FOUND);
        }
        user.reportingManager = updateData.reportingManager;
    }

    const allowedUpdates = ['fullName', 'email', 'phone', 'dateOfJoining', 'designation', 'monthlySalary', 'status'];
    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            user[field] = updateData[field];
        }
    });

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

export const deleteEmployee = async (id) => {
    const user = await User.findOne({ _id: id, role: 'employee' });
    if (!user) {
        throw new Error(MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    await user.deleteOne();
    return { message: MESSAGES.EMPLOYEE_DELETED };
};