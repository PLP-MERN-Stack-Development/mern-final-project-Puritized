import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE,
  withCredentials: true
});

// attach access token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// on 401, try refresh once
let isRefreshing = false;
let queued = [];

const processQueue = (err, token = null) => {
  queued.forEach((prom) => {
    if (err) prom.reject(err);
    else prom.resolve(token);
  });
  queued = [];
};

// MARK public requests globally
const makePublic = (config = {}) => {
  return { ...config, skipAuthRedirect: true };
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // CHECK if request is public
    const skipRedirect = original?.skipAuthRedirect || original?.headers?.skipAuthRedirect;

    if (err.response?.status === 401 && !original._retry && !skipRedirect) {
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
        const r = await axios.get(`${BASE}/api/auth/refresh`, { withCredentials: true });
        const newToken = r.data.accessToken;
        if (!newToken) throw new Error("No refresh token returned");
        localStorage.setItem('accessToken', newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export { makePublic };
export default api;