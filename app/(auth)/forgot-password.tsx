import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg px-6">
      <Text className="mb-4 text-2xl font-bold text-text-primary">
        Reset Password
      </Text>
      <Text className="mb-8 text-base text-text-secondary">
        Password reset form coming in Epic 2
      </Text>
      <Pressable
        className="w-full items-center rounded-lg bg-brand-primary py-4"
        onPress={() => router.back()}
      >
        <Text className="text-base font-semibold text-white">Back to Login</Text>
      </Pressable>
    </View>
  );
}
