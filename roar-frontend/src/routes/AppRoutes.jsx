import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../config/roles';

import Login from '../pages/Login';
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
      <Route path="/login" element={<Login/>} />
      <Route path="/unauthorized" element={<Unauthorized/>} />

      {/* Accessible to all verified accounts */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.FACULTY_REP, ROLES.LIBRARIAN, ROLES.EXECUTIVE_DIRECTOR]}/>}>
        <Route path="/" element={<Home/>} />
        <Route path="/research/:id" element={<ResearchDetail/>} />
      </Route>

      {/* Faculty Representative Only: Submission and AI Extraction Form */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.FACULTY_REP]}/>}>
        <Route path="/submit" element={<SubmitResearch/>} />
      </Route>

      {/* Librarian Only: Call Number Assignment & Archive Controls */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.LIBRARIAN]}/>}>
        <Route path="/manage-materials" element={<ManageMaterials/>} />
      </Route>

      {/* Executive Director Only: Add/Remove Representatives */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.EXECUTIVE_DIRECTOR]}/>}>
        <Route path="/set-representatives" element={<SetRepresentatives/>} />
      </Route>

      {/* Analytics Dashboard: Faculty Rep, Librarian, and Executive Director */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.FACULTY_REP, ROLES.LIBRARIAN, ROLES.EXECUTIVE_DIRECTOR]}/>}>
        <Route path="/analytics" element={<Analytics/>} />
      </Route>
    </Routes>
  );
}
