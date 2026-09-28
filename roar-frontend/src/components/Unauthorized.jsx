import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">

        <div className="unauthorized-icon">🚫</div>

        <div className="unauthorized-badge">403</div>

        <h1 className="unauthorized-title">Unauthorized Access</h1>

        <p className="unauthorized-message">
          Your institutional role does not have permission to access this section.
        </p>

        {user && (
          <div className="unauthorized-role-info">
            <span className="unauthorized-label">Signed in as:</span>
            <span className="unauthorized-email">{user.email}</span>
            <span className="unauthorized-role-pill">{user.role}</span>
          </div>
        )}

        <p className="unauthorized-hint">
          If you believe this is an error, contact your system administrator.
        </p>

        <div className="unauthorized-actions">
          <button
            className="unauthorized-home-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Go to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
