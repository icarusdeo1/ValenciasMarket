import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-4 text-3xl font-bold text-brand-secondary">
          Order Confirmed
        </Text>
        <Text className="mb-8 text-base text-text-secondary">
          Confirmation details coming in Epic 7
        </Text>
        <Pressable
          className="w-full items-center rounded-lg bg-brand-primary py-4"
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-base font-semibold text-white">Done</Text>
        </Pressable>
      </View>
    </View>
  );
}
