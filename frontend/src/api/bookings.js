import axiosClient from './axiosClient';
import { useQuery } from '@tanstack/react-query';

export const fetchBookings = async () => {
  const { data } = await axiosClient.get('/routes/bookings');
  return data;
};

export const useBookings = () => {
  return useQuery(['bookings'], fetchBookings);
};