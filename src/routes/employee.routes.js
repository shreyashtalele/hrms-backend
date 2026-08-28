import express from 'express';
import { create, list, getOne, update, remove } from '../controllers/employee.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/employee.validator.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.post('/', validate(createEmployeeSchema), create);
router.get('/', list);
router.get('/:id', getOne);
router.put('/:id', validate(updateEmployeeSchema), update);
router.delete('/:id', remove);

export default router;