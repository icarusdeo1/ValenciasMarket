import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import { ToastProvider } from '@/components/Toast';
import { useSession } from '@/hooks/useSession';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayout() {
  const { isAuthenticated, isGuest, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const hasAccess = isAuthenticated || isGuest;

    if (!hasAccess && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (hasAccess && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isGuest, isLoading, segments, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ToastProvider>
          <StatusBar style="auto" />
          <Slot />
        </ToastProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(RootLayout);
