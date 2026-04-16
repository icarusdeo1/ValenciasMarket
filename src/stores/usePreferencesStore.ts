import { create } from 'zustand';
import { storage } from './mmkv';

type ColorScheme = 'system' | 'light' | 'dark';

type PreferencesState = {
  colorScheme: ColorScheme;
  hasCompletedOnboarding: boolean;
  isFirstOrder: boolean;
  notificationsOrderUpdates: boolean;
  notificationsPromotions: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  setOnboardingComplete: () => void;
  setFirstOrderUsed: () => void;
  setNotificationsOrderUpdates: (enabled: boolean) => void;
  setNotificationsPromotions: (enabled: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  colorScheme: (storage.getString('prefs.colorScheme') as ColorScheme | undefined) ?? 'system',
  hasCompletedOnboarding: storage.getBoolean('prefs.onboarded') ?? false,
  isFirstOrder: storage.getBoolean('prefs.isFirstOrder') ?? true,
  notificationsOrderUpdates: storage.getBoolean('prefs.notifOrders') ?? true,
  notificationsPromotions: storage.getBoolean('prefs.notifPromos') ?? false,

  setColorScheme: (scheme) => {
    storage.set('prefs.colorScheme', scheme);
    set({ colorScheme: scheme });
  },

  setOnboardingComplete: () => {
    storage.set('prefs.onboarded', true);
    set({ hasCompletedOnboarding: true });
  },

  setFirstOrderUsed: () => {
    storage.set('prefs.isFirstOrder', false);
    set({ isFirstOrder: false });
  },

  setNotificationsOrderUpdates: (enabled) => {
    storage.set('prefs.notifOrders', enabled);
    set({ notificationsOrderUpdates: enabled });
  },

  setNotificationsPromotions: (enabled) => {
    storage.set('prefs.notifPromos', enabled);
    set({ notificationsPromotions: enabled });
  },
}));
