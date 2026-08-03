import React from 'react';
import Modal from './Modal';
import { printElement } from '../utils/exportUtils';
import './ReceiptModal.css';

const ReceiptModal = ({ isOpen, onClose, feeRecord }) => {
  if (!feeRecord) return null;

  const handlePrint = () => {
    printElement('Fee Receipt');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fee Payment Receipt" size="medium">
      <div className="receipt-container" id="printable-receipt">
        <div className="receipt-header">
          <h2>DON BOSCO SKILL MISSION</h2>
          <p className="receipt-subtitle">Hostel Room & Fee Management</p>
          <div className="receipt-badge">OFFICIAL RECEIPT</div>
        </div>

        <div className="receipt-details-grid">
          <div className="receipt-row">
            <span className="receipt-label">Receipt No:</span>
            <span className="receipt-val font-mono">{feeRecord.id.substring(0, 8).toUpperCase()}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Payment Date:</span>
            <span className="receipt-val">{feeRecord.paidDate || feeRecord.createdAt || 'N/A'}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Student Name:</span>
            <span className="receipt-val font-bold">{feeRecord.personName}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Registration No:</span>
            <span className="receipt-val">{feeRecord.registrationNumber}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Room Number:</span>
            <span className="receipt-val">Room {feeRecord.roomNumber}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Fee Month:</span>
            <span className="receipt-val">{feeRecord.month}</span>
          </div>
        </div>

        <div className="receipt-summary-table">
          <div className="summary-header">
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className="summary-body">
            <div className="summary-item">
              <span>Hostel Maintenance & Room Rent ({feeRecord.month})</span>
              <span>₹{Number(feeRecord.amount).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="summary-footer">
            <span>Total Paid:</span>
            <span className="total-amount">₹{Number(feeRecord.paidAmount || feeRecord.amount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="receipt-status-banner">
          Status: <strong className="status-text">{feeRecord.status}</strong> 
          {feeRecord.paymentMode && ` via ${feeRecord.paymentMode}`}
          {feeRecord.transactionRef && ` (Ref: ${feeRecord.transactionRef})`}
        </div>

        <div className="receipt-footer-signatures">
          <div className="sig-box">
            <p>Student Signature</p>
          </div>
          <div className="sig-box">
            <p>Authorized Warden Signature</p>
          </div>
        </div>
      </div>

      <div className="modal-actions-bar">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
        <button className="btn btn-primary" onClick={handlePrint}>🖨️ Print Receipt</button>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
