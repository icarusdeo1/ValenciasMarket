import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { formatPrice } from '@/utils/calculateItemTotal';
import type { MenuItem } from '@/types';

type MenuItemCardProps = {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
};

export function MenuItemCard({ item, onPress }: MenuItemCardProps) {
  return (
    <Pressable
      className="mx-4 mb-2 min-h-[80px] flex-row items-center rounded-xl bg-surface p-3 active:opacity-80 dark:bg-surface-dark"
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${formatPrice(item.price)}${item.unit ? `, ${item.unit}` : ''}`}
    >
      <View className="mr-3 h-[64px] w-[64px] overflow-hidden rounded-lg bg-bg dark:bg-bg-dark">
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 64, height: 64 }}
            contentFit="cover"
            placeholder={{ blurhash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH' }}
            transition={200}
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-2xl">🍽️</Text>
          </View>
        )}
      </View>
      <View className="flex-1">
        <Text
          className="text-base font-semibold text-text-primary dark:text-text-primary-dark"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        {item.description ? (
          <Text
            className="mt-0.5 text-sm text-text-secondary dark:text-text-secondary-dark"
            numberOfLines={2}
          >
            {item.description}
          </Text>
        ) : null}
        {item.unit ? (
          <Text className="mt-0.5 text-xs text-text-secondary dark:text-text-secondary-dark">
            {item.unit}
          </Text>
        ) : null}
      </View>
      <Text className="ml-2 text-base font-bold text-text-primary dark:text-text-primary-dark">
        {formatPrice(item.price)}
      </Text>
    </Pressable>
  );
}
