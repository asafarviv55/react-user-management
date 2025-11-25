import React, { useState } from 'react';
import http from '../http-common';

const PasswordReset = ({ userId, email }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendResetLink = async () => {
    setLoading(true);
    setMessage('');

    try {
      await http.post('/users/password-reset/request', {
        userId,
        email
      });
      setMessage('Password reset link sent to email');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Error sending reset link: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await http.post('/users/password-reset/direct', {
        userId,
        newPassword
      });
      setMessage('Password reset successfully');
      setShowModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage('Error resetting password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Password Management</h5>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={handleSendResetLink}
            disabled={loading}
          >
            <i className="fas fa-envelope me-2"></i>
            Send Reset Link
          </button>

          <button
            className="btn btn-warning"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <i className="fas fa-key me-2"></i>
            Direct Reset
          </button>
        </div>

        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reset Password</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="alert alert-info small">
                    <i className="fas fa-info-circle me-2"></i>
                    Password must be at least 8 characters long
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleDirectReset}
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
