import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.model.js';
import { STATUS } from '../utils/statusCodes.js';
import { MESSAGES } from '../utils/messages.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.UNAUTHORIZED,
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.UNAUTHORIZED,
            });
        }

        if (user.status !== 'active') {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.ACCOUNT_INACTIVE,
            });
        }

        req.user = {
            userId: user._id,
            role: user.role,
            email: user.email,
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.UNAUTHORIZED,
            });
        }
        next(error);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(STATUS.FORBIDDEN).json({
                success: false,
                message: MESSAGES.FORBIDDEN,
            });
        }
        next();
    };
};