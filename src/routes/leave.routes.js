import express from 'express';
import {
    apply,
    myRequests,
    allRequests,
    approve,
    reject,
    balance
} from '../controllers/leave.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/leave/apply:
 *   post:
 *     summary: Apply for leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplyLeaveRequest'
 *     responses:
 *       201:
 *         description: Leave applied successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/apply', authenticate, apply);

/**
 * @swagger
 * /api/leave/my-requests:
 *   get:
 *     summary: Get employee's own leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave requests
 *       401:
 *         description: Unauthorized
 */
router.get('/my-requests', authenticate, myRequests);

/**
 * @swagger
 * /api/leave/balance:
 *   get:
 *     summary: Get current user's leave balance
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave balance
 *       401:
 *         description: Unauthorized
 */
router.get('/balance', authenticate, balance);

/**
 * @swagger
 * /api/leave/balance/{employeeId}:
 *   get:
 *     summary: Get leave balance for specific employee
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave balance
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/balance/:employeeId', authenticate, authorize('admin'), balance);

/**
 * @swagger
 * /api/leave/all:
 *   get:
 *     summary: Admin - Get all leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by status
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
 *         description: List of all leave requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/all', authenticate, authorize('admin'), allRequests);

/**
 * @swagger
 * /api/leave/{id}/approve:
 *   put:
 *     summary: Admin - Approve leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave approved successfully
 *       404:
 *         description: Leave not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put('/:id/approve', authenticate, authorize('admin'), approve);

/**
 * @swagger
 * /api/leave/{id}/reject:
 *   put:
 *     summary: Admin - Reject leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 *       404:
 *         description: Leave not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put('/:id/reject', authenticate, authorize('admin'), reject);

export default router;