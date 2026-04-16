import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { useState } from 'react';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
};

export function Input({
  label,
  error,
  helperText,
  multiline,
  maxLength,
  value,
  className = '',
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderClass = error
    ? 'border-error'
    : isFocused
      ? 'border-brand-primary'
      : 'border-border-light dark:border-border-dark';

  return (
    <View className={className}>
      {label ? (
        <Text className="mb-1 text-sm font-medium text-text-primary dark:text-text-primary-dark">
          {label}
        </Text>
      ) : null}
      <TextInput
        className={`min-h-[44px] rounded-lg border bg-surface px-3 py-2 text-base text-text-primary dark:bg-surface-dark dark:text-text-primary-dark ${borderClass} ${multiline ? 'min-h-[88px] py-3' : ''}`}
        placeholderTextColor="#6B6B6B"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        maxLength={maxLength}
        value={value}
        onFocus={(e) => {
          setIsFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />
      <View className="flex-row justify-between">
        {error ? (
          <Text className="mt-1 text-xs text-error">{error}</Text>
        ) : helperText ? (
          <Text className="mt-1 text-xs text-text-secondary dark:text-text-secondary-dark">
            {helperText}
          </Text>
        ) : (
          <View />
        )}
        {multiline && maxLength ? (
          <Text className="mt-1 text-xs text-text-secondary dark:text-text-secondary-dark">
            {value?.length ?? 0}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
