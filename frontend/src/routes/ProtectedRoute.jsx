import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ roles = [], children }) => {
  const { user } = useAuth(); // get logged-in user from context

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not authorized
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />; // redirect to home if role mismatch
  }

  return children; // authorized
};

export default ProtectedRoute;