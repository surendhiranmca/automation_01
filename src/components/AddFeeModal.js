import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const AddFeeModal = ({ isOpen, onClose, onSave, feeEntry = null, people = [], rooms = [] }) => {
  const [formData, setFormData] = useState({
    personId: '',
    month: 'August 2026',
    amount: '4500',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    paymentMode: 'Cash',
    transactionRef: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (feeEntry) {
      setFormData({
        personId: feeEntry.personId || '',
        month: feeEntry.month || 'August 2026',
        amount: feeEntry.amount ? String(feeEntry.amount) : '4500',
        dueDate: feeEntry.dueDate || new Date().toISOString().split('T')[0],
        status: feeEntry.status || 'Pending',
        paymentMode: feeEntry.paymentMode || 'Cash',
        transactionRef: feeEntry.transactionRef || ''
      });
    } else {
      setFormData({
        personId: people.length > 0 ? people[0].id : '',
        month: 'August 2026',
        amount: '4500',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        paymentMode: 'Cash',
        transactionRef: ''
      });
    }
    setErrors({});
  }, [feeEntry, isOpen, people]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.personId) newErrors.personId = 'Student is required';
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedPerson = people.find(p => p.id === formData.personId);
    const room = rooms.find(r => r.id === selectedPerson?.roomId);

    const payload = {
      ...formData,
      personName: selectedPerson ? selectedPerson.name : 'Unknown Student',
      registrationNumber: selectedPerson ? selectedPerson.registrationNumber : 'N/A',
      roomNumber: room ? room.roomNumber : 'N/A',
      amount: Number(formData.amount),
      paidAmount: formData.status === 'Paid' ? Number(formData.amount) : 0,
      paidDate: formData.status === 'Paid' ? new Date().toISOString().split('T')[0] : null
    };

    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={feeEntry ? 'Edit Fee Entry' : 'Add New Fee Record'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label required">Student</label>
          <select
            name="personId"
            value={formData.personId}
            onChange={handleChange}
            className={`form-select ${errors.personId ? 'error' : ''}`}
            disabled={!!feeEntry}
          >
            <option value="">Select Student</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.registrationNumber})
              </option>
            ))}
          </select>
          {errors.personId && <span className="error-message">{errors.personId}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Fee Month</label>
            <input
              type="text"
              name="month"
              value={formData.month}
              onChange={handleChange}
              placeholder="e.g. August 2026"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`form-input ${errors.amount ? 'error' : ''}`}
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`form-input ${errors.dueDate ? 'error' : ''}`}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {formData.status === 'Paid' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Cash">Cash</option>
                <option value="Online Transfer">Online Transfer / UPI</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Reference #</label>
              <input
                type="text"
                name="transactionRef"
                value={formData.transactionRef}
                onChange={handleChange}
                placeholder="TXN Ref / Receipt #"
                className="form-input"
              />
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {feeEntry ? 'Update Fee Record' : 'Save Fee Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFeeModal;
