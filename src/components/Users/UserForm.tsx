import { useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import '../Cards/CardList.css';

export default function UserForm() {
  const [formData, setFormData] = useState({ 
    login: '', 
    password: '', 
    is_admin: 0 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/v1/users', formData);
      
      setFormData({ login: '', password: '', is_admin: 0 });
      alert('Пользователь успешно создан!');
    } catch (err) {
      setError(getBackendError(err, 'Ошибка создания пользователя'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-form card-create-form">
      <h3 className="card-form__title">Новый пользователь</h3>
      {error && <p className="form-error">{error}</p>}
      
      <div className="form-group__row">
        <div className="form-group">
          <label className="form-label">Логин</label>
          <input 
            className="form-input" 
            value={formData.login} 
            onChange={e => setFormData({...formData, login: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input 
            className="form-input" 
            type="password"
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Роль при создании</label>
        <select 
          className="form-input" 
          value={formData.is_admin} 
          onChange={e => setFormData({...formData, is_admin: parseInt(e.target.value, 10)})}
        >
          <option value={0}>Обычный пользователь</option>
          <option value={1}>Администратор</option>
        </select>
      </div>
      
      <button type="submit" disabled={loading} className="btn btn-create">
        {loading ? '⏳ Создание...' : '➕ Создать пользователя'}
      </button>
    </form>
  );
}