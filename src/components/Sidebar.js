import React from 'react';
import { useAuth } from './AuthContext';
import './Sidebar.css';

const Sidebar = ({ currentPage, onPageChange }) => {
  const { currentUser } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'rooms', label: 'Rooms / Tables', icon: '🏠' },
    { id: 'namelist', label: 'Name List', icon: '👥' },
    { id: 'fees', label: 'Hostel Fees', icon: '💳' },
    { id: 'leaves', label: 'Leave Requests', icon: '📝' },
    { id: 'attendance', label: 'Daily Roll Call', icon: '📅' },
    { id: 'visitors', label: 'Visitor Logs', icon: '🪪' },
    { id: 'complaints', label: 'Complaints', icon: '⚠️' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'history', label: 'List History', icon: '📜' },
    { id: 'auditlogs', label: 'Audit Logs', icon: '🛡️', roles: ['admin', 'superadmin'] },
    { id: 'settings', label: 'Settings', icon: '⚙️', roles: ['admin', 'superadmin'] },
    { id: 'users', label: 'Users', icon: '👤', roles: ['admin', 'superadmin'] }
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !item.roles || (currentUser && item.roles.includes(currentUser.role))
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title" style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>DON BOSCO<br/>SKILL MISSION</h1>
        <p className="sidebar-subtitle">Hostel Portal</p>
      </div>

      <nav className="sidebar-nav">
        {visibleMenuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-version">v2.0.0 SRS</p>
      </div>
    </aside>
  );
};

export default Sidebar;
