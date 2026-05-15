import { useState } from 'react';
import { Link } from 'react-router-dom';
import KeyList from '../components/Keys/KeysList';
import KeyForm from '../components/Keys/KeyForm';
import './CardsPage.css'; // Используем те же стили для страницы
import '../components/Cards/CardList.css'; // Общие стили кнопок

export default function KeysPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="cards-page">
      <header className="cards-page__header">
        <nav className="cards-page__nav">
          <Link to="/dashboard" className="cards-page__back-link">← На главную</Link>
        </nav>
        <h1 className="cards-page__title">🔑 Управление ключами</h1>
      </header>

      <div className="cards-page__actions">
        <button
          className={`btn ${showForm ? 'btn-cancel' : 'btn-create'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Скрыть форму' : '+ Добавить ключ'}
        </button>
      </div>

      {showForm && <KeyForm />}
      <KeyList />
    </div>
  );
}