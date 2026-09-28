import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, ROLES } from '../config/roles';

const ROLE_OPTIONS = [
  { label: 'Student / APC User', value: ROLES.STUDENT },
  { label: 'Faculty Representative', value: ROLES.FACULTY_REP },
  { label: 'Librarian', value: ROLES.LIBRARIAN },
  { label: 'Executive Director', value: ROLES.EXECUTIVE_DIRECTOR },
];

export default function Auth() {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.STUDENT);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { login, loginWithMicrosoft, register } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setRole(ROLES.STUDENT);
    setStatus({ type: '', message: '' });
  };

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    resetForm();
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    const result = await loginWithMicrosoft();
    if (!result?.success) {
      setLoading(false);
      setStatus({
        type: 'error',
        message: result?.message || 'Failed to authenticate with Microsoft Azure.',
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@apc.edu.ph')) {
      setStatus({
        type: 'error',
        message: 'Institutional access required: Please enter an official @apc.edu.ph email address.',
      });
      return;
    }
    setLoading(true);
    setStatus({ type: '', message: '' });
    const result = await login(cleanEmail, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@apc.edu.ph')) {
      setStatus({
        type: 'error',
        message: 'Registration restricted: Only official institutional emails (@apc.edu.ph) are permitted.',
      });
      return;
    }
    setLoading(true);
    setStatus({ type: '', message: '' });
    const result = await register(cleanEmail, password, role);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  const handleQuickFill = (mockUser) => {
    setEmail(mockUser.email);
    setPassword(mockUser.password);
    setStatus({ type: '', message: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* ── Brand ── */}
        <div className="auth-brand">
          <span className="auth-brand-logo">📚</span>
          <h1 className="auth-brand-title">Rams Open Access Repository</h1>
          <p className="auth-brand-sub">Research Output & Archive Repository</p>
        </div>

        {/* ── Tab Toggle ── */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('signup')}
            type="button"
          >
            Register
          </button>
        </div>

        {/* ── Status Banner ── */}
        {status.message && (
          <div className={`auth-status ${status.type}`}>
            {status.type === 'error' ? '⚠️' : '✅'} {status.message}
          </div>
        )}

        {/* ── Login Form ── */}
        {tab === 'login' && (
          <div className="auth-tab-content">
            <button
              type="button"
              onClick={handleMicrosoftLogin}
              className="microsoft-login-btn"
              disabled={loading}
              id="microsoft-login-btn"
            >
              <svg className="microsoft-icon" width="20" height="20" viewBox="0 0 21 21" aria-hidden="true">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
              <span>Sign in with Microsoft</span>
            </button>

            <div className="auth-divider">
              <span>or sign in with email</span>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@apc.edu.ph"
                required
                autoComplete="email"
              />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
              />

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              {/* Quick-fill panel for demo */}
              <div className="auth-quick-fill">
                <p>⚡ Demo Quick-Fill</p>
                <div className="auth-quick-btns">
                  {MOCK_USERS.map((u) => (
                    <button
                      type="button"
                      key={u.email}
                      onClick={() => handleQuickFill(u)}
                      className="quick-btn"
                      title={u.email}
                    >
                      {u.role}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── Sign Up Form ── */}
        {tab === 'signup' && (
          <div className="auth-tab-content">
            <button
              type="button"
              onClick={handleMicrosoftLogin}
              className="microsoft-login-btn"
              disabled={loading}
              id="microsoft-signup-btn"
            >
              <svg className="microsoft-icon" width="20" height="20" viewBox="0 0 21 21" aria-hidden="true">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
              <span>Continue with Microsoft</span>
            </button>

            <div className="auth-divider">
              <span>or register manually</span>
            </div>

            <form onSubmit={handleSignUp} className="auth-form">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@apc.edu.ph"
                required
                autoComplete="email"
              />

              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />

              <label htmlFor="signup-role">Institutional Role</label>
              <select
                id="signup-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="auth-role-select"
                required
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <p className="auth-role-hint">
                🔒 Demo mode: role is written directly to your session.
              </p>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
