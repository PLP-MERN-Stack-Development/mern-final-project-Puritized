import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true
});

/* ============================
    REQUEST INTERCEPTOR
============================ */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  //  ONLY attach token if request is NOT public
  if (token && !config?.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ============================
    TOKEN REFRESH LOGIC
============================ */
let isRefreshing = false;
let queued = [];

const processQueue = (err, token = null) => {
  queued.forEach(({ resolve, reject }) => {
    if (err) reject(err);
    else resolve(token);
  });
  queued = [];
};

/* ============================
    RESPONSE INTERCEPTOR
============================ */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};

    //  Skip refresh logic for public routes
    if (original?.skipAuth) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queued.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const r = await axios.get(`${BASE}/api/auth/refresh`, {
          withCredentials: true
        });

        const newToken = r.data.accessToken;
        if (!newToken) throw new Error("No refresh token");

        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ============================
    HELPER FOR PUBLIC REQUESTS
============================ */
export const makePublic = (config = {}) => ({
  ...config,
  skipAuth: true
});

export default api;