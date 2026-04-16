import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 p-2">
          <Text className="text-lg text-brand-primary">Back</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-text-primary">Your Cart</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-text-secondary">
          Cart UI coming in Epic 5
        </Text>
      </View>
    </View>
  );
}
