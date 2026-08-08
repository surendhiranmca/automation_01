import { sampleRooms, samplePeople, sampleFees, sampleLeaves, sampleComplaints } from './sampleData';

/**
 * Storage Utilities for localStorage management
 * Handles all persistence layer operations
 */

const STORAGE_KEYS = {
  ROOMS: 'rnl_rooms',
  PEOPLE: 'rnl_people',
  LIST_PERIODS: 'rnl_list_periods',
  CURRENT_PERIOD: 'rnl_current_period',
  METADATA: 'rnl_metadata',
  USERS: 'rnl_users',
  FEES: 'rnl_fees',
  COMPLAINTS: 'rnl_complaints',
  LEAVES: 'rnl_leaves',
  NOTIFICATIONS: 'rnl_notifications',
  VISITORS: 'rnl_visitors',
  ATTENDANCE: 'rnl_attendance',
  AUDIT_LOGS: 'rnl_audit_logs'
};

/**
 * Initialize storage with default values if not present
 */
export const initializeStorage = () => {
  const existingRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
  if (!existingRooms || JSON.parse(existingRooms).length === 0 || (existingRooms && existingRooms.includes('Table 1'))) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(sampleRooms));
  }
  const existingPeople = localStorage.getItem(STORAGE_KEYS.PEOPLE);
  if (!existingPeople || JSON.parse(existingPeople).length === 0 || (existingPeople && existingPeople.includes('Table 1'))) {
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(samplePeople));
  }

  if (!localStorage.getItem(STORAGE_KEYS.LIST_PERIODS)) {
    localStorage.setItem(STORAGE_KEYS.LIST_PERIODS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.METADATA)) {
    localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(getDefaultMetadata()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PERIOD)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PERIOD, JSON.stringify(getDefaultCurrentPeriod()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
      { id: 'admin-001', username: 'admin', password: 'admin', role: 'admin' },
      { id: 'student-001', username: 'student', password: 'password', role: 'student' }
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEES) || JSON.parse(localStorage.getItem(STORAGE_KEYS.FEES)).length === 0) {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(sampleFees));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLAINTS)).length === 0) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(sampleComplaints));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAVES) || JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVES)).length === 0) {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(sampleLeaves));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

/**
 * Get default metadata structure
 */
export const getDefaultMetadata = () => {
  const today = new Date();
  const nextUpdate = new Date(today);
  nextUpdate.setDate(nextUpdate.getDate() + 15);

  const year = nextUpdate.getFullYear();
  const month = String(nextUpdate.getMonth() + 1).padStart(2, '0');
  const day = String(nextUpdate.getDate()).padStart(2, '0');

  return {
    lastUpdateDate: today.toISOString().split('T')[0],
    nextUpdateDate: `${year}-${month}-${day}`,
    totalRooms: 0,
    totalPeople: 0,
    updateIntervalDays: 15,
    lastCheckDate: today.toISOString().split('T')[0],
    appCreatedDate: today.toISOString().split('T')[0]
  };
};

/**
 * Get default current period
 */
export const getDefaultCurrentPeriod = () => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 14);
  const nextUpdateDate = new Date(endDate);
  nextUpdateDate.setDate(nextUpdateDate.getDate() + 1);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const endYear = endDate.getFullYear();
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  const endDay = String(endDate.getDate()).padStart(2, '0');

  const nextYear = nextUpdateDate.getFullYear();
  const nextMonth = String(nextUpdateDate.getMonth() + 1).padStart(2, '0');
  const nextDay = String(nextUpdateDate.getDate()).padStart(2, '0');

  return {
    id: generateUUID(),
    startDate: `${year}-${month}-${day}`,
    endDate: `${endYear}-${endMonth}-${endDay}`,
    isActive: true,
    generatedDate: `${year}-${month}-${day}`,
    nextUpdateDate: `${nextYear}-${nextMonth}-${nextDay}`,
    lastUpdateDate: `${year}-${month}-${day}`
  };
};

/**
 * Generate UUID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

/**
 * Get all rooms
 */
export const getRooms = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
  return data ? JSON.parse(data) : [];
};

/**
 * Save rooms
 */
export const saveRooms = (rooms) => {
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  updateMetadata();
};

/**
 * Get all people
 */
export const getPeople = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PEOPLE);
  return data ? JSON.parse(data) : [];
};

/**
 * Save people
 */
export const savePeople = (people) => {
  localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people));
  updateMetadata();
};

/**
 * Get list periods history
 */
export const getListPeriods = () => {
  const data = localStorage.getItem(STORAGE_KEYS.LIST_PERIODS);
  return data ? JSON.parse(data) : [];
};

/**
 * Save list periods
 */
export const saveListPeriods = (periods) => {
  localStorage.setItem(STORAGE_KEYS.LIST_PERIODS, JSON.stringify(periods));
};

/**
 * Get current period
 */
export const getCurrentPeriod = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PERIOD);
  return data ? JSON.parse(data) : getDefaultCurrentPeriod();
};

/**
 * Save current period
 */
export const saveCurrentPeriod = (period) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_PERIOD, JSON.stringify(period));
};

/**
 * Get metadata
 */
export const getMetadata = () => {
  const data = localStorage.getItem(STORAGE_KEYS.METADATA);
  return data ? JSON.parse(data) : getDefaultMetadata();
};

/**
 * Save metadata
 */
export const saveMetadata = (metadata) => {
  localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata));
};

/**
 * Update metadata counts
 */
