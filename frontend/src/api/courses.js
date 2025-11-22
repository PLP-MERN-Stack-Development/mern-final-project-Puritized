import axiosClient from './axiosClient';
import { useQuery } from '@tanstack/react-query';

export const fetchCourses = async () => {
  const { data } = await axiosClient.get('/routes/courses');
  return data;
};

export const useCourses = () => {
  return useQuery(['courses'], fetchCourses);
};