import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/httpError.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import * as ctrl from '../controllers/product.controller.js';

const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).default(''),
  price: z.number().int().min(0),
  stock: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional(),
});

const router = Router();
router.get('/', asyncHandler(ctrl.list));
router.get('/:id', asyncHandler(ctrl.get));
router.post('/', requireAuth, requireRole('admin'), validate(productSchema), asyncHandler(ctrl.create));
export default router;
