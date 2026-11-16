// Base URL: mặc định '/api' (cùng origin, đi qua Vite proxy hoặc Nginx).
const BASE = import.meta.env.VITE_API_URL || '/api';

export const getToken = () => localStorage.getItem('token');
export const setToken = (t) =>
  t ? localStorage.setItem('token', t) : localStorage.removeItem('token');

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error?.message || `Lỗi ${res.status}`);
  return data;
}

export const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
