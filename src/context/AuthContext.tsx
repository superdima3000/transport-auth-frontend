import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';

// 1️⃣ Описываем структуру контекста
type AuthContextType = {
  user: { 
    token: string;
    login: string;
  } | null;
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
    const login = localStorage.getItem('login'); // Восстанавливаем логин при перезагрузке
    
    if (token && login) {
      setUser({ token, login });
    }
    setLoading(false);
  }, []);

  const loginUser = async (login: string, password: string) => {
    const { data } = await api.post('/auth/sign-in', { login, password });
    
    // Сохраняем и токен, и логин в хранилище
    localStorage.setItem('token', data.token);
    localStorage.setItem('login', login); 
    
    // Обновляем стейт двумя полями
    setUser({ token: data.token, login });
  };

  const register = async (login: string, password: string, is_admin = 0) => {
    await api.post('/auth/sign-up', { login, password, is_admin });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('login'); // Очищаем логин при выходе
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: loginUser, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};