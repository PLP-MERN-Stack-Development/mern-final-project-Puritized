import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, loginRequest, logoutRequest } from '../api/authApi';
import api, { makePublic } from '../api/apiClient';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);       // still loading data
  const [initialized, setInitialized] = useState(false); // auth init complete

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;

        // Fetch current user as public request
        const res = await api.get('/api/auth/me', makePublic());
        if (mounted) setUser(res.data.user);
      } catch (err) {
        setUser(null); // unauthenticated users won't be redirected
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };
    init();
    return () => (mounted = false);
  }, []);

  const login = async (email, password) => {
    const res = await loginRequest({ email, password });
    const { accessToken, user } = res.data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.error('logout error', e);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      delete api.defaults.headers.common.Authorization;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, initialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}