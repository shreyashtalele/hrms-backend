import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import holidayRoutes from './routes/holiday.routes.js';
import payrollRoutes from './routes/payroll.routes.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

const app = express();

app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'HRMS API Documentation',
}));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/payroll', payrollRoutes);

app.use(errorHandler);

export default app;