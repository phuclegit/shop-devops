import { pool } from '../db/pool.js';

export async function insertOrder(userId, total, db) {
  const { rows } = await db.query(
    `INSERT INTO orders (user_id, total) VALUES ($1, $2)
     RETURNING id, status, total, created_at`,
    [userId, total],
  );
  return rows[0];
}

export async function insertItem({ orderId, productId, quantity, unitPrice }, db) {
  await db.query(
    `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
     VALUES ($1, $2, $3, $4)`,
    [orderId, productId, quantity, unitPrice],
  );
}

// Lấy đơn của 1 user kèm danh sách item (gom bằng json_agg)
export async function listByUser(userId, db = pool) {
  const { rows } = await db.query(
    `SELECT o.id, o.status, o.total, o.created_at,
            COALESCE(json_agg(json_build_object(
              'productId', oi.product_id,
              'name', p.name,
              'quantity', oi.quantity,
              'unitPrice', oi.unit_price
            )) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId],
  );
  return rows;
}
