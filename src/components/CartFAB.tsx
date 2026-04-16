import { Pressable, Text, View } from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type CartFABProps = {
  itemCount: number;
  subtotal: string;
};

export function CartFAB({ itemCount, subtotal }: CartFABProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(itemCount > 0 ? 1 : 0, {
      damping: 12,
      stiffness: 150,
    });
  }, [itemCount, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (itemCount === 0) return null;

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-24 right-4"
    >
      <Pressable
        className="min-h-[56px] flex-row items-center rounded-full bg-brand-primary px-5 py-3 shadow-lg"
        onPress={() => router.push('/cart')}
        accessibilityLabel={`Cart with ${itemCount} items, subtotal ${subtotal}`}
        accessibilityRole="button"
      >
        <Ionicons name="cart" size={22} color="#FFFFFF" />
        <View className="ml-2 h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1">
          <Text className="text-xs font-bold text-brand-primary">{itemCount}</Text>
        </View>
        <Text className="ml-2 text-base font-bold text-white">{subtotal}</Text>
      </Pressable>
    </Animated.View>
  );
}
