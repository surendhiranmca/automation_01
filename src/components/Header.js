import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import NotificationCenter from './NotificationCenter';
import './Header.css';

const Header = ({ title, updateStatus }) => {
  const { currentUser, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const getStatusColor = () => {
    if (!updateStatus) return 'gray';
    if (updateStatus.isOverdue) return 'red';
    if (updateStatus.daysRemaining <= 3) return 'orange';
    return 'green';
  };

  const getStatusText = () => {
    if (!updateStatus) return 'Loading...';
    if (updateStatus.isOverdue) return '⚠️ Overdue';
    if (updateStatus.daysRemaining === 0) return '🔔 Due Today';
    return `✓ ${updateStatus.daysRemaining}d remaining`;
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{title}</h2>
      </div>

      <div className="header-right">
        {/* Dynamic UI Template Switcher */}
        <div className="theme-switcher-container">
          <label className="theme-label font-sm">🎨 Template: </label>
          <select value={theme} onChange={handleThemeChange} className="theme-select-input">
            <option value="dark">🌙 Dark Sapphire Glass</option>
            <option value="light">☀️ Clean Executive Light</option>
            <option value="cyberpunk">🦄 Cyberpunk Neon Violet</option>
            <option value="emerald">🌲 Emerald Forest Theme</option>
          </select>
        </div>

        <NotificationCenter />
        
        {currentUser && (
          <div className="header-user-info">
            <span className="user-name">
              {currentUser.role === 'student' ? `👨‍🎓 ${currentUser.name || currentUser.username}` : `🛡️ ${currentUser.username}`}
            </span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        )}

        <div className={`update-badge update-badge-${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>
    </header>
  );
};

export default Header;
