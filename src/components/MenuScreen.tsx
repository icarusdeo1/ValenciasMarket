import { View, Text } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useState, useCallback, useRef } from 'react';
import type { MenuItem } from '@/types';
import type { CategoryMap } from '@/constants/menu';
import { CategoryTabBar } from './CategoryTabBar';
import { MenuSearchBar } from './MenuSearchBar';
import { MenuItemCard } from './MenuItemCard';
import { CategoryBanner } from './CategoryBanner';
import { EmptyState } from './EmptyState';

type SectionItem =
  | { type: 'header'; category: CategoryMap }
  | { type: 'item'; item: MenuItem };

type MenuScreenProps = {
  categories: CategoryMap[];
  onItemPress: (item: MenuItem) => void;
};

function buildSectionData(categories: CategoryMap[]): SectionItem[] {
  const items: SectionItem[] = [];
  for (const category of categories) {
    items.push({ type: 'header', category });
    for (const item of category.items) {
      items.push({ type: 'item', item });
    }
  }
  return items;
}

function filterCategories(categories: CategoryMap[], query: string): CategoryMap[] {
  if (!query) return categories;
  return categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description?.toLowerCase().includes(query) ?? false),
      ),
    }))
    .filter((cat) => cat.items.length > 0);
}

export function MenuScreen({ categories, onItemPress }: MenuScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const listRef = useRef<FlashListRef<SectionItem>>(null);

  const filtered = filterCategories(categories, searchQuery);
  const sectionData = buildSectionData(filtered);
  const categoryNames = filtered.map((c) => c.name);

  const handleTabPress = useCallback(
    (index: number) => {
      setActiveTabIndex(index);
      const targetCategory = filtered[index];
      if (!targetCategory) return;
      const sectionIndex = sectionData.findIndex(
        (s) => s.type === 'header' && s.category.name === targetCategory.name,
      );
      if (sectionIndex >= 0 && listRef.current) {
        listRef.current.scrollToIndex({ index: sectionIndex, animated: true });
      }
    },
    [filtered, sectionData],
  );

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: SectionItem }> }) => {
      const firstHeader = viewableItems.find((v) => v.item.type === 'header');
      if (firstHeader && firstHeader.item.type === 'header') {
        const idx = filtered.findIndex(
          (c) => c.name === (firstHeader.item as { type: 'header'; category: CategoryMap }).category.name,
        );
        if (idx >= 0 && idx !== activeTabIndex) {
          setActiveTabIndex(idx);
        }
      }
    },
    [filtered, activeTabIndex],
  );

  const renderItem = useCallback(
    ({ item }: { item: SectionItem }) => {
      if (item.type === 'header') {
        const cat = item.category;
        return (
          <View className="px-4 pb-1 pt-4">
            <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              {cat.name}
            </Text>
            {cat.description ? (
              <Text className="mt-0.5 text-sm text-text-secondary dark:text-text-secondary-dark">
                {cat.description}
              </Text>
            ) : null}
            {cat.items[0]?.maxQuantityNote ? (
              <View className="mt-1">
                <CategoryBanner text={cat.items[0].maxQuantityNote} />
              </View>
            ) : null}
          </View>
        );
      }
      return <MenuItemCard item={item.item} onPress={onItemPress} />;
    },
    [onItemPress],
  );

  return (
    <View className="flex-1 bg-bg dark:bg-bg-dark">
      <MenuSearchBar onSearch={setSearchQuery} />
      {!searchQuery && categoryNames.length > 0 ? (
        <CategoryTabBar
          categories={categoryNames}
          activeIndex={activeTabIndex}
          onTabPress={handleTabPress}
        />
      ) : null}
      {sectionData.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No results found"
          subtitle="Try a different search term."
        />
      ) : (
        <FlashList
          ref={listRef}
          data={sectionData}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.type === 'header'
              ? `header-${item.category.name}`
              : `item-${item.item.id}-${index}`
          }
          getItemType={(item) => item.type}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />
      )}
    </View>
  );
}
