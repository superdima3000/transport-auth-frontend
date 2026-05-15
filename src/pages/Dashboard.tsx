import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const menuItems = [
    { to: '/cards', title: 'Карты', icon: '💳', desc: 'Управление балансом и блокировкой' },
    { to: '/keys', title: 'Ключи', icon: '🔑', desc: 'Мастер-ключи доступа системы' },
    { to: '/terminals', title: 'Терминалы', icon: '📟', desc: 'Список активных устройств' },
    { to: '/transactions', title: 'Транзакции', icon: '💸', desc: 'История оплат и авторизация' },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <h1>Панель управления</h1>
          <p>Добро пожаловать, <span className="username">{user?.login}</span>!</p>
        </div>
        <button onClick={logout} className="btn-logout">Выйти →</button>
      </header>
      
      <div className="dashboard-grid">
        {menuItems.map((item) => (
          <Link key={item.to} to={item.to} className="dashboard-card">
            <div className="card-icon">{item.icon}</div>
            <div className="card-text">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}