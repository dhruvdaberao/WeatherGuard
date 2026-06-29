import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { User } from '../types/auth';

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await api.get('/auth/me');
        return response.data;
      } catch (err) {
        return null; // Return null if unauthorized/not logged in
      }
    },
    retry: false, // Don't retry on 401s
  });

  const logout = async () => {
    await api.post('/auth/logout');
    await refetch();
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
  };
}
