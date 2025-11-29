import api, { makePublic } from './apiClient';

// ✅ Public course endpoints skip auth
export const getCourses = () => api.get('/api/courses', makePublic());
export const getCourse = (id) => api.get(`/api/courses/${id}`, makePublic());

// ✅ Course creation requires authentication
export const createCourse = (payload) => api.post('/api/courses', payload);