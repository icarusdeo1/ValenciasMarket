import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleReset() {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    // Supabase resetPasswordForEmail wiring lands in task 2.1.5
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <View
        className="flex-1 items-center justify-center bg-bg px-6"
        style={{ paddingTop: insets.top }}
      >
        <Text className="mb-4 text-2xl font-bold text-brand-secondary">
          Check Your Email
        </Text>
        <Text className="mb-8 text-center text-base text-text-secondary">
          We sent a password reset link to {email}. Follow the instructions in the
          email to reset your password.
        </Text>
        <Button title="Back to Login" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        <Text className="mb-2 text-3xl font-bold text-text-primary">
          Reset Password
        </Text>
        <Text className="mb-8 text-base text-text-secondary">
          Enter the email address associated with your account and we&apos;ll send
          you a reset link.
        </Text>

        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          error={error || undefined}
          className="mb-6"
        />

        <Button title="Send Reset Link" onPress={handleReset} loading={loading} />

        <View className="mt-6">
          <Button
            title="Back to Login"
            variant="ghost"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
