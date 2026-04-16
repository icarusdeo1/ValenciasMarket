import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePreferencesStore } from '@/stores';
import { Card } from '@/components/Card';
import Constants from 'expo-constants';

type ColorScheme = 'system' | 'light' | 'dark';

const SCHEME_OPTIONS: { value: ColorScheme; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {
    colorScheme,
    setColorScheme,
    notificationsOrderUpdates,
    notificationsPromotions,
    setNotificationsOrderUpdates,
    setNotificationsPromotions,
  } = usePreferencesStore();

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
          Settings
        </Text>
      </View>

      <View className="px-4 pt-3">
        {/* Appearance */}
        <Card className="mb-3">
          <Text className="mb-3 text-base font-bold text-text-primary dark:text-text-primary-dark">
            Appearance
          </Text>
          <View className="flex-row gap-2">
            {SCHEME_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                className={`min-h-[44px] flex-1 items-center justify-center rounded-lg border-2 py-3 ${colorScheme === opt.value ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light dark:border-border-dark'}`}
                onPress={() => setColorScheme(opt.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: colorScheme === opt.value }}
                accessibilityLabel={`${opt.label} mode`}
              >
                <Ionicons
                  name={opt.icon}
                  size={20}
                  color={colorScheme === opt.value ? '#C41E24' : '#6B6B6B'}
                />
                <Text
                  className={`mt-1 text-sm font-medium ${colorScheme === opt.value ? 'text-brand-primary' : 'text-text-secondary'}`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Notifications */}
        <Card className="mb-3">
          <Text className="mb-3 text-base font-bold text-text-primary dark:text-text-primary-dark">
            Notifications
          </Text>
          <Pressable
            className="min-h-[44px] flex-row items-center justify-between py-2"
            onPress={() => setNotificationsOrderUpdates(!notificationsOrderUpdates)}
            accessibilityRole="switch"
            accessibilityState={{ checked: notificationsOrderUpdates }}
          >
            <Text className="text-base text-text-primary dark:text-text-primary-dark">
              Order Updates
            </Text>
            <View
              className={`h-6 w-10 items-center justify-center rounded-full ${notificationsOrderUpdates ? 'bg-brand-primary' : 'bg-border-light dark:bg-border-dark'}`}
            >
              <View
                className={`h-5 w-5 rounded-full bg-white ${notificationsOrderUpdates ? 'ml-4' : 'mr-4'}`}
              />
            </View>
          </Pressable>
          <Pressable
            className="min-h-[44px] flex-row items-center justify-between py-2"
            onPress={() => setNotificationsPromotions(!notificationsPromotions)}
            accessibilityRole="switch"
            accessibilityState={{ checked: notificationsPromotions }}
          >
            <Text className="text-base text-text-primary dark:text-text-primary-dark">
              Promotions &amp; Specials
            </Text>
            <View
              className={`h-6 w-10 items-center justify-center rounded-full ${notificationsPromotions ? 'bg-brand-primary' : 'bg-border-light dark:bg-border-dark'}`}
            >
              <View
                className={`h-5 w-5 rounded-full bg-white ${notificationsPromotions ? 'ml-4' : 'mr-4'}`}
              />
            </View>
          </Pressable>
        </Card>

        {/* App Info */}
        <Card>
          <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Version {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </Card>
      </View>
    </View>
  );
}
