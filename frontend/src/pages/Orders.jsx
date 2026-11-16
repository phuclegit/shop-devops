import { useEffect, useState } from 'react';
import { api, formatVND } from '../api/client.js';

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/orders/mine').then(setOrders).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="muted">Đang tải...</p>;
  if (orders.length === 0) return <p>Bạn chưa có đơn hàng nào.</p>;

  return (
    <>
      <h2>Đơn hàng của tôi</h2>
      {orders.map((o) => (
        <div className="card wide" key={o.id}>
          <div className="row">
            <strong>Đơn #{o.id}</strong>
            <span className="badge">{o.status}</span>
            <span className="muted">{new Date(o.created_at).toLocaleString('vi-VN')}</span>
          </div>
          <ul>
            {o.items.map((it) => (
              <li key={it.productId}>{it.name} × {it.quantity} — {formatVND(it.unitPrice)}</li>
            ))}
          </ul>
          <p>Tổng: <strong>{formatVND(o.total)}</strong></p>
        </div>
      ))}
    </>
  );
}
