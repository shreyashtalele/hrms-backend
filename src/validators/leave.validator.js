import { z } from 'zod';

export const applyLeaveSchema = z.object({
    leaveType: z.string().min(1, 'Leave type is required'),
    fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    isHalfDay: z.boolean().default(false),
    halfDaySession: z.enum(['first', 'second']).optional(),
    reason: z.string().min(1, 'Reason is required'),
});

export const updateLeaveSchema = z.object({
    status: z.enum(['approved', 'rejected']),
});