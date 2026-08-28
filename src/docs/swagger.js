import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HRMS Backend API',
            version: '1.0.0',
            description: 'Human Resource Management System API Documentation',
            contact: {
                name: 'API Support',
                email: 'support@hrms.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development Server',
            },
            {
                url: 'https://your-app.onrender.com',
                description: 'Production Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // Auth
                LoginRequest: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'admin@hrms.com' },
                        password: { type: 'string', example: 'admin123' },
                    },
                    required: ['email', 'password'],
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        employeeId: { type: 'string' },
                                        email: { type: 'string' },
                                        fullName: { type: 'string' },
                                        role: { type: 'string' },
                                    },
                                },
                                tokens: {
                                    type: 'object',
                                    properties: {
                                        accessToken: { type: 'string' },
                                        refreshToken: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
                // Employee
                CreateEmployeeRequest: {
                    type: 'object',
                    properties: {
                        fullName: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john.doe@company.com' },
                        password: { type: 'string', example: 'employee123' },
                        phone: { type: 'string', example: '9876543210' },
                        dateOfJoining: { type: 'string', example: '2026-01-15' },
                        designation: { type: 'string', example: 'Software Developer' },
                        monthlySalary: { type: 'number', example: 50000 },
                        employmentType: { type: 'string', example: '65a1b2c3d4e5f67890abcdef' },
                        reportingManager: { type: 'string', example: null },
                        status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
                    },
                    required: ['fullName', 'email', 'password', 'phone', 'dateOfJoining', 'designation', 'monthlySalary', 'employmentType'],
                },
                EmployeeResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                employeeId: { type: 'string' },
                                fullName: { type: 'string' },
                                email: { type: 'string' },
                                phone: { type: 'string' },
                                designation: { type: 'string' },
                                monthlySalary: { type: 'number' },
                                role: { type: 'string' },
                                status: { type: 'string' },
                                leaveBalances: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            leaveType: { type: 'string' },
                                            total: { type: 'number' },
                                            used: { type: 'number' },
                                            remaining: { type: 'number' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                // Leave
                ApplyLeaveRequest: {
                    type: 'object',
                    properties: {
                        leaveType: { type: 'string', example: 'Casual Leave' },
                        fromDate: { type: 'string', example: '2026-09-01' },
                        toDate: { type: 'string', example: '2026-09-01' },
                        isHalfDay: { type: 'boolean', example: false },
                        halfDaySession: { type: 'string', enum: ['first', 'second'], example: null },
                        reason: { type: 'string', example: 'Personal work' },
                    },
                    required: ['leaveType', 'fromDate', 'toDate', 'reason'],
                },
                // Attendance
                PunchRequest: {
                    type: 'object',
                    properties: {},
                },
                PunchResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                employeeId: { type: 'string' },
                                date: { type: 'string' },
                                punches: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            type: { type: 'string', enum: ['in', 'out'] },
                                            time: { type: 'string' },
                                        },
                                    },
                                },
                                totalWorkingHours: { type: 'number' },
                                totalBreakHours: { type: 'number' },
                                isLate: { type: 'boolean' },
                                lateMinutes: { type: 'number' },
                                status: { type: 'string', enum: ['present', 'absent', 'half-day', 'holiday', 'leave'] },
                            },
                        },
                    },
                },
                // Holiday
                CreateHolidayRequest: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Republic Day' },
                        date: { type: 'string', example: '2026-01-26' },
                        description: { type: 'string', example: 'National holiday' },
                    },
                    required: ['name', 'date'],
                },
                // Payroll
                RunPayrollRequest: {
                    type: 'object',
                    properties: {
                        month: { type: 'number', example: 8 },
                        year: { type: 'number', example: 2026 },
                    },
                    required: ['month', 'year'],
                },
                PayrollResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    employeeId: { type: 'string' },
                                    month: { type: 'string' },
                                    grossSalary: { type: 'number' },
                                    workingDaysInMonth: { type: 'number' },
                                    perDaySalary: { type: 'number' },
                                    deductions: {
                                        type: 'object',
                                        properties: {
                                            unpaidLeave: {
                                                type: 'object',
                                                properties: {
                                                    days: { type: 'number' },
                                                    amount: { type: 'number' },
                                                },
                                            },
                                            absentDays: {
                                                type: 'object',
                                                properties: {
                                                    days: { type: 'number' },
                                                    amount: { type: 'number' },
                                                },
                                            },
                                            lateMarkDeductions: {
                                                type: 'object',
                                                properties: {
                                                    halfDays: { type: 'number' },
                                                    amount: { type: 'number' },
                                                },
                                            },
                                            paidLeaveUsed: {
                                                type: 'object',
                                                properties: {
                                                    days: { type: 'number' },
                                                    amount: { type: 'number' },
                                                },
                                            },
                                            totalDeduction: { type: 'number' },
                                        },
                                    },
                                    netSalary: { type: 'number' },
                                    status: { type: 'string', enum: ['draft', 'finalized'] },
                                },
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);