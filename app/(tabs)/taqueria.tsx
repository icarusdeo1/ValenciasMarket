import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { MenuItem } from '@/types';
import { TAQUERIA_CATEGORIES } from '@/constants/menu';
import { useCartStore } from '@/stores';
import { formatPrice } from '@/utils/calculateItemTotal';
import { MenuScreen } from '@/components/MenuScreen';
import { ItemDetailSheet } from '@/components/ItemDetailSheet';
import { CartFAB } from '@/components/CartFAB';

export default function TaqueriaScreen() {
  const insets = useSafeAreaInsets();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());

  const handleItemPress = useCallback((item: MenuItem) => {
    setSelectedItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: insets.top }}>
      <MenuScreen categories={TAQUERIA_CATEGORIES} onItemPress={handleItemPress} />

      {selectedItem ? (
        <ItemDetailSheet item={selectedItem} onClose={handleClose} />
      ) : null}

      <CartFAB itemCount={itemCount} subtotal={formatPrice(subtotal)} />
    </GestureHandlerRootView>
  );
}
