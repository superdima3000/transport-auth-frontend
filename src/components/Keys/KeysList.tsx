import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import '../Cards/CardList.css'; // Переиспользуем твои стили

type KeyItem = {
  id: number;
  name: string;
  value: string;
};

type KeysResponse = {
  data: KeyItem[];
};

export default function KeyList() {
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingKeyId, setEditingKeyId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', value: '' });
  const [formError, setFormError] = useState('');

  const fetchKeys = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<KeysResponse>('/api/v1/keys');
      setKeys(response.data.data || []);
    } catch (err) {
      setError(getBackendError(err, 'Не удалось загрузить ключи'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, []);

  const startEdit = (key: KeyItem) => {
    setEditingKeyId(key.id);
    setFormData({ name: key.name, value: key.value });
    setFormError('');
  };

  const cancelEdit = () => {
    setEditingKeyId(null);
    setFormError('');
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingKeyId) return;

    try {
      await api.put(`/api/v1/keys/${editingKeyId}`, formData);
      setEditingKeyId(null);
      fetchKeys();
    } catch (err) {
      setFormError(getBackendError(err, 'Ошибка сохранения'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить ключ?')) return;
    try {
      await api.delete(`/api/v1/keys/${id}`);
      fetchKeys();
    } catch (err) {
      alert(getBackendError(err, 'Ошибка удаления'));
    }
  };

  if (loading) return <p className="card-item--loading">Загрузка...</p>;
  if (error) return <p className="card-item--error">{error}</p>;

  return (
    <div className="card-list-container">
      {keys.length === 0 ? (
        <p>Ключей не найдено</p>
      ) : (
        <ul className="card-list">
          {keys.map(item => (
            <li key={item.id} className="card-item">
              {editingKeyId === item.id ? (
                <form onSubmit={saveEdit} className="card-form">
                  <h3 className="card-form__title">Редактирование ключа</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Название</label>
                    <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Значение ключа</label>
                    <input className="form-input" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} required />
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
                    <span className="card-info__number">ID: {item.id}</span> 
                    <span className="card-info__owner">— {item.name}</span>
                    <div className="card-info__details">
                      Значение: {item.value}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => startEdit(item)} className="btn btn-edit">✏️ Изменить</button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-delete">🗑️ Удалить</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchKeys} className="btn btn-refresh">🔄 Обновить список</button>
    </div>
  );
}