import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import SearchBar from '../components/SearchBar';
import AddFeeModal from '../components/AddFeeModal';
import ReceiptModal from '../components/ReceiptModal';
import { useFees } from '../hooks/useFees';
import { usePeople } from '../hooks/usePeople';
import { useRooms } from '../hooks/useRooms';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../components/AuthContext';
import { exportToCSV } from '../utils/exportUtils';
import './Fees.css';

const Fees = () => {
  const { fees, addFee, updateFee, deleteFee, getFeeStats } = useFees();
  const { people } = usePeople();
  const { rooms } = useRooms();
  const { success, error } = useNotification();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [selectedFeeRecord, setSelectedFeeRecord] = useState(null);

  const isAdmin = !currentUser || currentUser.role === 'admin';
  const isStudent = currentUser && currentUser.role === 'student';

  const stats = getFeeStats();

  const filteredFees = useMemo(() => {
    return fees.filter(fee => {
      if (isStudent && currentUser) {
        const isSelf = fee.personId === currentUser.id || fee.registrationNumber === currentUser.username;
        if (!isSelf) return false;
      }

      if (statusFilter !== 'All' && fee.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = fee.personName?.toLowerCase().includes(q);
        const regMatch = fee.registrationNumber?.toLowerCase().includes(q);
        const roomMatch = fee.roomNumber?.toLowerCase().includes(q);
        const monthMatch = fee.month?.toLowerCase().includes(q);
        return nameMatch || regMatch || roomMatch || monthMatch;
      }

      return true;
    });
  }, [fees, searchQuery, statusFilter, isStudent, currentUser]);

  const handleSaveFee = (formData) => {
    let result;
    if (editingFee) {
      result = updateFee(editingFee.id, formData);
      if (result.success) success('Fee record updated successfully!');
    } else {
      result = addFee(formData);
      if (result.success) success('Fee record created successfully!');
    }
    setIsAddModalOpen(false);
    setEditingFee(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      deleteFee(id);
      success('Fee record deleted');
    }
  };

  const handleOpenReceipt = (feeRecord) => {
    setSelectedFeeRecord(feeRecord);
    setIsReceiptOpen(true);
  };

  const handleExportCSV = () => {
    const exportData = filteredFees.map(f => ({
      'Student Name': f.personName,
      'Registration #': f.registrationNumber,
      'Room Number': f.roomNumber,
      'Month': f.month,
      'Amount (₹)': f.amount,
      'Paid Amount (₹)': f.paidAmount,
      'Due Date': f.dueDate,
      'Status': f.status,
      'Payment Mode': f.paymentMode || 'N/A',
      'Transaction Ref': f.transactionRef || 'N/A'
    }));
    exportToCSV(exportData, 'Hostel_Fee_Report');
  };

  return (
    <div className="fees-page">
      <div className="fees-header">
        <div>
          <h1>Hostel Fee Management</h1>
          <p className="fees-subtitle">Track fee collections, dues, payment status, and receipts</p>
        </div>
        <div className="fees-header-actions">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            📥 Export Excel / CSV
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => { setEditingFee(null); setIsAddModalOpen(true); }}>
              + Add Fee Entry
            </button>
          )}
        </div>
      </div>

      <div className="fees-stats-grid">
        <DashboardCard
          title="Total Collected"
          value={`₹${stats.totalCollected.toLocaleString('en-IN')}`}
          icon="💰"
          trend="neutral"
        />
        <DashboardCard
          title="Pending Fees"
          value={`₹${stats.pendingFees.toLocaleString('en-IN')}`}
          icon="⏳"
          trend="warning"
        />
        <DashboardCard
          title="Overdue Fees"
          value={`₹${stats.overdueFees.toLocaleString('en-IN')}`}
          icon="🚨"
          trend="negative"
        />
        <DashboardCard
          title="Total Records"
          value={stats.totalEntries}
          icon="📋"
          trend="positive"
        />
      </div>

      <div className="fees-controls">
        <div className="search-container">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by student, registration #, month, or room..."
          />
        </div>
        <div className="filter-group">
          <label>Status Filter: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="name-list-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Registration #</th>
              <th>Room #</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.length > 0 ? (
              filteredFees.map(fee => (
                <tr key={fee.id}>
                  <td><strong>{fee.personName}</strong></td>
                  <td><span className="registration-badge">{fee.registrationNumber}</span></td>
                  <td>Room {fee.roomNumber}</td>
                  <td>{fee.month}</td>
                  <td>₹{Number(fee.amount).toLocaleString('en-IN')}</td>
                  <td>{fee.dueDate}</td>
                  <td>
                    <span className={`status-badge status-${fee.status.toLowerCase()}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="action-btn btn-receipt"
                      onClick={() => handleOpenReceipt(fee)}
                      title="View & Print Receipt"
                    >
                      🧾 Receipt
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          className="action-btn btn-edit"
                          onClick={() => { setEditingFee(fee); setIsAddModalOpen(true); }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(fee.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-table-cell">
                  No fee records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddFeeModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingFee(null); }}
        onSave={handleSaveFee}
        feeEntry={editingFee}
        people={people}
        rooms={rooms}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        feeRecord={selectedFeeRecord}
      />
    </div>
  );
};

export default Fees;
