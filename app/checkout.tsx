import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useState, useMemo } from 'react';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore, usePreferencesStore, useAuthStore } from '@/stores';
import { formatPrice } from '@/utils/calculateItemTotal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import type { OrderType } from '@/types';

const TIP_PRESETS = [
  { label: '10%', multiplier: 0.1 },
  { label: '15%', multiplier: 0.15 },
  { label: '20%', multiplier: 0.2 },
  { label: '25%', multiplier: 0.25 },
];

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { items, getSubtotal, clearCart } = useCartStore();
  const isFirstOrder = usePreferencesStore((s) => s.isFirstOrder);
  const setFirstOrderUsed = usePreferencesStore((s) => s.setFirstOrderUsed);
  const isGuest = useAuthStore((s) => s.isGuest);

  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [scheduleType, setScheduleType] = useState<'asap' | 'scheduled'>('asap');
  const [tipIndex, setTipIndex] = useState(1);
  const [customTip, setCustomTip] = useState('');
  const [useCustomTip, setUseCustomTip] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = isFirstOrder ? subtotal * 0.1 : 0;
  const deliveryFee = orderType === 'delivery' ? 7.99 : 0;
  const taxRate = 0.0875;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;

  const tipAmount = useMemo(() => {
    if (useCustomTip) {
      const parsed = parseFloat(customTip);
      return isNaN(parsed) ? 0 : parsed;
    }
    const preset = TIP_PRESETS[tipIndex];
    return preset ? subtotal * preset.multiplier : 0;
  }, [useCustomTip, customTip, tipIndex, subtotal]);

  const total = subtotal - discount + deliveryFee + tax + tipAmount;

  async function handlePlaceOrder() {
    if (items.length === 0) return;
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      Alert.alert('Delivery Address', 'Please enter a delivery address.');
      return;
    }

    setSubmitting(true);
    // Payment + submit-order wiring lands in tasks 7.2-7.4
    // Simulate order success for now
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (isFirstOrder) setFirstOrderUsed();
    clearCart();
    setSubmitting(false);
    router.replace('/order-confirmation');
  }

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
          Checkout
        </Text>
      </View>

      {isGuest ? (
        <Pressable
          className="mx-4 mt-2 flex-row items-center rounded-lg bg-brand-primary/10 px-3 py-2"
          onPress={() => router.push('/(auth)/register')}
        >
          <Ionicons name="person-add-outline" size={18} color="#C41E24" />
          <Text className="ml-2 flex-1 text-sm text-brand-primary">
            Create an account to track your order
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#C41E24" />
        </Pressable>
      ) : null}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Order Type */}
        <Card className="mx-4 mt-3">
          <Text className="mb-2 text-base font-bold text-text-primary dark:text-text-primary-dark">
            Order Type
          </Text>
          <View className="flex-row gap-2">
            {(['pickup', 'delivery'] as const).map((type) => (
              <Pressable
                key={type}
                className={`min-h-[44px] flex-1 items-center justify-center rounded-lg border-2 py-2 ${orderType === type ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light dark:border-border-dark'}`}
                onPress={() => setOrderType(type)}
                accessibilityRole="radio"
                accessibilityState={{ selected: orderType === type }}
              >
                <Ionicons
                  name={type === 'pickup' ? 'storefront-outline' : 'car-outline'}
                  size={20}
                  color={orderType === type ? '#C41E24' : '#6B6B6B'}
                />
                <Text
                  className={`mt-1 text-sm font-semibold ${orderType === type ? 'text-brand-primary' : 'text-text-secondary'}`}
                >
                  {type === 'pickup' ? 'Pickup' : 'Delivery'}
                </Text>
              </Pressable>
            ))}
          </View>
          {orderType === 'delivery' ? (
            <View className="mt-3">
              <Input
                label="Delivery Address"
                placeholder="Enter your address"
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                helperText="Delivery fee: $7.99 – $12.99 based on distance"
              />
            </View>
          ) : null}
        </Card>

        {/* Schedule */}
        <Card className="mx-4 mt-3">
          <Text className="mb-2 text-base font-bold text-text-primary dark:text-text-primary-dark">
            When
          </Text>
          <View className="flex-row gap-2">
            {(['asap', 'scheduled'] as const).map((type) => (
              <Pressable
                key={type}
                className={`min-h-[44px] flex-1 items-center justify-center rounded-lg border-2 py-2 ${scheduleType === type ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light dark:border-border-dark'}`}
                onPress={() => setScheduleType(type)}
                accessibilityRole="radio"
                accessibilityState={{ selected: scheduleType === type }}
              >
                <Text
                  className={`text-sm font-semibold ${scheduleType === type ? 'text-brand-primary' : 'text-text-secondary'}`}
                >
                  {type === 'asap' ? 'ASAP' : 'Schedule for Later'}
                </Text>
              </Pressable>
            ))}
          </View>
          {scheduleType === 'scheduled' ? (
            <Text className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark">
              Date/time picker coming with @expo/ui DatePicker (task 7.1.4)
            </Text>
          ) : null}
        </Card>

        {/* Tip */}
        <Card className="mx-4 mt-3">
          <Text className="mb-2 text-base font-bold text-text-primary dark:text-text-primary-dark">
            Add a Tip
          </Text>
          <View className="flex-row gap-2">
            {TIP_PRESETS.map((preset, index) => (
              <Pressable
                key={preset.label}
                className={`min-h-[44px] flex-1 items-center justify-center rounded-lg border-2 py-2 ${!useCustomTip && tipIndex === index ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light dark:border-border-dark'}`}
                onPress={() => {
                  setUseCustomTip(false);
                  setTipIndex(index);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: !useCustomTip && tipIndex === index }}
              >
                <Text
                  className={`text-sm font-semibold ${!useCustomTip && tipIndex === index ? 'text-brand-primary' : 'text-text-secondary'}`}
                >
                  {preset.label}
                </Text>
                <Text className="mt-0.5 text-xs text-text-secondary">
                  {formatPrice(subtotal * preset.multiplier)}
                </Text>
              </Pressable>
            ))}
            <Pressable
              className={`min-h-[44px] flex-1 items-center justify-center rounded-lg border-2 py-2 ${useCustomTip ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light dark:border-border-dark'}`}
              onPress={() => setUseCustomTip(true)}
              accessibilityRole="radio"
              accessibilityState={{ selected: useCustomTip }}
            >
              <Text
                className={`text-sm font-semibold ${useCustomTip ? 'text-brand-primary' : 'text-text-secondary'}`}
              >
                Custom
              </Text>
            </Pressable>
          </View>
          {useCustomTip ? (
            <View className="mt-2">
              <Input
                placeholder="$0.00"
                keyboardType="decimal-pad"
                value={customTip}
                onChangeText={setCustomTip}
              />
            </View>
          ) : null}
        </Card>

        {/* Order Summary */}
        <Card className="mx-4 mt-3">
          <Text className="mb-3 text-base font-bold text-text-primary dark:text-text-primary-dark">
            Order Summary
          </Text>
          {items.map((item) => {
            const modifiers = item.selectedChoices.reduce(
              (sum, c) => sum + c.priceModifier,
              0,
            );
            const lineTotal = (item.menuItem.price + modifiers) * item.quantity;
            return (
              <View key={item.cartItemId} className="mb-1 flex-row justify-between">
                <Text className="flex-1 text-sm text-text-primary dark:text-text-primary-dark">
                  {item.quantity}× {item.menuItem.name}
                </Text>
                <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                  {formatPrice(lineTotal)}
                </Text>
              </View>
            );
          })}

          <View className="mt-3 border-t border-border-light pt-2 dark:border-border-dark">
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-secondary">Subtotal</Text>
              <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                {formatPrice(subtotal)}
              </Text>
            </View>
            {discount > 0 ? (
              <View className="flex-row justify-between">
                <Text className="text-sm text-brand-secondary">
                  First Order Discount (10%)
                </Text>
                <Text className="text-sm text-brand-secondary">
                  -{formatPrice(discount)}
                </Text>
              </View>
            ) : null}
            {orderType === 'delivery' ? (
              <View className="flex-row justify-between">
                <Text className="text-sm text-text-secondary">Delivery Fee</Text>
                <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                  {formatPrice(deliveryFee)}
                </Text>
              </View>
            ) : null}
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-secondary">Tax</Text>
              <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                {formatPrice(tax)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-secondary">Tip</Text>
              <Text className="text-sm text-text-primary dark:text-text-primary-dark">
                {formatPrice(tipAmount)}
              </Text>
            </View>
            <View className="mt-2 flex-row justify-between border-t border-border-light pt-2 dark:border-border-dark">
              <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                Total
              </Text>
              <Text className="text-lg font-bold text-brand-primary">
                {formatPrice(total)}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Place Order footer */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-border-light bg-surface px-4 dark:border-border-dark dark:bg-surface-dark"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="py-3">
          <Text className="mb-1 text-center text-xs text-text-secondary">
            Payment integration coming in tasks 7.2–7.3
          </Text>
          <Button
            title={`Place Order — ${formatPrice(total)}`}
            onPress={handlePlaceOrder}
            loading={submitting}
            disabled={items.length === 0}
          />
        </View>
      </View>
    </View>
  );
}
