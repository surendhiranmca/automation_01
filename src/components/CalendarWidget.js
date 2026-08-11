import React, { useState } from 'react';
import './CalendarWidget.css';

const DEFAULT_DEADLINES = [
  {
    id: 'dl-1',
    date: '2026-08-20',
    dayNumber: 20,
    month: 7, // 0-indexed (August)
    year: 2026,
    title: '15-Day Room Name List Regeneration',
    category: 'cycle',
    type: 'Auto-Roster',
    icon: '⚡',
    priority: 'high',
    time: '12:00 AM Midnight',
    description: 'System automatically recalculates student room & mess table allocations for the next 15-day cycle.'
  },
  {
    id: 'dl-2',
    date: '2026-08-15',
    dayNumber: 15,
    month: 7,
    year: 2026,
    title: 'Monthly Hostel Fee Due Date',
    category: 'fee',
    type: 'Fee Payment',
    icon: '💳',
    priority: 'critical',
    time: '11:59 PM',
    description: 'Final deadline to clear pending monthly mess and room stay fee dues without late fee charges.'
  },
  {
    id: 'dl-3',
    date: '2026-08-18',
    dayNumber: 18,
    month: 7,
    year: 2026,
    title: 'Outstation Leave Return Deadline',
    category: 'leave',
    type: 'Leave Return',
    icon: '🏖️',
    priority: 'normal',
    time: '06:00 PM',
    description: 'Approved outstation students must report back to hostel premises before 6:00 PM.'
  },
  {
    id: 'dl-4',
    date: '2026-08-25',
    dayNumber: 25,
    month: 7,
    year: 2026,
    title: 'Mess Maintenance & Inspection',
    category: 'maintenance',
    type: 'Inspection',
    icon: '🧹',
    priority: 'normal',
    time: '10:00 AM',
    description: 'Bi-monthly kitchen hygiene and dining hall equipment maintenance check.'
  },
  {
    id: 'dl-5',
    date: '2026-08-11',
    dayNumber: 11,
    month: 7,
    year: 2026,
    title: 'Night Attendance Roll Call',
    category: 'attendance',
    type: 'Roll Call',
    icon: '📋',
    priority: 'high',
    time: '09:00 PM Daily',
    description: 'Warden roll call verification for all hostel blocks.'
  }
];

