import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, formatVND } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, setQuantity, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function checkout() {
    if (!user) return navigate('/login');
    setBusy(true);
    setError('');
    try {
      await api('/orders', {
        method: 'POST',
        body: { items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })) },
      });
      clear();
      navigate('/orders');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0) return <p>Giỏ hàng trống.</p>;

  return (
    <>
      <h2>Giỏ hàng</h2>
      <table className="table">
        <tbody>
          {items.map(({ product, quantity }) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{formatVND(product.price)}</td>
              <td>
                <button className="small" onClick={() => setQuantity(product.id, quantity - 1)}>−</button>
                <span className="qty">{quantity}</span>
                <button className="small" onClick={() => setQuantity(product.id, quantity + 1)}>+</button>
              </td>
              <td>{formatVND(product.price * quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="total">Tổng cộng: <strong>{formatVND(total)}</strong></p>
      {error && <p className="error">{error}</p>}
      <button disabled={busy} onClick={checkout}>
        {user ? 'Đặt hàng' : 'Đăng nhập để đặt hàng'}
      </button>
    </>
  );
}
