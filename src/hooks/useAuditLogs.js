import { useState, useEffect, useCallback } from 'react';
import { getAuditLogs, saveAuditLogs } from '../utils/storage';

export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAuditLogs = useCallback(() => {
    const data = getAuditLogs();
    setAuditLogs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAuditLogs();
    const interval = setInterval(loadAuditLogs, 5000);
    return () => clearInterval(interval);
  }, [loadAuditLogs]);

  const clearLogs = () => {
    saveAuditLogs([]);
    setAuditLogs([]);
  };

  return {
    auditLogs,
    loading,
    clearLogs,
    reloadLogs: loadAuditLogs
  };
};
