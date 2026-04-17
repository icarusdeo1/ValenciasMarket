import { useQuery } from '@tanstack/react-query';
import type { Order } from '@/types';

/**
 * Fetches a single order by id.
 *
 * Supabase wiring lands with Epic 9 + task 1.1.6. Until then the query
 * is disabled and returns `{ data: null, isLoading: false }` so screens
 * render their empty state.
 */
export function useOrder(id: string | undefined) {
  return useQuery<Order | null>({
    queryKey: ['orders', id],
    queryFn: async () => {
      // TODO(Epic 9): replace with supabase.from('orders').select().eq('id', id).single()
      return null;
    },
    enabled: false,
  });
}
