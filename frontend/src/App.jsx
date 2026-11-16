import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="container">Đang tải...</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="*" element={<p>Không tìm thấy trang.</p>} />
        </Routes>
      </main>
    </>
  );
}
