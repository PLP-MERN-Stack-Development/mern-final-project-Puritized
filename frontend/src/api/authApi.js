import api from './apiClient';

export const loginRequest = (data) => api.post('/api/auth/login', data);
export const registerRequest = (data) => api.post('/api/auth/register', data);
export const refreshRequest = () => api.get('/api/auth/refresh');
export const fetchMe = () => api.get('/api/auth/me');
export const logoutRequest = () => api.post('/api/auth/logout');