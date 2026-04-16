import { View, Text, Pressable, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '@/utils/calculateItemTotal';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/Card';
import type { Order, OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-brand-gold' },
  confirmed: { label: 'Confirmed', color: 'text-brand-primary' },
  preparing: { label: 'Preparing', color: 'text-brand-primary' },
  ready: { label: 'Ready', color: 'text-brand-secondary' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-brand-secondary' },
  delivered: { label: 'Delivered', color: 'text-brand-secondary' },
  cancelled: { label: 'Cancelled', color: 'text-error' },
};

function OrderRow({ order }: { order: Order }) {
  const status = STATUS_LABELS[order.status];
  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card
      className="mx-4 mb-2"
      onPress={() => router.push(`/order-detail/${order.id}`)}
    >
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-base font-bold text-text-primary dark:text-text-primary-dark">
            Order #{order.id.slice(-6).toUpperCase()}
          </Text>
          <Text className="mt-0.5 text-sm text-text-secondary dark:text-text-secondary-dark">
            {dateStr} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-base font-bold text-text-primary dark:text-text-primary-dark">
            {formatPrice(order.total)}
          </Text>
          <Text className={`mt-0.5 text-xs font-semibold ${status.color}`}>
            {status.label}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default function OrderHistoryScreen() {
  const insets = useSafeAreaInsets();

  // TanStack Query hook for orders lands in Epic 9 with Supabase
  const orders: Order[] = [];

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
          Order History
        </Text>
      </View>

      {orders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          subtitle="Your order history will appear here after your first order."
          ctaTitle="Start Ordering"
          onCtaPress={() => router.replace('/(tabs)/taqueria')}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderRow order={item} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        />
      )}
    </View>
  );
}
