import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';

function ActionCard({ icon, title, description, badge, onClick }) {
  return (
    <div
      className="dashboard-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      <div className="card-icon-row">
        <div className="card-icon">{icon}</div>
        {badge && <span className="card-badge">{badge}</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
      </div>
      <span className="card-link">View details →</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      {/* ── Identity strip (read-only — Sign Out is in Navbar) ── */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="dashboard-brand">📚 ROAR</span>
          <div className="dashboard-identity">
            <span className="dashboard-email">{user?.email}</span>
            <span className="dashboard-role-pill">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* ── Welcome ── */}
      <div className="dashboard-welcome">
        <h2>Welcome back, <strong>{user?.name || user?.email?.split('@')[0]}</strong></h2>
        <p>Your institutional portal — access tools available to your role.</p>
      </div>

      {/* ── Action Cards ── */}
      <div className="dashboard-grid">

        {/* All roles */}
        <ActionCard
          icon="🔍"
          title="Browse & View Research"
          description="Search, filter, and discover institutional research outputs from all departments."
          badge="All Roles"
          onClick={() => navigate('/browse')}
        />

        {/* Faculty Representative */}
        {user?.role === ROLES.FACULTY_REP && (
          <ActionCard
            icon="📤"
            title="Submit Research Material"
            description="Upload and submit your department's research outputs for cataloging and archiving."
            badge="Faculty Rep"
            onClick={() => navigate('/submit')}
          />
        )}

        {/* Librarian */}
        {user?.role === ROLES.LIBRARIAN && (
          <ActionCard
            icon="🗂️"
            title="Catalog & Archive Documents"
            description="Assign call numbers, classify materials, and manage the institutional archive."
            badge="Librarian"
            onClick={() => navigate('/manage-materials')}
          />
        )}

        {/* Executive Director */}
        {user?.role === ROLES.EXECUTIVE_DIRECTOR && (
          <ActionCard
            icon="👥"
            title="Manage Representatives"
            description="Add or remove Faculty Representatives for departments across the institution."
            badge="Exec Director"
            onClick={() => navigate('/set-representatives')}
          />
        )}

        {/* Analytics — staff only */}
        {[ROLES.FACULTY_REP, ROLES.LIBRARIAN, ROLES.EXECUTIVE_DIRECTOR].includes(user?.role) && (
          <ActionCard
            icon="📊"
            title="Analytics & Reports"
            description="View usage statistics, submission trends, and generate analytical reports."
            badge="Staff Only"
            onClick={() => navigate('/analytics')}
          />
        )}

      </div>

      {user?.role === ROLES.STUDENT && (
        <div className="dashboard-student-notice">
          <span>ℹ️</span>
          <p>
            As a <strong>Student / APC User</strong>, you have read-only access to the research catalog.
          </p>
        </div>
      )}

    </div>
  );
}
