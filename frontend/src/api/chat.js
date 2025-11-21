import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://mern-final-project-puritized.onrender.com/routes/chat';

export const fetchMessages = async () => {
  const { data } = await axios.get(API_URL, { withCredentials: true });
  return data;
};

export const useMessages = () => {
  return useQuery(['chat'], fetchMessages);
};