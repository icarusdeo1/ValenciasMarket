import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { MenuItem } from '@/types';
import { MARKET_CATEGORIES } from '@/constants/menu';
import { useCartStore, useAgeVerifiedStore } from '@/stores';
import { formatPrice } from '@/utils/calculateItemTotal';
import { MenuScreen } from '@/components/MenuScreen';
import { ItemDetailSheet } from '@/components/ItemDetailSheet';
import { CartFAB } from '@/components/CartFAB';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [pendingBeerItem, setPendingBeerItem] = useState<MenuItem | null>(null);
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());
  const { verified, setVerified } = useAgeVerifiedStore();

  const handleItemPress = useCallback(
    (item: MenuItem) => {
      if (item.requiresAgeVerification && !verified) {
        setPendingBeerItem(item);
        return;
      }
      setSelectedItem(item);
    },
    [verified],
  );

  const handleAgeConfirm = useCallback(() => {
    setVerified();
    if (pendingBeerItem) {
      setSelectedItem(pendingBeerItem);
      setPendingBeerItem(null);
    }
  }, [pendingBeerItem, setVerified]);

  const handleAgeCancel = useCallback(() => {
    setPendingBeerItem(null);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: insets.top }}>
      <MenuScreen categories={MARKET_CATEGORIES} onItemPress={handleItemPress} />

      {selectedItem ? (
        <ItemDetailSheet item={selectedItem} onClose={handleClose} />
      ) : null}

      <CartFAB itemCount={itemCount} subtotal={formatPrice(subtotal)} />

      <AgeVerificationModal
        visible={!!pendingBeerItem}
        onConfirm={handleAgeConfirm}
        onCancel={handleAgeCancel}
      />
    </GestureHandlerRootView>
  );
}
