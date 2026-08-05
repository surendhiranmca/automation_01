import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from './AuthContext';

const AddLeaveModal = ({ isOpen, onClose, onSave, people = [], rooms = [] }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    personId: '',
    leaveDate: '',
    returnDate: '',
    reason: '',
    contactNumber: '',
    parentContact: ''
  });
  const [errors, setErrors] = useState({});

  const isStudent = currentUser && currentUser.role === 'student';

  // Find logged in student profile
  const studentProfile = isStudent 
    ? people.find(p => p.registrationNumber === currentUser.username || p.id === currentUser.id)
    : null;

  const studentRoom = studentProfile 
    ? rooms.find(r => r.id === studentProfile.roomId)
    : null;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        personId: studentProfile ? studentProfile.id : '',
        leaveDate: '',
        returnDate: '',
        reason: '',
        contactNumber: '',
        parentContact: ''
      });
      setErrors({});
    }
  }, [isOpen, studentProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    let selectedPerson = studentProfile;
    if (!isStudent) {
      if (!formData.personId) newErrors.personId = 'Student selection is required';
      selectedPerson = people.find(p => p.id === formData.personId);
    }

    if (!formData.leaveDate) newErrors.leaveDate = 'Leave From Date is required';
    if (!formData.returnDate) newErrors.returnDate = 'Leave To Date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason for leave is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Emergency Contact Number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const room = rooms.find(r => r.id === selectedPerson?.roomId);

    onSave({
      personId: selectedPerson ? selectedPerson.id : 'N/A',
      personName: selectedPerson ? selectedPerson.name : (currentUser?.name || 'Student'),
      registrationNumber: selectedPerson ? selectedPerson.registrationNumber : (currentUser?.username || 'N/A'),
      roomNumber: room ? room.roomNumber : 'N/A',
      leaveDate: formData.leaveDate,
      returnDate: formData.returnDate,
      reason: formData.reason,
      contactNumber: formData.contactNumber,
      parentContact: formData.parentContact || formData.contactNumber
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📝 Submit Outstation Leave Request" size="medium">
      <form onSubmit={handleSubmit} className="form">
        {isStudent && studentProfile && (
          <div className="form-group readonly-group" style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: '#475569', display: 'block', fontSize: '0.75rem' }}>Student Name:</strong>
                <span>{studentProfile.name}</span>
              </div>
              <div>
                <strong style={{ color: '#475569', display: 'block', fontSize: '0.75rem' }}>Registration #:</strong>
                <span>{studentProfile.registrationNumber}</span>
              </div>
              <div>
                <strong style={{ color: '#475569', display: 'block', fontSize: '0.75rem' }}>Room #:</strong>
                <span>{studentRoom ? `Room ${studentRoom.roomNumber}` : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {!isStudent && (
          <div className="form-group">
            <label className="form-label required">Student</label>
            <select
              name="personId"
              value={formData.personId}
              onChange={handleChange}
              className={`form-select ${errors.personId ? 'error' : ''}`}
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
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Leave From Date</label>
            <input
              type="date"
              name="leaveDate"
              value={formData.leaveDate}
              onChange={handleChange}
              className={`form-input ${errors.leaveDate ? 'error' : ''}`}
            />
            {errors.leaveDate && <span className="error-message">{errors.leaveDate}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Leave To Date</label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className={`form-input ${errors.returnDate ? 'error' : ''}`}
            />
            {errors.returnDate && <span className="error-message">{errors.returnDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Emergency Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={`form-input ${errors.contactNumber ? 'error' : ''}`}
            />
            {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Parent / Guardian Contact (Optional)</label>
            <input
              type="text"
              name="parentContact"
              value={formData.parentContact}
              onChange={handleChange}
              placeholder="e.g. 9876543211"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Reason for Leave</label>
          <textarea
            name="reason"
            rows="3"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Explain detailed reason for outstation leave..."
            className={`form-textarea ${errors.reason ? 'error' : ''}`}
          ></textarea>
          {errors.reason && <span className="error-message">{errors.reason}</span>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLeaveModal;
