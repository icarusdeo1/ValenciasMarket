# Valencia's Carniceria & Taqueria

Native iOS + Android app (Expo + React Native) for Valencia's in Citrus Heights, CA.
Replaces Snaptown with a branded ordering experience across Taqueria (prepared food)
and Market (grocery) channels, plus catering inquiries.

See `valencias-PRD.md` for the product spec and `valencias-tasks.md` for the engineering
breakdown. See `CLAUDE.md` for development conventions.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in EXPO_PUBLIC_SENTRY_DSN etc. as you get them
npm run start                # Expo dev server
npm run ios                  # iOS dev build (requires macOS + Apple Developer account)
npm run android              # Android dev build
```

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run start` | Start Expo dev server |
| `npm run ios` | Build + run iOS dev client |
| `npm run android` | Build + run Android dev client |
| `npm run web` | Start web bundler (dev only) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run doctor` | `npx expo-doctor` |
| `npm run lint` | `expo lint` |

## Environment variables

All public env vars must be prefixed `EXPO_PUBLIC_`. See `.env.example`.

| Variable | When needed | How to obtain |
|----------|-------------|---------------|
| `EXPO_PUBLIC_SENTRY_DSN` | Error monitoring (any build) | Sentry project settings (🧑 1.1.12) |
| `EXPO_PUBLIC_SUPABASE_URL` | Epic 2 (auth) | Supabase project (🧑 1.1.6) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Epic 2 | Supabase project (🧑 1.1.6) |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Epic 7 (payments) | Stripe dashboard (🧑 1.1.7) |
| `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` | Epic 7 (delivery address) | Google Cloud (🧑 1.1.9) |

## Build profiles (EAS)

- `development` — dev client for local testing and E2E
- `preview` — internal distribution for TestFlight / Play internal track
- `production` — App Store / Play Store submission

## Current state

Feature 1.1 project scaffold complete: Expo Router v5, TypeScript strict, NativeWind v4,
Zustand + MMKV, TanStack Query, FlashList, Reanimated, bottom sheet, edge-to-edge, Sentry.
Navigation shell (Feature 1.2), design system (Feature 1.3), and state stores (Feature 1.4)
are the next work items.
