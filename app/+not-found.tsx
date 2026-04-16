import { View, Text, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="mb-4 text-2xl font-bold text-text-primary">
          Page Not Found
        </Text>
        <Link href="/(tabs)" asChild>
          <Pressable className="rounded-lg bg-brand-primary px-6 py-3">
            <Text className="text-base font-semibold text-white">
              Go to Home
            </Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
