import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

type ToggleOptionProps = {
  label: string;
  priceModifier?: number;
  selected: boolean;
  onChange: (selected: boolean) => void;
};

export function ToggleOption({
  label,
  priceModifier,
  selected,
  onChange,
}: ToggleOptionProps) {
  function handlePress() {
    void Haptics.selectionAsync();
    onChange(!selected);
  }

  return (
    <Pressable
      className={`mb-1 min-h-[44px] flex-row items-center justify-between rounded-lg border px-3 py-2 ${selected ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light dark:border-border-dark'}`}
      onPress={handlePress}
      accessibilityRole="switch"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label}${priceModifier ? ` +$${priceModifier.toFixed(2)}` : ''}`}
    >
      <View className="flex-1 flex-row items-center">
        <View
          className={`mr-3 h-5 w-5 items-center justify-center rounded border-2 ${selected ? 'border-brand-primary bg-brand-primary' : 'border-text-secondary dark:border-text-secondary-dark'}`}
        >
          {selected ? (
            <Text className="text-xs font-bold text-white">✓</Text>
          ) : null}
        </View>
        <Text className="text-base text-text-primary dark:text-text-primary-dark">
          {label}
        </Text>
      </View>
      {priceModifier ? (
        <Text className="text-sm font-medium text-brand-gold">
          +${priceModifier.toFixed(2)}
        </Text>
      ) : null}
    </Pressable>
  );
}
