import http from './http';
import { getAccessToken, refreshAccessToken } from './authService';

// simple wrapper to auto-refresh on 401
async function withAuth(requestFn) {
  try {
    return await requestFn(getAccessToken());
  } catch (err) {
    if (err.code === 401) {
      await refreshAccessToken();
      return await requestFn(getAccessToken());
    }
    throw err;
  }
}

export const initiatePayment = (payload) => withAuth((token) =>
  http.request('/payments/init', { method: 'POST', body: payload, token })
);

export const getPaymentStatus = (id) => withAuth((token) =>
  http.request(`/payments/${id}/status`, { method: 'GET', token })
);