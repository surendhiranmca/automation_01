import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import SearchBar from '../components/SearchBar';
import AddVisitorModal from '../components/AddVisitorModal';
import { useVisitors } from '../hooks/useVisitors';
import { usePeople } from '../hooks/usePeople';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../components/AuthContext';
import './Visitors.css';

const Visitors = () => {
  const { visitors, addVisitor, checkOutVisitor, getVisitorStats } = useVisitors();
  const { people } = usePeople();
  const { success } = useNotification();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = getVisitorStats();

  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      if (statusFilter !== 'All' && v.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const vNameMatch = v.visitorName?.toLowerCase().includes(q);
        const pNameMatch = v.personName?.toLowerCase().includes(q);
        const regMatch = v.registrationNumber?.toLowerCase().includes(q);
        const roomMatch = v.roomNumber?.toLowerCase().includes(q);
        return vNameMatch || pNameMatch || regMatch || roomMatch;
      }

      return true;
    });
  }, [visitors, searchQuery, statusFilter]);

  const handleSaveVisitor = (data) => {
    addVisitor(data, currentUser);
    success('Visitor check-in pass created successfully!');
    setIsAddModalOpen(false);
  };

  const handleCheckOut = (id) => {
    checkOutVisitor(id, currentUser);
    success('Visitor checked out successfully!');
  };

  return (
    <div className="visitors-page">
      <div className="visitors-header">
        <div>
          <h1>🪪 Hostel Visitor Management Desk</h1>
          <p className="visitors-subtitle">Register visitor entry passes, verify host student details, and record exit timestamps</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Check-In New Visitor
        </button>
      </div>

      <div className="visitors-stats-grid">
        <DashboardCard title="Total Visitors" value={stats.total} icon="🪪" trend="neutral" />
        <DashboardCard title="Currently In Hostel" value={stats.inHostel} icon="🟢" trend="warning" />
        <DashboardCard title="Checked Out" value={stats.checkedOut} icon="✅" trend="positive" />
      </div>

      <div className="visitors-controls">
        <div className="search-container">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by visitor name, host student, room #, or reg #..."
          />
        </div>
        <div className="filter-group">
          <label>Status Filter: </label>
          <div className="status-tabs">
            {['All', 'In Hostel', 'Checked Out'].map((st) => (
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
              <th>Visitor Name</th>
              <th>Visitor Phone</th>
              <th>Host Student Visited</th>
              <th>Room</th>
              <th>Purpose</th>
              <th>Check-In Time</th>
              <th>Check-Out Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map(v => (
                <tr key={v.id}>
                  <td><strong>{v.visitorName}</strong></td>
                  <td>📞 {v.contactNumber}</td>
                  <td>
                    <strong>{v.personName}</strong>
                    <div className="registration-badge">{v.registrationNumber}</div>
                  </td>
                  <td>Room {v.roomNumber}</td>
                  <td className="purpose-cell">{v.purpose}</td>
                  <td>{v.checkInTime}</td>
                  <td>{v.checkOutTime || '-'}</td>
                  <td>
                    <span className={`status-badge ${v.status === 'In Hostel' ? 'status-pending' : 'status-approved'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    {v.status === 'In Hostel' ? (
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => handleCheckOut(v.id)}
                        title="Check-Out Visitor"
                      >
                        🚪 Check-Out
                      </button>
                    ) : (
                      <span className="text-muted font-sm">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="empty-table-cell">
                  No visitor logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddVisitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveVisitor}
        people={people}
      />
    </div>
  );
};

export default Visitors;
