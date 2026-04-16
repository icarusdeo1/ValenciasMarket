import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Button } from '@/components/Button';

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 120 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      className="flex-1 items-center justify-center bg-bg px-6 dark:bg-bg-dark"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Animated.View
        style={animatedStyle}
        className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-brand-secondary"
      >
        <Ionicons name="checkmark" size={56} color="#FFFFFF" />
      </Animated.View>

      <Text className="mb-2 text-3xl font-bold text-text-primary dark:text-text-primary-dark">
        Order Confirmed!
      </Text>

      <Text className="mb-1 text-base text-text-secondary dark:text-text-secondary-dark">
        Order #VLC-{String(Date.now()).slice(-6)}
      </Text>

      <Text className="mb-8 text-center text-base text-text-secondary dark:text-text-secondary-dark">
        Estimated ready time: 20–30 minutes.{'\n'}We&apos;ll notify you when
        it&apos;s ready!
      </Text>

      <View className="w-full">
        <Button title="Done" onPress={() => router.replace('/(tabs)')} />
      </View>
    </View>
  );
}
