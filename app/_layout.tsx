import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import { useSession } from '@/hooks/useSession';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
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
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Slot />
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
