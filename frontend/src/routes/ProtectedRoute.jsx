import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ roles = [], children }) => {
  const { user, loading, initialized } = useAuth();

  // Wait until auth state is fully initialized
  if (loading || !initialized) return <div>Loading...</div>;

  // Only redirect to login if route requires roles
  if (roles.length && !user) return <Navigate to="/login" replace />;

  // Redirect to home if user exists but role is not allowed
  if (user && roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;