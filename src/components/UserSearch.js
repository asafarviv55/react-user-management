import React from 'react';

const UserSearch = ({ searchTerm, onSearchChange, filters, onFilterChange, onReset }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Search Users</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Name, email, or phone..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => onSearchChange('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-md-2">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={filters.role}
              onChange={(e) => onFilterChange('role', e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Sort By</label>
            <select
              className="form-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="createdAt">Created Date</option>
              <option value="lastLogin">Last Login</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Order</label>
            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={filters.sortOrder}
                onChange={(e) => onFilterChange('sortOrder', e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <button
                className="btn btn-outline-secondary"
                onClick={onReset}
                title="Reset Filters"
              >
                <i className="fas fa-redo"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
