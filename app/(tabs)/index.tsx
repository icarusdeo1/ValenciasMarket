import { View, Text, Pressable, ScrollView, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isBusinessOpen, getBusinessHoursDisplay } from '@/utils';
import { usePreferencesStore, useCartStore } from '@/stores';
import { formatPrice } from '@/utils/calculateItemTotal';
import { Card } from '@/components/Card';
import { CartFAB } from '@/components/CartFAB';

const PHONE = '(916) 729-2926';
const ADDRESS = '8040 Greenback Ln, Citrus Heights, CA 95610';

function OpenClosedBadge() {
  const open = isBusinessOpen();
  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-1 ${open ? 'bg-brand-secondary/15' : 'bg-error/15'}`}
    >
      <View
        className={`mr-1.5 h-2 w-2 rounded-full ${open ? 'bg-brand-secondary' : 'bg-error'}`}
      />
      <Text
        className={`text-sm font-semibold ${open ? 'text-brand-secondary' : 'text-error'}`}
      >
        {open ? 'Open Now' : 'Closed'}
      </Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="min-h-[44px] min-w-[72px] items-center py-2"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={24} color="#C41E24" />
      <Text className="mt-1 text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
        {label}
      </Text>
    </Pressable>
  );
}

function openDialer() {
  void Linking.openURL('tel:9167292926');
}

function openDirections() {
  const encoded = encodeURIComponent(ADDRESS);
  const url =
    Platform.OS === 'ios'
      ? `maps://maps.apple.com/?q=${encoded}`
      : `geo:0,0?q=${encoded}`;
  void Linking.openURL(url);
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const isFirstOrder = usePreferencesStore((s) => s.isFirstOrder);
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());

  return (
    <View className="flex-1 bg-bg dark:bg-bg-dark" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero */}
        <View className="items-center bg-brand-primary px-6 pb-8 pt-10">
          <Text className="text-4xl font-bold text-white">Valencia&apos;s</Text>
          <Text className="mt-1 text-base text-white/80">
            Carniceria &amp; Taqueria
          </Text>
          <View className="mt-3">
            <OpenClosedBadge />
          </View>
        </View>

        {/* First-order promo */}
        {isFirstOrder ? (
          <View className="mx-4 -mt-4 rounded-xl bg-brand-gold/20 px-4 py-3">
            <Text className="text-center text-base font-bold text-brand-gold">
              🎉 10% Off Your First Order!
            </Text>
          </View>
        ) : null}

        {/* Ordering CTAs */}
        <View className="mx-4 mt-4 flex-row gap-3">
          <Card
            className="flex-1 items-center py-6"
            onPress={() => router.push('/(tabs)/taqueria')}
          >
            <Ionicons name="restaurant" size={32} color="#C41E24" />
            <Text className="mt-2 text-center text-base font-bold text-text-primary dark:text-text-primary-dark">
              Order from the Taqueria
            </Text>
            <Text className="mt-1 text-center text-xs text-text-secondary dark:text-text-secondary-dark">
              Burritos, tacos, plates &amp; more
            </Text>
          </Card>
          <Card
            className="flex-1 items-center py-6"
            onPress={() => router.push('/(tabs)/market')}
          >
            <Ionicons name="storefront" size={32} color="#C41E24" />
            <Text className="mt-2 text-center text-base font-bold text-text-primary dark:text-text-primary-dark">
              Order from the Market
            </Text>
            <Text className="mt-1 text-center text-xs text-text-secondary dark:text-text-secondary-dark">
              Meats, produce, groceries
            </Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View className="mx-4 mt-4 flex-row justify-around rounded-xl bg-surface py-2 dark:bg-surface-dark">
          <QuickAction icon="call" label="Call" onPress={openDialer} />
          <QuickAction icon="navigate" label="Directions" onPress={openDirections} />
          <QuickAction
            icon="calendar"
            label="Catering"
            onPress={() => router.push('/(tabs)/catering')}
          />
        </View>

        {/* Location & Contact */}
        <Card className="mx-4 mt-4">
          <Text className="mb-2 text-lg font-bold text-text-primary dark:text-text-primary-dark">
            Visit Us
          </Text>
          <Pressable onPress={openDirections} accessibilityRole="link">
            <View className="mb-2 flex-row items-start">
              <Ionicons name="location" size={18} color="#C41E24" />
              <Text className="ml-2 flex-1 text-sm text-text-primary dark:text-text-primary-dark">
                {ADDRESS}
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={openDialer} accessibilityRole="link">
            <View className="mb-2 flex-row items-center">
              <Ionicons name="call" size={18} color="#C41E24" />
              <Text className="ml-2 text-sm text-brand-primary">{PHONE}</Text>
            </View>
          </Pressable>
          <View className="flex-row items-start">
            <Ionicons name="time" size={18} color="#C41E24" />
            <Text className="ml-2 text-sm text-text-secondary dark:text-text-secondary-dark">
              {getBusinessHoursDisplay()}
            </Text>
          </View>
        </Card>
      </ScrollView>

      <CartFAB itemCount={itemCount} subtotal={formatPrice(subtotal)} />
    </View>
  );
}
