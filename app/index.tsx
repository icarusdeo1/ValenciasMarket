import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <Text className="text-2xl font-bold text-brand-primary">
        Valencia&apos;s
      </Text>
      <Text className="mt-2 text-text-secondary">Scaffold online.</Text>
    </View>
  );
}
