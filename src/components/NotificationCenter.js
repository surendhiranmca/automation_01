import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import './NotificationCenter.css';

const NotificationCenter = ({ onPageChange }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTargetPage = (n) => {
    if (n.targetPage) return n.targetPage;
    
    const text = `${n.title || ''} ${n.message || ''}`.toLowerCase();
    
    if (text.includes('payment') || text.includes('paid') || text.includes('fee') || text.includes('txn') || text.includes('receipt') || text.includes('transaction')) {
      return 'fees';
    }
    if (text.includes('leave') || text.includes('outstation') || text.includes('approval') || text.includes('warden')) {
      return 'leaves';
    }
    if (text.includes('complaint') || text.includes('issue') || text.includes('repair')) {
      return 'complaints';
    }
    if (text.includes('visitor') || text.includes('check-in') || text.includes('check-out')) {
      return 'visitors';
    }
    if (text.includes('attendance') || text.includes('roll call') || text.includes('absent') || text.includes('present')) {
      return 'attendance';
    }
    if (text.includes('room') || text.includes('table') || text.includes('student') || text.includes('resident')) {
      return 'namelist';
    }
    return 'fees';
  };

  const handleNotificationClick = (n) => {
    markAsRead(n.id);
    setIsOpen(false);
    if (onPageChange) {
      const target = getTargetPage(n);
      onPageChange(target);
    }
  };

  return (
    <div className="notification-center" ref={dropdownRef}>
      <button 
        className="notification-bell-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button className="text-btn" onClick={markAllAsRead}>Mark all read</button>
              )}
              {notifications.length > 0 && (
                <button className="text-btn danger-text" onClick={clearAllNotifications}>Clear</button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <span>🔕 No notifications yet</span>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                  title={`Click to view details in ${getTargetPage(n)}`}
                >
                  <div className="notification-title">
                    <span>{n.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {!n.isRead && <span className="unread-dot"></span>}
                      <span className="notif-redirect-arrow">→</span>
                    </div>
                  </div>
                  <div className="notification-message">{n.message}</div>
                  <div className="notification-time">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default NotificationCenter;
