import api from './apiClient';

export const getCourses = () => api.get('/api/courses');
export const getCourse = (id) => api.get(`/api/courses/${id}`);
export const createCourse = (payload) => api.post('/api/courses', payload);