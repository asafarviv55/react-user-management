import React, { useState, useEffect } from 'react';
import ActivityLogService from '../services/ActivityLogService';

const UserActivityLog = ({ userId, limit = 20 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActivities();
  }, [userId]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const response = await ActivityLogService.getUserActivities(userId, limit);
      setActivities(response.data);
    } catch (err) {
      setError('Failed to load activity log');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      'login': 'fa-sign-in-alt',
      'logout': 'fa-sign-out-alt',
      'create': 'fa-plus-circle',
      'update': 'fa-edit',
      'delete': 'fa-trash',
      'view': 'fa-eye',
      'download': 'fa-download',
      'upload': 'fa-upload'
    };
    return icons[type] || 'fa-circle';
  };

  const getActivityColor = (type) => {
    const colors = {
      'login': 'success',
      'logout': 'secondary',
      'create': 'primary',
      'update': 'info',
      'delete': 'danger',
      'view': 'dark',
      'download': 'warning',
      'upload': 'warning'
    };
    return colors[type] || 'secondary';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">{error}</div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Activity Log</h5>
        <button className="btn btn-sm btn-outline-primary" onClick={loadActivities}>
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
      <div className="card-body">
        {activities.length === 0 ? (
          <p className="text-muted">No activities recorded yet.</p>
        ) : (
          <div className="timeline">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item mb-3 pb-3 border-bottom">
                <div className="d-flex">
                  <div className={`activity-icon text-${getActivityColor(activity.type)} me-3`}>
                    <i className={`fas ${getActivityIcon(activity.type)}`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <strong>{activity.action}</strong>
                      <small className="text-muted">{formatTimestamp(activity.timestamp)}</small>
                    </div>
                    {activity.description && (
                      <p className="mb-1 text-muted small">{activity.description}</p>
                    )}
                    {activity.metadata && (
                      <div className="small text-secondary">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <span key={key} className="me-2">
                            <strong>{key}:</strong> {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityLog;