export const updateMetadata = () => {
  const metadata = getMetadata();
  const rooms = getRooms();
  const people = getPeople();

  metadata.totalRooms = rooms.length;
  metadata.totalPeople = people.length;
  metadata.lastCheckDate = new Date().toISOString().split('T')[0];

  saveMetadata(metadata);
};

/**
 * Get all users
 */
export const getUsers = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

/**
 * Save users
 */
export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Get all fees
 */
/**
 * Get all fees and calculate automatic overdue status & late fees
 */
export const getFees = () => {
  const data = localStorage.getItem(STORAGE_KEYS.FEES);
  const fees = data ? JSON.parse(data) : [];
  return checkAndUpdateOverdueFees(fees);
};

/**
 * Check and update overdue fees with fine calculations
 */
export const checkAndUpdateOverdueFees = (feesList) => {
  if (!feesList || !Array.isArray(feesList)) return [];

  return feesList.map(fee => {
    const originalAmount = Number(fee.amount) || 0;
    const isPaid = fee.status === 'Paid';
    return {
      ...fee,
      status: isPaid ? 'Paid' : 'Pending',
      lateFee: 0,
      finePerDay: 0,
      overdueDays: 0,
      totalPayable: originalAmount
    };
  });
};

/**
 * Save fees
 */
export const saveFees = (fees) => {
  localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
};

/**
 * Get all complaints
 */
export const getComplaints = () => {
  const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
  return data ? JSON.parse(data) : [];
};

/**
 * Save complaints
 */
export const saveComplaints = (complaints) => {
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
};

/**
 * Get all leaves
 */
export const getLeaves = () => {
  const data = localStorage.getItem(STORAGE_KEYS.LEAVES);
  return data ? JSON.parse(data) : [];
};

/**
 * Save leaves
 */
export const saveLeaves = (leaves) => {
  localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
};

/**
 * Get all notifications
 */
export const getNotifications = () => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return data ? JSON.parse(data) : [];
};

/**
 * Add a new notification
 */
export const addNotification = (notificationData) => {
  const notifications = getNotifications();
  const newNotification = {
    id: generateUUID(),
    isRead: false,
    createdAt: new Date().toISOString(),
    ...notificationData
  };
  const updated = [newNotification, ...notifications];
  saveNotifications(updated);
  return newNotification;
};

/**
 * Save notifications
 */
export const saveNotifications = (notifications) => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

/**
 * Clear all data (for settings/reset)
 */
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.ROOMS);
  localStorage.removeItem(STORAGE_KEYS.PEOPLE);
  localStorage.removeItem(STORAGE_KEYS.LIST_PERIODS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_PERIOD);
  localStorage.removeItem(STORAGE_KEYS.METADATA);
  localStorage.removeItem(STORAGE_KEYS.FEES);
  localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
  localStorage.removeItem(STORAGE_KEYS.LEAVES);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  // Do not remove USERS to preserve login credentials
  initializeStorage();
};

/**
 * Export all data as JSON
 */
export const exportAllData = () => {
  return {
    rooms: getRooms(),
    people: getPeople(),
    listPeriods: getListPeriods(),
    currentPeriod: getCurrentPeriod(),
    metadata: getMetadata(),
    users: getUsers(),
    fees: getFees(),
    complaints: getComplaints(),
    leaves: getLeaves(),
    notifications: getNotifications(),
    exportDate: new Date().toISOString()
  };
};

/**
 * Import data from JSON
 */
export const importData = (data) => {
  try {
    if (data.rooms) saveRooms(data.rooms);
    if (data.people) savePeople(data.people);
    if (data.listPeriods) saveListPeriods(data.listPeriods);
    if (data.currentPeriod) saveCurrentPeriod(data.currentPeriod);
    if (data.metadata) saveMetadata(data.metadata);
    if (data.users) saveUsers(data.users);
    if (data.fees) saveFees(data.fees);
    if (data.complaints) saveComplaints(data.complaints);
    if (data.leaves) saveLeaves(data.leaves);
    if (data.notifications) saveNotifications(data.notifications);
    if (data.visitors) saveVisitors(data.visitors);
    if (data.attendance) saveAttendance(data.attendance);
    if (data.auditLogs) saveAuditLogs(data.auditLogs);
    return true;
  } catch (error) {
    console.error('Import error:', error);
    return false;
  }
};

/**
 * Get all visitors
 */
export const getVisitors = () => {
  const data = localStorage.getItem(STORAGE_KEYS.VISITORS);
  return data ? JSON.parse(data) : [];
};

/**
 * Save visitors
 */
export const saveVisitors = (visitors) => {
  localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(visitors));
};

/**
 * Get attendance records
 */
export const getAttendance = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return data ? JSON.parse(data) : [];
};

/**
 * Save attendance records
 */
export const saveAttendance = (attendance) => {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
};

/**
 * Get audit logs
 */
export const getAuditLogs = () => {
  const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  return data ? JSON.parse(data) : [];
};

/**
 * Save audit logs
 */
export const saveAuditLogs = (logs) => {
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
};

/**
 * Log audit action
 */
export const logAuditAction = (userRole, username, action, details) => {
  const logs = getAuditLogs();
  const newLog = {
    id: generateUUID(),
    timestamp: new Date().toISOString(),
    userRole: userRole || 'system',
    username: username || 'system',
    action,
    details
  };
  const updated = [newLog, ...logs];
  saveAuditLogs(updated);
  return newLog;
};

