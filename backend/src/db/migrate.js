// Migration runner tối giản: chạy các file .sql theo thứ tự tên, mỗi file đúng 1 lần.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, withTransaction } from './pool.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);

  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
  const { rows } = await pool.query('SELECT name FROM schema_migrations');
  const applied = new Set(rows.map((r) => r.name));

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await fs.readFile(path.join(dir, file), 'utf8');
    await withTransaction(async (client) => {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations(name) VALUES ($1)', [file]);
    });
    console.log(`[migrate] applied ${file}`);
  }
  console.log('[migrate] done');
}

main()
  .catch((err) => {
    console.error('[migrate] failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
