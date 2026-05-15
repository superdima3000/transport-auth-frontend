import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RegisterForm.css';

export default function RegisterForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // false → 0 (user), true → 1 (admin)
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Бэкенд ожидает is_admin: 0 или 1
      await register(login, password, isAdmin ? 1 : 0);
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Ошибка регистрации';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="auth-form__title">Регистрация</h2>
      {error && <p className="auth-form__error">{error}</p>}

      <div className="auth-form__group">
        <label htmlFor="reg-login" className="auth-form__label">Логин</label>
        <input
          id="reg-login"
          type="text"
          className="auth-form__input"
          value={login}
          onChange={e => setLogin(e.target.value)}
          required
          autoComplete="username"
          placeholder="Придумайте логин"
        />
      </div>

      <div className="auth-form__group">
        <label htmlFor="reg-password" className="auth-form__label">Пароль</label>
        <input
          id="reg-password"
          type="password"
          className="auth-form__input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Придумайте пароль"
        />
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label">Роль</label>
        <div className="auth-form__role-group">
          <label className="auth-form__radio-option">
            <input
              type="radio"
              name="role"
              value="user"
              checked={!isAdmin}
              onChange={() => setIsAdmin(false)}
            />
            Пользователь
          </label>
          <label className="auth-form__radio-option">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={isAdmin}
              onChange={() => setIsAdmin(true)}
            />
            Администратор
          </label>
        </div>
      </div>

      <button type="submit" className="auth-form__submit">
        Зарегистрироваться
      </button>

      <div className="auth-form__footer">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="auth-form__link">
          Войти
        </Link>
      </div>
    </form>
  );
}