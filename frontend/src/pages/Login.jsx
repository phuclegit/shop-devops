import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h2>Đăng nhập</h2>
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="Email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Mật khẩu" required value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Đăng nhập</button>
      <p className="muted">Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
    </form>
  );
}
