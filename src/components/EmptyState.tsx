import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

type EmptyStateProps = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  ctaTitle?: string;
  onCtaPress?: () => void;
};

export function EmptyState({
  icon = 'bag-outline',
  title,
  subtitle,
  ctaTitle,
  onCtaPress,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons name={icon} size={64} color="#A0A0A0" />
      <Text className="mt-4 text-center text-xl font-bold text-text-primary dark:text-text-primary-dark">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-2 text-center text-base text-text-secondary dark:text-text-secondary-dark">
          {subtitle}
        </Text>
      ) : null}
      {ctaTitle && onCtaPress ? (
        <View className="mt-6 w-full">
          <Button title={ctaTitle} onPress={onCtaPress} />
        </View>
      ) : null}
    </View>
  );
}
