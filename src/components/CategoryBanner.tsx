import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CategoryBannerProps = {
  text: string;
  variant?: 'warning' | 'info';
};

export function CategoryBanner({ text, variant = 'warning' }: CategoryBannerProps) {
  return (
    <View
      className={`mx-4 mb-2 flex-row items-center rounded-lg px-3 py-2 ${variant === 'warning' ? 'bg-brand-gold/20' : 'bg-brand-primary/10'}`}
    >
      <Ionicons
        name={variant === 'warning' ? 'warning' : 'information-circle'}
        size={18}
        color={variant === 'warning' ? '#D4A844' : '#C41E24'}
      />
      <Text
        className={`ml-2 text-sm font-semibold ${variant === 'warning' ? 'text-brand-gold' : 'text-brand-primary'}`}
      >
        {text}
      </Text>
    </View>
  );
}
