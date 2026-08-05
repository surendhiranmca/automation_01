import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import { usePeople } from '../hooks/usePeople';
import { useRooms } from '../hooks/useRooms';
import { useAttendance } from '../hooks/useAttendance';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../components/AuthContext';
import './Attendance.css';

const Attendance = () => {
  const { people } = usePeople();
  const { rooms } = useRooms();
  const { markAttendance, getAttendanceForDate, getAttendanceStats } = useAttendance();
  const { success } = useNotification();
  const { currentUser } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedRoom, setSelectedRoom] = useState('All');

  const existingAttendance = getAttendanceForDate(selectedDate);

  // Initial state map for people
  const [statuses, setStatuses] = useState({});

  // Sync state when date or records change
  const currentStudents = useMemo(() => {
    return people.filter(p => selectedRoom === 'All' || p.roomId === selectedRoom);
  }, [people, selectedRoom]);

  const handleStatusChange = (personId, status) => {
    setStatuses(prev => ({
      ...prev,
      [personId]: status
    }));
  };

  const handleBulkStatus = (status) => {
    const updated = {};
    currentStudents.forEach(p => {
      updated[p.id] = status;
    });
    setStatuses(prev => ({ ...prev, ...updated }));
  };

  const handleSaveAttendance = () => {
    const records = currentStudents.map(p => {
      const recorded = existingAttendance.find(a => a.personId === p.id);
      return {
        personId: p.id,
        personName: p.name,
        registrationNumber: p.registrationNumber,
        roomNumber: p.roomNumber,
        status: statuses[p.id] || recorded?.status || 'Present'
      };
    });

    markAttendance(selectedDate, records, currentUser);
    success(`Daily Roll Call Attendance saved for ${selectedDate}!`);
  };

  const stats = getAttendanceStats(selectedDate);

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1>📅 Daily Roll Call & Night Attendance</h1>
          <p className="attendance-subtitle">Track nightly resident roll call, outstation leave status, and unaccounted absences</p>
        </div>
        <div className="header-action-group">
          <input
            type="date"
            className="form-input date-picker-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSaveAttendance}>
            💾 Save Roll Call
          </button>
        </div>
      </div>

      <div className="attendance-stats-grid">
        <DashboardCard title="Total Tracked Students" value={stats.total || currentStudents.length} icon="👥" trend="neutral" />
        <DashboardCard title="Present In Room" value={stats.present} icon="✅" trend="positive" />
        <DashboardCard title="Absent Without Leave" value={stats.absent} icon="🚨" trend="negative" />
        <DashboardCard title="On Approved Leave" value={stats.onLeave} icon="🏖️" trend="warning" />
      </div>

      <div className="attendance-controls">
        <div className="filter-group">
          <label>Filter Table / Room: </label>
          <select
            className="form-select room-select"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="All">All Tables / Rooms</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} ({r.roomName})
              </option>
            ))}
          </select>
        </div>

        <div className="bulk-actions">
          <span>Bulk Mark: </span>
          <button className="btn btn-secondary btn-xs" onClick={() => handleBulkStatus('Present')}>
            Mark All Present
          </button>
          <button className="btn btn-secondary btn-xs" onClick={() => handleBulkStatus('Absent')}>
            Mark All Absent
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="name-list-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Student Name</th>
              <th>Registration # (User ID)</th>
              <th>Assigned Table / Room</th>
              <th>Roll Call Status</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, idx) => {
                const existing = existingAttendance.find(a => a.personId === student.id);
                const currentStatus = statuses[student.id] || existing?.status || 'Present';

                return (
                  <tr key={student.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{student.name}</strong></td>
                    <td><span className="registration-badge">{student.registrationNumber}</span></td>
                    <td>Room / {student.roomNumber}</td>
                    <td>
                      <div className="status-radio-group">
                        <label className={`radio-pill ${currentStatus === 'Present' ? 'active-present' : ''}`}>
                          <input
                            type="radio"
                            name={`st-${student.id}`}
                            checked={currentStatus === 'Present'}
                            onChange={() => handleStatusChange(student.id, 'Present')}
                          />
                          🟢 Present
                        </label>
                        <label className={`radio-pill ${currentStatus === 'Absent' ? 'active-absent' : ''}`}>
                          <input
                            type="radio"
                            name={`st-${student.id}`}
                            checked={currentStatus === 'Absent'}
                            onChange={() => handleStatusChange(student.id, 'Absent')}
                          />
                          🔴 Absent
                        </label>
                        <label className={`radio-pill ${currentStatus === 'On Leave' ? 'active-leave' : ''}`}>
                          <input
                            type="radio"
                            name={`st-${student.id}`}
                            checked={currentStatus === 'On Leave'}
                            onChange={() => handleStatusChange(student.id, 'On Leave')}
                          />
                          🏖️ On Leave
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="empty-table-cell">
                  No resident students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
