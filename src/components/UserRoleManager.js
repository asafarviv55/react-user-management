import React, { useState, useEffect } from 'react';
import RoleService from '../services/RoleService';

const UserRoleManager = ({ userId, currentRoles = [] }) => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [userRoles, setUserRoles] = useState(currentRoles);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAvailableRoles();
  }, []);

  const loadAvailableRoles = async () => {
    try {
      const response = await RoleService.getAllRoles();
      setAvailableRoles(response.data);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const handleAssignRole = async (roleId) => {
    setLoading(true);
    setMessage('');

    try {
      await RoleService.assignRole(userId, roleId);
      setUserRoles([...userRoles, roleId]);
      setMessage('Role assigned successfully');
    } catch (error) {
      setMessage('Error assigning role: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleId) => {
    setLoading(true);
    setMessage('');

    try {
      await RoleService.removeRole(userId, roleId);
      setUserRoles(userRoles.filter(id => id !== roleId));
      setMessage('Role removed successfully');
    } catch (error) {
      setMessage('Error removing role: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roleId) => {
    return userRoles.includes(roleId);
  };

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h5>Role Management</h5>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <div className="roles-list">
          {availableRoles.map(role => (
            <div key={role.id} className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                id={`role-${role.id}`}
                checked={hasRole(role.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleAssignRole(role.id);
                  } else {
                    handleRemoveRole(role.id);
                  }
                }}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor={`role-${role.id}`}>
                <strong>{role.name}</strong>
                {role.description && <span className="text-muted"> - {role.description}</span>}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRoleManager;
