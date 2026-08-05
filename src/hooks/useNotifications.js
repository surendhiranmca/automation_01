import { useState, useEffect, useCallback } from 'react';
import { getNotifications, saveNotifications, addNotification as addNotifStorage } from '../utils/storage';
import { useAuth } from '../components/AuthContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();

  const loadNotifications = useCallback(() => {
    const all = getNotifications();
    if (!currentUser || currentUser.role === 'admin') {
      setNotifications(all);
    } else {
      const userNotifs = all.filter(n => 
        n.userId === currentUser.id || 
        n.registrationNumber === currentUser.username || 
        n.userId === 'all' || 
        n.userId === 'student'
      );
      setNotifications(userNotifs);
    }
  }, [currentUser]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const addNotification = (notifData) => {
    const created = addNotifStorage(notifData);
    loadNotifications();
    return created;
  };

  const markAsRead = (id) => {
    const all = getNotifications();
    const updated = all.map(n => n.id === id ? { ...n, isRead: true } : n);
    saveNotifications(updated);
    loadNotifications();
  };

  const markAllAsRead = () => {
    const all = getNotifications();
    const updated = all.map(n => {
      if (!currentUser || currentUser.role === 'admin') return { ...n, isRead: true };
      const isMine = n.userId === currentUser.id || n.registrationNumber === currentUser.username || n.userId === 'all' || n.userId === 'student';
      return isMine ? { ...n, isRead: true } : n;
    });
    saveNotifications(updated);
    loadNotifications();
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    reloadNotifications: loadNotifications
  };
};
