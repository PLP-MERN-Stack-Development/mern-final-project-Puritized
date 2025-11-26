import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ roles = [], children }) => {
  const { user, loading } = useAuth();

  // Wait until auth state is resolved
  if (loading) return <div>Loading...</div>;

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // User role mismatch → redirect to home
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;