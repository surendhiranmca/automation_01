import React, { useState, useEffect } from 'react';
import HistoryCard from '../components/HistoryCard';
import Modal from '../components/Modal';
import { useListGeneration } from '../hooks/useListGeneration';
import { useRooms } from '../hooks/useRooms';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../components/AuthContext';
import './History.css';

const History = () => {
  const { getAllPeriods } = useListGeneration();
  const { rooms } = useRooms();
  const { currentUser } = useAuth();
  const isStudent = currentUser && currentUser.role === 'student';
  const [periods, setPeriods] = useState([]);
  const [expandedPeriodId, setExpandedPeriodId] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const allPeriods = getAllPeriods();
    setPeriods(allPeriods);
  }, [getAllPeriods]);

  const handleToggleExpand = (periodId) => {
    setExpandedPeriodId(expandedPeriodId === periodId ? null : periodId);
  };

  const handleViewDetails = (period) => {
    setSelectedPeriod(period);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPeriod(null);
  };

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? `${room.roomNumber} - ${room.roomName}` : `Room ${roomId.substring(0, 8)}`;
  };

  const getPeopleByRoom = (people, roomId) => {
    return people.filter(p => p.roomId === roomId);
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div className="history-title-section">
          <h1>List History</h1>
          <p className="history-subtitle">View and manage previous name lists</p>
        </div>
      </div>

      {periods && periods.length > 0 ? (
        <div className="history-list">
          {periods.map(period => (
            <HistoryCard
              key={period.id}
              period={period}
              isExpanded={expandedPeriodId === period.id}
              onToggleExpand={handleToggleExpand}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-icon">📜</p>
          <p className="empty-message">No history available</p>
          <p className="empty-subtext">History will be created after the first automatic update</p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        title={`Period Details: ${selectedPeriod?.startDate} - ${selectedPeriod?.endDate}`}
        onClose={handleCloseDetailModal}
        size="large"
      >
        <div className="detail-content">
          <div className="detail-section">
            <h3>Period Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Start Date</span>
                <span className="info-value">{formatDate(selectedPeriod?.startDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">End Date</span>
                <span className="info-value">{formatDate(selectedPeriod?.endDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Generated Date</span>
                <span className="info-value">{formatDate(selectedPeriod?.generatedDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total People</span>
                <span className="info-value">{selectedPeriod?.people?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Rooms</span>
                <span className="info-value">
                  {new Set(selectedPeriod?.people?.map(p => p.roomId)).size}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">
                  {selectedPeriod?.isActive ? '🟢 Active' : '⚪ Archived'}
                </span>
              </div>
            </div>
          </div>

          {selectedPeriod?.people && selectedPeriod.people.length > 0 && (
            <div className="detail-section">
              <h3>People by Room</h3>
              <div className="room-details">
                {Array.from(
                  new Set(selectedPeriod.people.map(p => p.roomId))
                ).map(roomId => {
                  const roomPeople = getPeopleByRoom(selectedPeriod.people, roomId);
                  return (
                    <div key={roomId} className="room-detail-card">
                      <h4>{getRoomName(roomId)}</h4>
                      <div className="people-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Registration #</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roomPeople.map(person => {
                              const isSelf = isStudent && currentUser && (
                                (currentUser.id && currentUser.id === person.id) ||
                                (currentUser.username && (currentUser.username === person.registrationNumber || currentUser.username === person.id)) ||
                                (currentUser.registrationNumber && currentUser.registrationNumber === person.registrationNumber)
                              );
                              const showPrivateDetails = !isStudent || isSelf;

                              return (
                                <tr key={person.id}>
                                  <td>{person.name}</td>
                                  <td>{showPrivateDetails ? person.registrationNumber : '-'}</td>
                                  <td>
                                    <span className={`status-badge status-${person.status}`}>
                                      {person.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default History;
