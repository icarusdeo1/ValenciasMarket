import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuantitySelector } from './QuantitySelector';
import { formatPrice } from '@/utils/calculateItemTotal';
import type { CartItem } from '@/types';

type CartItemRowProps = {
  cartItem: CartItem;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  onEdit: (cartItem: CartItem) => void;
};

function getChoicesSummary(cartItem: CartItem): string {
  const parts: string[] = [];
  for (const choice of cartItem.selectedChoices) {
    const group = cartItem.menuItem.optionGroups?.find(
      (g) => g.id === choice.groupId,
    );
    const choiceLabel = group?.choices.find((c) => c.id === choice.choiceId)?.label;
    if (choiceLabel) parts.push(choiceLabel);
  }
  if (cartItem.specialInstructions) {
    parts.push(cartItem.specialInstructions);
  }
  return parts.join(', ');
}

function getLineTotal(cartItem: CartItem): number {
  const modifiers = cartItem.selectedChoices.reduce(
    (sum, c) => sum + c.priceModifier,
    0,
  );
  return (cartItem.menuItem.price + modifiers) * cartItem.quantity;
}

export function CartItemRow({
  cartItem,
  onQuantityChange,
  onRemove,
  onEdit,
}: CartItemRowProps) {
  const summary = getChoicesSummary(cartItem);
  const lineTotal = getLineTotal(cartItem);

  return (
    <Pressable
      className="mx-4 mb-2 rounded-xl bg-surface p-3 active:opacity-90 dark:bg-surface-dark"
      onPress={() => onEdit(cartItem)}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${cartItem.menuItem.name}`}
    >
      <View className="flex-row items-start justify-between">
        <View className="mr-2 flex-1">
          <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
            {cartItem.menuItem.name}
          </Text>
          {summary ? (
            <Text
              className="mt-0.5 text-sm text-text-secondary dark:text-text-secondary-dark"
              numberOfLines={2}
            >
              {summary}
            </Text>
          ) : null}
        </View>
        <View className="items-end">
          <Text className="text-base font-bold text-text-primary dark:text-text-primary-dark">
            {formatPrice(lineTotal)}
          </Text>
          <Pressable
            className="mt-1 min-h-[44px] min-w-[44px] items-center justify-center"
            onPress={() => onRemove(cartItem.cartItemId)}
            accessibilityLabel={`Remove ${cartItem.menuItem.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={18} color="#D32F2F" />
          </Pressable>
        </View>
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        <QuantitySelector
          value={cartItem.quantity}
          min={1}
          onChange={(qty) => onQuantityChange(cartItem.cartItemId, qty)}
        />
      </View>
    </Pressable>
  );
}
