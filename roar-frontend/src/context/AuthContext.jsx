import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS } from '../config/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('roar_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const matchedUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (matchedUser) {
      const sessionUser = {
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role
      };
      setUser(sessionUser);
      localStorage.setItem('roar_user', JSON.stringify(sessionUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid institutional credentials.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('roar_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
