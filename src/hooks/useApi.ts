import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useUIStore } from '@/store/uiStore';

// Generic hook for fetching data
export function useFetchData<T>(
  key: string | (string | number)[],
  fetchFn: () => Promise<T>,
  options?: { enabled?: boolean; onSuccess?: (data: T) => void }
) {
  return useQuery(key, fetchFn, {
    ...options,
    onError: (error: any) => {
      useUIStore.getState().addNotification({
        type: 'error',
        message: error?.response?.data?.error || 'An error occurred',
      });
    },
  });
}

// Generic hook for mutations with notifications
export function useMutateData<T, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: T, variables: V) => void;
    invalidateQueries?: string[];
  }
) {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation(mutationFn, {
    onSuccess: (data, variables) => {
      if (options?.successMessage) {
        addNotification({
          type: 'success',
          message: options.successMessage,
        });
      }

      // Invalidate queries to refresh data
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((query) => {
          queryClient.invalidateQueries(query);
        });
      }

      options?.onSuccess?.(data, variables);
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: options?.errorMessage || error?.response?.data?.error || 'An error occurred',
      });
    },
  });
}
