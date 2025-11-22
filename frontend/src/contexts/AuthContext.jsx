import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { saveUser, loadUser, clearUser } from '../services/storage.js'; // adjust path

const AuthContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://mern-final-project-puritized.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser()); // load from localStorage
  const [loading, setLoading] = useState(!user); // only loading if no persisted user

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/routes/auth/me`, { withCredentials: true });
          setUser(res?.data?.user || null);
          if (res?.data?.user) saveUser(res.data.user);
        } catch (err) {
          setUser(null);
          clearUser();
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    saveUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/routes/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      clearUser();
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