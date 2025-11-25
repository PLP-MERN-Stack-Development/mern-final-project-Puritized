import api from "./apiClient";

export const startCoursePayment = async (courseId) => {
  const res = await api.post("/payments/checkout", { courseId });
  return res.data.url; // redirect URL
};