import axiosClient from "./axiosClient";

export const login = (data) =>
  axiosClient.post("/routes/auth/login", data, { withCredentials: true });

export const registerUser = (data) =>
  axiosClient.post("/routes/auth/register", data, { withCredentials: true });

export const refreshToken = () =>
  axiosClient.get("/routes/auth/refresh", { withCredentials: true });