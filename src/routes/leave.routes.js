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

// Employee routes
router.post('/apply', authenticate, apply);
router.get('/my-requests', authenticate, myRequests);
router.get('/balance', authenticate, balance);
router.get('/balance/:employeeId', authenticate, authorize('admin'), balance);

// Admin routes
router.get('/all', authenticate, authorize('admin'), allRequests);
router.put('/:id/approve', authenticate, authorize('admin'), approve);
router.put('/:id/reject', authenticate, authorize('admin'), reject);

export default router;