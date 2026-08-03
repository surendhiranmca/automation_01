import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from './AuthContext';
import './NameListTable.css';

const NameListTable = ({ people, rooms, onEdit, onDelete, onTransfer, selectedId, isAdmin = true }) => {
  const { currentUser } = useAuth();
  const isStudent = currentUser && currentUser.role === 'student';

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : 'Unknown';
  };

  if (!people || people.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">👥</p>
        <p className="empty-message">No people found</p>
        <p className="empty-subtext">Add a person to get started</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="name-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Registration #</th>
            <th>Course</th>
            <th>DOB</th>
            <th>Room</th>
            <th>Assigned Date</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {people.map(person => {
            const isSelf = isStudent && currentUser && (
              (currentUser.id && currentUser.id === person.id) ||
              (currentUser.username && (currentUser.username === person.registrationNumber || currentUser.username === person.id)) ||
              (currentUser.registrationNumber && currentUser.registrationNumber === person.registrationNumber)
            );
            const showPrivateDetails = !isStudent || isSelf;

            return (
              <tr
                key={person.id}
                className={`table-row ${selectedId === person.id ? 'selected' : ''}`}
              >
                <td>
                  <div className="person-name">{person.name}</div>
                </td>
                <td>
                  {showPrivateDetails ? (
                    <span className="registration-badge">{person.registrationNumber}</span>
                  ) : (
                    <span className="muted-dash">-</span>
                  )}
                </td>
                <td>{person.course || '-'}</td>
                <td>
                  {showPrivateDetails ? (
                    person.dob ? formatDate(person.dob) : 'Not set'
                  ) : (
                    <span className="muted-dash">-</span>
                  )}
                </td>
                <td className="cell-room">
                  <span className="room-badge">
                    {getRoomName(person.roomId)}
                  </span>
                </td>
                <td className="cell-date">{person.assignedDate}</td>
                <td>
                  <span className={`status-badge status-${person.status}`}>
                    {person.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="cell-actions">
                    <button
                      className="action-btn btn-edit"
                      onClick={() => onEdit(person)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn btn-transfer"
                      onClick={() => onTransfer(person)}
                      title="Transfer"
                    >
                      🔄
                    </button>
                    <button
                      className="action-btn btn-delete"
                      onClick={() => onDelete(person.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NameListTable;
