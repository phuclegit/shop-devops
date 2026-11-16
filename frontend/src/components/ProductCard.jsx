import { formatVND } from '../api/client.js';

export default function ProductCard({ product, onAdd }) {
  const soldOut = product.stock <= 0;
  return (
    <div className="card">
      <div className="thumb">{product.name.charAt(0)}</div>
      <h3>{product.name}</h3>
      <p className="muted">{product.description}</p>
      <p className="price">{formatVND(product.price)}</p>
      <p className="muted">{soldOut ? 'Hết hàng' : `Còn ${product.stock}`}</p>
      <button disabled={soldOut} onClick={() => onAdd(product)}>
        Thêm vào giỏ
      </button>
    </div>
  );
}
