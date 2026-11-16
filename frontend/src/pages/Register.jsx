import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await register(form.fullName, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h2>Đăng ký</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Họ tên" required value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
      <input type="email" placeholder="Email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Mật khẩu (tối thiểu 8 ký tự)" required minLength={8}
        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Tạo tài khoản</button>
    </form>
  );
}
