import React, { useState } from 'react';
import { usePeople } from '../hooks/usePeople';
import { useRooms } from '../hooks/useRooms';
import { useFees } from '../hooks/useFees';
import { useComplaints } from '../hooks/useComplaints';
import { useLeaves } from '../hooks/useLeaves';
import { exportToCSV, printElement } from '../utils/exportUtils';
import './Reports.css';

const Reports = () => {
  const { people } = usePeople();
  const { rooms } = useRooms();
  const { fees } = useFees();
  const { complaints } = useComplaints();
  const { leaves } = useLeaves();

  const [activeTab, setActiveTab] = useState('occupancy');

  const handleExportCSV = () => {
    if (activeTab === 'occupancy') {
      const data = rooms.map(r => {
        const assigned = people.filter(p => p.roomId === r.id);
        return {
          'Room Number': r.roomNumber,
          'Room Name': r.roomName,
          'Capacity': r.capacity,
          'Occupied': assigned.length,
          'Available Beds': Math.max(0, r.capacity - assigned.length),
          'Occupancy %': `${Math.round((assigned.length / r.capacity) * 100)}%`,
          'Status': r.isActive ? 'Active' : 'Inactive'
        };
      });
      exportToCSV(data, 'Room_Occupancy_Report');
    } else if (activeTab === 'fees') {
      const data = fees.map(f => ({
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
      exportToCSV(data, 'Hostel_Fees_Report');
    } else if (activeTab === 'complaints') {
      const data = complaints.map(c => ({
        'Student Name': c.personName,
        'Registration #': c.registrationNumber,
        'Room Number': c.roomNumber,
        'Category': c.category,
        'Priority': c.priority,
        'Description': c.description,
        'Created Date': c.createdDate,
        'Status': c.status,
        'Admin Remarks': c.adminRemarks || 'None'
      }));
      exportToCSV(data, 'Complaints_Report');
    } else if (activeTab === 'leaves') {
      const data = leaves.map(l => ({
        'Student Name': l.personName,
        'Registration #': l.registrationNumber,
        'Room Number': l.roomNumber,
        'Leave Date': l.leaveDate,
        'Return Date': l.returnDate,
        'Reason': l.reason,
        'Contact Number': l.contactNumber,
        'Parent Contact': l.parentContact,
        'Status': l.status
      }));
      exportToCSV(data, 'Leave_Requests_Report');
    }
  };

  const handlePrint = () => {
    printElement();
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Hostel Reports & Analytics</h1>
          <p className="reports-subtitle">Generate, filter, print, and export system audit reports</p>
        </div>
        <div className="reports-actions">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            📥 Export to CSV / Excel
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print Report / PDF
          </button>
        </div>
      </div>

      <div className="reports-tabs">
        <button
          className={`tab-btn ${activeTab === 'occupancy' ? 'active' : ''}`}
          onClick={() => setActiveTab('occupancy')}
        >
          🏠 Room Occupancy Report
        </button>
        <button
          className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
          onClick={() => setActiveTab('fees')}
        >
          💵 Fee Collection Report
        </button>
        <button
          className={`tab-btn ${activeTab === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveTab('complaints')}
        >
          ⚠️ Complaint Analytics Report
        </button>
        <button
          className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          🏖️ Outstation Leave Report
        </button>
      </div>

      <div className="report-content-card" id="printable-report">
        {activeTab === 'occupancy' && (
          <div>
            <h2>Room Occupancy Summary</h2>
            <p className="report-meta">Total Configured Rooms: {rooms.length} | Total Resident Students: {people.length}</p>
            <table className="name-list-table">
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Building / Name</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Available</th>
                  <th>Occupancy Rate</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(r => {
                  const assigned = people.filter(p => p.roomId === r.id);
                  const available = Math.max(0, r.capacity - assigned.length);
                  const rate = Math.round((assigned.length / r.capacity) * 100);
                  return (
                    <tr key={r.id}>
                      <td><strong>Room {r.roomNumber}</strong></td>
                      <td>{r.roomName}</td>
                      <td>{r.capacity} beds</td>
                      <td>{assigned.length} students</td>
                      <td>{available} beds</td>
                      <td>
                        <div className="progress-bar-cell">
                          <div className="progress-fill" style={{ width: `${Math.min(100, rate)}%` }}></div>
                          <span>{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'fees' && (
          <div>
            <h2>Fee Collection & Dues Report</h2>
            <p className="report-meta">Total Fee Records: {fees.length}</p>
            <table className="name-list-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Registration #</th>
                  <th>Room #</th>
                  <th>Month</th>
                  <th>Total Fee</th>
                  <th>Paid Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.id}>
                    <td><strong>{f.personName}</strong></td>
                    <td>{f.registrationNumber}</td>
                    <td>Room {f.roomNumber}</td>
                    <td>{f.month}</td>
                    <td>₹{Number(f.amount).toLocaleString('en-IN')}</td>
                    <td>₹{Number(f.paidAmount || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`status-badge status-${f.status.toLowerCase()}`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div>
            <h2>Complaint Resolution Analytics</h2>
            <p className="report-meta">Total Logged Complaints: {complaints.length}</p>
            <table className="name-list-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Room #</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Logged Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.personName}</strong></td>
                    <td>Room {c.roomNumber}</td>
                    <td>{c.category}</td>
                    <td>{c.priority}</td>
                    <td>{c.createdDate}</td>
                    <td>
                      <span className={`status-badge status-${c.status.toLowerCase().replace(' ', '-')}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'leaves' && (
          <div>
            <h2>Outstation Leave Audit Log</h2>
            <p className="report-meta">Total Leave Applications: {leaves.length}</p>
            <table className="name-list-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Room #</th>
                  <th>Leave Date</th>
                  <th>Return Date</th>
                  <th>Student Phone</th>
                  <th>Parent Phone</th>
                  <th>Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.personName}</strong></td>
                    <td>Room {l.roomNumber}</td>
                    <td>{l.leaveDate}</td>
                    <td>{l.returnDate}</td>
                    <td>{l.contactNumber}</td>
                    <td>{l.parentContact}</td>
                    <td>
                      <span className={`status-badge status-${l.status.toLowerCase()}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
