import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import SearchBar from '../components/SearchBar';
import AddLeaveModal from '../components/AddLeaveModal';
import { useLeaves } from '../hooks/useLeaves';
import { usePeople } from '../hooks/usePeople';
import { useRooms } from '../hooks/useRooms';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../components/AuthContext';
import './Leaves.css';

const Leaves = () => {
  const { leaves, addLeaveRequest, updateLeaveStatus, deleteLeave, getLeaveStats } = useLeaves();
  const { people } = usePeople();
  const { rooms } = useRooms();
  const { success } = useNotification();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isAdmin = !currentUser || currentUser.role === 'admin';
  const isStudent = currentUser && currentUser.role === 'student';

  const stats = getLeaveStats();

  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      if (isStudent && currentUser) {
        const isSelf = l.personId === currentUser.id || l.registrationNumber === currentUser.username;
        if (!isSelf) return false;
      }

      if (statusFilter !== 'All' && l.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = l.personName?.toLowerCase().includes(q);
        const reasonMatch = l.reason?.toLowerCase().includes(q);
        const roomMatch = l.roomNumber?.toLowerCase().includes(q);
        return nameMatch || reasonMatch || roomMatch;
      }

      return true;
    });
  }, [leaves, searchQuery, statusFilter, isStudent, currentUser]);

  const handleSaveLeave = (data) => {
    addLeaveRequest(data);
    success('Leave request submitted successfully!');
    setIsAddModalOpen(false);
  };

  const handleApprove = (id) => {
    updateLeaveStatus(id, 'Approved', 'Approved by Warden');
    success('Leave request approved');
  };

  const handleReject = (id) => {
    updateLeaveStatus(id, 'Rejected', 'Rejected by Warden');
    success('Leave request rejected');
  };

  return (
    <div className="leaves-page">
      <div className="leaves-header">
        <div>
          <h1>Leave Management</h1>
          <p className="leaves-subtitle">Submit, track, and approve student outstation leave permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Apply for Leave
        </button>
      </div>

      <div className="leaves-stats-grid">
        <DashboardCard title="Total Requests" value={stats.total} icon="📋" trend="neutral" />
        <DashboardCard title="Pending Approval" value={stats.pending} icon="⏳" trend="warning" />
        <DashboardCard title="Approved Leaves" value={stats.approved} icon="✅" trend="positive" />
        <DashboardCard title="Rejected Requests" value={stats.rejected} icon="❌" trend="negative" />
      </div>

      <div className="leaves-controls">
        <div className="search-container">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by student name, room, or reason..."
          />
        </div>
        <div className="filter-group">
          <label>Status Filter: </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="name-list-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Room #</th>
              <th>Leave Period</th>
              <th>Reason</th>
              <th>Student Contact</th>
              <th>Parent Contact</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map(l => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.personName}</strong>
                    <div className="sub-reg">{l.registrationNumber}</div>
                  </td>
                  <td>Room {l.roomNumber}</td>
                  <td>
                    <div className="date-range">
                      <span><strong>Out:</strong> {l.leaveDate}</span>
                      <span><strong>Return:</strong> {l.returnDate}</span>
                    </div>
                  </td>
                  <td className="reason-cell">{l.reason}</td>
                  <td>📞 {l.contactNumber}</td>
                  <td>📞 {l.parentContact}</td>
                  <td>
                    <span className={`status-badge status-${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="cell-actions">
                      {l.status === 'Pending' ? (
                        <div className="leave-action-btns">
                          <button
                            className="btn btn-success btn-xs"
                            onClick={() => handleApprove(l.id)}
                            title="Approve Leave"
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => handleReject(l.id)}
                            title="Reject Leave"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted font-sm">-</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-table-cell">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddLeaveModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveLeave}
        people={people}
        rooms={rooms}
      />
    </div>
  );
};

export default Leaves;
