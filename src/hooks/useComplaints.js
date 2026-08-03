import { useState, useEffect, useCallback } from 'react';
import { getComplaints, saveComplaints, generateUUID } from '../utils/storage';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = useCallback(() => {
    const data = getComplaints();
    setComplaints(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const addComplaint = (data) => {
    const newComplaint = {
      id: generateUUID(),
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
      resolvedDate: null,
      adminRemarks: null,
      ...data
    };
    const updated = [newComplaint, ...complaints];
    saveComplaints(updated);
    setComplaints(updated);
    return { success: true, complaint: newComplaint };
  };

  const updateComplaintStatus = (id, status, adminRemarks = '') => {
    const updated = complaints.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          adminRemarks: adminRemarks || c.adminRemarks,
          resolvedDate: status === 'Resolved' ? new Date().toISOString().split('T')[0] : c.resolvedDate
        };
      }
      return c;
    });
    saveComplaints(updated);
    setComplaints(updated);
    return { success: true };
  };

  const deleteComplaint = (id) => {
    const updated = complaints.filter(c => c.id !== id);
    saveComplaints(updated);
    setComplaints(updated);
    return { success: true };
  };

  const getComplaintStats = useCallback(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length
    };
  }, [complaints]);

  return {
    complaints,
    loading,
    addComplaint,
    updateComplaintStatus,
    deleteComplaint,
    getComplaintStats,
    reloadComplaints: loadComplaints
  };
};
