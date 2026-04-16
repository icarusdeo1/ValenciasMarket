import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

type RadioChoice = {
  id: string;
  label: string;
  priceModifier?: number;
};

type RadioGroupProps = {
  label: string;
  required?: boolean;
  choices: RadioChoice[];
  selectedId: string | null;
  onChange: (id: string) => void;
};

function formatModifier(amount: number): string {
  return `+$${amount.toFixed(2)}`;
}

export function RadioGroup({
  label,
  required = false,
  choices,
  selectedId,
  onChange,
}: RadioGroupProps) {
  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center">
        <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
          {label}
        </Text>
        {required ? (
          <View className="ml-2 rounded bg-brand-primary px-2 py-0.5">
            <Text className="text-xs font-semibold text-white">Required</Text>
          </View>
        ) : null}
      </View>
      {choices.map((choice) => {
        const isSelected = selectedId === choice.id;
        return (
          <Pressable
            key={choice.id}
            className={`mb-1 min-h-[44px] flex-row items-center rounded-lg border px-3 py-2 ${isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light dark:border-border-dark'}`}
            onPress={() => {
              void Haptics.selectionAsync();
              onChange(choice.id);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${choice.label}${choice.priceModifier ? ` ${formatModifier(choice.priceModifier)}` : ''}`}
          >
            <View
              className={`mr-3 h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected ? 'border-brand-primary' : 'border-text-secondary dark:border-text-secondary-dark'}`}
            >
              {isSelected ? (
                <View className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
              ) : null}
            </View>
            <Text className="flex-1 text-base text-text-primary dark:text-text-primary-dark">
              {choice.label}
            </Text>
            {choice.priceModifier ? (
              <Text className="text-sm font-medium text-brand-gold">
                {formatModifier(choice.priceModifier)}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
