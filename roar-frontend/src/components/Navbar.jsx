import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">ROAR</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>

        {user.role === ROLES.FACULTY_REP && (
          <Link to="/submit">Submit Research</Link>
        )}

        {user.role === ROLES.LIBRARIAN && (
          <Link to="/manage-materials">Manage Materials</Link>
        )}

        {user.role === ROLES.EXECUTIVE_DIRECTOR && (
          <Link to="/set-representatives">Set Representatives</Link>
        )}

        {[ROLES.FACULTY_REP, ROLES.LIBRARIAN, ROLES.EXECUTIVE_DIRECTOR].includes(user.role) && (
          <Link to="/analytics">Analytics</Link>
        )}
      </div>
      <div className="nav-profile">
        <span>{user.name} ({user.role})</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
}
