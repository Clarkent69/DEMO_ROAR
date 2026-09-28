import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated || location.pathname === '/auth') return null;

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">Rams Open Access Repository</Link>
      </div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/browse">Browse Research</Link>
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
        <span className="nav-role-pill">{user.role}</span>
        <button onClick={handleLogout} className="nav-logout-btn">Sign Out</button>
      </div>
    </nav>
  );
}
