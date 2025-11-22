import http from './http';
import { getAccessToken } from './authService';

/* -------------------------------
   Create a new booking
---------------------------------*/
export const createBooking = (payload) =>
  http.request('/routes/bookings', {
    method: 'POST',
    body: payload,
    token: getAccessToken(),
  });

/* -------------------------------
   Get bookings of logged-in user
---------------------------------*/
export const getMyBookings = () =>
  http.request('/routes/bookings/me', {
    method: 'GET',
    token: getAccessToken(),
  });