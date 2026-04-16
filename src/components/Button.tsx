import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-brand-primary',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-brand-secondary',
    text: 'text-white',
  },
  outline: {
    container: 'border-2 border-brand-primary bg-transparent',
    text: 'text-brand-primary',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-brand-primary',
  },
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const styles = variantClasses[variant];

  function handlePress(e: Parameters<NonNullable<PressableProps['onPress']>>[0]) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  }

  return (
    <Pressable
      className={`min-h-[44px] items-center justify-center rounded-lg px-6 py-3 ${styles.container} ${isDisabled ? 'opacity-50' : ''}`}
      disabled={isDisabled}
      onPress={handlePress}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#C41E24' : '#FFFFFF'} />
      ) : (
        <Text className={`text-base font-semibold ${styles.text}`}>{title}</Text>
      )}
    </Pressable>
  );
}
