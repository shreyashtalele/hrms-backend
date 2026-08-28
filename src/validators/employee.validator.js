import { z } from 'zod';

export const createEmployeeSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    dateOfJoining: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    designation: z.string().min(1, 'Designation is required'),
    monthlySalary: z.number().positive('Salary must be positive'),
    employmentType: z.string().min(1, 'Employment type is required'),
    reportingManager: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
});

export const updateEmployeeSchema = z.object({
    fullName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    dateOfJoining: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    designation: z.string().min(1).optional(),
    monthlySalary: z.number().positive().optional(),
    employmentType: z.string().min(1).optional(),
    reportingManager: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
});