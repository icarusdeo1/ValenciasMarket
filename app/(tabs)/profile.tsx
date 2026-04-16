import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <Text className="px-4 py-3 text-2xl font-bold text-text-primary">
        Profile
      </Text>
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-text-secondary">
          Profile coming in Epic 9
        </Text>
      </View>
    </View>
  );
}
