import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../config/roles';

import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import ResearchDetail from '../pages/ResearchDetail';
import SubmitResearch from '../pages/SubmitResearch';
import ManageMaterials from '../pages/ManageMaterials';
import SetRepresentatives from '../pages/SetRepresentatives';
import Analytics from '../pages/Analytics';
import Unauthorized from '../components/Unauthorized';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Navigate replace to="/auth" />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Accessible to all authenticated roles */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.FACULTY_REP, ROLES.LIBRARIAN, ROLES.EXECUTIVE_DIRECTOR]} />}>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<Home />} />
        <Route path="/research/:id" element={<ResearchDetail />} />
      </Route>

      {/* Faculty Representative Only: Submission Form */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.FACULTY_REP]} />}>
        <Route path="/submit" element={<SubmitResearch />} />
      </Route>

      {/* Librarian Only: Archive Controls */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.LIBRARIAN]} />}>
        <Route path="/manage-materials" element={<ManageMaterials />} />
      </Route>

      {/* Executive Director Only: Manage Representatives */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.EXECUTIVE_DIRECTOR]} />}>
        <Route path="/set-representatives" element={<SetRepresentatives />} />
      </Route>

      {/* Analytics: Faculty Rep, Librarian, Executive Director — Students get 403 */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.FACULTY_REP, ROLES.LIBRARIAN, ROLES.EXECUTIVE_DIRECTOR]} />}>
        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}
