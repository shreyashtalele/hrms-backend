import express from 'express';
import { list, create, update, remove } from '../controllers/holiday.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/holidays:
 *   get:
 *     summary: Get all holidays
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *     responses:
 *       200:
 *         description: List of holidays
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, list);

/**
 * @swagger
 * /api/holidays:
 *   post:
 *     summary: Admin - Create holiday
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHolidayRequest'
 *     responses:
 *       201:
 *         description: Holiday created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/', authenticate, authorize('admin'), create);

/**
 * @swagger
 * /api/holidays/{id}:
 *   put:
 *     summary: Admin - Update holiday
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHolidayRequest'
 *     responses:
 *       200:
 *         description: Holiday updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Holiday not found
 */
router.put('/:id', authenticate, authorize('admin'), update);

/**
 * @swagger
 * /api/holidays/{id}:
 *   delete:
 *     summary: Admin - Delete holiday
 *     tags: [Holidays]
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
 *         description: Holiday deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Holiday not found
 */
router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;