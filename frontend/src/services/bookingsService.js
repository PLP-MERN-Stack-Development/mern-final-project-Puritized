import http from './http';
import { getAccessToken } from './authService';

export const createBooking = (payload) =>
  http.request('/bookings', { method: 'POST', body: payload, token: getAccessToken() });

export const getMyBookings = () =>
  http.request('/bookings/me', { method: 'GET', token: getAccessToken() });