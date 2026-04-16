import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import { type ReactNode } from 'react';

type CardProps = ViewProps & {
  children: ReactNode;
  onPress?: PressableProps['onPress'];
};

export function Card({ children, onPress, className = '', ...rest }: CardProps) {
  const baseClasses = 'rounded-2xl bg-surface p-4 shadow-sm dark:bg-surface-dark';

  if (onPress) {
    return (
      <Pressable
        className={`${baseClasses} active:opacity-80 ${className}`}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={`${baseClasses} ${className}`} {...rest}>
      {children}
    </View>
  );
}
