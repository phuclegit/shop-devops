// Repository: chỉ chứa SQL, không chứa logic nghiệp vụ.
import { pool } from '../db/pool.js';

export async function findByEmail(email, db = pool) {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

export async function findById(id, db = pool) {
  const { rows } = await db.query(
    'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
    [id],
  );
  return rows[0] || null;
}

export async function create({ email, passwordHash, fullName }, db = pool) {
  const { rows } = await db.query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, full_name, role, created_at`,
    [email, passwordHash, fullName],
  );
  return rows[0];
}
