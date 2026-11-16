import { pool } from '../db/pool.js';

export async function list({ q, limit, offset }, db = pool) {
  const search = q ? `%${q}%` : '%';
  const { rows } = await db.query(
    `SELECT id, name, description, price, stock, image_url
     FROM products
     WHERE name ILIKE $1
     ORDER BY id
     LIMIT $2 OFFSET $3`,
    [search, limit, offset],
  );
  const count = await db.query('SELECT count(*)::int AS total FROM products WHERE name ILIKE $1', [search]);
  return { items: rows, total: count.rows[0].total };
}

export async function findById(id, db = pool) {
  const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function create({ name, description, price, stock, imageUrl }, db = pool) {
  const { rows } = await db.query(
    `INSERT INTO products (name, description, price, stock, image_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, description, price, stock, imageUrl ?? null],
  );
  return rows[0];
}

// Khóa các dòng sản phẩm để tránh 2 đơn cùng trừ 1 kho (race condition)
export async function findByIdsForUpdate(ids, db) {
  const { rows } = await db.query(
    'SELECT id, name, price, stock FROM products WHERE id = ANY($1::int[]) FOR UPDATE',
    [ids],
  );
  return rows;
}

export async function decreaseStock(id, quantity, db) {
  await db.query('UPDATE products SET stock = stock - $2 WHERE id = $1', [id, quantity]);
}
