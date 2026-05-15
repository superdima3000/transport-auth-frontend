import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>🚇 Transport Auth Panel</h1>
      <p>Добро пожаловать!</p>
      
      <nav>
        <Link to="/cards">💳 Карты</Link> | 
        <Link to="/terminals">📡 Терминалы</Link> | 
        <Link to="/transactions">📊 Транзакции</Link>
      </nav>
      
      <button onClick={logout}>Выйти</button>
    </div>
  );
}