import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import type { User } from '@/types';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout, setUser } = useAuthStore();

  // Query for current user
  const { isLoading, error } = useQuery(
    'currentUser',
    async () => {
      if (!token) return null;
      const response = await authApi.getMe();
      return response.data.user as User;
    },
    {
      enabled: !!token && !user,
      onSuccess: (data) => {
        if (data) {
          setUser(data);
        }
      },
      onError: () => {
        logout();
      },
      retry: false,
    }
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}

export function useRequireAuth(allowedRoles?: string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }

    if (!isLoading && isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        window.location.href = '/unauthorized';
      }
    }
  }, [isLoading, isAuthenticated, allowedRoles, user]);

  return { user, isLoading };
}
