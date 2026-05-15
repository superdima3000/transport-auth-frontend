import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import '../Cards/CardList.css';

type Transaction = {
  id: number;
  amount: number;
  card_id: number;
  terminal_id: number;
  created_at: string;
};

type TransactionsResponse = { data: Transaction[] };

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ amount: 0, card_id: 0, terminal_id: 0 });
  const [formError, setFormError] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<TransactionsResponse>('/api/v1/transactions');
      setTransactions(response.data.data || []);
    } catch (err) {
      setError(getBackendError(err, 'Не удалось загрузить транзакции'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setFormData({ amount: transaction.amount, card_id: transaction.card_id, terminal_id: transaction.terminal_id });
    setFormError('');
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await api.put(`/api/v1/transactions/${editingId}`, formData);
      setEditingId(null);
      fetchTransactions();
    } catch (err) {
      setFormError(getBackendError(err, 'Ошибка сохранения'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить транзакцию?')) return;
    try {
      await api.delete(`/api/v1/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      alert(getBackendError(err, 'Ошибка удаления'));
    }
  };

  // Метод для специфичного роута авторизации MIFARE
  const handleAuthorize = async (id: number) => {
    try {
      await api.get(`/api/v1/transactions/${id}/authorize`);
      alert('Транзакция авторизована');
      fetchTransactions();
    } catch (err) {
      alert(getBackendError(err, 'Ошибка авторизации транзакции'));
    }
  };

  if (loading) return <p className="card-item--loading">Загрузка...</p>;
  if (error) return <p className="card-item--error">{error}</p>;

  return (
    <div className="card-list-container">
      {transactions.length === 0 ? <p>Транзакций нет</p> : (
        <ul className="card-list">
          {transactions.map(trx => (
            <li key={trx.id} className="card-item">
              {editingId === trx.id ? (
                <form onSubmit={saveEdit} className="card-form">
                  <h3 className="card-form__title">Редактирование</h3>
                  <div className="form-group__row">
                    <div className="form-group">
                      <label className="form-label">Сумма</label>
                      <input className="form-input" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: +e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Card ID</label>
                      <input className="form-input" type="number" value={formData.card_id} onChange={e => setFormData({...formData, card_id: +e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Terminal ID</label>
                      <input className="form-input" type="number" value={formData.terminal_id} onChange={e => setFormData({...formData, terminal_id: +e.target.value})} required />
                    </div>
                  </div>
                  {formError && <p className="form-error">{formError}</p>}
                  <div className="form-actions">
                    <button type="submit" className="btn btn-save">💾 Сохранить</button>
                    <button type="button" onClick={() => setEditingId(null)} className="btn btn-cancel">❌ Отмена</button>
                  </div>
                </form>
              ) : (
                <div className="card-content">
                  <div>
                    <span className="card-info__number">ID: {trx.id}</span>
                    <span className="card-info__owner">— Сумма: {trx.amount} ₽</span>
                    <div className="card-info__details">
                      Карта: {trx.card_id} | Терминал: {trx.terminal_id} | Дата: {new Date(trx.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleAuthorize(trx.id)} className="btn btn-create">✅ Авторизовать</button>
                    <button onClick={() => startEdit(trx)} className="btn btn-edit">✏️</button>
                    <button onClick={() => handleDelete(trx.id)} className="btn btn-delete">🗑️</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchTransactions} className="btn btn-refresh">🔄 Обновить</button>
    </div>
  );
}