import axiosClient from './axiosClient';
import { useQuery } from '@tanstack/react-query';

export const fetchLessons = async () => {
  const { data } = await axiosClient.get('/routes/lessons');
  return data;
};

export const useLessons = () => {
  return useQuery(['lessons'], fetchLessons);
};