import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">🛍️ Shop Demo</Link>
        <nav>
          <Link to="/cart">Giỏ hàng ({count})</Link>
          {user ? (
            <>
              <Link to="/orders">Đơn hàng</Link>
              <span className="muted">{user.full_name}</span>
              <button
                className="link"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
