import { View, Text, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '@/utils/calculateItemTotal';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import type { Order } from '@/types';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  // TanStack Query fetch by id lands with Supabase
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const order = null as Order | null;

  return (
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
        <Text className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          Order #{id?.slice(-6).toUpperCase()}
        </Text>
      </View>

      {!order ? (
        <EmptyState
          icon="receipt-outline"
          title="Order not found"
          subtitle="Order details will be available once Supabase is connected."
          ctaTitle="Go Back"
          onCtaPress={() => router.back()}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} className="px-4 pt-3">
          <Card className="mb-3">
            <Text className="mb-1 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
              Status
            </Text>
            <Text className="text-lg font-bold text-brand-primary">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </Card>

          <Card className="mb-3">
            <Text className="mb-2 text-base font-bold text-text-primary dark:text-text-primary-dark">
              Items
            </Text>
            {order.items.map((item) => {
              const modifiers = item.selectedChoices.reduce(
                (sum, c) => sum + c.priceModifier,
                0,
              );
              const lineTotal = (item.menuItem.price + modifiers) * item.quantity;
              return (
                <View
                  key={item.cartItemId}
                  className="mb-1 flex-row justify-between"
                >
                  <Text className="flex-1 text-sm text-text-primary dark:text-text-primary-dark">
                    {item.quantity}× {item.menuItem.name}
                  </Text>
                  <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                    {formatPrice(lineTotal)}
                  </Text>
                </View>
              );
            })}
          </Card>

          <Card>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-secondary">Subtotal</Text>
              <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                {formatPrice(order.subtotal)}
              </Text>
            </View>
            {order.discount > 0 ? (
              <View className="flex-row justify-between">
                <Text className="text-sm text-brand-secondary">Discount</Text>
                <Text className="text-sm text-brand-secondary">
                  -{formatPrice(order.discount)}
                </Text>
              </View>
            ) : null}
            {order.deliveryFee > 0 ? (
              <View className="flex-row justify-between">
                <Text className="text-sm text-text-secondary">Delivery Fee</Text>
                <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                  {formatPrice(order.deliveryFee)}
                </Text>
              </View>
            ) : null}
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-secondary">Tax</Text>
              <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                {formatPrice(order.tax)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-secondary">Tip</Text>
              <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                {formatPrice(order.tip)}
              </Text>
            </View>
            <View className="mt-2 flex-row justify-between border-t border-border-light pt-2 dark:border-border-dark">
              <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                Total
              </Text>
              <Text className="text-lg font-bold text-brand-primary">
                {formatPrice(order.total)}
              </Text>
            </View>
          </Card>
        </ScrollView>
      )}
    </View>
  );
}
