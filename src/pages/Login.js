import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import WelcomeDashboard from './WelcomeDashboard';
import './Login.css';

const Login = () => {
  const [view, setView] = useState('welcome'); // 'welcome', 'selection', 'admin', 'student'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSelectRole = (role) => {
    setView(role);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleBack = () => {
    if (view === 'admin' || view === 'student') {
      setView('selection');
    } else {
      setView('welcome');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    const result = await login(username, password, view);
    if (!result.success) {
      setError(result.message);
    }
    setIsLoading(false);
  };

  // If in welcome mode, display full screen Welcome Dashboard landing page
  if (view === 'welcome') {
    return <WelcomeDashboard onHostelLogin={() => setView('selection')} />;
  }

  const renderSelection = () => (
    <div className="login-selection fade-in">
      <button className="back-btn" onClick={handleBack} type="button">
        ← Back to Welcome Page
      </button>
      <h2>Welcome</h2>
      <p className="selection-subtitle">Please select your login portal</p>
      <div className="role-buttons">
        <button className="role-btn admin-btn" onClick={() => handleSelectRole('admin')}>
          <div className="role-icon">👤</div>
          <span>Admin Portal</span>
        </button>
        <button className="role-btn student-btn" onClick={() => handleSelectRole('student')}>
          <div className="role-icon">🎓</div>
          <span>Student Portal</span>
        </button>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="login-form-container slide-in">
      <button className="back-btn" onClick={handleBack} type="button">
        ← Back
      </button>
      <h2 className="portal-title">
        {view === 'admin' ? 'Admin Login' : 'Student Login'}
      </h2>
      {view === 'student' && (
        <p className="portal-hint">Use your Registration Number &amp; Date of Birth to sign in</p>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="login-error shake">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">
            {view === 'student' ? '🎓 Registration Number' : 'Username'}
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={view === 'student' ? 'e.g. DBSM20260001' : 'Enter your username'}
            autoComplete="username"
            className="glass-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            {view === 'student' ? '📅 Date of Birth (DD/MM/YYYY)' : 'Password'}
          </label>
          <input
            type={view === 'student' ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={view === 'student' ? 'e.g. 15/08/2003' : 'Enter your password'}
            autoComplete="current-password"
            className="glass-input"
          />
        </div>
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? <span className="spinner"></span> : 'Sign In'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="login-wrapper fade-in">
      <div className="login-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="login-card glass-panel">
        <div className="login-header">
          <h1>DON BOSCO</h1>
          <p className="app-subtitle">SKILL MISSION</p>
          <div className="divider"></div>
          <p className="app-name">Hostel Room</p>
        </div>
        
        <div className="login-content">
          {view === 'selection' ? renderSelection() : renderForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
