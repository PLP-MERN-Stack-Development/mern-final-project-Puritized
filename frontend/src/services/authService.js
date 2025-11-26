import http from './http';

let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;

/* -------------------------------
   Login
---------------------------------*/
export const login = async (email, password) => {
  const data = await http.request('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  });
  accessToken = data.accessToken || data.token; // save token
  return data;
};

/* -------------------------------
   Refresh access token using cookie
   (backend endpoint should return new accessToken)
---------------------------------*/
export const refreshAccessToken = async () => {
  const data = await http.request('/api/auth/refresh', {
    method: 'GET',
    token: null // use cookie for refresh
  });
  accessToken = data.accessToken;
  return data;
};