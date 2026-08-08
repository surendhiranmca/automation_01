import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Notification from './components/Notification';
import { useNotification } from './hooks/useNotification';
import { useListGeneration } from './hooks/useListGeneration';
import { initializeStorage } from './utils/storage';
import { initializeSampleData } from './utils/sampleData';

import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import NameList from './pages/NameList';
import Fees from './pages/Fees';
import Complaints from './pages/Complaints';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Visitors from './pages/Visitors';
import AuditLogs from './pages/AuditLogs';
import Reports from './pages/Reports';
import History from './pages/History';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './components/AuthContext';

import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { notifications, removeNotification } = useNotification();
  const { updateStatus, updateOccurred, clearUpdateFlag } = useListGeneration();
  const [appReady, setAppReady] = useState(false);
  const { currentUser, loading } = useAuth();

  // Initialize storage on app mount
  useEffect(() => {
    initializeStorage();
    initializeSampleData();
    setAppReady(true);
  }, []);

  // Clear update flag after notification
  useEffect(() => {
    if (updateOccurred) {
      clearUpdateFlag();
    }
  }, [updateOccurred, clearUpdateFlag]);

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      rooms: 'Room & Table Management',
      namelist: 'Name List',
      fees: 'Hostel Fee Management',
      complaints: 'Complaint Management',
      leaves: 'Leave Management',
      attendance: 'Daily Attendance Roll Call',
      visitors: 'Visitor Pass Management',
      auditlogs: 'Security Audit Logs',
      reports: 'Reports & Analytics',
      history: 'History',
      settings: 'Settings',
      users: 'User Management'
    };
    return titles[currentPage] || 'Dashboard';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard updateStatus={updateStatus} onPageChange={setCurrentPage} />;

      case 'rooms':
        return <Rooms />;
      case 'namelist':
        return <NameList />;
      case 'fees':
        return <Fees />;
      case 'complaints':
        return <Complaints />;
      case 'leaves':
        return <Leaves />;
      case 'attendance':
        return <Attendance />;
      case 'visitors':
        return <Visitors />;
      case 'auditlogs':
        return <AuditLogs />;
      case 'reports':
        return <Reports />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard updateStatus={updateStatus} />;
    }
  };

  if (!appReady || loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="app-main">
        <Header title={getPageTitle()} updateStatus={updateStatus} onPageChange={setCurrentPage} />

        
        <main className="app-content">
          {renderPage()}
        </main>
      </div>

      <Notification notifications={notifications} onClose={removeNotification} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