const CalendarWidget = ({ initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 11)); // August 2026
  const [selectedDate, setSelectedDate] = useState(11);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDateStr, setNewDateStr] = useState('2026-08-15');
  const [newCategory, setNewCategory] = useState('fee');
  const [deadlines, setDeadlines] = useState(DEFAULT_DEADLINES);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate days in current month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddDeadline = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const dObj = new Date(newDateStr);
    if (isNaN(dObj.getTime())) return;

    const newDl = {
      id: `custom-${Date.now()}`,
      date: newDateStr,
      dayNumber: dObj.getDate(),
      month: dObj.getMonth(),
      year: dObj.getFullYear(),
      title: newTitle,
      category: newCategory,
      type: 'Custom Deadline',
      icon: newCategory === 'fee' ? '💳' : newCategory === 'leave' ? '🏖️' : '⏱️',
      priority: 'high',
      time: '11:59 PM',
      description: 'User specified deadline'
    };

    setDeadlines([...deadlines, newDl]);
    setNewTitle('');
    setShowAddModal(false);
  };

  // Get deadlines for current visible month
  const monthDeadlines = deadlines.filter(
    dl => dl.month === month && dl.year === year
  );

  // Get deadlines for selected day
  const selectedDayDeadlines = monthDeadlines.filter(
    dl => dl.dayNumber === selectedDate
  );

  // Helper to check if a day has deadlines
  const getDeadlinesForDay = (day) => {
    return monthDeadlines.filter(dl => dl.dayNumber === day);
  };

  return (
    <div className="calendar-widget-container">
      {/* Sleek Top-Right Corner Trigger Button */}
      <button
        className="calendar-open-trigger-btn"
        onClick={() => setIsOpen(true)}
        title="Click to open Calendar & Deadlines Tracker"
      >
        <div className="trigger-btn-icon-wrapper">
          <span className="cal-icon">📅</span>
          <span className="cal-pulse-ring"></span>
        </div>
        <div className="trigger-btn-text">
          <span className="trigger-title">View Calendar &amp; Deadlines</span>
          <span className="trigger-subtitle">
            {monthDeadlines.length} Active Deadlines • Point Out Dates
          </span>
        </div>
        <div className="trigger-badge">
          <span>Open</span>
          <span className="badge-arrow">→</span>
        </div>
      </button>

      {/* Pop-up Modal / Slide-Over Pattern */}
      {isOpen && (
        <div className="calendar-modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="calendar-modal-dialog glass-panel slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="calendar-widget-header">
              <div className="widget-title-group">
                <span className="widget-icon">📅</span>
                <div>
                  <h3 className="widget-title">Calendar &amp; System Deadlines</h3>
                  <span className="widget-subtitle">Interactive schedule &amp; cycle deadline tracker</span>
                </div>
              </div>
              <div className="header-action-buttons">
                <button
                  className="add-deadline-btn"
                  onClick={() => setShowAddModal(true)}
                  title="Add Custom Deadline"
                >
                  + Add Deadline
                </button>
                <button
                  className="close-calendar-modal-btn"
                  onClick={() => setIsOpen(false)}
                  title="Close Calendar"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Calendar Main Grid Layout (2-Column Inside Modal) */}
            <div className="calendar-modal-body-grid">
              {/* Left Column: Interactive Month Calendar */}
              <div className="calendar-left-col">
                {/* Calendar Month Nav */}
                <div className="calendar-nav">
                  <button className="nav-arrow-btn" onClick={prevMonth}>&lsaquo;</button>
                  <span className="month-year-display">
                    {monthNames[month]} {year}
                  </span>
                  <button className="nav-arrow-btn" onClick={nextMonth}>&rsaquo;</button>
                </div>

                {/* Days of Week Header */}
                <div className="calendar-days-header">
                  {daysOfWeek.map((day, idx) => (
                    <span key={idx} className="day-header-cell">{day}</span>
                  ))}
                </div>

                {/* Days Matrix */}
                <div className="calendar-grid-matrix">
                  {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="calendar-day-cell empty-cell"></div>
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isToday = dayNum === 11 && month === 7 && year === 2026;
                    const isSelected = dayNum === selectedDate;
                    const dayDeadlines = getDeadlinesForDay(dayNum);
                    const hasDeadlines = dayDeadlines.length > 0;

                    return (
                      <div
                        key={`day-${dayNum}`}
                        className={`calendar-day-cell ${isToday ? 'today-cell' : ''} ${isSelected ? 'selected-cell' : ''} ${hasDeadlines ? 'has-deadline' : ''}`}
                        onClick={() => setSelectedDate(dayNum)}
                      >
                        <span className="day-number">{dayNum}</span>
                        {hasDeadlines && (
                          <div className="deadline-dots-container">
                            {dayDeadlines.slice(0, 3).map((dl, dIdx) => (
                              <span
                                key={dIdx}
                                className={`deadline-dot dot-${dl.category}`}
                                title={dl.title}
                              ></span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick Selection Chips */}
                <div className="upcoming-deadlines-summary">
                  <div className="summary-title">⚡ Point Out Key Dates</div>
                  <div className="summary-chips">
                    <div className="summary-chip chip-cycle" onClick={() => setSelectedDate(20)}>
                      <span>⚡ Aug 20: 15-Day Roster Update</span>
                    </div>
                    <div className="summary-chip chip-fee" onClick={() => setSelectedDate(15)}>
                      <span>💳 Aug 15: Fee Payment Due</span>
                    </div>
                    <div className="summary-chip chip-leave" onClick={() => setSelectedDate(18)}>
                      <span>🏖️ Aug 18: Leave Return</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Deadlines Pointout Panel */}
              <div className="calendar-right-col">
                <div className="deadlines-pointout-section">
                  <div className="pointout-header">
                    <span className="pointout-title">
                      📌 {selectedDate ? `${monthNames[month]} ${selectedDate} Deadlines` : 'Upcoming Deadlines'}
                    </span>
                    <span className="pointout-badge">
                      {selectedDayDeadlines.length} Alert(s)
                    </span>
                  </div>

                  <div className="deadlines-list">
                    {selectedDayDeadlines.length > 0 ? (
                      selectedDayDeadlines.map((dl) => (
                        <div key={dl.id} className={`deadline-item item-${dl.category} priority-${dl.priority}`}>
                          <div className="dl-item-icon">{dl.icon}</div>
                          <div className="dl-item-details">
                            <div className="dl-item-header">
                              <span className="dl-title">{dl.title}</span>
                              <span className={`dl-priority-tag tag-${dl.priority}`}>{dl.priority.toUpperCase()}</span>
                            </div>
                            <div className="dl-time-meta">
                              <span className="dl-time">⏰ {dl.time}</span>
                              <span className="dl-type">• {dl.type}</span>
                            </div>
                            <p className="dl-desc">{dl.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-deadlines-box">
                        <span className="no-dl-icon">✅</span>
                        <p>No critical deadlines scheduled for this day.</p>
                        <span className="select-hint">Select highlighted dates (🔴/🟣/🟢) on the left to inspect deadlines.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Deadline Sub-Modal */}
      {showAddModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content-card glass-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📌 Add Custom Deadline / Reminder</h3>
              <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddDeadline} className="modal-body-form">
              <div className="form-field">
                <label>Deadline Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Mess Fee Final Date / Exam Schedule"
                  required
                  className="glass-input"
                />
              </div>

              <div className="form-field">
                <label>Target Date</label>
                <input
                  type="date"
                  value={newDateStr}
                  onChange={e => setNewDateStr(e.target.value)}
                  required
                  className="glass-input"
                />
              </div>

              <div className="form-field">
                <label>Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="glass-input"
                >
                  <option value="fee">Fee &amp; Payments 💳</option>
                  <option value="cycle">15-Day Roster Cycle ⚡</option>
                  <option value="leave">Leave &amp; Outstation 🏖️</option>
                  <option value="maintenance">Maintenance &amp; Inspection 🧹</option>
                  <option value="attendance">Attendance &amp; Roll Call 📋</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Deadline</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
