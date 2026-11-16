import { Router } from 'express';
import { pool } from '../db/pool.js';
import { asyncHandler } from '../utils/httpError.js';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';

const router = Router();

// Liveness: process còn sống không (Docker/K8s dùng để restart)
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Readiness: đã kết nối được database chưa (dùng để quyết định nhận traffic)
router.get(
  '/ready',
  asyncHandler(async (_req, res) => {
    await pool.query('SELECT 1');
    res.json({ status: 'ready' });
  }),
);

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;
