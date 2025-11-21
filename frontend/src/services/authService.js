import http from './http';

let accessToken = null;

export const setAccessToken = (t) => { accessToken = t; };
export const getAccessToken = () => accessToken;

// login
export const login = async (email, password) => {
  const data = await http.request('/auth/login', { method: 'POST', body: { email, password } });
  accessToken = data.accessToken || data.token;
  return data;
};

// refresh token using cookie: endpoint returns new accessToken
export const refreshAccessToken = async () => {
  const data = await http.request('/auth/refresh', { method: 'POST', token: null });
  accessToken = data.accessToken;
  return data;
};