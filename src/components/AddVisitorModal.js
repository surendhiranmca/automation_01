import React, { useState } from 'react';
import Modal from './Modal';

const AddVisitorModal = ({ isOpen, onClose, onSave, people = [] }) => {
  const [formData, setFormData] = useState({
    visitorName: '',
    contactNumber: '',
    personId: '',
    purpose: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.visitorName.trim()) newErrors.visitorName = 'Visitor Name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact Number is required';
    if (!formData.personId) newErrors.personId = 'Host Student is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose of visit is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const hostStudent = people.find(p => p.id === formData.personId);

    onSave({
      visitorName: formData.visitorName,
      contactNumber: formData.contactNumber,
      personId: hostStudent ? hostStudent.id : '',
      personName: hostStudent ? hostStudent.name : 'Unknown Student',
      registrationNumber: hostStudent ? hostStudent.registrationNumber : 'N/A',
      roomNumber: hostStudent ? hostStudent.roomNumber : 'N/A',
      purpose: formData.purpose
    });

    setFormData({
      visitorName: '',
      contactNumber: '',
      personId: '',
      purpose: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🪪 Visitor Entry Check-In Pass" size="medium">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Visitor Name</label>
            <input
              type="text"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              placeholder="Full Name of Visitor"
              className={`form-input ${errors.visitorName ? 'error' : ''}`}
            />
            {errors.visitorName && <span className="error-message">{errors.visitorName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Visitor Phone Number</label>
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
        </div>

        <div className="form-group">
          <label className="form-label required">Host Student Being Visited</label>
          <select
            name="personId"
            value={formData.personId}
            onChange={handleChange}
            className={`form-select ${errors.personId ? 'error' : ''}`}
          >
            <option value="">-- Choose Host Student --</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.registrationNumber}) - {p.roomNumber}
              </option>
            ))}
          </select>
          {errors.personId && <span className="error-message">{errors.personId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label required">Purpose of Visit</label>
          <textarea
            name="purpose"
            rows="3"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Specify relationship & detailed purpose of visit..."
            className={`form-textarea ${errors.purpose ? 'error' : ''}`}
          ></textarea>
          {errors.purpose && <span className="error-message">{errors.purpose}</span>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            🪪 Issue Visitor Gate Pass
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVisitorModal;
