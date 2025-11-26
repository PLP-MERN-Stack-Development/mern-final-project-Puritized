import api from './apiClient';

export const loginRequest = (data) => api.post('/routes/auth/login', data);
export const registerRequest = (data) => api.post('/routes/auth/register', data);
export const refreshRequest = () => api.get('/routes/auth/refresh');
export const fetchMe = () => api.get('/routes/auth/me');
export const logoutRequest = () => api.post('/routes/auth/logout');