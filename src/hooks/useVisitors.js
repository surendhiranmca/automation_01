import { useState, useEffect, useCallback } from 'react';
import { getVisitors, saveVisitors, generateUUID, logAuditAction } from '../utils/storage';

export const useVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVisitors = useCallback(() => {
    const data = getVisitors();
    setVisitors(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVisitors();
  }, [loadVisitors]);

  const addVisitor = (visitorData, currentUser) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toISOString().split('T')[0];
    const newVisitor = {
      id: generateUUID(),
      checkInTime: `${dateStr} ${now}`,
      checkOutTime: null,
      status: 'In Hostel',
      ...visitorData
    };

    const updated = [newVisitor, ...visitors];
    saveVisitors(updated);
    setVisitors(updated);

    logAuditAction(
      currentUser?.role || 'security',
      currentUser?.username || 'Gate Security',
      'Visitor Registered',
      `Registered visitor ${newVisitor.visitorName} visiting ${newVisitor.personName} (${newVisitor.registrationNumber}).`
    );

    return { success: true, visitor: newVisitor };
  };

  const checkOutVisitor = (id, currentUser) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toISOString().split('T')[0];
    let checkedOutRecord = null;

    const updated = visitors.map(v => {
      if (v.id === id) {
        checkedOutRecord = {
          ...v,
          checkOutTime: `${dateStr} ${now}`,
          status: 'Checked Out'
        };
        return checkedOutRecord;
      }
      return v;
    });

    saveVisitors(updated);
    setVisitors(updated);

    if (checkedOutRecord) {
      logAuditAction(
        currentUser?.role || 'security',
        currentUser?.username || 'Gate Security',
        'Visitor Checked Out',
        `Checked out visitor ${checkedOutRecord.visitorName}.`
      );
    }

    return { success: true };
  };

  const getVisitorStats = useCallback(() => {
    return {
      total: visitors.length,
      inHostel: visitors.filter(v => v.status === 'In Hostel').length,
      checkedOut: visitors.filter(v => v.status === 'Checked Out').length
    };
  }, [visitors]);

  return {
    visitors,
    loading,
    addVisitor,
    checkOutVisitor,
    getVisitorStats,
    reloadVisitors: loadVisitors
  };
};
