import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../config/roles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleQuickSelect = (mockUser) => {
    setEmail(mockUser.email);
    setPassword(mockUser.password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>Log In with APC Account</h2>
        {error && <p className="error-message">{error}</p>}
        
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="username@apc.edu.ph"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit">Log In</button>

        <div className="mock-selector">
          <p>Quick Fill User:</p>
          {MOCK_USERS.map((u) => (
            <button
              type="button"
              key={u.email}
              onClick={() => handleQuickSelect(u)}
              className="quick-btn"
            >
              {u.role}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
