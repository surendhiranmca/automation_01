import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from './AuthContext';

const AddComplaintModal = ({ isOpen, onClose, onSave, people = [], rooms = [] }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    personId: '',
    category: 'Electricity',
    priority: 'Medium',
    description: ''
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

    if (!formData.description.trim()) newErrors.description = 'Description is required';

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
      category: formData.category,
      priority: formData.priority,
      description: formData.description
    });

    setFormData({ personId: '', category: 'Electricity', priority: 'Medium', description: '' });
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit New Complaint" size="medium">
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
            <label className="form-label required">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Complaint Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue clearly..."
            className={`form-textarea ${errors.description ? 'error' : ''}`}
          ></textarea>
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Complaint
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddComplaintModal;
