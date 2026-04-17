import { create } from 'zustand';

type AgeVerifiedState = {
  verified: boolean;
  setVerified: () => void;
};

/**
 * Session-only age-gate flag for beer (21+). Intentionally NOT persisted —
 * CLAUDE.md rule: "Beer gate shown before item detail sheet opens.
 * Confirmation is per-session only — Zustand, never persisted, never synced."
 */
export const useAgeVerifiedStore = create<AgeVerifiedState>((set) => ({
  verified: false,
  setVerified: () => set({ verified: true }),
}));
