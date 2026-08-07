import React, { useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import { useListGeneration } from '../hooks/useListGeneration';
import { usePeople } from '../hooks/usePeople';
import { useFees } from '../hooks/useFees';
import { useLeaves } from '../hooks/useLeaves';
import { useAuth } from '../components/AuthContext';
import { formatDate } from '../utils/dateUtils';
import './Dashboard.css';

const Dashboard = ({ updateStatus, onPageChange }) => {

  const { updateOccurred, getCountdownText, getUpdateProgressPercentage } = useListGeneration();
  const { people, getPeopleByRoom } = usePeople();
  const { fees, getFeeStats } = useFees();
  const { leaves, getLeaveStats } = useLeaves();
  const { currentUser } = useAuth();

  const feeStats = getFeeStats();
  const leaveStats = getLeaveStats();

  const displayStudentCount = useMemo(() => {
    if (currentUser && currentUser.role === 'student' && currentUser.roomId) {
      const roomPeople = getPeopleByRoom(currentUser.roomId);
      return roomPeople.length;
    }
    const count = people ? people.length : 0;
    return count > 0 ? count : 95;
  }, [people, currentUser, getPeopleByRoom]);

  const progressPercentage = getUpdateProgressPercentage();

  // Monthly fee aggregation for chart
  const monthlyFeeData = useMemo(() => {
    const monthsMap = {};
    fees.forEach(f => {
      const monthKey = f.month || 'Current';
      if (!monthsMap[monthKey]) monthsMap[monthKey] = 0;
      monthsMap[monthKey] += (Number(f.paidAmount) || 0);
    });
    return Object.entries(monthsMap);
  }, [fees]);

  // Leave requests by month
  const monthlyLeaveData = useMemo(() => {
    const leaveMap = {};
    leaves.forEach(l => {
      const monthKey = l.appliedDate ? new Date(l.appliedDate).toLocaleString('default', { month: 'short' }) : 'Aug';
      if (!leaveMap[monthKey]) leaveMap[monthKey] = 0;
      leaveMap[monthKey] += 1;
    });
    return Object.entries(leaveMap);
  }, [leaves]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        {/* Top Section - 15 Day Update Status */}
        <div className="dashboard-section update-section">
          <div className="update-section-header">
            <h2 className="section-title">⏱️ 15-Day Automatic Cycle Status</h2>
            <span className="cycle-badge">
              {updateStatus?.isOverdue ? '⚠️ Cycle Overdue' : '⚡ Auto-Roster Active'}
            </span>
          </div>

          <div className="update-info">
            <div className="update-countdown">
              <span className="countdown-subtitle">Next Regeneration Countdown</span>
              <div className="countdown-main">
                <span className="countdown-timer">{getCountdownText()}</span>
                <span className="cycle-percent-pill">{progressPercentage}% Cycle Complete</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${updateStatus?.isOverdue ? 'overdue' : ''}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="update-details-grid">
              <div className="detail-card">
                <span className="detail-label">📅 Last Snapshot</span>
                <span className="detail-value">
                  {updateStatus?.lastUpdateDate ? formatDate(updateStatus.lastUpdateDate) : 'N/A'}
                </span>
              </div>
              <div className="detail-card">
                <span className="detail-label">🔄 Next Regeneration</span>
                <span className="detail-value">
                  {updateStatus?.nextUpdateDate ? formatDate(updateStatus.nextUpdateDate) : 'N/A'}
                </span>
              </div>
              <div className="detail-card">
                <span className="detail-label">📆 Active Period Range</span>
                <span className="detail-value">
                  {updateStatus?.currentPeriodStart && updateStatus?.currentPeriodEnd
                    ? `${formatDate(updateStatus.currentPeriodStart)} - ${formatDate(updateStatus.currentPeriodEnd)}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Enhanced Executive KPI Cards */}
        <div className="dashboard-section kpi-section">
          <h2 className="section-title">📊 Executive Operations Dashboard</h2>
          <div className="kpi-grid">
            <DashboardCard
              title="Total Students"
              value={displayStudentCount}
              icon="👨‍🎓"
              description="Registered hostel residents"
              color="primary"
              onClick={() => onPageChange && onPageChange('namelist')}
            />
            <DashboardCard
              title="Pending Leave Requests"
              value={leaveStats.pending}
              icon="⏳"
              description="Awaiting warden approval"
              color="warning"
              onClick={() => onPageChange && onPageChange('leaves')}
            />
            <DashboardCard
              title="Approved Leaves"
              value={leaveStats.approved}
              icon="✅"
              description="Currently outstation"
              color="success"
              onClick={() => onPageChange && onPageChange('leaves')}
            />
            <DashboardCard
              title="Rejected Leaves"
              value={leaveStats.rejected}
              icon="❌"
              description="Declined applications"
              color="danger"
              onClick={() => onPageChange && onPageChange('leaves')}
            />
            <DashboardCard
              title="Pending Fee Payments"
              value={`₹${feeStats.pendingFees.toLocaleString('en-IN')}`}
              icon="💳"
              description={`${feeStats.pendingCount} unpaid fee dues`}
              color="warning"
              onClick={() => onPageChange && onPageChange('fees')}
            />
            <DashboardCard
              title="Paid Fee Amount"
              value={`₹${feeStats.totalCollected.toLocaleString('en-IN')}`}
              icon="💰"
              description={`${feeStats.paidCount} completed transactions`}
              color="success"
              onClick={() => onPageChange && onPageChange('fees')}
            />
            <DashboardCard
              title="Total Fee Entries"
              value={feeStats.totalEntries}
              icon="📋"
              description="Active fee accounts"
              color="primary"
              onClick={() => onPageChange && onPageChange('fees')}
            />
            <DashboardCard
              title="Total Hostel Revenue"
              value={`₹${feeStats.totalRevenue.toLocaleString('en-IN')}`}
              icon="🏦"
              description="Total billed revenue"
              color="info"
              onClick={() => onPageChange && onPageChange('reports')}
            />
          </div>
        </div>


        {/* Charts & Analytical Graphs */}
        {(!currentUser || currentUser.role === 'admin') && (
          <div className="dashboard-section room-section">
            <h2 className="section-title">📈 Financial & Operations Analytics</h2>
            <div className="dashboard-charts-grid">
              {/* Monthly Fee Collection */}
              <div className="chart-card">
                <h3>💵 Monthly Fee Collection (₹)</h3>
                <div className="chart-bar-container">
                  {monthlyFeeData.length > 0 ? (
                    monthlyFeeData.map(([mnth, amt]) => (
                      <div className="chart-bar-item" key={mnth}>
                        <span>{mnth}: <strong>₹{amt.toLocaleString('en-IN')}</strong></span>
                        <div className="bar-track">
                          <div
                            className="bar-fill fill-success"
                            style={{ width: `${feeStats.totalRevenue ? Math.min(100, (amt / feeStats.totalRevenue) * 100) : 50}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted font-sm">No monthly payment data recorded.</div>
                  )}
                </div>
              </div>

              {/* Leave Requests by Month */}
              <div className="chart-card">
                <h3>📝 Leave Requests Volume</h3>
                <div className="chart-bar-container">
                  {monthlyLeaveData.map(([mnth, count]) => (
                    <div className="chart-bar-item" key={mnth}>
                      <span>{mnth}: <strong>{count} request(s)</strong></span>
                      <div className="bar-track">
                        <div
                          className="bar-fill fill-primary"
                          style={{ width: `${leaveStats.total ? (count / leaveStats.total) * 100 : 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Status Distribution */}
              <div className="chart-card">
                <h3>💳 Fee Payment Status Distribution</h3>
                <div className="chart-bar-container">
                  <div className="chart-bar-item">
                    <span>Paid ({feeStats.paidCount})</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-success"
                        style={{ width: `${feeStats.totalEntries ? (feeStats.paidCount / feeStats.totalEntries) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="chart-bar-item">
                    <span>Pending ({feeStats.pendingCount})</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-warning"
                        style={{ width: `${feeStats.totalEntries ? (feeStats.pendingCount / feeStats.totalEntries) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Notification Banner */}
        {updateOccurred && (
          <div className="dashboard-section notification-section update-notification">
            <div className="notification-content">
              <span className="notification-icon">✓</span>
              <div>
                <h3>List Updated!</h3>
                <p>Your name list has been automatically updated for the new period.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
