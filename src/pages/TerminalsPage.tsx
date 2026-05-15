import { useState } from 'react';
import { Link } from 'react-router-dom';
import TerminalList from '../components/Terminals/TerminalList';
import TerminalForm from '../components/Terminals/TerminalForm';
import './CardsPage.css';
import '../components/Cards/CardList.css';

export default function TerminalsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="cards-page">
      <header className="cards-page__header">
        <nav className="cards-page__nav">
          <Link to="/dashboard" className="cards-page__back-link">
            ← На главную
          </Link>
        </nav>
        <h1 className="cards-page__title">📟 Управление терминалами</h1>
      </header>

      <div className="cards-page__actions">
        <button
          className={`btn ${showForm ? 'btn-cancel' : 'btn-create'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Скрыть форму' : '+ Добавить терминал'}
        </button>
      </div>

      {showForm && <TerminalForm />}
      <TerminalList />
    </div>
  );
}