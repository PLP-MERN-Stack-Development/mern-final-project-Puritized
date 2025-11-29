// src/api/adminApi.js
import api from "./apiClient";

// =======================
// ✅ USERS
// =======================

export const fetchUsers = (page = 1, limit = 20) =>
  api.get("/api/admin/users", { params: { page, limit } });

export const updateUserRole = (userId, role) =>
  api.patch(`/api/admin/users/${userId}/role`, { role });

export const deleteUser = (userId) =>
  api.delete(`/api/admin/users/${userId}`);

// =======================
// ✅ COURSES
// =======================

// src/api/adminApi.js
export const fetchCoursesAdmin = (page = 1, limit = 20, q = "") =>
  api.get("/api/admin/courses", { params: { page, limit, q, t: Date.now() } });

export const publishCourse = (courseId) =>
  api.post(`/api/admin/courses/${courseId}/publish`);

export const unpublishCourse = (courseId) =>
  api.post(`/api/admin/courses/${courseId}/unpublish`);

export const deleteCourseAdmin = (courseId) =>
  api.delete(`/api/admin/courses/${courseId}`);

// =======================
// ✅ PAYMENTS
// =======================

export const fetchPaymentsAdmin = (page = 1, limit = 20) =>
  api.get("/api/admin/payments", { params: { page, limit } });

export const markRefunded = (paymentId) =>
  api.post(`/api/admin/payments/${paymentId}/refund`);