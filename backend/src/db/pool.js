import pg from 'pg';
import { config } from '../config/env.js';

export const pool = new pg.Pool({ connectionString: config.databaseUrl });

export const query = (text, params) => pool.query(text, params);

// Chạy nhiều câu SQL trong 1 transaction: lỗi thì ROLLBACK, xong thì COMMIT
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
