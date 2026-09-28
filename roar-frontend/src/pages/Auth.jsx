import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, ROLES } from '../config/roles';

export default function Auth() {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setStatus({ type: '', message: '' });
  };

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    resetForm();
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
    const result = await register(cleanEmail, password, ROLES.STUDENT);
    setLoading(false);
    if (result.success) {
      if (result.message) {
        setStatus({ type: 'success', message: result.message });
        setTab('login');
        setPassword('');
      } else {
        navigate('/dashboard');
      }
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
