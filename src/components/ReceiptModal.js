import React from 'react';
import Modal from './Modal';
import { printElement } from '../utils/exportUtils';
import './ReceiptModal.css';

const ReceiptModal = ({ isOpen, onClose, feeRecord }) => {
  if (!feeRecord) return null;

  const handlePrint = () => {
    printElement('Fee Receipt');
  };

  const receiptNo = feeRecord.receiptNumber || `REC-${feeRecord.id?.substring(0, 8).toUpperCase() || '2026-001'}`;
  const baseAmount = Number(feeRecord.amount) || 0;
  const lateFee = Number(feeRecord.lateFee) || 0;
  const paidAmount = Number(feeRecord.paidAmount) || Number(feeRecord.totalPayable) || baseAmount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🧾 Official Hostel Fee Payment Receipt" size="medium">
      <div className="receipt-container" id="printable-receipt">
        <div className="receipt-header">
          <h2>DON BOSCO SKILL MISSION</h2>
          <p className="receipt-subtitle">Hostel Room & Fee Automation System</p>
          <div className="receipt-badge">OFFICIAL PAYMENT RECEIPT</div>
        </div>

        <div className="receipt-details-grid">
          <div className="receipt-row">
            <span className="receipt-label">Receipt Number:</span>
            <span className="receipt-val font-mono">{receiptNo}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Payment Date:</span>
            <span className="receipt-val">{feeRecord.paymentDate || feeRecord.paidDate || new Date().toISOString().split('T')[0]}</span>
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
            <span className="receipt-label">Fee Category:</span>
            <span className="receipt-val">{feeRecord.feeType || 'Hostel Fee'} ({feeRecord.month || 'Current Period'})</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Payment Method:</span>
            <span className="receipt-val">{feeRecord.paymentMode || 'Online Gateway / UPI'}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Transaction ID:</span>
            <span className="receipt-val font-mono">{feeRecord.transactionRef || feeRecord.transactionId || 'TXN891230491'}</span>
          </div>
        </div>

        <div className="receipt-summary-table">
          <div className="summary-header">
            <span>Description</span>
            <span>Amount (₹)</span>
          </div>
          <div className="summary-body">
            <div className="summary-item">
              <span>{feeRecord.feeType || 'Hostel Fee'} ({feeRecord.month || 'Current Period'})</span>
              <span>₹{baseAmount.toLocaleString('en-IN')}</span>
            </div>
            {lateFee > 0 && (
              <div className="summary-item late-fee-line">
                <span>Late Payment Fine ({feeRecord.overdueDays || 1} days overdue)</span>
                <span>+ ₹{lateFee.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
          <div className="summary-footer">
            <span>Total Amount Paid:</span>
            <span className="total-amount">₹{paidAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="receipt-status-banner">
          Status: <strong className="status-text paid-status">✅ PAID & VERIFIED</strong>
        </div>

        <div className="receipt-footer-signatures">
          <div className="sig-box">
            <div className="sig-line"></div>
            <p>Student Signature</p>
          </div>
          <div className="sig-box warden-stamp-box">
            <div className="digital-stamp">DB HOSTEL<br/>VERIFIED</div>
            <div className="sig-line"></div>
            <p>Admin / Authorized Warden Signature</p>
          </div>
        </div>
      </div>

      <div className="modal-actions-bar">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
        <button className="btn btn-primary" onClick={handlePrint}>🖨️ Download / Print Receipt</button>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
