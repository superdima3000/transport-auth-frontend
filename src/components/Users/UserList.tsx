import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { getBackendError } from '../../utils/errorHandler';
import '../Cards/CardList.css';

type UserItem = {
  id: number;
  login: string;
  is_admin: number;
};

type UsersResponse = {
  data: UserItem[];
};

export default function UserList() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  // Сохраняем логин для отправки (он обязателен), но менять даем только is_admin
  const [formData, setFormData] = useState({ login: '', is_admin: 0 });
  const [formError, setFormError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<UsersResponse>('/api/v1/users');
      setUsers(response.data.data || []);
    } catch (err) {
      setError(getBackendError(err, 'Не удалось загрузить пользователей'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const startEdit = (user: UserItem) => {
    setEditingId(user.id);
    setFormData({ login: user.login, is_admin: user.is_admin });
    setFormError('');
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      await api.put(`/api/v1/users/${editingId}`, {
        login: formData.login, // Отправляем старый логин, так как бекенд его требует
        is_admin: formData.is_admin,
      });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setFormError(getBackendError(err, 'Ошибка сохранения'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить пользователя?')) return;
    try {
      await api.delete(`/api/v1/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(getBackendError(err, 'Ошибка удаления'));
    }
  };

  if (loading) return <p className="card-item--loading">Загрузка...</p>;
  if (error) return <p className="card-item--error">{error}</p>;

  return (
    <div className="card-list-container">
      {users.length === 0 ? <p>Пользователей не найдено</p> : (
        <ul className="card-list">
          {users.map(user => (
            <li key={user.id} className="card-item">
              {editingId === user.id ? (
                <form onSubmit={saveEdit} className="card-form">
                  <h3 className="card-form__title">Изменение статуса</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Пользователь</label>
                    {/* Показываем логин просто текстом, без инпута */}
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' }}>
                      {formData.login}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Статус (Роль)</label>
                    <select 
                      className="form-input" 
                      value={formData.is_admin} 
                      onChange={e => setFormData({...formData, is_admin: parseInt(e.target.value, 10)})}
                    >
                      <option value={0}>Обычный пользователь</option>
                      <option value={1}>Администратор</option>
                    </select>
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
                    <span className="card-info__number">ID: {user.id}</span> 
                    <span className="card-info__owner">— {user.login}</span>
                    <div className="card-info__details">
                      Роль: {user.is_admin === 1 ? '👑 Администратор' : '👤 Пользователь'}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => startEdit(user)} className="btn btn-edit">✏️ Права</button>
                    <button onClick={() => handleDelete(user.id)} className="btn btn-delete">🗑️ Удалить</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchUsers} className="btn btn-refresh">🔄 Обновить список</button>
    </div>
  );
}