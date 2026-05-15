import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import '../Cards/CardList.css';

type Terminal = {
  id: number;
  name: string;
  address: string;
  serial_number: string;
};

type TerminalsResponse = { data: Terminal[] };

export default function TerminalList() {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', serial_number: '' });
  const [formError, setFormError] = useState('');

  const fetchTerminals = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<TerminalsResponse>('/api/v1/terminals');
      setTerminals(response.data.data || []);
    } catch (err) {
      setError(getBackendError(err, 'Не удалось загрузить терминалы'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTerminals(); }, []);

  const startEdit = (terminal: Terminal) => {
    setEditingId(terminal.id);
    setFormData({ name: terminal.name, address: terminal.address, serial_number: terminal.serial_number });
    setFormError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormError('');
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      await api.put(`/api/v1/terminals/${editingId}`, formData);
      setEditingId(null);
      fetchTerminals();
    } catch (err) {
      setFormError(getBackendError(err, 'Ошибка сохранения'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить терминал?')) return;
    try {
      await api.delete(`/api/v1/terminals/${id}`);
      fetchTerminals();
    } catch (err) {
      alert(getBackendError(err, 'Ошибка удаления'));
    }
  };

  if (loading) return <p className="card-item--loading">Загрузка...</p>;
  if (error) return <p className="card-item--error">{error}</p>;

  return (
    <div className="card-list-container">
      {terminals.length === 0 ? <p>Терминалов не найдено</p> : (
        <ul className="card-list">
          {terminals.map(terminal => (
            <li key={terminal.id} className="card-item">
              {editingId === terminal.id ? (
                <form onSubmit={saveEdit} className="card-form">
                  <h3 className="card-form__title">Редактирование терминала</h3>
                  
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
                  
                  {formError && <p className="form-error">{formError}</p>}
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-save">💾 Сохранить</button>
                    <button type="button" onClick={cancelEdit} className="btn btn-cancel">❌ Отмена</button>
                  </div>
                </form>
              ) : (
                <div className="card-content">
                  <div>
                    <span className="card-info__number">#{terminal.serial_number}</span> 
                    <span className="card-info__owner">— {terminal.name}</span>
                    <div className="card-info__details">📍 {terminal.address}</div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => startEdit(terminal)} className="btn btn-edit">✏️ Изменить</button>
                    <button onClick={() => handleDelete(terminal.id)} className="btn btn-delete">🗑️ Удалить</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchTerminals} className="btn btn-refresh">🔄 Обновить</button>
    </div>
  );
}