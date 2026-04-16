import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/stores';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const setGuest = useAuthStore((s) => s.setGuest);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    // Supabase auth wiring lands in task 2.1.3
    setLoading(false);
    setError('Auth not yet connected. Use "Continue as Guest" for now.');
  }

  function handleGuestContinue() {
    setGuest();
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        <View className="mb-10 items-center">
          <Text className="text-4xl font-bold text-brand-primary">
            Valencia&apos;s
          </Text>
          <Text className="mt-1 text-base text-text-secondary">
            Carniceria &amp; Taqueria
          </Text>
        </View>

        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          className="mb-4"
        />

        <View className="mb-2">
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            error={error || undefined}
          />
          <Pressable
            className="absolute right-3 top-8 min-h-[44px] min-w-[44px] items-center justify-center"
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#6B6B6B"
            />
          </Pressable>
        </View>

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable className="mb-6 self-end py-2">
            <Text className="text-sm text-brand-primary">Forgot Password?</Text>
          </Pressable>
        </Link>

        <Button title="Sign In" onPress={handleLogin} loading={loading} />

        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-border-light" />
          <Text className="mx-4 text-sm text-text-secondary">or</Text>
          <View className="h-px flex-1 bg-border-light" />
        </View>

        <Button
          title="Continue with Google"
          variant="outline"
          onPress={() => {
            // Google OAuth wiring lands in task 2.2.1
          }}
        />

        {Platform.OS === 'ios' ? (
          <View className="mt-3">
            <Button
              title="Continue with Apple"
              variant="outline"
              onPress={() => {
                // Apple Sign-In wiring lands in task 2.2.2
              }}
            />
          </View>
        ) : null}

        <View className="mt-6">
          <Button
            title="Continue as Guest"
            variant="ghost"
            onPress={handleGuestContinue}
          />
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="text-sm font-semibold text-brand-primary">
                Sign Up
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
