import { View, TextInput, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

type MenuSearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export function MenuSearchBar({ onSearch, placeholder = 'Search menu...' }: MenuSearchBarProps) {
  const [text, setText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(text.trim().toLowerCase());
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, onSearch]);

  return (
    <View className="mx-4 mb-2 flex-row items-center rounded-lg bg-surface px-3 dark:bg-surface-dark">
      <Ionicons name="search" size={18} color="#6B6B6B" />
      <TextInput
        className="ml-2 min-h-[44px] flex-1 text-base text-text-primary dark:text-text-primary-dark"
        placeholder={placeholder}
        placeholderTextColor="#6B6B6B"
        value={text}
        onChangeText={setText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search menu items"
      />
      {text.length > 0 ? (
        <Pressable
          onPress={() => setText('')}
          className="min-h-[44px] min-w-[44px] items-center justify-center"
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={18} color="#A0A0A0" />
        </Pressable>
      ) : null}
    </View>
  );
}
