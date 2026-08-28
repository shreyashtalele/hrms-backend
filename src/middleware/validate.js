import { ZodError } from 'zod';
import { STATUS } from '../utils/statusCodes.js';

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            return res.status(STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Validation error',
            });
        }
    };
};