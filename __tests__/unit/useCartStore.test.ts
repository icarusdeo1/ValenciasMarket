jest.mock('expo-crypto', () => {
  let seq = 0;
  return { randomUUID: () => `test-uuid-${++seq}` };
});

jest.mock('react-native-mmkv', () => {
  class MockMMKV {
    private store = new Map<string, boolean | string | number>();
    set(key: string, value: boolean | string | number) { this.store.set(key, value); }
    getString(key: string) { const v = this.store.get(key); return typeof v === 'string' ? v : undefined; }
    getNumber(key: string) { const v = this.store.get(key); return typeof v === 'number' ? v : undefined; }
    getBoolean(key: string) { const v = this.store.get(key); return typeof v === 'boolean' ? v : undefined; }
    remove(key: string) { return this.store.delete(key); }
    clearAll() { this.store.clear(); }
  }
  return { createMMKV: () => new MockMMKV() };
});

import { useCartStore } from '../../src/stores/useCartStore';
import type { MenuItem, SelectedChoice } from '../../src/types';

const MOCK_BURRITO: MenuItem = {
  id: 'regular-burrito',
  name: 'Regular Burrito',
  price: 11.99,
  category: 'Burritos',
  channel: 'taqueria',
};

const MOCK_TACO: MenuItem = {
  id: 'asada-taco',
  name: 'Asada Taco',
  price: 2.99,
  category: 'Tacos',
  channel: 'taqueria',
};

const LENGUA: SelectedChoice = {
  groupId: 'burrito_meat_choice',
  choiceId: 'lengua',
  priceModifier: 1.99,
};

function resetCart() {
  useCartStore.getState().clearCart();
}

describe('useCartStore', () => {
  beforeEach(() => {
    resetCart();
  });

  describe('addItem', () => {
    it('adds an item to the cart and returns true', () => {
      const ok = useCartStore.getState().addItem(MOCK_BURRITO, [LENGUA], 'no onions', 2);
      expect(ok).toBe(true);
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0]?.menuItem.id).toBe('regular-burrito');
      expect(items[0]?.quantity).toBe(2);
      expect(items[0]?.specialInstructions).toBe('no onions');
    });

    it('rejects adding a 51st item (50-item cap)', () => {
      const store = useCartStore.getState();
      for (let i = 0; i < 50; i++) {
        store.addItem(MOCK_TACO, [], '', 1);
      }
      expect(useCartStore.getState().items).toHaveLength(50);
      const rejected = useCartStore.getState().addItem(MOCK_TACO, [], '', 1);
      expect(rejected).toBe(false);
      expect(useCartStore.getState().items).toHaveLength(50);
    });

    it('updates lastUpdated timestamp on add', () => {
      const before = useCartStore.getState().lastUpdated;
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 1);
      expect(useCartStore.getState().lastUpdated).toBeGreaterThan(before);
    });
  });

  describe('removeItem', () => {
    it('removes an item by cartItemId', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 1);
      useCartStore.getState().addItem(MOCK_TACO, [], '', 1);
      const firstId = useCartStore.getState().items[0]!.cartItemId;
      useCartStore.getState().removeItem(firstId);
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0]?.menuItem.id).toBe('asada-taco');
    });

    it('is a no-op for unknown cartItemId', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 1);
      useCartStore.getState().removeItem('nonexistent');
      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('changes quantity', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 1);
      const id = useCartStore.getState().items[0]!.cartItemId;
      useCartStore.getState().updateQuantity(id, 5);
      expect(useCartStore.getState().items[0]?.quantity).toBe(5);
    });

    it('removes the item when quantity <= 0', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 2);
      const id = useCartStore.getState().items[0]!.cartItemId;
      useCartStore.getState().updateQuantity(id, 0);
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('updateItem', () => {
    it('replaces choices, instructions, and quantity', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 1);
      const id = useCartStore.getState().items[0]!.cartItemId;
      useCartStore.getState().updateItem(id, [LENGUA], 'extra salsa', 3);
      const item = useCartStore.getState().items[0]!;
      expect(item.selectedChoices).toEqual([LENGUA]);
      expect(item.specialInstructions).toBe('extra salsa');
      expect(item.quantity).toBe(3);
    });
  });

  describe('getSubtotal', () => {
    it('returns 0 when empty', () => {
      expect(useCartStore.getState().getSubtotal()).toBe(0);
    });

    it('sums base prices + modifiers * quantities', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [LENGUA], '', 2); // (11.99 + 1.99) * 2 = 27.96
      useCartStore.getState().addItem(MOCK_TACO, [], '', 3); // 2.99 * 3 = 8.97
      expect(useCartStore.getState().getSubtotal()).toBeCloseTo(36.93, 2);
    });
  });

  describe('getItemCount', () => {
    it('returns total quantity summed across items', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 2);
      useCartStore.getState().addItem(MOCK_TACO, [], '', 5);
      expect(useCartStore.getState().getItemCount()).toBe(7);
    });
  });

  describe('isStale', () => {
    it('returns false when cart is empty (lastUpdated=0)', () => {
      expect(useCartStore.getState().isStale()).toBe(false);
    });

    it('returns false for a fresh cart', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 1);
      expect(useCartStore.getState().isStale()).toBe(false);
    });

    it('returns true when lastUpdated is more than 24 hours old', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 1);
      const spy = jest.spyOn(Date, 'now').mockReturnValue(
        useCartStore.getState().lastUpdated + 25 * 60 * 60 * 1000,
      );
      expect(useCartStore.getState().isStale()).toBe(true);
      spy.mockRestore();
    });
  });

  describe('clearCart', () => {
    it('empties items and resets lastUpdated', () => {
      useCartStore.getState().addItem(MOCK_BURRITO, [], '', 1);
      useCartStore.getState().clearCart();
      expect(useCartStore.getState().items).toHaveLength(0);
      expect(useCartStore.getState().lastUpdated).toBe(0);
    });
  });
});
