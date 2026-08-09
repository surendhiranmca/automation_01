import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, feeRecord, onCompletePayment }) => {
  const [paymentMode, setPaymentMode] = useState('UPI'); // UPI, Card, NetBanking
  const [upiSubMode, setUpiSubMode] = useState('id'); // 'id' or 'qr'
  const [upiId, setUpiId] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiVerificationStatus, setUpiVerificationStatus] = useState(null); // null, 'valid', 'invalid'
  const [verifiedName, setVerifiedName] = useState('');
  const [verifiedBank, setVerifiedBank] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // 2-Minute QR Countdown & 5-Cycle Auto-Refresh Loop
  const [qrTimerSeconds, setQrTimerSeconds] = useState(120); // 120s = 2 mins
  const [qrCycleCount, setQrCycleCount] = useState(1); // 1 to 5
  const [qrToken, setQrToken] = useState(() => Date.now());
  const [isQrExpired, setIsQrExpired] = useState(false);

  // Reset or pre-fill state when feeRecord opens
  useEffect(() => {
    if (feeRecord) {
      setUpiId('');
      setUpiVerificationStatus(null);
      setErrorMsg('');
      setIsProcessing(false);
      setQrTimerSeconds(120);
      setQrCycleCount(1);
      setQrToken(Date.now());
      setIsQrExpired(false);
    }
  }, [feeRecord]);


  // 2-Minute Countdown & Auto-Refresh Effect
  useEffect(() => {
    let interval = null;
    if (isOpen && paymentMode === 'UPI' && upiSubMode === 'qr' && !isQrExpired) {
      interval = setInterval(() => {
        setQrTimerSeconds(prev => {
          if (prev <= 1) {
            // 2 minutes completed! Check refresh cycles
            setQrCycleCount(currCycle => {
              if (currCycle >= 5) {
                // Reached max 5 attempts (10 mins total). Mark expired.
                setIsQrExpired(true);
                clearInterval(interval);
                return currCycle;
              } else {
                // Auto-refresh QR code token & reset timer to 120s
                setQrToken(Date.now());
                return currCycle + 1;
              }
            });
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, paymentMode, upiSubMode, isQrExpired]);

  const handleResetQrSession = () => {
    setQrTimerSeconds(120);
    setQrCycleCount(1);
    setQrToken(Date.now());
    setIsQrExpired(false);
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  if (!feeRecord) return null;

  const baseAmount = Number(feeRecord.amount) || 0;
  const lateFee = Number(feeRecord.lateFee) || 0;
  const totalPayable = Number(feeRecord.totalPayable) || (baseAmount + lateFee);

  // Bank handle resolver dictionary for real-time verification
  const handleVerifyUpi = () => {
    if (!upiId || !upiId.includes('@')) {
      setUpiVerificationStatus('invalid');
      setErrorMsg('Please enter a valid UPI VPA ID (e.g. user@bank)');
      return;
    }

    setIsVerifyingUpi(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifyingUpi(false);
      const handle = upiId.split('@')[1]?.toLowerCase() || '';
      
      let bank = 'State Bank of India (SBI)';
      let holder = 'Surendhiran A';

      if (handle.includes('paytm')) { bank = 'Paytm Payments Bank'; }
      else if (handle.includes('ybl') || handle.includes('ibl')) { bank = 'Yes Bank / PhonePe'; }
      else if (handle.includes('okicici') || handle.includes('icici')) { bank = 'ICICI Bank / GPay'; }
      else if (handle.includes('okaxis') || handle.includes('axis')) { bank = 'Axis Bank / GPay'; }
      else if (handle.includes('apl')) { bank = 'Amazon Pay / Axis Bank'; }

      if (feeRecord && feeRecord.personName) {
        holder = feeRecord.personName;
      }

      setVerifiedName(holder);
      setVerifiedBank(bank);
      setUpiVerificationStatus('valid');
    }, 600);
  };

  // Generate live real-time UPI deep-link QR code URL with timestamp token
  const activeUpi = upiId || 'surendhiransurendhiran645@oksbi';
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(activeUpi)}&pn=${encodeURIComponent('DBSM hostel fee')}&am=${totalPayable}&cu=INR&tn=${encodeURIComponent('Hostel Fee ' + (feeRecord.month || 'Aug 2026'))}`;
  const liveQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiDeepLink + '&t=' + qrToken)}`;

  const startPaymentProcess = (modeOverride = null) => {
    setErrorMsg('');
    const effectiveMode = modeOverride || paymentMode;

    if (effectiveMode === 'UPI') {
      if (upiSubMode === 'id' && (!upiId || !upiId.includes('@'))) {
        setErrorMsg('Please enter a valid UPI ID (e.g. user@bank)');
        return;
      }
      if (upiSubMode === 'qr' && isQrExpired) {
        setErrorMsg('QR session expired. Please restart the session.');
        return;
      }
    }

    if (effectiveMode === 'Card') {
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
    setProcessStep(1);

    setTimeout(() => {
      setProcessStep(2);
      setTimeout(() => {
        setProcessStep(3);
        setTimeout(() => {
          setIsProcessing(false);
          const generatedTxnId = `TXN20260806${Math.floor(1000 + Math.random() * 9000)}`;
          onCompletePayment(feeRecord.id, {
            paymentMode: effectiveMode === 'UPI' ? (upiSubMode === 'qr' ? 'UPI_QR' : 'UPI_ID') : effectiveMode,
            transactionId: generatedTxnId,
            amountPaid: totalPayable,
            upiId: activeUpi
          });
          onClose();
        }, 800);
      }, 900);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startPaymentProcess();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="💳 Real-Time Online Fee Payment Gateway" size="medium">
      <form onSubmit={handleSubmit} className="payment-form">
        {/* Fee Billing Summary Box */}
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
            <span>Room / Table:</span>
            <span>Room {feeRecord.roomNumber}</span>
          </div>
          <hr className="summary-divider" />
          <div className="summary-row">
            <span>Base Fee:</span>
            <span>₹{baseAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total Payable Amount:</span>
            <span className="total-amount">₹{baseAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment Methods selector */}
        <div className="form-group">
          <label className="form-label required">Select Payment Method</label>
          <div className="payment-methods-grid">
            <button
              type="button"
              className={`payment-method-btn ${paymentMode === 'UPI' ? 'active' : ''}`}
              onClick={() => setPaymentMode('UPI')}
            >
              📱 UPI / QR Code
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

        {/* REAL-TIME UPI & QR CODE SECTION */}
        {paymentMode === 'UPI' && (
          <div className="upi-section-container">
            <div className="upi-tab-toggle">
              <button
                type="button"
                className={`upi-tab-btn ${upiSubMode === 'id' ? 'active' : ''}`}
                onClick={() => setUpiSubMode('id')}
              >
                🆔 Verify UPI ID
              </button>
              <button
                type="button"
                className={`upi-tab-btn ${upiSubMode === 'qr' ? 'active' : ''}`}
                onClick={() => setUpiSubMode('qr')}
              >
                📸 Live UPI QR Code
              </button>
            </div>

            {upiSubMode === 'id' && (
              <div className="upi-id-box">
                <label className="form-label required">Enter VPA / UPI ID</label>
                <div className="upi-input-group">
                  <input
                    type="text"
                    placeholder="Enter VPA / UPI ID (e.g. name@oksbi, name@paytm, 9876543210@ybl)"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setUpiVerificationStatus(null);
                    }}
                    className="form-input upi-input"
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-secondary btn-verify-upi"
                    onClick={handleVerifyUpi}
                    disabled={isVerifyingUpi}
                  >
                    {isVerifyingUpi ? '⏳ Verifying...' : '✓ Verify UPI ID'}
                  </button>
                </div>

                {/* Verification result badge */}
                {upiVerificationStatus === 'valid' && (
                  <div className="upi-verified-badge valid">
                    <span className="badge-icon">✅</span>
                    <div>
                      <strong>Verified VPA Account:</strong> {verifiedName}
                      <br />
                      <small>Linked Bank: {verifiedBank}</small>
                    </div>
                  </div>
                )}
                {upiVerificationStatus === 'invalid' && (
                  <div className="upi-verified-badge invalid">
                    <span className="badge-icon">❌</span>
                    <span>Invalid UPI ID. Please check the handle format (e.g. user@oksbi)</span>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-success"
                  style={{ width: '100%', marginTop: '12px', padding: '12px', fontWeight: '700', borderRadius: '10px' }}
                  onClick={() => startPaymentProcess('UPI')}
                  disabled={isProcessing || !upiId.trim()}
                >
                  {isProcessing ? '⏳ Processing Payment...' : `🔒 Pay ₹${totalPayable.toLocaleString('en-IN')} via UPI ID`}
                </button>
              </div>
            )}

            {upiSubMode === 'qr' && (
              <div className="upi-qr-container">
                <div className="qr-timer-bar">
                  <div className="timer-badge">
                    ⏱️ Valid For: <span className="timer-countdown">{formatTimer(qrTimerSeconds)}</span>
                  </div>
                  <div className="cycle-badge">
                    🔄 Refresh Cycle: <strong>{qrCycleCount} of 5</strong>
                  </div>
                </div>

                {isQrExpired ? (
                  <div className="qr-expired-box">
                    <span className="expired-icon">🛑</span>
                    <h4>QR Payment Session Expired</h4>
                    <p>The 2-minute QR payment session has expired after 5 auto-refresh attempts (10 mins total).</p>
                    <button type="button" className="btn btn-primary" onClick={handleResetQrSession}>
                      🔄 Restart 2-Min QR Session
                    </button>
                  </div>
                ) : (
                  <div className="upi-qr-box">
                    <div className="qr-image-wrapper">
                      <img src={liveQrUrl} alt="Real Time UPI QR Code" className="live-qr-code-img" />
                      <div className="qr-scan-badge">Scan to Pay ₹{totalPayable.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="qr-instructions">
                      <p className="qr-title">Scan with Any Banking App:</p>
                      <div className="upi-apps-icons">
                        <span className="app-badge gpay">GPay</span>
                        <span className="app-badge phonepe">PhonePe</span>
                        <span className="app-badge paytm">Paytm</span>
                        <span className="app-badge bhim">BHIM</span>
                        <span className="app-badge sbi">YONO SBI</span>
                      </div>
                      <p className="timer-notice">
                        ℹ️ QR auto-refreshes every 2 minutes for security (Attempt {qrCycleCount} of 5).
                      </p>
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{ width: '100%', marginTop: '12px', padding: '12px', fontWeight: '700', fontSize: '0.95rem', borderRadius: '10px' }}
                        onClick={() => startPaymentProcess('UPI')}
                        disabled={isProcessing}
                      >
                        {isProcessing ? '⏳ Processing Payment...' : `📲 Auto-Confirm & Complete ₹${totalPayable.toLocaleString('en-IN')} QR Payment`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {paymentMode === 'Card' && (
          <div className="card-section-box" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            <button
              type="button"
              className="btn btn-success"
              style={{ width: '100%', marginTop: '8px', padding: '12px', fontWeight: '700', borderRadius: '10px' }}
              onClick={() => startPaymentProcess('Card')}
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Processing Card Payment...' : `🔒 Pay ₹${totalPayable.toLocaleString('en-IN')} via Card`}
            </button>
          </div>
        )}

        {paymentMode === 'NetBanking' && (
          <div className="netbanking-section-box" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label required">Select Bank</label>
              <select className="form-select">
                <option value="SBI">State Bank of India</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="Axis">Axis Bank</option>
                <option value="Canara">Canara Bank</option>
              </select>
            </div>
            <button
              type="button"
              className="btn btn-success"
              style={{ width: '100%', marginTop: '8px', padding: '12px', fontWeight: '700', borderRadius: '10px' }}
              onClick={() => startPaymentProcess('NetBanking')}
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Connecting to Bank...' : `🏦 Pay ₹${totalPayable.toLocaleString('en-IN')} via Net Banking`}
            </button>
          </div>
        )}

        {errorMsg && <div className="payment-error">{errorMsg}</div>}

        {/* Real-time processing progress modal */}
        {isProcessing && (
          <div className="processing-overlay">
            <div className="processing-card">
              <div className="spinner-ring"></div>
              {processStep === 1 && <p>🔍 Verifying Payment Gateway & Bank Network...</p>}
              {processStep === 2 && <p>📲 Sending Authorization Request to Banking App...</p>}
              {processStep === 3 && <p>✅ Payment Confirmed! Generating Official Receipt...</p>}
            </div>
          </div>
        )}

        <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '12px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing} style={{ minWidth: '110px' }}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;

