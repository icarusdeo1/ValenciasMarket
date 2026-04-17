import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

type CateringFormData = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  additionalInfo: string;
};

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function CateringScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CateringFormData>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      eventDate: '',
      guestCount: '',
      additionalInfo: '',
    },
  });

  async function onSubmit(data: CateringFormData) {
    setLoading(true);
    // submit-catering Edge Function wiring lands in task 8.1.2
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <View
        className="flex-1 items-center justify-center bg-bg px-6 dark:bg-bg-dark"
        style={{ paddingTop: insets.top }}
      >
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-brand-secondary">
          <Ionicons name="checkmark" size={36} color="#FFFFFF" />
        </View>
        <Text className="mb-2 text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          Thank You!
        </Text>
        <Text className="mb-6 text-center text-base text-text-secondary dark:text-text-secondary-dark">
          We&apos;ll get back to you within 24 hours to discuss your catering
          needs.
        </Text>
        <Button title="Done" onPress={() => setSubmitted(false)} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg dark:bg-bg-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
        className="px-4"
      >
        <Text className="mb-1 text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          Catering Inquiry
        </Text>
        <Text className="mb-6 text-base text-text-secondary dark:text-text-secondary-dark">
          Planning an event? Let us know and we&apos;ll prepare a custom quote.
        </Text>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required.' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Name"
              placeholder="Your full name"
              autoCapitalize="words"
              autoComplete="name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              className="mb-4"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address.',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              className="mb-4"
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          rules={{ required: 'Phone number is required.' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Phone"
              placeholder="(916) 555-1234"
              keyboardType="phone-pad"
              autoComplete="tel"
              value={value}
              onChangeText={(text) => onChange(formatPhoneNumber(text))}
              error={errors.phone?.message}
              className="mb-4"
            />
          )}
        />

        <Controller
          control={control}
          name="eventDate"
          rules={{ required: 'Event date is required.' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Event Date"
              placeholder="MM/DD/YYYY"
              value={value}
              onChangeText={onChange}
              error={errors.eventDate?.message}
              helperText="Native DatePicker coming with @expo/ui (task 8.1.1)"
              className="mb-4"
            />
          )}
        />

        <Controller
          control={control}
          name="guestCount"
          rules={{
            required: 'Number of guests is required.',
            validate: (v) => {
              const n = parseInt(v, 10);
              return (n > 0 && !isNaN(n)) || 'Enter a valid number.';
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Number of Guests"
              placeholder="e.g. 50"
              keyboardType="number-pad"
              value={value}
              onChangeText={onChange}
              error={errors.guestCount?.message}
              className="mb-4"
            />
          )}
        />

        <Controller
          control={control}
          name="additionalInfo"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Additional Information (Optional)"
              placeholder="Tell us about your event, dietary needs, etc."
              multiline
              maxLength={1000}
              value={value}
              onChangeText={onChange}
              className="mb-6"
            />
          )}
        />

        <Button
          title="Submit Inquiry"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
