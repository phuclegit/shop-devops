// Test không cần database: chỉ kiểm tra những route không chạm DB.
// Dùng test runner có sẵn của Node (node --test), không cần cài thêm thư viện.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

async function withServer(t) {
  const server = createApp().listen(0);
  t.after(() => server.close());
  return `http://127.0.0.1:${server.address().port}`;
}

test('GET /api/health trả 200', async (t) => {
  const base = await withServer(t);
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('route không tồn tại trả 404 dạng JSON', async (t) => {
  const base = await withServer(t);
  const res = await fetch(`${base}/api/khong-co`);
  assert.equal(res.status, 404);
  assert.equal((await res.json()).error.message, 'Route not found');
});

test('GET /api/orders/mine không có token trả 401', async (t) => {
  const base = await withServer(t);
  const res = await fetch(`${base}/api/orders/mine`);
  assert.equal(res.status, 401);
});

test('POST /api/auth/register với dữ liệu sai trả 400', async (t) => {
  const base = await withServer(t);
  const res = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'khong-phai-email', password: '123' }),
  });
  assert.equal(res.status, 400);
});
