import axiosClient from './axiosClient';
import { useQuery } from '@tanstack/react-query';

// Fetch courses from backend
export const fetchCourses = async () => {
  const { data } = await axiosClient.get('/routes/courses');
  return data;
};

// Custom hook for courses
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // optional: cache for 5 minutes
    refetchOnWindowFocus: false, // optional: prevent automatic refetch
  });
};