import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    let selectedPerson = null;
    if (isStudent) {
      selectedPerson = people.find(p => p.registrationNumber === currentUser.username || p.id === currentUser.id);
    } else {
      if (!formData.personId) newErrors.personId = 'Student is required';
      selectedPerson = people.find(p => p.id === formData.personId);
    }

    if (!formData.leaveDate) newErrors.leaveDate = 'Leave date is required';
    if (!formData.returnDate) newErrors.returnDate = 'Return date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    if (!formData.parentContact) newErrors.parentContact = 'Parent contact is required';

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
      parentContact: formData.parentContact
    });

    setFormData({
      personId: '',
      leaveDate: '',
      returnDate: '',
      reason: '',
      contactNumber: '',
      parentContact: ''
    });
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave" size="medium">
      <form onSubmit={handleSubmit} className="form">
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
            <label className="form-label required">Leave Date</label>
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
            <label className="form-label required">Return Date</label>
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
            <label className="form-label required">Student Contact #</label>
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
            <label className="form-label required">Parent Contact #</label>
            <input
              type="text"
              name="parentContact"
              value={formData.parentContact}
              onChange={handleChange}
              placeholder="e.g. 9876543211"
              className={`form-input ${errors.parentContact ? 'error' : ''}`}
            />
            {errors.parentContact && <span className="error-message">{errors.parentContact}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Reason for Leave</label>
          <textarea
            name="reason"
            rows="3"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Explain reason for leave..."
            className={`form-textarea ${errors.reason ? 'error' : ''}`}
          ></textarea>
          {errors.reason && <span className="error-message">{errors.reason}</span>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Leave Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLeaveModal;
