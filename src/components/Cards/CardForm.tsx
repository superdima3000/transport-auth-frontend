import { useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import './CardList.css';

export default function CardForm() {
  const [formData, setFormData] = useState({ 
    card_number: '', 
    owner_name: '', 
    balance: '0',
    key_id: '1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/v1/cards', {
        card_number: formData.card_number,
        owner_name: formData.owner_name,
        balance: parseFloat(formData.balance),
        is_blocked: false,
        key_id: parseInt(formData.key_id, 10),
      });
      
      setFormData({ card_number: '', owner_name: '', balance: '0', key_id: '1' });
      alert('Карта успешно создана!');
    } catch (err) {
      setError(getBackendError(err, 'Ошибка создания карты'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-form card-create-form">
      <h3 className="card-form__title">Новая карта</h3>
      {error && <p className="form-error">{error}</p>}
      
      <div className="form-group">
        <label className="form-label">Номер карты</label>
        <input className="form-input" value={formData.card_number} onChange={e => setFormData({...formData, card_number: e.target.value})} required />
      </div>

      <div className="form-group">
        <label className="form-label">Владелец</label>
        <input className="form-input" value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value})} required />
      </div>

      <div className="form-group__row">
        <div className="form-group">
          <label className="form-label">Баланс (₽)</label>
          <input className="form-input" type="number" value={formData.balance} onChange={e => setFormData({...formData, balance: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Key ID</label>
          <input className="form-input" type="number" value={formData.key_id} onChange={e => setFormData({...formData, key_id: e.target.value})} required />
        </div>
      </div>
      
      <button type="submit" disabled={loading} className="btn btn-create">
        {loading ? '⏳ Создание...' : '➕ Создать карту'}
      </button>
    </form>
  );
}