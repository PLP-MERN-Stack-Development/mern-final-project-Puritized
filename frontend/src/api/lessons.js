import axiosClient from './axiosClient';
import { useQuery } from '@tanstack/react-query';

// Fetch lessons by course
export const fetchLessons = async (courseId) => {
  const { data } = await axiosClient.get(`/api/lessons/${courseId}`);
  return data;
};

// Query hook
export const useLessons = (courseId) => {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => fetchLessons(courseId),
    enabled: !!courseId, // Don't run until courseId is available
    staleTime: 5 * 60 * 1000,
  });
};