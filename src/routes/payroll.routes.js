import express from 'express';
import { run, history, getOne, finalize, downloadSlip } from '../controllers/payroll.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';


const router = express.Router();

router.use(authenticate);

router.post('/run', authorize('admin'), run);
router.get('/history', authorize('admin'), history);
router.get('/:id', getOne);
router.put('/:id/finalize', authorize('admin'), finalize);
router.get('/:id/download', authenticate, downloadSlip);

export default router;