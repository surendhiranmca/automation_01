import React from 'react';
import { useAuth } from './AuthContext';
import './HistoryCard.css';

const HistoryCard = ({ period, onViewDetails, isExpanded, onToggleExpand }) => {
  const { currentUser } = useAuth();
  const isStudent = currentUser && currentUser.role === 'student';

  const getRoomStats = () => {
    if (!period.people) return [];
    
    const roomMap = {};
    period.people.forEach(person => {
      if (!roomMap[person.roomId]) {
        roomMap[person.roomId] = 0;
      }
      roomMap[person.roomId]++;
    });

    return Object.entries(roomMap).map(([roomId, count]) => ({
      roomId,
      count
    }));
  };

  const roomStats = getRoomStats();

  return (
    <div className="history-card">
      <div
        className="history-header"
        onClick={() => onToggleExpand && onToggleExpand(period.id)}
      >
        <div className="history-info">
          <h3 className="history-title">
            Period: {period.startDate} to {period.endDate}
          </h3>
          <p className="history-subtitle">
            Generated on {period.generatedDate}
          </p>
        </div>

        <div className="history-summary">
          <span className="summary-badge">
            {period.totalPeople || (period.people ? period.people.length : 0)} people
          </span>
          <span className="summary-badge">
            {roomStats.length} rooms
          </span>
          <button className="expand-btn">
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="history-body">
          <div className="room-distribution">
            <h4 className="section-title">Room Distribution</h4>
            <div className="room-list">
              {roomStats.length > 0 ? (
                roomStats.map((stat, idx) => (
                  <div key={idx} className="room-stat">
                    <span className="room-id">Room {stat.roomId.substring(0, 8)}</span>
                    <span className="room-count">{stat.count} people</span>
                  </div>
                ))
              ) : (
                <p className="no-data">No room data available</p>
              )}
            </div>
          </div>

          {period.people && period.people.length > 0 && (
            <div className="people-list-preview">
              <h4 className="section-title">People in this Period</h4>
              <div className="people-preview">
                {period.people.slice(0, 5).map((person, idx) => {
                  const isSelf = isStudent && currentUser && (
                    (currentUser.id && currentUser.id === person.id) ||
                    (currentUser.username && (currentUser.username === person.registrationNumber || currentUser.username === person.id)) ||
                    (currentUser.registrationNumber && currentUser.registrationNumber === person.registrationNumber)
                  );
                  const showPrivateDetails = !isStudent || isSelf;

                  return (
                    <div key={idx} className="person-item">
                      <span className="person-name">{person.name}</span>
                      {showPrivateDetails && (
                        <span className="person-reg">{person.registrationNumber}</span>
                      )}
                    </div>
                  );
                })}
                {period.people.length > 5 && (
                  <p className="more-people">
                    +{period.people.length - 5} more people
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            className="view-details-btn"
            onClick={() => onViewDetails && onViewDetails(period)}
          >
            View Full Details
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;
