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

/**
 * @swagger
 * /api/attendance/punch-in:
 *   post:
 *     summary: Punch in for the day
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Punched in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/punch-in', authenticate, punchInController);

/**
 * @swagger
 * /api/attendance/punch-out:
 *   post:
 *     summary: Punch out for the day
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Punched out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/punch-out', authenticate, punchOutController);

/**
 * @swagger
 * /api/attendance/today:
 *   get:
 *     summary: Get today's attendance stats
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's attendance
 *       401:
 *         description: Unauthorized
 */
router.get('/today', authenticate, todayStats);

/**
 * @swagger
 * /api/attendance/history:
 *   get:
 *     summary: Get attendance history
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Month (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Attendance history
 *       401:
 *         description: Unauthorized
 */
router.get('/history', authenticate, history);

/**
 * @swagger
 * /api/attendance/calendar/{month}/{year}:
 *   get:
 *     summary: Get attendance calendar data
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Calendar data with status colors
 *       401:
 *         description: Unauthorized
 */
router.get('/calendar/:month/:year', authenticate, calendar);

/**
 * @swagger
 * /api/attendance/admin:
 *   get:
 *     summary: Admin - View all attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: All attendance records
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/admin', authenticate, authorize('admin'), adminAttendance);

export default router;