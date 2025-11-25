import axiosClient from './apiClient';
import { useQuery } from '@tanstack/react-query';

export const fetchMessages = async () => {
  const { data } = await axiosClient.get('/routes/chat');
  return data;
};

export const useMessages = () => {
  return useQuery(['chat'], fetchMessages);
};