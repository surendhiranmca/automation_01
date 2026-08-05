import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import DashboardCard from '../components/DashboardCard';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { formatDate } from '../utils/dateUtils';
import './AuditLogs.css';

const AuditLogs = () => {
  const { auditLogs, clearLogs } = useAuditLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (roleFilter !== 'All' && log.userRole?.toLowerCase() !== roleFilter.toLowerCase()) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const userMatch = log.username?.toLowerCase().includes(q);
        const actionMatch = log.action?.toLowerCase().includes(q);
        const detailMatch = log.details?.toLowerCase().includes(q);
        return userMatch || actionMatch || detailMatch;
      }

      return true;
    });
  }, [auditLogs, searchQuery, roleFilter]);

  return (
    <div className="audit-logs-page">
      <div className="audit-logs-header">
        <div>
          <h1>🛡️ System Security Audit Logs</h1>
          <p className="audit-logs-subtitle">Track security events, user authentications, payment transactions, and warden decisions</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={clearLogs}>
          🗑️ Clear Audit Logs
        </button>
      </div>

      <div className="audit-stats-grid">
        <DashboardCard title="Total Recorded Events" value={auditLogs.length} icon="🛡️" trend="neutral" />
        <DashboardCard
          title="Admin Actions"
          value={auditLogs.filter(l => l.userRole === 'admin' || l.userRole === 'superadmin').length}
          icon="🛡️"
          trend="info"
        />
        <DashboardCard
          title="Warden Decisions"
          value={auditLogs.filter(l => l.userRole === 'warden').length}
          icon="📝"
          trend="positive"
        />
        <DashboardCard
          title="Security Gate Passes"
          value={auditLogs.filter(l => l.userRole === 'security').length}
          icon="🪪"
          trend="warning"
        />
      </div>

      <div className="audit-controls">
        <div className="search-container">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by username, action name, or event detail..."
          />
        </div>
        <div className="filter-group">
          <label>Role Filter: </label>
          <div className="status-tabs">
            {['All', 'Admin', 'Warden', 'Security', 'Student'].map((r) => (
              <button
                key={r}
                className={`tab-btn ${roleFilter === r ? 'active' : ''}`}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="name-list-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User Role</th>
              <th>Username</th>
              <th>Action Performed</th>
              <th>Activity Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td className="timestamp-cell">
                    {formatDate(log.timestamp.split('T')[0])} {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td>
                    <span className={`role-badge role-${log.userRole?.toLowerCase() || 'system'}`}>
                      {log.userRole?.toUpperCase() || 'SYSTEM'}
                    </span>
                  </td>
                  <td><strong>{log.username}</strong></td>
                  <td><strong>{log.action}</strong></td>
                  <td className="details-cell">{log.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-table-cell">
                  No security audit logs recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
