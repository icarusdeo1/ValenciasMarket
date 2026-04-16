import { View, Text, Pressable, SectionList, Alert } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/stores';
import { formatPrice } from '@/utils/calculateItemTotal';
import { CartItemRow } from '@/components/CartItemRow';
import { ItemDetailSheet } from '@/components/ItemDetailSheet';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { CategoryBanner } from '@/components/CategoryBanner';
import type { CartItem } from '@/types';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
    isStale,
  } = useCartStore();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const stale = isStale();

  const sections = useMemo(() => {
    const taqueriaItems = items.filter((i) => i.menuItem.channel === 'taqueria');
    const marketItems = items.filter((i) => i.menuItem.channel === 'market');
    const result: { title: string; data: CartItem[] }[] = [];
    if (taqueriaItems.length > 0) {
      result.push({ title: 'Taqueria', data: taqueriaItems });
    }
    if (marketItems.length > 0) {
      result.push({ title: 'Market', data: marketItems });
    }
    return result;
  }, [items]);

  const handleRemove = useCallback(
    (cartItemId: string) => {
      const item = items.find((i) => i.cartItemId === cartItemId);
      Alert.alert(
        'Remove Item',
        `Remove ${item?.menuItem.name ?? 'this item'} from your cart?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeItem(cartItemId),
          },
        ],
      );
    },
    [items, removeItem],
  );

  const handleEdit = useCallback((cartItem: CartItem) => {
    setEditingItem(cartItem);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-bg dark:bg-bg-dark" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center border-b border-border-light px-4 py-3 dark:border-border-dark">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 min-h-[44px] min-w-[44px] items-center justify-center"
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </Pressable>
          <Text className="flex-1 text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            Your Cart
          </Text>
          {itemCount > 0 ? (
            <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Text>
          ) : null}
        </View>

        {items.length === 0 ? (
          <EmptyState
            icon="cart-outline"
            title="Your cart is empty"
            subtitle="Browse the Taqueria or Market to add items."
            ctaTitle="Browse Menu"
            onCtaPress={() => router.replace('/(tabs)/taqueria')}
          />
        ) : (
          <>
            {stale ? (
              <View className="mx-4 mt-2">
                <CategoryBanner
                  text="Your cart was updated over 24 hours ago. Prices may have changed."
                  variant="info"
                />
              </View>
            ) : null}

            <SectionList
              sections={sections}
              keyExtractor={(item) => item.cartItemId}
              renderSectionHeader={({ section }) => (
                <View className="bg-bg px-4 pb-1 pt-3 dark:bg-bg-dark">
                  <Text className="text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">
                    {section.title}
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <CartItemRow
                  cartItem={item}
                  onQuantityChange={updateQuantity}
                  onRemove={handleRemove}
                  onEdit={handleEdit}
                />
              )}
              contentContainerStyle={{ paddingBottom: 140 }}
            />

            <View
              className="absolute bottom-0 left-0 right-0 border-t border-border-light bg-surface px-4 dark:border-border-dark dark:bg-surface-dark"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <View className="flex-row items-center justify-between py-3">
                <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
                  Subtotal
                </Text>
                <Text className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
                  {formatPrice(subtotal)}
                </Text>
              </View>
              <Button
                title="Proceed to Checkout"
                onPress={() => router.push('/checkout')}
              />
            </View>
          </>
        )}

        {editingItem ? (
          <ItemDetailSheet
            item={editingItem.menuItem}
            editingCartItem={editingItem}
            onClose={handleCloseEdit}
          />
        ) : null}
      </View>
    </GestureHandlerRootView>
  );
}
