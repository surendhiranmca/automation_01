import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const AddFeeModal = ({ isOpen, onClose, onSave, feeEntry = null, people = [], rooms = [] }) => {
  const [targetScope, setTargetScope] = useState('single'); // 'single', 'room', 'all'
  const [selectedRoomId, setSelectedRoomId] = useState('');
  
  const [formData, setFormData] = useState({
    personId: '',
    feeType: 'Hostel Fee',
    month: 'August 2026',
    amount: '5000',
    dueDate: new Date().toISOString().split('T')[0],
    finePerDay: '50',
    description: '',
    status: 'Pending'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (feeEntry) {
      setTargetScope('single');
      setFormData({
        personId: feeEntry.personId || '',
        feeType: feeEntry.feeType || 'Hostel Fee',
        month: feeEntry.month || 'August 2026',
        amount: feeEntry.amount ? String(feeEntry.amount) : '5000',
        dueDate: feeEntry.dueDate || new Date().toISOString().split('T')[0],
        finePerDay: feeEntry.finePerDay ? String(feeEntry.finePerDay) : '50',
        description: feeEntry.description || '',
        status: feeEntry.status || 'Pending'
      });
    } else {
      setTargetScope('single');
      setFormData({
        personId: people.length > 0 ? people[0].id : '',
        feeType: 'Hostel Fee',
        month: 'August 2026',
        amount: '5000',
        dueDate: new Date().toISOString().split('T')[0],
        finePerDay: '50',
        description: 'Monthly Hostel & Room Maintenance Fee',
        status: 'Pending'
      });
      if (rooms.length > 0) setSelectedRoomId(rooms[0].id);
    }
    setErrors({});
  }, [feeEntry, isOpen, people, rooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (targetScope === 'single' && !formData.personId && !feeEntry) {
      newErrors.personId = 'Please select a student';
    }
    if (targetScope === 'room' && !selectedRoomId) {
      newErrors.roomId = 'Please select a room';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedPerson = people.find(p => p.id === formData.personId);
    const room = rooms.find(r => r.id === (selectedPerson ? selectedPerson.roomId : selectedRoomId));

    const payload = {
      ...formData,
      personName: selectedPerson ? selectedPerson.name : 'Target Student',
      registrationNumber: selectedPerson ? selectedPerson.registrationNumber : 'N/A',
      roomNumber: room ? room.roomNumber : 'N/A',
      amount: Number(formData.amount),
      finePerDay: Number(formData.finePerDay) || 0
    };

    onSave(payload, targetScope, selectedRoomId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={feeEntry ? 'Edit Fee Request' : '📢 Issue Hostel Fee Payment Request'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="form">
        {!feeEntry && (
          <div className="form-group">
            <label className="form-label required">Notification Target Scope</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
              <label style={{ fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="targetScope"
                  value="single"
                  checked={targetScope === 'single'}
                  onChange={() => setTargetScope('single')}
                />
                👤 Single Student
              </label>
              <label style={{ fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="targetScope"
                  value="room"
                  checked={targetScope === 'room'}
                  onChange={() => setTargetScope('room')}
                />
                🏠 Entire Room
              </label>
              <label style={{ fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="targetScope"
                  value="all"
                  checked={targetScope === 'all'}
                  onChange={() => setTargetScope('all')}
                />
                🏢 All Students
              </label>
            </div>
          </div>
        )}

        {targetScope === 'single' && !feeEntry && (
          <div className="form-group">
            <label className="form-label required">Select Student</label>
            <select
              name="personId"
              value={formData.personId}
              onChange={handleChange}
              className={`form-select ${errors.personId ? 'error' : ''}`}
            >
              <option value="">-- Choose Student --</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.registrationNumber})
                </option>
              ))}
            </select>
            {errors.personId && <span className="error-message">{errors.personId}</span>}
          </div>
        )}

        {targetScope === 'room' && !feeEntry && (
          <div className="form-group">
            <label className="form-label required">Select Target Room</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className={`form-select ${errors.roomId ? 'error' : ''}`}
            >
              <option value="">-- Choose Room --</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} - {r.roomName}
                </option>
              ))}
            </select>
            {errors.roomId && <span className="error-message">{errors.roomId}</span>}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Fee Type</label>
            <select
              name="feeType"
              value={formData.feeType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Hostel Fee">Hostel Fee</option>
              <option value="Mess Fee">Mess Fee</option>
              <option value="Maintenance Fee">Maintenance Fee</option>
              <option value="Utility / Electricity Fee">Utility / Electricity Fee</option>
              <option value="Exam Fee">Exam Fee</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
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
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Fine Per Day (₹ / Day)</label>
            <input
              type="number"
              name="finePerDay"
              value={formData.finePerDay}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description / Payment Instructions</label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add optional notes for students..."
            className="form-textarea"
          ></textarea>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {feeEntry ? 'Save Changes' : '📢 Broadcast Fee Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFeeModal;
