import express from 'express';
import { list, create, update, remove } from '../controllers/holiday.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes (authenticated users can view)
router.get('/', authenticate, list);

// Admin only routes
router.post('/', authenticate, authorize('admin'), create);
router.put('/:id', authenticate, authorize('admin'), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;