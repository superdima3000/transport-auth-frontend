import { useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import '../Cards/CardList.css';

export default function TerminalForm() {
  const [formData, setFormData] = useState({ name: '', address: '', serial_number: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/v1/terminals', formData);
      setFormData({ name: '', address: '', serial_number: '' });
      alert('Терминал успешно создан!');
    } catch (err) {
      setError(getBackendError(err, 'Ошибка создания'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-form card-create-form">
      <h3 className="card-form__title">Новый терминал</h3>
      {error && <p className="form-error">{error}</p>}
      
      <div className="form-group">
        <label className="form-label">Название</label>
        <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
      </div>
      <div className="form-group">
        <label className="form-label">Адрес</label>
        <input className="form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
      </div>
      <div className="form-group">
        <label className="form-label">Серийный номер</label>
        <input className="form-input" value={formData.serial_number} onChange={e => setFormData({...formData, serial_number: e.target.value})} required />
      </div>
      
      <button type="submit" disabled={loading} className="btn btn-create">
        {loading ? '⏳ Создание...' : '➕ Создать терминал'}
      </button>
    </form>
  );
}