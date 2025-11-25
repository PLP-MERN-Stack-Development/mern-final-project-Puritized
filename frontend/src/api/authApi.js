import api from './apiClient';

export const loginRequest = (data) => api.post('/auth/login', data);
export const registerRequest = (data) => api.post('/auth/register', data);
export const refreshRequest = () => api.get('/auth/refresh');
export const fetchMe = () => api.get('/auth/me');
export const logoutRequest = () => api.post('/auth/logout');