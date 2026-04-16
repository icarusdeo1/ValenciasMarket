import { View, Text, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useCartStore } from '@/stores';
import { Button } from '@/components/Button';

type MenuItemRowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
};

function MenuItemRow({ icon, label, onPress }: MenuItemRowProps) {
  return (
    <Pressable
      className="min-h-[52px] flex-row items-center border-b border-border-light px-4 py-3 active:bg-bg dark:border-border-dark"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={22} color="#6B6B6B" />
      <Text className="ml-3 flex-1 text-base text-text-primary dark:text-text-primary-dark">
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#A0A0A0" />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, isGuest, logout } = useAuthStore();
  const clearCart = useCartStore((s) => s.clearCart);

  function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your cart will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            clearCart();
            logout();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  }

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <Text className="px-4 py-3 text-2xl font-bold text-text-primary">
        Profile
      </Text>

      <View className="mx-4 mb-6 rounded-2xl bg-surface p-4 dark:bg-surface-dark">
        {isAuthenticated && user ? (
          <>
            <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              {user.name ?? 'Valencia\'s Customer'}
            </Text>
            <Text className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark">
              {user.email}
            </Text>
          </>
        ) : (
          <>
            <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              Guest
            </Text>
            <Text className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark">
              Create an account to track orders and save preferences.
            </Text>
            <View className="mt-3">
              <Button
                title="Create Account"
                variant="outline"
                onPress={() => router.push('/(auth)/register')}
              />
            </View>
          </>
        )}
      </View>

      <View className="mx-4 rounded-2xl bg-surface dark:bg-surface-dark">
        <MenuItemRow
          icon="receipt-outline"
          label="Order History"
          onPress={() => router.push('/order-history')}
        />
        <MenuItemRow
          icon="card-outline"
          label="Saved Payment Methods"
          onPress={() => {
            // Payment methods screen lands in Epic 9
          }}
        />
        <MenuItemRow
          icon="notifications-outline"
          label="Notification Preferences"
          onPress={() => router.push('/settings')}
        />
        <MenuItemRow
          icon="settings-outline"
          label="App Settings"
          onPress={() => router.push('/settings')}
        />
        <MenuItemRow
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => router.push('/help')}
        />
      </View>

      <View className="mx-4 mt-6">
        {isAuthenticated || isGuest ? (
          <Button title="Sign Out" variant="outline" onPress={handleSignOut} />
        ) : null}
      </View>

      {isAuthenticated ? (
        <Pressable
          className="mt-4 items-center py-3"
          onPress={() => {
            // Delete account lands in task 2.4.2
            Alert.alert('Delete Account', 'Account deletion coming in Epic 2.4.');
          }}
          accessibilityRole="button"
          accessibilityLabel="Delete Account"
        >
          <Text className="text-sm text-error">Delete Account</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
