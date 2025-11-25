import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDataService from "../services/UserService";

const AddUser = () => {
  const navigate = useNavigate();
  const initialUserState = {
    email: "",
    birthDate: "",
    phoneNumber: ""
  };

  const [user, setUser] = useState(initialUserState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!user.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }

    // Birth date validation
    if (!user.birthDate) {
      newErrors.birthDate = "Birth date is required";
    } else {
      const birthDate = new Date(user.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.birthDate = "User must be at least 18 years old";
      }
      if (birthDate > today) {
        newErrors.birthDate = "Birth date cannot be in the future";
      }
    }

    // Phone validation
    if (user.phoneNumber && !/^[\d\s\-+()]{10,}$/.test(user.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const saveUser = (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    UserDataService.create(user)
      .then((response) => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch((error) => {
        setServerError(error.response?.data?.message || "Failed to create user");
        setLoading(false);
      });
  };

  const newUser = () => {
    setUser(initialUserState);
    setErrors({});
    setSubmitted(false);
    setServerError(null);
  };

  if (submitted) {
    return (
      <div className="text-center mt-5">
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">User created successfully!</h4>
          <p>The new user has been added to the system.</p>
        </div>
        <button className="btn btn-primary me-2" onClick={newUser}>
          Add Another User
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/users")}>
          View All Users
        </button>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h4>Add New User</h4>
          </div>
          <div className="card-body">
            {serverError && (
              <div className="alert alert-danger" role="alert">
                {serverError}
              </div>
            )}

            <form onSubmit={saveUser}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="birthDate" className="form-label">
                  Birth Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.birthDate ? "is-invalid" : ""}`}
                  id="birthDate"
                  name="birthDate"
                  value={user.birthDate}
                  onChange={handleInputChange}
                />
                {errors.birthDate && (
                  <div className="invalid-feedback">{errors.birthDate}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                  id="phoneNumber"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                />
                {errors.phoneNumber && (
                  <div className="invalid-feedback">{errors.phoneNumber}</div>
                )}
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/users")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
