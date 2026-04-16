import { create } from 'zustand';
import { storage } from './mmkv';
import type { User } from '@/types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setGuest: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isGuest: storage.getBoolean('auth.isGuest') ?? false,
  isLoading: false,

  login: (user) => {
    storage.set('auth.isAuthenticated', true);
    storage.set('auth.isGuest', false);
    set({ user, isAuthenticated: true, isGuest: false });
  },

  logout: () => {
    storage.remove('auth.isAuthenticated');
    storage.remove('auth.isGuest');
    set({ user: null, isAuthenticated: false, isGuest: false });
  },

  setGuest: () => {
    storage.set('auth.isGuest', true);
    storage.set('auth.isAuthenticated', false);
    set({ user: null, isAuthenticated: false, isGuest: true });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
