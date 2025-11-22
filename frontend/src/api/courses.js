import axiosClient from './axiosClient';
import { useQuery } from '@tanstack/react-query';

// Fetch all courses
export const fetchCourses = async () => {
  const { data } = await axiosClient.get('/api/courses');
  return data;
};

// Query hook
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};