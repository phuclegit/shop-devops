import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/httpError.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import * as ctrl from '../controllers/order.controller.js';

const createOrderSchema = z.object({
  items: z
    .array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(100) }))
    .min(1),
});

const router = Router();
router.use(requireAuth);
router.post('/', validate(createOrderSchema), asyncHandler(ctrl.create));
router.get('/mine', asyncHandler(ctrl.listMine));
export default router;
