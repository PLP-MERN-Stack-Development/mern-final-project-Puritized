import React from 'react';
import { QueryClient, QueryClientProvider as RQProvider } from '@tanstack/react-query';

// Create a single client
const queryClient = new QueryClient();

export const QueryClientProvider = ({ children }) => {
  return (
    <RQProvider client={queryClient}>
      {children}
    </RQProvider>
  );
};