import http from './http';
import { getAccessToken, refreshAccessToken } from './authService';

/* --------------------------------------
   Helper: auto-refresh token on 401
----------------------------------------*/
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

/* --------------------------------------
   Payments API
----------------------------------------*/

// Initiate a payment
export const initiatePayment = (payload) =>
  withAuth((token) =>
    http.request('/routes/payments/init', { method: 'POST', body: payload, token })
  );

// Check payment status
export const getPaymentStatus = (id) =>
  withAuth((token) =>
    http.request(`/routes/payments/${id}/status`, { method: 'GET', token })
  );