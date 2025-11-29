import api, { makePublic } from './apiClient';

// ✅ Public endpoints should skip auth
export const loginRequest = (data) =>
  api.post('/api/auth/login', data, makePublic());

export const registerRequest = (data) =>
  api.post('/api/auth/register', data, makePublic());

// ✅ Refresh and fetchMe are protected routes, do NOT skip auth
export const refreshRequest = () => api.get('/api/auth/refresh');
export const fetchMe = () => api.get('/api/auth/me');

// ✅ Logout uses token
export const logoutRequest = () => api.post('/api/auth/logout');