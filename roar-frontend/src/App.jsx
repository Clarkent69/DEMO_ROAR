import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar/>
        <AppRoutes/>
      </AuthProvider>
    </Router>
  );
}
