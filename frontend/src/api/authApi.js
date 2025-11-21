import axiosClient from "./axiosClient";

export const login = (data) =>
  axiosClient.post("/routes/auth/login", data);

export const registerUser = (data) =>
  axiosClient.post("/routes/auth/register", data);

export const refreshToken = () =>
  axiosClient.get("/routes/auth/refresh");