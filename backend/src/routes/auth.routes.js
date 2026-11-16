import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/httpError.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import * as ctrl from '../controllers/auth.controller.js';

const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
  fullName: z.string().min(1).max(100),
});
const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

const router = Router();
router.post('/register', validate(registerSchema), asyncHandler(ctrl.register));
router.post('/login', validate(loginSchema), asyncHandler(ctrl.login));
router.get('/me', requireAuth, asyncHandler(ctrl.me));
export default router;
