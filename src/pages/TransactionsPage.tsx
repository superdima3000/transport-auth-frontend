import { useState } from 'react';
import { Link } from 'react-router-dom';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import './CardsPage.css';
import '../components/Cards/CardList.css';

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="cards-page">
      <header className="cards-page__header">
        <nav className="cards-page__nav">
          <Link to="/dashboard" className="cards-page__back-link">
            ← На главную
          </Link>
        </nav>
        <h1 className="cards-page__title">💸 История транзакций</h1>
      </header>

      <div className="cards-page__actions">
        <button
          className={`btn ${showForm ? 'btn-cancel' : 'btn-create'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Скрыть форму' : '+ Новая транзакция'}
        </button>
      </div>

      {showForm && <TransactionForm />}
      <TransactionList />
    </div>
  );
}