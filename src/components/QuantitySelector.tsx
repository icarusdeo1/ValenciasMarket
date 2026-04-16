import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type QuantitySelectorProps = {
  value: number;
  min?: number;
  onChange: (quantity: number) => void;
};

export function QuantitySelector({ value, min = 1, onChange }: QuantitySelectorProps) {
  function decrement() {
    if (value > min) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value - 1);
    }
  }

  function increment() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(value + 1);
  }

  return (
    <View className="flex-row items-center">
      <Pressable
        className="h-[44px] w-[44px] items-center justify-center rounded-lg bg-surface dark:bg-surface-dark"
        onPress={decrement}
        disabled={value <= min}
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button"
      >
        <Ionicons name="remove" size={20} color={value <= min ? '#A0A0A0' : '#C41E24'} />
      </Pressable>
      <Text className="min-w-[40px] text-center text-lg font-bold text-text-primary dark:text-text-primary-dark">
        {value}
      </Text>
      <Pressable
        className="h-[44px] w-[44px] items-center justify-center rounded-lg bg-surface dark:bg-surface-dark"
        onPress={increment}
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={20} color="#C41E24" />
      </Pressable>
    </View>
  );
}
