import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [q, setQ] = useState('');
  const [data, setData] = useState({ items: [], total: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  // Debounce 300ms để không gọi API sau mỗi phím gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api(`/products?q=${encodeURIComponent(q)}`)
        .then((d) => {
          setData(d);
          setError('');
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <>
      <input
        className="search"
        placeholder="Tìm sản phẩm..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Đang tải...</p>}
      <div className="grid">
        {data.items.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={add} />
        ))}
      </div>
      {!loading && !error && data.items.length === 0 && <p>Không có sản phẩm nào.</p>}
    </>
  );
}
