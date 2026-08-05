import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import SearchBar from '../components/SearchBar';
import AddLeaveModal from '../components/AddLeaveModal';
import Modal from '../components/Modal';
import { useLeaves } from '../hooks/useLeaves';
import { usePeople } from '../hooks/usePeople';
import { useRooms } from '../hooks/useRooms';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../components/AuthContext';
import './Leaves.css';

const Leaves = () => {
  const { leaves, addLeaveRequest, updateLeaveStatus, getLeaveStats } = useLeaves();
  const { people } = usePeople();
  const { rooms } = useRooms();
  const { success } = useNotification();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Decision modal state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decisionType, setDecisionType] = useState(null); // 'Approved' or 'Rejected'
  const [remarks, setRemarks] = useState('');

  const isAdmin = !currentUser || currentUser.role === 'admin' || currentUser.role === 'staff' || currentUser.role === 'manager';
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
        const regMatch = l.registrationNumber?.toLowerCase().includes(q);
        const roomMatch = l.roomNumber?.toLowerCase().includes(q);
        const reasonMatch = l.reason?.toLowerCase().includes(q);
        return nameMatch || regMatch || roomMatch || reasonMatch;
      }

      return true;
    });
  }, [leaves, searchQuery, statusFilter, isStudent, currentUser]);

  const handleSaveLeave = (data) => {
    addLeaveRequest(data);
    success('Leave request submitted successfully!');
    setIsAddModalOpen(false);
  };

  const handleOpenDecisionModal = (leave, type) => {
    setSelectedLeave(leave);
    setDecisionType(type);
    setRemarks(type === 'Approved' ? 'Approved by Hostel Warden' : 'Parent consent required / Invalid dates');
  };

  const handleConfirmDecision = (e) => {
    e.preventDefault();
    if (!selectedLeave || !decisionType) return;

    updateLeaveStatus(selectedLeave.id, decisionType, remarks);
    success(`Leave request ${decisionType.toLowerCase()} successfully!`);
    setSelectedLeave(null);
    setDecisionType(null);
    setRemarks('');
  };

  return (
    <div className="leaves-page">
      <div className="leaves-header">
        <div>
          <h1>📜 Student Leave Approval Desk</h1>
          <p className="leaves-subtitle">Submit, review, and track student outstation leave permissions with automated notifications</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Apply for Leave
        </button>
      </div>

      <div className="leaves-stats-grid">
        <DashboardCard title="Total Leave Requests" value={stats.total} icon="📋" trend="neutral" />
        <DashboardCard title="Pending Approval" value={stats.pending} icon="⏳" trend="warning" />
        <DashboardCard title="Approved Leaves" value={stats.approved} icon="✅" trend="positive" />
        <DashboardCard title="Rejected Requests" value={stats.rejected} icon="❌" trend="negative" />
      </div>

      <div className="leaves-controls">
        <div className="search-container">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by student name, room #, or reg #..."
          />
        </div>
        <div className="filter-group">
          <label>Status Filter: </label>
          <div className="status-tabs">
            {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
              <button
                key={st}
                className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="name-list-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Room</th>
              <th>Leave Period</th>
              <th>Reason</th>
              <th>Emergency Contact</th>
              <th>Status</th>
              <th>Remarks</th>
              {isAdmin && <th>Action / Decision</th>}
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map(l => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.personName}</strong>
                    <div className="registration-badge">{l.registrationNumber}</div>
                  </td>
                  <td>Room {l.roomNumber}</td>
                  <td>
                    <div className="date-range">
                      <span>🗓️ <strong>Out:</strong> {l.leaveDate}</span>
                      <span>🔄 <strong>Return:</strong> {l.returnDate}</span>
                    </div>
                  </td>
                  <td className="reason-cell">{l.reason}</td>
                  <td>📞 {l.contactNumber}</td>
                  <td>
                    <span className={`status-badge status-${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="remarks-cell">
                    {l.remarks ? <span className="text-muted">{l.remarks}</span> : <span className="text-muted">-</span>}
                  </td>
                  {isAdmin && (
                    <td className="cell-actions">
                      {l.status === 'Pending' ? (
                        <div className="leave-action-btns">
                          <button
                            className="btn btn-success btn-xs"
                            onClick={() => handleOpenDecisionModal(l, 'Approved')}
                            title="Approve Leave"
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => handleOpenDecisionModal(l, 'Rejected')}
                            title="Reject Leave"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted font-sm">Decided</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="empty-table-cell">
                  No leave requests found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Decision Modal for Warden Remarks */}
      {selectedLeave && (
        <Modal
          isOpen={!!selectedLeave}
          onClose={() => setSelectedLeave(null)}
          title={`${decisionType === 'Approved' ? '✅ Approve' : '❌ Reject'} Leave Request`}
          size="small"
        >
          <form onSubmit={handleConfirmDecision} className="form">
            <p style={{ fontSize: '0.88rem', color: '#334155' }}>
              Updating leave status for <strong>{selectedLeave.personName}</strong> ({selectedLeave.registrationNumber}).
            </p>
            <div className="form-group">
              <label className="form-label">Warden Remarks / Notes</label>
              <textarea
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks for student notification..."
                className="form-textarea"
              ></textarea>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedLeave(null)}>
                Cancel
              </button>
              <button
                type="submit"
                className={`btn ${decisionType === 'Approved' ? 'btn-success' : 'btn-danger'}`}
              >
                Confirm {decisionType}
              </button>
            </div>
          </form>
        </Modal>
      )}

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
