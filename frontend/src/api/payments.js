import axiosClient from './axiosClient';
import { useQuery } from '@tanstack/react-query';

export const fetchPayments = async () => {
  const { data } = await axiosClient.get('/routes/payments');
  return data;
};

export const usePayments = () => {
  return useQuery(['payments'], fetchPayments);
};