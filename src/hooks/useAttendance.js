import { useState, useEffect, useCallback } from 'react';
import { getAttendance, saveAttendance, generateUUID, logAuditAction } from '../utils/storage';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = useCallback(() => {
    const data = getAttendance();
    setAttendance(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const markAttendance = (date, records, currentUser) => {
    const currentAttendance = getAttendance();
    const filtered = currentAttendance.filter(a => a.date !== date);
    
    const newRecords = records.map(r => ({
      id: generateUUID(),
      date,
      personId: r.personId,
      personName: r.personName,
      registrationNumber: r.registrationNumber,
      roomNumber: r.roomNumber,
      status: r.status || 'Present' // 'Present', 'Absent', 'On Leave'
    }));

    const updated = [...newRecords, ...filtered];
    saveAttendance(updated);
    setAttendance(updated);

    logAuditAction(
      currentUser?.role || 'warden',
      currentUser?.username || 'Warden',
      'Attendance Saved',
      `Saved daily attendance roll call for ${date} (${newRecords.length} students).`
    );

    return { success: true, count: newRecords.length };
  };

  const getAttendanceForDate = useCallback((date) => {
    return attendance.filter(a => a.date === date);
  }, [attendance]);

  const getAttendanceStats = useCallback((date) => {
    const dayRecords = attendance.filter(a => a.date === date);
    return {
      total: dayRecords.length,
      present: dayRecords.filter(a => a.status === 'Present').length,
      absent: dayRecords.filter(a => a.status === 'Absent').length,
      onLeave: dayRecords.filter(a => a.status === 'On Leave').length
    };
  }, [attendance]);

  return {
    attendance,
    loading,
    markAttendance,
    getAttendanceForDate,
    getAttendanceStats,
    reloadAttendance: loadAttendance
  };
};
