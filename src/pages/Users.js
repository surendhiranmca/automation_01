import React, { useState, useEffect } from 'react';
import { getUsers, saveUsers, generateUUID, getRooms } from '../utils/storage';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('staff');
  const [formMsg, setFormMsg] = useState({ text: '', type: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setUsers(getUsers());
    setAvailableRooms(getRooms());
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      setFormMsg({ text: 'Username and password are required.', type: 'error' });
      return;
    }
    if (users.find(u => u.username === newUsername.trim())) {
      setFormMsg({ text: 'Username already exists.', type: 'error' });
      return;
    }
    const newUser = {
      id: generateUUID(),
      username: newUsername.trim(),
      password: newPassword.trim(),
      role: newRole
    };
    const updated = [...users, newUser];
    setUsers(updated);
    saveUsers(updated);
    setNewUsername('');
    setNewPassword('');
    setNewRole('staff');
    setShowForm(false);
    setFormMsg({ text: `User "${newUser.username}" created successfully!`, type: 'success' });
    setTimeout(() => setFormMsg({ text: '', type: '' }), 3000);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }
  };

  return (
    <div className="users-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>👤 User Management</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage admin and staff accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add User'}
        </button>
      </div>

      {/* Feedback message */}
      {formMsg.text && (
        <div style={{
          padding: '10px 16px',
          borderRadius: '8px',
          marginBottom: '1rem',
          background: formMsg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: formMsg.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${formMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          {formMsg.type === 'success' ? '✅' : '⚠️'} {formMsg.text}
        </div>
      )}

      {/* Add User Form */}
      {showForm && (
        <div className="users-list-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>➕ Create New User</h3>
          <form onSubmit={handleAddUser} className="form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label required">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={newRole} onChange={e => setNewRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="warden">Warden</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">✓ Create User</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="users-list-card">
        <h3>Existing Users ({users.length})</h3>
        <div className="users-list">
          {users.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No users found.</p>
          ) : (
            users.map(user => (
              <div key={user.id} className="user-item">
                <div className="user-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="user-username">{user.username}</span>
                    <span className={`user-role role-${user.role}`}>{user.role}</span>
                  </div>
                  {user.role === 'student' && user.roomId && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      Room: {availableRooms.find(r => r.id === user.roomId)?.roomName || 'Unknown'}
                    </span>
                  )}
                </div>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-btn"
                    title="Delete user"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
