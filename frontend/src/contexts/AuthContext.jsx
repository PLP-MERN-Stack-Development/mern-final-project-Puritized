import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { saveUser, loadUser, clearUser } from '../services/storage.js'; // adjust path

const AuthContext = createContext();

// Use VITE_BACKEND_URL or fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://mern-final-project-puritized.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser()); // load persisted user
  const [loading, setLoading] = useState(!user); // only loading if no persisted user

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          // UPDATED: correct backend route
          const res = await axios.get(`${BACKEND_URL}/routes/auth/me`, {
            withCredentials: true,
          });

          const fetchedUser = res?.data?.user || null;
          setUser(fetchedUser);
          if (fetchedUser) saveUser(fetchedUser);

        } catch (err) {
          setUser(null);
          clearUser();
          console.error('Fetch current user failed:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setLoading(false); // user already loaded from localStorage
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    saveUser(userData);
  };

  const logout = async () => {
    try {
      // UPDATED: correct backend route
      await axios.post(`${BACKEND_URL}/routes/auth/logout`, {}, {
        withCredentials: true
      });

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