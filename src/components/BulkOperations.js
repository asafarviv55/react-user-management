import React, { useState } from 'react';
import UserService from '../services/UserService';
import ExportService from '../services/ExportService';

const BulkOperations = ({ selectedUsers, onOperationComplete, onClearSelection }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const promises = selectedUsers.map(userId => UserService.remove(userId));
      await Promise.all(promises);
      setMessage(`Successfully deleted ${selectedUsers.length} users`);
      if (onOperationComplete) onOperationComplete();
      if (onClearSelection) onClearSelection();
    } catch (error) {
      setMessage('Error during bulk delete: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (!window.confirm(`Change status of ${selectedUsers.length} users to ${status}?`)) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const promises = selectedUsers.map(userId =>
        UserService.update(userId, { status })
      );
      await Promise.all(promises);
      setMessage(`Successfully updated ${selectedUsers.length} users to ${status}`);
      if (onOperationComplete) onOperationComplete();
    } catch (error) {
      setMessage('Error during bulk status change: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    setLoading(true);
    setMessage('');

    try {
      // Get full user data for selected users
      const promises = selectedUsers.map(userId => UserService.get(userId));
      const responses = await Promise.all(promises);
      const users = responses.map(response => response.data);

      if (format === 'csv') {
        ExportService.exportToCSV(users);
      } else if (format === 'json') {
        ExportService.exportToJSON(users);
      }

      setMessage(`Successfully exported ${users.length} users to ${format.toUpperCase()}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error during export: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <div className="card bg-light mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>{selectedUsers.length}</strong> user{selectedUsers.length !== 1 ? 's' : ''} selected
          </div>

          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowMenu(!showMenu)}
              disabled={loading}
            >
              <i className="fas fa-tasks me-2"></i>
              Bulk Actions
            </button>

            {showMenu && (
              <div className="dropdown-menu show position-absolute" style={{ right: 0 }}>
                <h6 className="dropdown-header">Status Changes</h6>
                <button
                  className="dropdown-item"
                  onClick={() => handleBulkStatusChange('active')}
                  disabled={loading}
                >
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Activate
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleBulkStatusChange('inactive')}
                  disabled={loading}
                >
                  <i className="fas fa-ban text-warning me-2"></i>
                  Deactivate
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleBulkStatusChange('suspended')}
                  disabled={loading}
                >
                  <i className="fas fa-pause-circle text-danger me-2"></i>
                  Suspend
                </button>

                <div className="dropdown-divider"></div>
                <h6 className="dropdown-header">Export</h6>
                <button
                  className="dropdown-item"
                  onClick={() => handleExport('csv')}
                  disabled={loading}
                >
                  <i className="fas fa-file-csv me-2"></i>
                  Export to CSV
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleExport('json')}
                  disabled={loading}
                >
                  <i className="fas fa-file-code me-2"></i>
                  Export to JSON
                </button>

                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleBulkDelete}
                  disabled={loading}
                >
                  <i className="fas fa-trash me-2"></i>
                  Delete Selected
                </button>
              </div>
            )}

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onClearSelection}
              disabled={loading}
            >
              <i className="fas fa-times"></i> Clear
            </button>
          </div>
        </div>

        {message && (
          <div className={`alert mt-2 mb-0 ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {loading && (
          <div className="mt-2">
            <div className="progress">
              <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkOperations;
