import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import './CardList.css';

type Card = {
  id: number;
  card_number: string;
  owner_name: string;
  balance: number;
  is_blocked: boolean;
  key_id: number;
};

type CardsResponse = {
  data: Card[];
};

export default function CardList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    card_number: '',
    owner_name: '',
    balance: 0,
    is_blocked: false,
    key_id: 0,
  });
  const [formError, setFormError] = useState('');

  const fetchCards = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<CardsResponse>('/api/v1/cards');
      setCards(response.data.data || []);
    } catch (err) {
      setError(getBackendError(err, 'Не удалось загрузить карты'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCards(); }, []);

  const startEdit = (card: Card) => {
    setEditingCardId(card.id);
    setFormData({
      card_number: card.card_number,
      owner_name: card.owner_name,
      balance: card.balance,
      is_blocked: card.is_blocked,
      key_id: card.key_id,
    });
    setFormError('');
  };

  const cancelEdit = () => {
    setEditingCardId(null);
    setFormError('');
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCardId) return;

    try {
      await api.put(`/api/v1/cards/${editingCardId}`, formData);
      setEditingCardId(null);
      fetchCards();
    } catch (err) {
      setFormError(getBackendError(err, 'Ошибка сохранения'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить карту?')) return;
    try {
      await api.delete(`/api/v1/cards/${id}`);
      fetchCards();
    } catch (err) {
      alert(getBackendError(err, 'Ошибка удаления'));
    }
  };

  if (loading) return <p className="card-item--loading">Загрузка...</p>;
  if (error) return <p className="card-item--error">{error}</p>;

  return (
    <div className="card-list-container">
      {cards.length === 0 ? (
        <p>Карт не найдено</p>
      ) : (
        <ul className="card-list">
          {cards.map(card => (
            <li key={card.id} className="card-item">
              {editingCardId === card.id ? (
                <form onSubmit={saveEdit} className="card-form">
                  <h3 className="card-form__title">Редактирование карты</h3>
                  
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
                      <input className="form-input" type="number" value={formData.balance} onChange={e => setFormData({...formData, balance: +e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Key ID</label>
                      <input className="form-input" type="number" value={formData.key_id} onChange={e => setFormData({...formData, key_id: +e.target.value})} required />
                    </div>
                  </div>
                  
                  <div className="checkbox-wrapper">
                    <input type="checkbox" id={`blocked-${card.id}`} checked={formData.is_blocked} onChange={e => setFormData({...formData, is_blocked: e.target.checked})} />
                    <label htmlFor={`blocked-${card.id}`}>Карта заблокирована</label>
                  </div>
                  
                  {formError && <p className="form-error">{formError}</p>}
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-save">💾 Сохранить</button>
                    <button type="button" onClick={cancelEdit} className="btn btn-cancel">❌ Отмена</button>
                  </div>
                </form>
              ) : (
                <div className="card-content">
                  <div>
                    <span className="card-info__number">#{card.card_number}</span> 
                    <span className="card-info__owner">— {card.owner_name}</span>
                    <div className="card-info__details">
                      💰 {card.balance} ₽ | 🔑 Key: {card.key_id} | {card.is_blocked ? '🔴 Блок' : '🟢 Активна'}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => startEdit(card)} className="btn btn-edit">✏️ Изменить</button>
                    <button onClick={() => handleDelete(card.id)} className="btn btn-delete">🗑️ Удалить</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchCards} className="btn btn-refresh">🔄 Обновить список</button>
    </div>
  );
}