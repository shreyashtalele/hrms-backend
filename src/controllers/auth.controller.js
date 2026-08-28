import { loginUser, logoutUser } from '../services/auth.service.js';
import { STATUS } from '../utils/statusCodes.js';
import { MESSAGES } from '../utils/messages.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(STATUS.OK).json({
            success: true,
            message: MESSAGES.LOGIN_SUCCESS,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const result = await logoutUser(userId);
        res.status(STATUS.OK).json({
            success: true,
            message: MESSAGES.LOGOUT_SUCCESS,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};