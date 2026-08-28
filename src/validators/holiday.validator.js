import { z } from 'zod';

export const createHolidaySchema = z.object({
    name: z.string().min(1, 'Holiday name is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    description: z.string().optional(),
});

export const updateHolidaySchema = z.object({
    name: z.string().min(1).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    description: z.string().optional(),
});