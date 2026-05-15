import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';

// 1️⃣ Описываем структуру контекста
type AuthContextType = {
  user: { token: string } | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string, is_admin?: number) => Promise<void>;
  logout: () => void;
};

// 2️⃣ Передаём null как fallback (убирает ошибку TS)
export const AuthContext = createContext<AuthContextType | null>(null);

// 3️⃣ Безопасный хук с проверкой
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth() must be used inside <AuthProvider>');
  }
  return context;
};

// 4️⃣ Провайдер
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({ token });
    setLoading(false);
  }, []);

  const login = async (login: string, password: string) => {
    const { data } = await api.post('/auth/sign-in', { login, password });
    localStorage.setItem('token', data.token);
    setUser({ token: data.token });
  };

  const register = async (login: string, password: string, is_admin = 0) => {
    await api.post('/auth/sign-up', { login, password, is_admin });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};