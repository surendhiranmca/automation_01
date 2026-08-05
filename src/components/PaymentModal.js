import React, { useState } from 'react';
import Modal from './Modal';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, feeRecord, onCompletePayment }) => {
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!feeRecord) return null;

  const baseAmount = Number(feeRecord.amount) || 0;
  const lateFee = Number(feeRecord.lateFee) || 0;
  const totalPayable = Number(feeRecord.totalPayable) || (baseAmount + lateFee);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (paymentMode === 'UPI' && !upiId.includes('@')) {
      setErrorMsg('Please enter a valid UPI ID (e.g. user@bank)');
      return;
    }
    if (paymentMode === 'Card') {
      if (cardNumber.replaceAll(' ', '').length < 16) {
        setErrorMsg('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardExpiry || !cardCvv) {
        setErrorMsg('Please complete card expiry date and CVV');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedTxnId = `TXN${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
      onCompletePayment(feeRecord.id, {
        paymentMode,
        transactionId: generatedTxnId,
        amountPaid: totalPayable
      });
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="💳 Online Fee Payment Gateway" size="medium">
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-summary-box">
          <div className="summary-row">
            <span>Fee Type:</span>
            <strong>{feeRecord.feeType || 'Hostel Fee'} ({feeRecord.month || 'Current Period'})</strong>
          </div>
          <div className="summary-row">
            <span>Student Name:</span>
            <span>{feeRecord.personName} ({feeRecord.registrationNumber})</span>
          </div>
          <div className="summary-row">
            <span>Room Number:</span>
            <span>Room {feeRecord.roomNumber}</span>
          </div>
          <hr className="summary-divider" />
          <div className="summary-row">
            <span>Base Fee:</span>
            <span>₹{baseAmount.toLocaleString('en-IN')}</span>
          </div>
          {lateFee > 0 && (
            <div className="summary-row late-fee-row">
              <span>Late Fee (Overdue):</span>
              <span className="text-danger">+ ₹{lateFee.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="summary-row total-row">
            <span>Total Payable Amount:</span>
            <span className="total-amount">₹{totalPayable.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Select Payment Method</label>
          <div className="payment-methods-grid">
            <button
              type="button"
              className={`payment-method-btn ${paymentMode === 'UPI' ? 'active' : ''}`}
              onClick={() => setPaymentMode('UPI')}
            >
              📱 UPI / QR
            </button>
            <button
              type="button"
              className={`payment-method-btn ${paymentMode === 'Card' ? 'active' : ''}`}
              onClick={() => setPaymentMode('Card')}
            >
              💳 Debit / Credit Card
            </button>
            <button
              type="button"
              className={`payment-method-btn ${paymentMode === 'NetBanking' ? 'active' : ''}`}
              onClick={() => setPaymentMode('NetBanking')}
            >
              🏦 Net Banking
            </button>
          </div>
        </div>

        {paymentMode === 'UPI' && (
          <div className="form-group">
            <label className="form-label required">UPI ID / VPA</label>
            <input
              type="text"
              placeholder="e.g. student@upi / reg1234@okicici"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="form-input"
              required
            />
          </div>
        )}

        {paymentMode === 'Card' && (
          <>
            <div className="form-group">
              <label className="form-label required">Card Number</label>
              <input
                type="text"
                placeholder="4532 8912 3456 7890"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label required">CVV</label>
                <input
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </>
        )}

        {paymentMode === 'NetBanking' && (
          <div className="form-group">
            <label className="form-label required">Select Bank</label>
            <select className="form-select">
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="Axis">Axis Bank</option>
            </select>
          </div>
        )}

        {errorMsg && <div className="payment-error">{errorMsg}</div>}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success btn-pay" disabled={isProcessing}>
            {isProcessing ? '⏳ Processing Payment...' : `🔒 Pay ₹${totalPayable.toLocaleString('en-IN')} Now`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
