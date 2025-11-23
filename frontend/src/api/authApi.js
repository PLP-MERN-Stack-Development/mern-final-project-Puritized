import axiosClient from "./axiosClient";

/** Login user */
export const login = (data) =>
  axiosClient.post("/routes/auth/login", data, { withCredentials: true });

/** Register new user */
export const registerUser = (data) =>
  axiosClient.post("/routes/auth/register", data, { withCredentials: true });

/** Refresh JWT token or session */
export const refreshToken = () =>
  axiosClient.get("/routes/auth/refresh", { withCredentials: true });

/** Fetch currently logged-in user */
export const fetchCurrentUser = () =>
  axiosClient.get("/routes/auth/me", { withCredentials: true });