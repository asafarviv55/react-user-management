import React, { useState, useEffect } from 'react';
import http from '../http-common';

const UserAuditHistory = ({ userId }) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadAuditHistory();
  }, [userId, filter, dateRange]);

  const loadAuditHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('action', filter);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const response = await http.get(`/users/${userId}/audit?${params.toString()}`);
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Error loading audit history:', error);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    const badges = {
      'created': 'success',
      'updated': 'info',
      'deleted': 'danger',
      'status_change': 'warning',
      'role_assigned': 'primary',
      'role_removed': 'secondary',
      'password_reset': 'warning',
      'login': 'success',
      'logout': 'secondary'
    };
    return badges[action] || 'secondary';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatChanges = (changes) => {
    if (!changes) return null;

    return Object.entries(changes).map(([field, data]) => (
      <div key={field} className="small">
        <strong>{field}:</strong>
        <span className="text-danger ms-1">{data.old || 'null'}</span>
        <i className="fas fa-arrow-right mx-1"></i>
        <span className="text-success">{data.new || 'null'}</span>
      </div>
    ));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Audit History</h5>
      </div>
      <div className="card-body">
        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Filter by Action</label>
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="status_change">Status Change</option>
              <option value="role_assigned">Role Assigned</option>
              <option value="role_removed">Role Removed</option>
              <option value="password_reset">Password Reset</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : auditLogs.length === 0 ? (
          <p className="text-muted">No audit records found</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Performed By</th>
                  <th>Changes</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{formatDate(log.timestamp)}</td>
                    <td>
                      <span className={`badge bg-${getActionBadge(log.action)}`}>
                        {log.action.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {log.performedBy?.name || 'System'}
                      <br />
                      <small className="text-muted">{log.performedBy?.email}</small>
                    </td>
                    <td>
                      {formatChanges(log.changes) || log.description}
                    </td>
                    <td>
                      <small className="font-monospace">{log.ipAddress || 'N/A'}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuditHistory;
