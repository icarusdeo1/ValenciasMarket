import { View, Text, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';

const PHONE = '9167292926';
const SUPPORT_EMAIL = 'support@valencias.com';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();

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
          Help &amp; Support
        </Text>
      </View>

      <View className="px-4 pt-3">
        <Card className="mb-3">
          <Text className="mb-3 text-base font-bold text-text-primary dark:text-text-primary-dark">
            Contact Us
          </Text>
          <Pressable
            className="min-h-[44px] flex-row items-center py-2"
            onPress={() => Linking.openURL(`tel:${PHONE}`)}
            accessibilityRole="link"
            accessibilityLabel="Call us"
          >
            <Ionicons name="call" size={20} color="#C41E24" />
            <Text className="ml-3 text-base text-brand-primary">(916) 729-2926</Text>
          </Pressable>
          <Pressable
            className="min-h-[44px] flex-row items-center py-2"
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            accessibilityRole="link"
            accessibilityLabel="Email us"
          >
            <Ionicons name="mail" size={20} color="#C41E24" />
            <Text className="ml-3 text-base text-brand-primary">{SUPPORT_EMAIL}</Text>
          </Pressable>
        </Card>

        <Card className="mb-3">
          <Text className="mb-3 text-base font-bold text-text-primary dark:text-text-primary-dark">
            Frequently Asked Questions
          </Text>
          <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
            FAQ content coming soon. 🧑 Confirm support email and FAQ with
            Valencia&apos;s (task 9.1.6).
          </Text>
        </Card>

        <Card>
          <Text className="mb-2 text-base font-bold text-text-primary dark:text-text-primary-dark">
            Visit Us
          </Text>
          <Text className="text-sm text-text-primary dark:text-text-primary-dark">
            8040 Greenback Ln, Citrus Heights, CA 95610
          </Text>
          <Text className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark">
            Mon–Thu: 8 AM – 8 PM{'\n'}Fri–Sun: 8 AM – 9 PM
          </Text>
        </Card>
      </View>
    </View>
  );
}
