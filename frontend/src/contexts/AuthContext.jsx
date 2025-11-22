import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Backend base URL (from environment variable or fallback)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://mern-final-project-puritized.onrender.com';

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/routes/auth/me`, {
          withCredentials: true,
        });
        setUser(res?.data?.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/routes/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);