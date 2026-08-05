import { useState, useEffect, useCallback } from 'react';
import { getLeaves, saveLeaves, generateUUID, addNotification } from '../utils/storage';

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
      remarks: '',
      ...data
    };
    const updated = [newLeave, ...leaves];
    saveLeaves(updated);
    setLeaves(updated);

    // Notify Admin of new leave request
    addNotification({
      userId: 'admin',
      title: '📝 New Leave Request Submitted',
      message: `${newLeave.personName} (${newLeave.registrationNumber}, Room ${newLeave.roomNumber}) submitted a leave request from ${newLeave.leaveDate} to ${newLeave.returnDate}.`,
      type: 'info'
    });

    return { success: true, leave: newLeave };
  };

  const updateLeaveStatus = (id, status, remarks = '') => {
    let targetLeave = null;
    const updated = leaves.map(l => {
      if (l.id === id) {
        targetLeave = {
          ...l,
          status,
          remarks: remarks || l.remarks
        };
        return targetLeave;
      }
      return l;
    });
    saveLeaves(updated);
    setLeaves(updated);

    if (targetLeave) {
      const isApproved = status === 'Approved';
      addNotification({
        userId: targetLeave.personId || 'student',
        registrationNumber: targetLeave.registrationNumber,
        title: isApproved ? '✅ Leave Request Approved' : '❌ Leave Request Rejected',
        message: `Your leave request for ${targetLeave.leaveDate} to ${targetLeave.returnDate} has been ${status.toLowerCase()}.${remarks ? ` Remarks: "${remarks}"` : ''}`,
        type: isApproved ? 'success' : 'error'
      });
    }

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
