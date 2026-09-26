import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="page-container">
      <h2>403 - Access Denied</h2>
      <p>Your institutional role does not have authorization to view this section.</p>
      <Link to="/">Return to Safety (Home)</Link>
    </div>
  );
}
