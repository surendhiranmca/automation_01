import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import SearchBar from '../components/SearchBar';
import AddComplaintModal from '../components/AddComplaintModal';
import Modal from '../components/Modal';
import { useComplaints } from '../hooks/useComplaints';
import { usePeople } from '../hooks/usePeople';
import { useRooms } from '../hooks/useRooms';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../components/AuthContext';
import './Complaints.css';

const Complaints = () => {
  const { complaints, addComplaint, updateComplaintStatus, deleteComplaint, getComplaintStats } = useComplaints();
  const { people } = usePeople();
  const { rooms } = useRooms();
  const { success } = useNotification();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusUpdateModal, setStatusUpdateModal] = useState({ isOpen: false, complaint: null, status: 'Pending', remarks: '' });

  const isAdmin = !currentUser || currentUser.role === 'admin';
  const isStudent = currentUser && currentUser.role === 'student';

  const stats = getComplaintStats();

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      if (isStudent && currentUser) {
        const isSelf = c.personId === currentUser.id || c.registrationNumber === currentUser.username;
        if (!isSelf) return false;
      }

      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = c.personName?.toLowerCase().includes(q);
        const descMatch = c.description?.toLowerCase().includes(q);
        const roomMatch = c.roomNumber?.toLowerCase().includes(q);
        return nameMatch || descMatch || roomMatch;
      }

      return true;
    });
  }, [complaints, searchQuery, categoryFilter, statusFilter, isStudent, currentUser]);

  const handleSaveComplaint = (data) => {
    addComplaint(data);
    success('Complaint submitted successfully!');
    setIsAddModalOpen(false);
  };

  const handleUpdateStatusSubmit = (e) => {
    e.preventDefault();
    if (!statusUpdateModal.complaint) return;
    updateComplaintStatus(statusUpdateModal.complaint.id, statusUpdateModal.status, statusUpdateModal.remarks);
    success(`Complaint status updated to ${statusUpdateModal.status}`);
    setStatusUpdateModal({ isOpen: false, complaint: null, status: 'Pending', remarks: '' });
  };

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <div>
          <h1>Complaint Management</h1>
          <p className="complaints-subtitle">Log, track, and resolve hostel maintenance and service issues</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Submit New Complaint
        </button>
      </div>

      <div className="complaints-stats-grid">
        <DashboardCard title="Total Complaints" value={stats.total} icon="📋" trend="neutral" />
        <DashboardCard title="Pending" value={stats.pending} icon="⏳" trend="warning" />
        <DashboardCard title="In Progress" value={stats.inProgress} icon="⚙️" trend="neutral" />
        <DashboardCard title="Resolved" value={stats.resolved} icon="✅" trend="positive" />
      </div>

      <div className="complaints-controls">
        <div className="search-container">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by student, room, or issue description..."
          />
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <label>Category: </label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-select">
              <option value="All">All Categories</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status: </label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="name-list-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Room #</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.personName}</strong></td>
                  <td>Room {c.roomNumber}</td>
                  <td><span className="category-badge">{c.category}</span></td>
                  <td>
                    <span className={`priority-badge priority-${c.priority.toLowerCase()}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="desc-cell">{c.description}</td>
                  <td>{c.createdDate}</td>
                  <td>
                    <span className={`status-badge status-${c.status.toLowerCase().replace(' ', '-')}`}>
                      {c.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="cell-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setStatusUpdateModal({ isOpen: true, complaint: c, status: c.status, remarks: c.adminRemarks || '' })}
                      >
                        Update Status
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-table-cell">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddComplaintModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveComplaint}
        people={people}
        rooms={rooms}
      />

      {/* Admin Status Update Modal */}
      <Modal
        isOpen={statusUpdateModal.isOpen}
        onClose={() => setStatusUpdateModal({ isOpen: false, complaint: null, status: 'Pending', remarks: '' })}
        title="Update Complaint Status"
        size="small"
      >
        <form onSubmit={handleUpdateStatusSubmit} className="form">
          <div className="form-group">
            <label className="form-label required">Status</label>
            <select
              value={statusUpdateModal.status}
              onChange={(e) => setStatusUpdateModal(prev => ({ ...prev, status: e.target.value }))}
              className="form-select"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Admin Remarks / Notes</label>
            <textarea
              rows="3"
              value={statusUpdateModal.remarks}
              onChange={(e) => setStatusUpdateModal(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="e.g. Technician dispatched to resolve issue..."
              className="form-textarea"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStatusUpdateModal({ isOpen: false, complaint: null, status: 'Pending', remarks: '' })}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints;
