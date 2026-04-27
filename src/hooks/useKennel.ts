import { useQuery } from 'react-query';
import { kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export function useKennel() {
  const { user } = useAuthStore();
  const kennelId = user?.kennelId;

  const { data: kennel, isLoading } = useQuery(
    ['kennel', kennelId],
    () => kennelsApi.getMyKennel().then((r) => r.data.kennel),
    { enabled: !!kennelId }
  );

  return { kennelId, kennel, isLoading };
}
