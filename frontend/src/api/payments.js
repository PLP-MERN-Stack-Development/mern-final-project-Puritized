import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://mern-final-project-puritized.onrender.com/routes/payments';

export const fetchPayments = async () => {
  const { data } = await axios.get(API_URL, { withCredentials: true });
  return data;
};

export const usePayments = () => {
  return useQuery(['payments'], fetchPayments);
};