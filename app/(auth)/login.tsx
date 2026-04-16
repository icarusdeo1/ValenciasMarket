import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg px-6">
      <Text className="mb-8 text-3xl font-bold text-brand-primary">
        Valencia&apos;s
      </Text>
      <Text className="mb-6 text-lg text-text-primary">Sign in to continue</Text>
      <Link href="/(tabs)" asChild>
        <Pressable className="mb-4 w-full items-center rounded-lg bg-brand-primary py-4">
          <Text className="text-base font-semibold text-white">
            Continue as Guest
          </Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/register" asChild>
        <Pressable className="w-full items-center py-3">
          <Text className="text-base text-brand-primary">Create Account</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/forgot-password" asChild>
        <Pressable className="mt-2 items-center py-2">
          <Text className="text-sm text-text-secondary">Forgot Password?</Text>
        </Pressable>
      </Link>
    </View>
  );
}
