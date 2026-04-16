/**
 * Placeholder session hook. Returns guest=true until Epic 2 wires Supabase auth.
 * The useAuthStore (Feature 1.4) will replace this.
 */
export function useSession() {
  return {
    isAuthenticated: false,
    isGuest: true,
    isLoading: false,
  } as const;
}
