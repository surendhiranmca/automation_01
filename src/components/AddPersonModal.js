import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './FormModal.css';

const AddPersonModal = ({ isOpen, person, rooms, onSave, onClose, errors: initialErrors }) => {
  const [formData, setFormData] = useState(person || {
    name: '',
    course: '',
    dob: '',
    roomId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        course: person.course || 'Skill Development Course',
        dob: person.dob || '2003-08-15',
        roomId: person.roomId || (rooms && rooms.length > 0 ? rooms[0].id : '')
      });
    } else {
      setFormData({
        name: '',
        course: 'Skill Development Course',
        dob: '2003-08-15',
        roomId: rooms && rooms.length > 0 ? rooms[0].id : ''
      });
    }
    setErrors(initialErrors || {});
  }, [person, initialErrors, isOpen, rooms]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} title={person ? 'Edit Person' : 'Add New Person'} onClose={onClose} size="medium">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., John Doe"
          />
          {errors.name && (
            <span className="form-error">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="course">Course</label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course || ''}
            onChange={handleChange}
            className={`form-input ${errors.course ? 'error' : ''}`}
            placeholder="e.g. Computer Science"
          />
          {errors.course && <span className="form-error">{errors.course}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dob" className="form-label">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            className={`form-input ${errors.dob ? 'error' : ''}`}
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && (
            <span className="form-error">{errors.dob}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="roomId" className="form-label">
            Assign to Room *
          </label>
          <select
            id="roomId"
            name="roomId"
            className={`form-select ${errors.roomId ? 'error' : ''}`}
            value={formData.roomId}
            onChange={handleChange}
          >
            <option value="">Select a room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.roomNumber} - {room.roomName}
              </option>
            ))}
          </select>
          {errors.roomId && (
            <span className="form-error">{errors.roomId}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {person ? 'Update Person' : 'Add Person'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPersonModal;
