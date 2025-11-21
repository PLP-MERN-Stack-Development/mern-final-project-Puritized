import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://mern-final-project-puritized.onrender.com/routes/bookings';

export const fetchBookings = async () => {
  const { data } = await axios.get(API_URL, { withCredentials: true });
  return data;
};

export const useBookings = () => {
  return useQuery(['bookings'], fetchBookings);
};