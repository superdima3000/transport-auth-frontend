import { useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import '../Cards/CardList.css';

export default function KeyForm() {
  const [formData, setFormData] = useState({ name: '', value: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/v1/keys', formData);
      setFormData({ name: '', value: '' });
      alert('Ключ успешно создан!');
    } catch (err) {
      setError(getBackendError(err, 'Ошибка создания ключа'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-form card-create-form">
      <h3 className="card-form__title">Новый ключ</h3>
      {error && <p className="form-error">{error}</p>}
      
      <div className="form-group">
        <label className="form-label">Название ключа</label>
        <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
      </div>

      <div className="form-group">
        <label className="form-label">Значение</label>
        <input className="form-input" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} required />
      </div>
      
      <button type="submit" disabled={loading} className="btn btn-create">
        {loading ? '⏳ Создание...' : '➕ Создать ключ'}
      </button>
    </form>
  );
}