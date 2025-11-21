import axiosClient from "./axiosClient";

export const getCourses = () =>
  axiosClient.get("/routes/courses");

export const getCourseDetails = (id) =>
  axiosClient.get(`/routes/courses/${id}`);