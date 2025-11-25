import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import ErrorBoundary from "./components/ErrorBoundary";
import AddUser from "./components/AddUser.js";
import User from "./components/User";
import UsersList from "./components/UsersList";

function App() {
  return (
    <ErrorBoundary>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="container">
            <span className="navbar-brand">User Management</span>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/users"} className="nav-link">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">
                  Add User
                </Link>
              </li>
            </div>
          </div>
        </nav>
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/list" element={<Navigate to="/users" replace />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/add" element={<AddUser />} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
