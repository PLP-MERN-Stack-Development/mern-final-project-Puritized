import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0"
  }
});

// ✅ Attach access token + FORCE disable 304 cache
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Critical fix: stop browser/Cloudflare 304 caching
  config.headers["If-None-Match"] = "";

  return config;
});

// ✅ Queue for handling token refresh
let isRefreshing = false;
let queued = [];

const processQueue = (err, token = null) => {
  queued.forEach(({ resolve, reject }) => {
    if (err) reject(err);
    else resolve(token);
  });
  queued = [];
};

// ✅ MARK public requests globally
const makePublic = (config = {}) => ({ ...config, skipAuthRedirect: true });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const skipRedirect =
      original?.skipAuthRedirect || original?.headers?.skipAuthRedirect;

    // ✅ Handle token expiration safely
    if (error.response?.status === 401 && !original._retry && !skipRedirect) {
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

        if (!newToken) throw new Error("No refresh token returned");

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

export { makePublic };
export default api;