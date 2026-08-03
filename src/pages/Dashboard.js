import React, { useState, useEffect, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import { useListGeneration } from '../hooks/useListGeneration';
import { useRooms } from '../hooks/useRooms';
import { usePeople } from '../hooks/usePeople';
import { useFees } from '../hooks/useFees';
import { useComplaints } from '../hooks/useComplaints';
import { useLeaves } from '../hooks/useLeaves';
import { useAuth } from '../components/AuthContext';
import { formatDate } from '../utils/dateUtils';
import './Dashboard.css';

const Dashboard = ({ updateStatus }) => {
  const { updateStatus: status, statistics, updateOccurred, getCountdownText, getUpdateProgressPercentage } = useListGeneration();
  const { rooms, getTotalRooms } = useRooms();
  const { people, getTotalPeople, getActivePeopleCount, getAveragePeoplePerRoom, getPeopleByRoom } = usePeople();
  const { fees, getFeeStats } = useFees();
  const { complaints, getComplaintStats } = useComplaints();
  const { leaves, getLeaveStats } = useLeaves();
  const { currentUser } = useAuth();
  
  const [roomsCount, setRoomsCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  const feeStats = getFeeStats();
  const complaintStats = getComplaintStats();
  const leaveStats = getLeaveStats();

  useEffect(() => {
    if (currentUser && currentUser.role === 'student' && currentUser.roomId) {
      const roomPeople = getPeopleByRoom(currentUser.roomId);
      setRoomsCount(1);
      setPeopleCount(roomPeople.length);
      setActiveCount(roomPeople.filter(p => p.status === 'active').length);
    } else {
      setRoomsCount(getTotalRooms());
      setPeopleCount(getTotalPeople());
      setActiveCount(getActivePeopleCount());
    }
  }, [getTotalRooms, getTotalPeople, getActivePeopleCount, getPeopleByRoom, currentUser]);

  const progressPercentage = getUpdateProgressPercentage();

  const occupiedRoomsCount = useMemo(() => {
    const occupiedRoomIds = new Set(people.map(p => p.roomId));
    return occupiedRoomIds.size;
  }, [people]);

  const availableRoomsCount = Math.max(0, rooms.length - occupiedRoomsCount);

  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        {/* Top Section - Update Status */}
        <div className="dashboard-section update-section">
          <h2 className="section-title">15-Day Automation Cycle Status</h2>
          <div className="update-info">
            <div className="update-countdown">
              <h3>Next Automatic Update</h3>
              <div className="countdown-box">
                <p className="countdown-text">{getCountdownText()}</p>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${updateStatus?.isOverdue ? 'overdue' : ''}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="progress-text">{progressPercentage}% complete</p>
              </div>
            </div>

            <div className="update-details">
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">
                  {updateStatus?.lastUpdateDate ? formatDate(updateStatus.lastUpdateDate) : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Next Update</span>
                <span className="detail-value">
                  {updateStatus?.nextUpdateDate ? formatDate(updateStatus.nextUpdateDate) : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Period</span>
                <span className="detail-value">
                  {updateStatus?.currentPeriodStart && updateStatus?.currentPeriodEnd
                    ? `${formatDate(updateStatus.currentPeriodStart)} - ${formatDate(updateStatus.currentPeriodEnd)}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Hostel Key Metrics */}
        <div className="dashboard-section kpi-section">
          <h2 className="section-title">Hostel Key Metrics</h2>
          <div className="kpi-grid">
            <DashboardCard
              title="Total Students"
              value={peopleCount}
              icon="👥"
              description="Assigned resident students"
              color="primary"
            />
            <DashboardCard
              title="Occupied Rooms"
              value={occupiedRoomsCount}
              icon="🏠"
              description="Rooms with assigned students"
              color="success"
            />
            <DashboardCard
              title="Available Rooms"
              value={availableRoomsCount}
              icon="🔑"
              description="Vacant / unassigned rooms"
              color="secondary"
            />
            <DashboardCard
              title="Pending Fees"
              value={`₹${feeStats.pendingFees.toLocaleString('en-IN')}`}
              icon="💵"
              description={`${feeStats.pendingCount + feeStats.overdueCount} pending fee records`}
              color="warning"
            />
            <DashboardCard
              title="Active Complaints"
              value={complaintStats.pending + complaintStats.inProgress}
              icon="⚠️"
              description={`${complaintStats.pending} pending, ${complaintStats.inProgress} in progress`}
              color="danger"
            />
            <DashboardCard
              title="Students on Leave"
              value={leaveStats.approved}
              icon="🏖️"
              description={`${leaveStats.pending} leave requests pending`}
              color="info"
            />
          </div>
        </div>

        {/* Visual Distribution Charts Section */}
        {(!currentUser || currentUser.role === 'admin') && (
          <div className="dashboard-section room-section">
            <h2 className="section-title">Hostel Operations Breakdown</h2>
            <div className="dashboard-charts-grid">
              {/* Fee Collection Status Bar */}
              <div className="chart-card">
                <h3>Fee Collection Status</h3>
                <div className="chart-bar-container">
                  <div className="chart-bar-item">
                    <span>Paid (₹{feeStats.totalCollected.toLocaleString('en-IN')})</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-success"
                        style={{ width: `${feeStats.totalEntries ? (feeStats.paidCount / feeStats.totalEntries) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="chart-bar-item">
                    <span>Pending (₹{feeStats.pendingFees.toLocaleString('en-IN')})</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-warning"
                        style={{ width: `${feeStats.totalEntries ? ((feeStats.pendingCount + feeStats.overdueCount) / feeStats.totalEntries) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complaint Status Bar */}
              <div className="chart-card">
                <h3>Complaint Resolution</h3>
                <div className="chart-bar-container">
                  <div className="chart-bar-item">
                    <span>Resolved ({complaintStats.resolved})</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-success"
                        style={{ width: `${complaintStats.total ? (complaintStats.resolved / complaintStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="chart-bar-item">
                    <span>Active ({complaintStats.pending + complaintStats.inProgress})</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-danger"
                        style={{ width: `${complaintStats.total ? ((complaintStats.pending + complaintStats.inProgress) / complaintStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Status Bar */}
              <div className="chart-card">
                <h3>Outstation Leave Status</h3>
                <div className="chart-bar-container">
                  <div className="chart-bar-item">
                    <span>Approved ({leaveStats.approved})</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-primary"
                        style={{ width: `${leaveStats.total ? (leaveStats.approved / leaveStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="chart-bar-item">
                    <span>Pending ({leaveStats.pending})</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill fill-warning"
                        style={{ width: `${leaveStats.total ? (leaveStats.pending / leaveStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Notification */}
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
