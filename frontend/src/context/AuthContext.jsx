import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api/client.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  // Có token sẵn thì hỏi backend xem token còn hợp lệ không
  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me')
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function authenticate(path, body) {
    const { user, token } = await api(path, { method: 'POST', body });
    setToken(token);
    setUser(user);
  }

  const value = {
    user,
    loading,
    login: (email, password) => authenticate('/auth/login', { email, password }),
    register: (fullName, email, password) =>
      authenticate('/auth/register', { fullName, email, password }),
    logout: () => {
      setToken(null);
      setUser(null);
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
