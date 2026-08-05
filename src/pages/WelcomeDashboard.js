import React from 'react';
import { useAuth } from '../components/AuthContext';
import { usePeople } from '../hooks/usePeople';
import { useRooms } from '../hooks/useRooms';
import { useFees } from '../hooks/useFees';
import { useLeaves } from '../hooks/useLeaves';
import { useNotifications } from '../hooks/useNotifications';
import DashboardCard from '../components/DashboardCard';
import './WelcomeDashboard.css';

const WelcomeDashboard = ({ onHostelLogin }) => {
  const { currentUser } = useAuth();
  const { people } = usePeople();
  const { rooms } = useRooms();
  const { fees } = useFees();
  const { leaves } = useLeaves();
  const { notifications, markAsRead } = useNotifications();

  const isStudent = currentUser && currentUser.role === 'student';

  // Find student record
  const student = isStudent
    ? people.find(p => p.registrationNumber === currentUser.username || p.id === currentUser.id)
    : null;

  const room = student ? rooms.find(r => r.id === student.roomId) : null;
  const roommates = student ? people.filter(p => p.roomId === student.roomId && p.id !== student.id) : [];

  const studentFees = isStudent
    ? fees.filter(f => f.personId === currentUser.id || f.registrationNumber === currentUser.username)
    : [];

  const pendingFees = studentFees.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  const paidFees = studentFees.filter(f => f.status === 'Paid');
  const totalPendingAmount = pendingFees.reduce((acc, f) => acc + (Number(f.totalPayable || f.amount) || 0), 0);

  const studentLeaves = isStudent
    ? leaves.filter(l => l.personId === currentUser.id || l.registrationNumber === currentUser.username)
    : [];

  const pendingLeaves = studentLeaves.filter(l => l.status === 'Pending');
  const approvedLeaves = studentLeaves.filter(l => l.status === 'Approved');

  const nextDueDate = pendingFees.length > 0
    ? pendingFees.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0].dueDate
    : 'No Dues';

  if (!currentUser) {
    return (
      <div className="welcome-fullscreen">
        <div className="fullscreen-bg">
          <div className="glow-blob blob-top-left"></div>
          <div className="glow-blob blob-bottom-right"></div>
          <div className="bg-grid-overlay"></div>
        </div>

        <header className="welcome-nav">
          <div className="nav-brand">
            <div className="brand-logo-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 8L8 26V54H56V26L32 8Z" fill="url(#brandGrad)" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M24 34H30V44H24V34Z" fill="#818cf8"/>
                <path d="M34 34H40V44H34V34Z" fill="#818cf8"/>
                <path d="M24 22H30V28H24V22Z" fill="#c7d2fe"/>
                <path d="M34 22H40V28H34V22Z" fill="#c7d2fe"/>
                <path d="M28 54V46H36V54H28Z" fill="#4f46e5"/>
                <defs>
                  <linearGradient id="brandGrad" x1="8" y1="8" x2="56" y2="54" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" stopOpacity="0.95"/>
                    <stop offset="1" stopColor="#e0e7ff" stopOpacity="0.95"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-text-container">
              <span className="brand-title">DON BOSCO</span>
              <span className="brand-subtitle">SKILL MISSION</span>
            </div>
          </div>

          <button className="nav-login-btn" onClick={onHostelLogin}>
            <span>Hostel Login</span>
            <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </header>

        <main className="welcome-hero-container">
          <div className="hero-content">
            <div className="badge-pill">
              <span className="badge-sparkle">✨</span>
              <span>Hostel Management System</span>
            </div>

            <h1 className="hero-title">
              Welcome to <br />
              <span className="gradient-text">DON BOSCO SKILL MISSION</span> <br />
              Hostel Portal
            </h1>

            <p className="hero-description">
              Complete automated solution for room allocations, fee payments, leave approvals, and student notifications.
            </p>

            <div className="hero-cta-group">
              <button className="primary-hero-btn" onClick={onHostelLogin}>
                <span>Hostel Login</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="student-dashboard-container">
      {/* Welcome Card */}
      <div className="welcome-card-hero">
        <div className="welcome-user-details">
          <div className="student-avatar-badge">👨‍🎓</div>
          <div>
            <h2>Welcome back, {student ? student.name : currentUser.username}!</h2>
            <p className="welcome-user-meta">
              Registration #: <strong>{student ? student.registrationNumber : currentUser.username}</strong> | Course: {student?.course || 'General'}
            </p>
          </div>
        </div>
        <div className="welcome-actions">
          <span className="badge-online">🟢 Active Resident</span>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="student-kpi-grid">
        <DashboardCard
          title="Assigned Room"
          value={room ? `Room ${room.roomNumber}` : 'Unassigned'}
          icon="🏠"
          description={room ? `${roommates.length + 1} residents` : 'No room assigned'}
          color="primary"
        />
        <DashboardCard
          title="Pending Dues"
          value={`₹${totalPendingAmount.toLocaleString('en-IN')}`}
          icon="💳"
          description={`${pendingFees.length} pending bill(s)`}
          color={totalPendingAmount > 0 ? 'warning' : 'success'}
        />
        <DashboardCard
          title="Next Due Date"
          value={nextDueDate}
          icon="🗓️"
          description="Upcoming payment deadline"
          color="info"
        />
        <DashboardCard
          title="Leave Requests"
          value={`${pendingLeaves.length} Pending`}
          icon="📝"
          description={`${approvedLeaves.length} approved leave(s)`}
          color="secondary"
        />
      </div>

      {/* Main Student Dashboard Content Grid */}
      <div className="student-sections-grid">
        {/* Room & Roommates Card */}
        <div className="student-section-card">
          <h3>🏠 Room & Roommate Information</h3>
          {room ? (
            <div className="room-info-content">
              <p><strong>Building/Wing:</strong> {room.roomName}</p>
              <p><strong>Capacity:</strong> {room.capacity} Bedded Room</p>
              <h4 style={{ marginTop: '12px', fontSize: '0.85rem' }}>Roommates in Room {room.roomNumber}:</h4>
              {roommates.length > 0 ? (
                <ul className="roommate-list">
                  {roommates.map(rm => (
                    <li key={rm.id}>
                      👤 {rm.name} <span className="text-muted">({rm.registrationNumber})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted font-sm">No roommates assigned currently.</p>
              )}
            </div>
          ) : (
            <p className="text-muted">No active room assignment.</p>
          )}
        </div>

        {/* Recent Notifications Card */}
        <div className="student-section-card">
          <h3>🔔 Recent Notifications</h3>
          {notifications.length > 0 ? (
            <div className="notifications-preview-list">
              {notifications.slice(0, 4).map(n => (
                <div key={n.id} className={`notif-preview-item ${!n.isRead ? 'unread' : ''}`} onClick={() => markAsRead(n.id)}>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No recent notifications.</p>
          )}
        </div>

        {/* Payment History Card */}
        <div className="student-section-card">
          <h3>🧾 Recent Payment Receipts</h3>
          {paidFees.length > 0 ? (
            <ul className="payment-history-list">
              {paidFees.map(f => (
                <li key={f.id} className="payment-history-item">
                  <div>
                    <strong>{f.feeType || 'Hostel Fee'}</strong>
                    <div className="text-muted font-sm">Ref: {f.transactionRef || f.receiptNumber || 'Paid'}</div>
                  </div>
                  <div className="payment-amount-badge">
                    + ₹{(Number(f.paidAmount) || Number(f.amount)).toLocaleString('en-IN')}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No completed payment receipts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
