import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import SearchBar from '../components/SearchBar';
import AddFeeModal from '../components/AddFeeModal';
import ReceiptModal from '../components/ReceiptModal';
import PaymentModal from '../components/PaymentModal';
import { useFees } from '../hooks/useFees';
import { usePeople } from '../hooks/usePeople';
import { useRooms } from '../hooks/useRooms';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../components/AuthContext';
import { exportToCSV } from '../utils/exportUtils';
import './Fees.css';

const Fees = () => {
  const { fees, addFee, updateFee, payFee, deleteFee, getFeeStats } = useFees();
  const { people } = usePeople();
  const { rooms } = useRooms();
  const { success } = useNotification();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [selectedFeeRecord, setSelectedFeeRecord] = useState(null);

  const isAdmin = !currentUser || currentUser.role === 'admin' || currentUser.role === 'staff' || currentUser.role === 'manager';
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
        const typeMatch = fee.feeType?.toLowerCase().includes(q);
        return nameMatch || regMatch || roomMatch || typeMatch;
      }

      return true;
    });
  }, [fees, searchQuery, statusFilter, isStudent, currentUser]);

  const handleSaveFee = (formData, targetScope, targetId) => {
    if (editingFee) {
      updateFee(editingFee.id, formData);
      success('Fee record updated successfully!');
    } else {
      const result = addFee(formData, targetScope, targetId);
      if (result.success) {
        success(`Fee notification issued successfully (${result.count} student(s) notified)!`);
      }
    }
    setIsAddModalOpen(false);
    setEditingFee(null);
  };

  const handleCompletePayment = (feeId, paymentDetails) => {
    payFee(feeId, paymentDetails);
    success('Online fee payment completed successfully! Receipt generated.');
    setIsPaymentOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to cancel and delete this fee request?')) {
      deleteFee(id);
      success('Fee request cancelled');
    }
  };

  const handleOpenReceipt = (feeRecord) => {
    setSelectedFeeRecord(feeRecord);
    setIsReceiptOpen(true);
  };

  const handleOpenPayment = (feeRecord) => {
    setSelectedFeeRecord(feeRecord);
    setIsPaymentOpen(true);
  };

  const getDaysRemainingText = (dueDateStr, status) => {
    if (status === 'Paid') return 'Completed';
    const due = new Date(dueDateStr).getTime();
    const today = new Date(new Date().toISOString().split('T')[0]).getTime();
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff <= 0) return 'Due Today';
    return `${diff} days remaining`;
  };

  const handleExportCSV = () => {
    const exportData = filteredFees.map(f => ({
      'Student Name': f.personName,
      'Registration #': f.registrationNumber,
      'Room Number': f.roomNumber,
      'Fee Type': f.feeType || 'Hostel Fee',
      'Base Amount (₹)': f.amount,
      'Total Payable (₹)': f.amount,
      'Paid Amount (₹)': f.paidAmount,
      'Due Date': f.dueDate,
      'Status': f.status,
      'Payment Mode': f.paymentMode || 'N/A',
      'Transaction ID': f.transactionRef || 'N/A'
    }));
    exportToCSV(exportData, 'Hostel_Fee_Report');
  };

  return (
    <div className="fees-page">
      <div className="fees-header">
        <div>
          <h1>💳 Hostel Fee & Online Payment Desk</h1>
          <p className="fees-subtitle">Issue fee requests, track pending dues, complete online payments, and download receipts</p>
        </div>
        <div className="fees-header-actions">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            📥 Export CSV
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => { setEditingFee(null); setIsAddModalOpen(true); }}>
              📢 + Issue Fee Request
            </button>
          )}
        </div>
      </div>

      <div className="fees-stats-grid">
        <DashboardCard
          title="Total Revenue Collected"
          value={`₹${stats.totalCollected.toLocaleString('en-IN')}`}
          icon="💰"
          trend="positive"
        />
        <DashboardCard
          title="Pending Dues"
          value={`₹${stats.pendingFees.toLocaleString('en-IN')}`}
          icon="⏳"
          trend="warning"
        />
        <DashboardCard
          title="Paid Entries"
          value={stats.paidCount}
          icon="✅"
          trend="positive"
        />
        <DashboardCard
          title="Total Fee Entries"
          value={stats.totalEntries}
          icon="📋"
          trend="neutral"
        />
      </div>

      <div className="fees-controls">
        <div className="search-container">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by student, reg #, fee type, or room..."
          />
        </div>
        <div className="filter-group">
          <label>Status Filter: </label>
          <div className="status-tabs">
            {['All', 'Pending', 'Paid'].map((st) => (
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
              <th>Fee Category</th>
              <th>Base Fee</th>
              <th>Total Payable</th>
              <th>Due Date & Countdown</th>
              <th>Status</th>
              <th>Actions / Payment</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.length > 0 ? (
              filteredFees.map(fee => {
                const baseAmt = Number(fee.amount) || 0;
                const isPaid = fee.status === 'Paid';

                return (
                  <tr key={fee.id}>
                    <td>
                      <strong>{fee.personName}</strong>
                      <div className="registration-badge">{fee.registrationNumber}</div>
                    </td>
                    <td>Room {fee.roomNumber}</td>
                    <td>
                      <span className="category-badge">{fee.feeType || 'Hostel Fee'}</span>
                      <div className="sub-month">{fee.month || 'Current'}</div>
                    </td>
                    <td>₹{baseAmt.toLocaleString('en-IN')}</td>
                    <td className="total-payable-cell">
                      <strong>₹{baseAmt.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <div className="due-date-box">
                        <span>{fee.dueDate}</span>
                        <span className={`countdown-badge ${isPaid ? 'badge-success' : 'badge-warning'}`}>
                          {getDaysRemainingText(fee.dueDate, fee.status)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${fee.status.toLowerCase()}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="cell-actions">
                      {isPaid ? (
                        <button
                          className="action-btn btn-receipt"
                          onClick={() => handleOpenReceipt(fee)}
                          title="View & Download Official Receipt"
                        >
                          🧾 Receipt
                        </button>
                      ) : (
                        <button
                          className="action-btn btn-success"
                          onClick={() => handleOpenPayment(fee)}
                          title="Pay Fee Online Now"
                        >
                          💳 Pay Now
                        </button>
                      )}

                      {isAdmin && (
                        <>
                          {!isPaid && (
                            <button
                              className="action-btn btn-edit"
                              onClick={() => { setEditingFee(fee); setIsAddModalOpen(true); }}
                              title="Edit Fee Request"
                            >
                              ✏️
                            </button>
                          )}
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDelete(fee.id)}
                            title="Cancel Request"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="empty-table-cell">
                  No fee records found matching criteria.
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

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        feeRecord={selectedFeeRecord}
        onCompletePayment={handleCompletePayment}
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
