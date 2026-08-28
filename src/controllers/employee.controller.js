import { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } from '../services/employee.service.js';
import { STATUS } from '../utils/statusCodes.js';
import { MESSAGES } from '../utils/messages.js';

export const create = async (req, res, next) => {
    try {
        const employee = await createEmployee(req.body);
        res.status(STATUS.CREATED).json({
            success: true,
            message: MESSAGES.EMPLOYEE_CREATED,
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

export const list = async (req, res, next) => {
    try {
        const { search, status, employmentType, page, limit } = req.query;
        const result = await getEmployees({ search, status, employmentType, page, limit });
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
        const employee = await getEmployeeById(req.params.id);
        res.status(STATUS.OK).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const employee = await updateEmployee(req.params.id, req.body);
        res.status(STATUS.OK).json({
            success: true,
            message: MESSAGES.EMPLOYEE_UPDATED,
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const result = await deleteEmployee(req.params.id);
        res.status(STATUS.OK).json({
            success: true,
            message: MESSAGES.EMPLOYEE_DELETED,
        });
    } catch (error) {
        next(error);
    }
};