import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Enter a valid email address.';
    if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    // Supabase signUp wiring lands in task 2.1.3
    setLoading(false);
    setErrors({ email: 'Registration not yet connected. Use guest mode for now.' });
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
          Create Account
        </Text>
        <Text className="mb-8 text-base text-text-secondary">
          Sign up to track orders and save your preferences.
        </Text>

        <Input
          label="Full Name"
          placeholder="John Doe"
          autoCapitalize="words"
          autoComplete="name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          className="mb-4"
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          className="mb-4"
        />

        <Input
          label="Password"
          placeholder="At least 8 characters"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          className="mb-4"
        />

        <Input
          label="Confirm Password"
          placeholder="Re-enter your password"
          secureTextEntry
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          className="mb-6"
        />

        <Button title="Create Account" onPress={handleRegister} loading={loading} />

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm text-text-secondary">
            Already have an account?{' '}
          </Text>
          <Button
            title="Sign In"
            variant="ghost"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
