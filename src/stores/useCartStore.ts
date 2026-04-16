import { create } from 'zustand';
import { storage } from './mmkv';
import type { CartItem, MenuItem, SelectedChoice } from '@/types';

const CART_KEY = 'cart.items';
const CART_TIMESTAMP_KEY = 'cart.lastUpdated';
const MAX_CART_ITEMS = 50;

function persistCart(items: CartItem[], timestamp: number) {
  storage.set(CART_KEY, JSON.stringify(items));
  storage.set(CART_TIMESTAMP_KEY, timestamp);
}

function loadCart(): { items: CartItem[]; lastUpdated: number } {
  const raw = storage.getString(CART_KEY);
  const timestamp = storage.getNumber(CART_TIMESTAMP_KEY) ?? 0;
  if (!raw) return { items: [], lastUpdated: 0 };
  try {
    const items = JSON.parse(raw) as CartItem[];
    return { items, lastUpdated: timestamp };
  } catch {
    return { items: [], lastUpdated: 0 };
  }
}

let nextCartItemId = Date.now();

type CartState = {
  items: CartItem[];
  lastUpdated: number;
  addItem: (
    menuItem: MenuItem,
    selectedChoices: SelectedChoice[],
    specialInstructions: string,
    quantity: number,
  ) => boolean;
  removeItem: (cartItemId: string) => void;
  updateItem: (
    cartItemId: string,
    selectedChoices: SelectedChoice[],
    specialInstructions: string,
    quantity: number,
  ) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  isStale: () => boolean;
};

export const useCartStore = create<CartState>((set, get) => {
  const { items, lastUpdated } = loadCart();

  return {
    items,
    lastUpdated,

    addItem: (menuItem, selectedChoices, specialInstructions, quantity) => {
      const state = get();
      if (state.items.length >= MAX_CART_ITEMS) return false;

      const newItem: CartItem = {
        cartItemId: String(nextCartItemId++),
        menuItem,
        selectedChoices,
        specialInstructions,
        quantity,
      };
      const now = Date.now();
      const updated = [...state.items, newItem];
      persistCart(updated, now);
      set({ items: updated, lastUpdated: now });
      return true;
    },

    removeItem: (cartItemId) => {
      const now = Date.now();
      const updated = get().items.filter((i) => i.cartItemId !== cartItemId);
      persistCart(updated, now);
      set({ items: updated, lastUpdated: now });
    },

    updateItem: (cartItemId, selectedChoices, specialInstructions, quantity) => {
      const now = Date.now();
      const updated = get().items.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, selectedChoices, specialInstructions, quantity }
          : item,
      );
      persistCart(updated, now);
      set({ items: updated, lastUpdated: now });
    },

    updateQuantity: (cartItemId, quantity) => {
      const now = Date.now();
      if (quantity <= 0) {
        const updated = get().items.filter((i) => i.cartItemId !== cartItemId);
        persistCart(updated, now);
        set({ items: updated, lastUpdated: now });
        return;
      }
      const updated = get().items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item,
      );
      persistCart(updated, now);
      set({ items: updated, lastUpdated: now });
    },

    clearCart: () => {
      storage.remove(CART_KEY);
      storage.remove(CART_TIMESTAMP_KEY);
      set({ items: [], lastUpdated: 0 });
    },

    getSubtotal: () => {
      return get().items.reduce((sum, item) => {
        const choiceTotal = item.selectedChoices.reduce(
          (acc, c) => acc + c.priceModifier,
          0,
        );
        return sum + (item.menuItem.price + choiceTotal) * item.quantity;
      }, 0);
    },

    getItemCount: () => {
      return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    isStale: () => {
      const { lastUpdated } = get();
      if (lastUpdated === 0) return false;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      return Date.now() - lastUpdated > twentyFourHours;
    },
  };
});
