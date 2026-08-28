import { STATUS } from '../utils/statusCodes.js';
import { MESSAGES } from '../utils/messages.js';

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || MESSAGES.INTERNAL_ERROR;

    console.error(`Error: ${message}`);
    console.error(err.stack);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};