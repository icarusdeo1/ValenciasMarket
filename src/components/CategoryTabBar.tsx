import { useRef, useEffect, useCallback } from 'react';
import { Text, Pressable, FlatList } from 'react-native';

type CategoryTabBarProps = {
  categories: string[];
  activeIndex: number;
  onTabPress: (index: number) => void;
};

export function CategoryTabBar({ categories, activeIndex, onTabPress }: CategoryTabBarProps) {
  const listRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    if (listRef.current && categories.length > 0) {
      listRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [activeIndex, categories.length]);

  const renderTab = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      const isActive = index === activeIndex;
      return (
        <Pressable
          className={`min-h-[44px] items-center justify-center px-4 ${isActive ? 'border-b-2 border-brand-primary' : ''}`}
          onPress={() => onTabPress(index)}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={item}
        >
          <Text
            className={`text-sm ${isActive ? 'font-bold text-brand-primary' : 'font-medium text-text-secondary dark:text-text-secondary-dark'}`}
          >
            {item}
          </Text>
        </Pressable>
      );
    },
    [activeIndex, onTabPress],
  );

  return (
    <FlatList
      ref={listRef}
      data={categories}
      renderItem={renderTab}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="max-h-[48px] border-b border-border-light bg-surface dark:border-border-dark dark:bg-surface-dark"
      onScrollToIndexFailed={() => {}}
    />
  );
}
