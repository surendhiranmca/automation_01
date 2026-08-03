import { useState, useEffect, useCallback } from 'react';
import { getLeaves, saveLeaves, generateUUID } from '../utils/storage';

export const useLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaves = useCallback(() => {
    const data = getLeaves();
    setLeaves(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const addLeaveRequest = (data) => {
    const newLeave = {
      id: generateUUID(),
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      adminRemarks: null,
      ...data
    };
    const updated = [newLeave, ...leaves];
    saveLeaves(updated);
    setLeaves(updated);
    return { success: true, leave: newLeave };
  };

  const updateLeaveStatus = (id, status, adminRemarks = '') => {
    const updated = leaves.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status,
          adminRemarks: adminRemarks || l.adminRemarks
        };
      }
      return l;
    });
    saveLeaves(updated);
    setLeaves(updated);
    return { success: true };
  };

  const deleteLeave = (id) => {
    const updated = leaves.filter(l => l.id !== id);
    saveLeaves(updated);
    setLeaves(updated);
    return { success: true };
  };

  const getLeaveStats = useCallback(() => {
    return {
      total: leaves.length,
      pending: leaves.filter(l => l.status === 'Pending').length,
      approved: leaves.filter(l => l.status === 'Approved').length,
      rejected: leaves.filter(l => l.status === 'Rejected').length
    };
  }, [leaves]);

  return {
    leaves,
    loading,
    addLeaveRequest,
    updateLeaveStatus,
    deleteLeave,
    getLeaveStats,
    reloadLeaves: loadLeaves
  };
};
