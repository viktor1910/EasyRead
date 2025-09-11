import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useNotification } from './NotificationContext/NotificationContext';

// Create a QueryProvider component that uses notification context
const QueryProviderInner = ({ children }: { children: React.ReactNode }) => {
  const { showError } = useNotification();

  // Create QueryClient với global error handler
  const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // Không retry cho lỗi 4xx (client errors)
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        onError: (error: any) => {
          // Show error notification cho tất cả mutations trừ khi được handle riêng
          if (!error?.isHandled) {
            showError(error);
          }
        },
      },
    },
  }), [showError]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryProviderInner>{children}</QueryProviderInner>
);
