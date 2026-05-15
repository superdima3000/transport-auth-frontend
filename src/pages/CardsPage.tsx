import { useState } from 'react';
import { Link } from 'react-router-dom';
import CardList from '../components/Cards/CardList';
import CardForm from '../components/Cards/CardForm';
import './CardsPage.css';

// Импортируем общие стили кнопок, чтобы .btn-create и .btn-cancel работали
import '../components/Cards/CardList.css';

export default function CardsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="cards-page">
      <header className="cards-page__header">
        <nav className="cards-page__nav">
          <Link to="/dashboard" className="cards-page__back-link">
            ← На главную
          </Link>
        </nav>
        <h1 className="cards-page__title">💳 Управление картами</h1>
      </header>

      <div className="cards-page__actions">
        <button
          className={`btn ${showForm ? 'btn-cancel' : 'btn-create'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Скрыть форму' : '+ Добавить карту'}
        </button>
      </div>

      {showForm && <CardForm />}
      <CardList />
    </div>
  );
}