import { useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import '../Cards/CardList.css';

export default function TransactionForm() {
  const [formData, setFormData] = useState({ 
    amount: '', 
    card_id: '', 
    terminal_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/v1/transactions', {
        amount: parseFloat(formData.amount),
        card_id: parseInt(formData.card_id, 10),
        terminal_id: parseInt(formData.terminal_id, 10),
      });
      
      setFormData({ amount: '', card_id: '', terminal_id: '' });
      alert('Транзакция успешно создана!');
    } catch (err) {
      setError(getBackendError(err, 'Ошибка создания транзакции'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-form card-create-form">
      <h3 className="card-form__title">Новая транзакция</h3>
      {error && <p className="form-error">{error}</p>}
      
      <div className="form-group">
        <label className="form-label">Сумма (₽)</label>
        <input 
          className="form-input" 
          type="number" 
          step="0.01"
          value={formData.amount} 
          onChange={e => setFormData({...formData, amount: e.target.value})} 
          required 
        />
      </div>

      <div className="form-group__row">
        <div className="form-group">
          <label className="form-label">ID Карты</label>
          <input 
            className="form-input" 
            type="number" 
            value={formData.card_id} 
            onChange={e => setFormData({...formData, card_id: e.target.value})} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">ID Терминала</label>
          <input 
            className="form-input" 
            type="number" 
            value={formData.terminal_id} 
            onChange={e => setFormData({...formData, terminal_id: e.target.value})} 
            required 
          />
        </div>
      </div>
      
      <button type="submit" disabled={loading} className="btn btn-create">
        {loading ? '⏳ Обработка...' : '➕ Создать транзакцию'}
      </button>
    </form>
  );
}