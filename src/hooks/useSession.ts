import { useAuthStore } from '@/stores';

export function useSession() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isGuest = useAuthStore((s) => s.isGuest);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { isAuthenticated, isGuest, isLoading } as const;
}
