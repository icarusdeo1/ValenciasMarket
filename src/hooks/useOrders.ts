import { useQuery } from '@tanstack/react-query';
import type { Order } from '@/types';

/**
 * Fetches the authenticated user's order history.
 *
 * Supabase wiring lands with Epic 9 + task 1.1.6. Until then the query
 * is disabled and returns an empty array so the order-history screen
 * renders its empty state.
 */
export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      // TODO(Epic 9): replace with supabase.from('orders').select().order('created_at', { ascending: false })
      return [];
    },
    enabled: false,
    initialData: [],
  });
}
