import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-brand-primary">
          Valencia&apos;s
        </Text>
        <Text className="mt-1 text-base text-text-secondary">
          Carniceria &amp; Taqueria
        </Text>
        <Text className="mt-6 text-sm text-text-secondary">
          Home screen coming in Epic 6
        </Text>
      </View>
    </View>
  );
}
