import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserList from '../components/Users/UserList';
import UserForm from '../components/Users/UserForm';
import './CardsPage.css';
import '../components/Cards/CardList.css';

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="cards-page">
      <header className="cards-page__header">
        <nav className="cards-page__nav">
          <Link to="/dashboard" className="cards-page__back-link">
            ← На главную
          </Link>
        </nav>
        <h1 className="cards-page__title">👥 Управление пользователями</h1>
      </header>

      <div className="cards-page__actions">
        <button
          className={`btn ${showForm ? 'btn-cancel' : 'btn-create'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Скрыть форму' : '+ Добавить пользователя'}
        </button>
      </div>

      {showForm && <UserForm />}
      <UserList />
    </div>
  );
}