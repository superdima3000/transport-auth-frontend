import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBackendError } from '../../utils/errorHandler'; // 👈 Импорт утилиты
import './LoginForm.css';

export default function LoginForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authLogin(login, password);
      navigate('/dashboard');
    } catch (err: any) {
      // 🔥 ОДНА СТРОКА — как в CardList, только поле message
      setError(err?.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="auth-form__title">Вход в систему</h2>
      
      {error && <p className="auth-form__error">{error}</p>}
      
      <div className="auth-form__group">
        <label htmlFor="login-input" className="auth-form__label">Логин</label>
        <input
          id="login-input"
          type="text"
          className="auth-form__input"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          autoComplete="username"
          placeholder="Введите логин"
        />
      </div>

      <div className="auth-form__group">
        <label htmlFor="password-input" className="auth-form__label">Пароль</label>
        <input
          id="password-input"
          type="password"
          className="auth-form__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Введите пароль"
        />
      </div>

      <button type="submit" className="auth-form__submit">
        Войти
      </button>

      <div className="auth-form__footer">
        Нет аккаунта?{' '}
        <Link to="/register" className="auth-form__link">
          Зарегистрироваться
        </Link>
      </div>
    </form>
  );
}