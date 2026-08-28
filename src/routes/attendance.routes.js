import express from 'express';
import {
    punchInController,
    punchOutController,
    todayStats,
    history,
    calendar,
    adminAttendance
} from '../controllers/attendance.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Employee routes
router.post('/punch-in', authenticate, punchInController);
router.post('/punch-out', authenticate, punchOutController);
router.get('/today', authenticate, todayStats);
router.get('/history', authenticate, history);
router.get('/calendar/:month/:year', authenticate, calendar);

// Admin routes
router.get('/admin', authenticate, authorize('admin'), adminAttendance);

export default router;