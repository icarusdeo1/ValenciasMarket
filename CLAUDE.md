# CLAUDE.md — Valencia's Carniceria & Taqueria

## Project Overview

**Valencia's Carniceria & Taqueria** is a family-owned Mexican restaurant and full-service grocery market in Citrus Heights, CA, operating since 2002. This project is a native iOS + Android mobile app (Expo/React Native) that replaces the existing third-party Snaptown ordering platform with a branded experience owned by Valencia's. The app unifies two ordering channels — the **Taqueria** (prepared food: burritos, tacos, combo plates, seafood, etc.) and the **Market** (meats, produce, tortillas, canned goods, beer, etc.) — into a single cart with modern authentication, extensive per-item customization, scheduled pickup or zone-based delivery, and multiple payment methods. A catering inquiry form is included alongside ordering.

The product scope, architecture, and acceptance criteria are defined in `valencias-PRD.md`. The full engineering breakdown (14 epics, 142 tasks) is in `valencias-tasks.md`. Always treat those two documents as the source of truth. If this file and the PRD disagree, the PRD wins — update this file.

## Role

You are an expert React Native / Expo development assistant for the Valencia's app. You help build, debug, test, and maintain a TypeScript-based cross-platform mobile app on Expo SDK 55 with the New Architecture enabled. You understand the two-channel menu data model, the customization engine with shared option-group templates, the checkout/payment flow, and the Supabase-backed auth and order persistence layer. You follow the conventions in this file and cross-reference task IDs (e.g., `3.1.5`, `7.2.3`) from `valencias-tasks.md` when scoping work.

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Expo SDK 55 (React Native 0.83) | New Architecture (JSI/Fabric/TurboModules) **mandatory** — no legacy bridge |
| **Language** | TypeScript (strict mode) | `noUncheckedIndexedAccess` enabled |
| **Navigation** | Expo Router v5 | File-based routing, typed routes, `Stack.Protected` for auth, deep linking (`valencias://`) |
| **Client State** | Zustand + MMKV | Persisted cart, auth reference, preferences |
| **Server State** | TanStack Query v5 | Order history, saved payments, async caches |
| **UI Styling** | NativeWind v4 | Tailwind for RN, `dark:` variants |
| **Native Primitives** | `@expo/ui` | SwiftUI/Compose wrappers — DatePicker, Toggle, ConfirmationDialog, ProgressView |
| **Animations** | React Native Reanimated v3 | UI-thread, 60fps |
| **Lists** | `@shopify/flash-list` | Recycler for 200+ item menus |
| **Bottom Sheets** | `@gorhom/bottom-sheet` v5 | Item detail is always a bottom sheet, never a routed screen |
| **Images** | `expo-image` | Blurhash placeholders, AVIF/WebP |
| **Maps** | `expo-maps` (with `react-native-maps` fallback) | iOS 18 SwiftUI / Jetpack Compose |
| **Blur / Edge-to-Edge** | `expo-blur`, `react-native-edge-to-edge` | Edge-to-edge mandatory for Android 16+ |
| **Forms** | React Hook Form | Catering form, checkout fields |
| **Auth / Backend** | Supabase (Auth, Postgres, Edge Functions, Realtime) | Email+password, Google OAuth, Apple Sign-In, RLS |
| **Payments** | `@stripe/stripe-react-native` + PayPal RN SDK | Stripe PaymentSheet + Apple Pay; PayPal in-app checkout |
| **Notifications** | `expo-notifications` | APNs on iOS, FCM on Android; dev builds required on Android |
| **Haptics / Linking** | `expo-haptics`, `expo-linking` | |
| **Error Monitoring** | Sentry (`@sentry/react-native`) | Source maps uploaded by EAS Build |
| **Build & Deploy** | EAS Build + EAS Submit + EAS Update | OTA via Hermes bytecode diffing |
| **Testing** | Jest + React Native Testing Library + Maestro (E2E) | Maestro runs the 10 smoke tests from PRD §12.6 |
| **Linting** | ESLint (`eslint-config-expo`) + Prettier | Pre-commit via husky + lint-staged |

### What We Do NOT Use

- **Legacy React Native Bridge** — New Architecture is mandatory. Run `npx expo-doctor` before adding any dep to verify compatibility.
- **`useSearchParams`** from Expo Router — use **`useLocalSearchParams`** (the older API is deprecated).
- **Routed screen for item detail** — item detail is always a `@gorhom/bottom-sheet` modal on top of the menu. No `app/item/[id].tsx`.
- **Raw card data in the app** — all PCI-sensitive data is handled by Stripe's prebuilt `PaymentSheet` / `CardField` or PayPal's SDK. Card numbers never touch our code.
- **AsyncStorage** — MMKV replaces it for all local persistence.
- **React Native `Animated` API** — use Reanimated v3. Legacy `Animated` runs on the JS thread and cannot hit 60fps.
- **`StyleSheet.create()` for standard styling** — NativeWind classNames. `StyleSheet` only for values NativeWind cannot express (e.g., `transform` matrices).
- **Redux / MobX / RxJS** — Zustand + TanStack Query only.
- **Firebase** — Sentry for errors; analytics (if added post-MVP) is Mixpanel or Amplitude.
- **Expo Go for production testing** — use EAS development/preview builds (expo-notifications and some New Arch modules are not in Expo Go).

## Architecture

```
Presentation (Expo Router screens + RN components + NativeWind)
        │
        ▼  read from stores / use query hooks
Stores (Zustand + MMKV)         Query Hooks (TanStack Query)
        │                                │
        ▼                                ▼
Services (Supabase client, AuthService, PaymentService, NotificationService)
        │
        ▼
Backend (Supabase Postgres + Edge Functions)        Constants (menu data, option groups)
```

### Layer Rules

- **Screens** (in `app/`) read from Zustand stores and call TanStack Query hooks. They never import `@supabase/supabase-js`, `@stripe/stripe-react-native`, or the PayPal SDK directly.
- **Stores** (`useAuthStore`, `useCartStore`, `usePreferencesStore`) encapsulate client state and persistence. Business logic lives here or in `src/utils/`.
- **Query hooks** (in `src/hooks/`) wrap TanStack Query for server state (order history, saved payments, catering submissions). They call services.
- **Services** (`src/services/`) wrap external SDKs: `supabase.ts` (client singleton), `PaymentService.ts` (Stripe + PayPal), `NotificationService.ts` (expo-notifications + permission handling).
- **Constants** (`src/constants/menu/`) are the hardcoded menu catalog for MVP. Post-MVP (14.3) they will migrate to Supabase-fetched with local cache.
- **Pure utilities** (`src/utils/`) — `calculateItemTotal`, `isBusinessOpen`, delivery-zone resolver, price formatter. No React, no platform imports, 100% unit-testable.
- All async work uses `async/await`. No `.then()` chains.

## Project Structure

```
ValenciasMarket/
├── app/                              # Expo Router v5 (file-based)
│   ├── _layout.tsx                   # Root: providers, Stack.Protected, Sentry wrap
│   ├── +not-found.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx               # 5 tabs: Home / Taqueria / Market / Catering / Profile
│   │   ├── index.tsx                 # Home
│   │   ├── taqueria.tsx
│   │   ├── market.tsx
│   │   ├── catering.tsx
│   │   └── profile.tsx
│   ├── cart.tsx
│   ├── checkout.tsx
│   ├── order-confirmation.tsx
│   ├── order-history.tsx
│   └── order-detail/[id].tsx
├── src/
│   ├── components/                   # Reusable UI (Button, Card, Input, QuantitySelector, RadioGroup, ...)
│   ├── constants/
│   │   ├── colors.ts                 # Brand palette (light + dark)
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── optionGroups.ts           # 15 reusable option-group templates (PRD §7)
│   │   └── menu/
│   │       ├── taqueria/             # breakfast.ts, burritos.ts, tacos.ts, sides.ts, ...
│   │       ├── market/               # beef.ts, pork.ts, produce.ts, beer.ts, ...
│   │       └── index.ts              # exports by channel+category, category display order
│   ├── stores/                       # useAuthStore, useCartStore, usePreferencesStore
│   ├── hooks/                        # useOrders, useSavedPayments, useCateringSubmit, ...
│   ├── utils/                        # calculateItemTotal, isBusinessOpen, deliveryZone, formatPrice
│   ├── services/                     # supabase.ts, PaymentService.ts, NotificationService.ts
│   └── types/                        # MenuItem, OptionGroup, OptionChoice, CartItem, Order, User
├── assets/                           # Icon, splash, brand images (🧑 provided by Valencia's)
├── supabase/
│   └── functions/                    # Edge Functions: delete-user, create-payment-intent, create-paypal-order, submit-order, submit-catering
├── __tests__/
│   ├── unit/                         # utils, stores, menu-data integrity
│   ├── component/                    # RNTL component tests
│   └── maestro/                      # 10 smoke-test flows (PRD §12.6)
├── app.config.ts
├── eas.json
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
├── tsconfig.json
├── global.css                        # NativeWind entry
├── valencias-PRD.md                  # Source of truth (do not edit without explicit instruction)
└── valencias-tasks.md                # Task breakdown referenced by ID (e.g., 3.1.5)
```

## Domain Glossary

| Term | Definition |
|------|-----------|
| **Taqueria** | One of two ordering channels. Prepared food: breakfast, burritos, tacos, sides, antojitos, soups, seafood, quesadillas, combo plates, beverages, catering trays. ~109 items across 11 categories. |
| **Market** | The grocery channel. Beef, pork, seafood, poultry, cheese, produce, tortillas, canned goods, dry goods, hot sauces, hot food, beverages, beer. 200+ items across 13 categories with per-unit pricing. |
| **Option Group** | Reusable customization template attached to a menu item (15 total templates defined in `src/constants/optionGroups.ts`). Each has an `id`, `name`, `required` flag, `type` (`single_select` or `optional_toggle`), and `choices[]` (each with optional `priceModifier`). |
| **Burrito Meat Choice** | Required single-select group. Options: Asada, Pollo, Barbacoa, Carnitas, Al Pastor, Chorizo, Lengua (+$1.99), Tripas (+$1.99). |
| **Tortilla Choice** | Required single-select group. Options: Corn, Flour. Applied to items like Chilaquiles, Enchiladas, combo plates 1–5, 7–13, 17. |
| **Special Instructions** | 500-char multiline field present on **every** item. Placeholder: "Example: No pepper / sugar / salt please." |
| **Order Type** | Pickup (default) or Delivery. Delivery reveals Google Places autocomplete + zone-based fee. |
| **Delivery Zone** | 1–5, with fees $7.99–$12.99 based on concentric radius from 8040 Greenback Ln (final polygons 🧑 TBD with Valencia's). |
| **10 POUND MAX** | Category-level banner on Beef (Market). Displayed as gold warning banner; enforced at quantity selection. |
| **Age Verification Gate** | Before opening any item in the Beer category, show a modal: "Are you 21 or older?" Yes/No. Stored **per session in Zustand only — never persisted**. |
| **First-Order Promo** | 10% discount auto-applied to a user's (or device's, for guests) first successful order. Eligibility validated server-side in `submit-order` Edge Function. |
| **Cart Staleness** | Cart stores the timestamp of its last update. If > 24h old on resume, show an info banner: "Your cart was updated over 24 hours ago. Prices may have changed." |
| **Guest Mode** | No-auth session. Full menu / cart / checkout access. On checkout, non-blocking "Create an account to track your order" prompt; if user converts, cart survives the auth flip. |
| **Catering Inquiry** | Separate form submission (not an order). Stored in `catering_inquiries` table. Rate-limited 3/hr/user. |

## Business Details

- **Address:** 8040 Greenback Lane, Citrus Heights, CA 95610
- **Phone:** (916) 729-2926 (tel: links open dialer)
- **Timezone:** `America/Los_Angeles`
- **Hours:** Mon–Thu 8:00 AM – 8:00 PM; Fri–Sun 8:00 AM – 9:00 PM
- **`isBusinessOpen()`** lives in `src/utils/` and drives the open/closed badge on the Home screen.

## Brand Identity

Defined in `src/constants/colors.ts`, `typography.ts`, `spacing.ts`, and mirrored in `tailwind.config.js`.

### Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `brand.primary` | `#C41E24` | Primary CTAs, active tab underline, cart FAB, promo banner |
| `brand.primaryDark` | `#8B1519` | Pressed states, gradients |
| `brand.secondary` | `#1B5E20` | "Open Now" badge, success states, completion |
| `brand.gold` | `#D4A844` | Accents, "10 POUND MAX" banner, first-order promo flourishes |
| `bg` / `bg.dark` | `#F5F5F5` / `#121212` | App background |
| `surface` / `surface.dark` | `#FFFFFF` / `#1E1E1E` | Cards, bottom sheet, inputs |
| `text.primary` | `#1A1A1A` (light) / `#FFFFFF` (dark) | Body text |
| `text.secondary` | `#6B6B6B` (light) / `#A0A0A0` (dark) | Labels, descriptions, helper text |
| Error red | `#D32F2F` | Inline input errors, declined payment |

### Spacing Scale

`4, 8, 12, 16, 20, 24, 32, 40, 48` (px). Exposed as Tailwind `spacing` numbered tokens.

### Typography

Bold sans-serif for headings, regular weight for body. Targets: Inter, SF Pro Display, or Poppins. Final font 🧑 TBD with brand assets from Valencia's (task 1.1.13). Min body size 16pt; support system Dynamic Type up to 200%.

### Touch Targets

Minimum **44 × 44 pt** for every interactive element. Audit in 11.2.2.

## Mobile Guardrails

### Navigation

- Item detail is a `@gorhom/bottom-sheet` modal with snap points 60% / 90%, backdrop blur via `expo-blur`. Never a routed screen.
- Every screen wraps content with `useSafeAreaInsets()`. `SafeAreaProvider` mounted once in `app/_layout.tsx`.
- `react-native-edge-to-edge` enabled; Android status bar / nav bar render transparent.
- Deep links: `valencias://`, `valencias://taqueria`, `valencias://market`, `valencias://catering`, `valencias://taqueria/burritos` (category-level).

### Auth

- `Stack.Protected` in `app/_layout.tsx` gates authenticated routes. Guest passthrough is allowed into tabs; only specific actions (save card, view order history) require conversion.
- Tokens managed by Supabase SDK in secure storage (Keychain/Keystore). Only an `isAuthenticated` / `isGuest` reference lands in MMKV via Zustand.
- Apple Sign-In only rendered on iOS. Google OAuth via `expo-auth-session`.

### Payments

- Stripe is the primary path: card via `PaymentSheet`, Apple Pay via `ApplePayButton` (iOS only, capability-checked).
- PayPal is an alternate path; opens in-app (not external Safari).
- `create-payment-intent` and `create-paypal-order` Edge Functions re-compute the order total server-side. **Never trust a client-provided total.**
- Double-submission prevention: disable "Place Order" after first tap, show a `ProgressView`; poll for order creation on network timeout before allowing retry.

### Cart

- Persisted to MMKV on every mutation.
- 50-item hard cap — toast "Cart limit reached (50 items)" blocks further adds.
- Cart survives guest → authenticated conversion.
- Swipe-to-delete and quantity adjustment both update subtotal reactively.

### Menu & Customization

- All items pulled from `src/constants/menu/` (MVP). Prices must be > 0; every required option group must have ≥ 2 choices.
- **Upcharges are precise — copy from PRD verbatim.** Lengua / Tripas / Extra Burrito Meat = +$1.99. Nachos meat = +$0.99 (NOT +$1.99). Quesadilla Extra Meat = +$1.99 (NOT +$2.59).
- `calculateItemTotal(basePrice, selectedChoices, quantity)` is the single source of pricing. Every screen that shows a price ultimately goes through it. Tests in `__tests__/unit/` cover TC-OPT-04 through TC-OPT-08.
- Chimichanga and similar items: confirm from PRD whether they accept option groups or are special-instructions-only. **Do not guess.**

### Beer / Age Verification

- Beer gate shown before item detail sheet opens. Confirmation is per-session only — Zustand, never persisted, never synced. If user declines, return to menu without adding.

### Offline & Performance

- Menu data is bundled (constants); app loads fully offline for browsing.
- Images use `expo-image` with blurhash placeholders; thumbnails sized to 80×80, never load 1920px sources.
- Targets: cold start **< 2s**; menu scroll **60 FPS** on 200+ items (test on Samsung A54); bottom sheet open **< 300ms**; crash-free **> 99.5%**.

### Accessibility

- Every interactive element needs `accessibilityLabel` and `accessibilityRole`. Labels are descriptive ("Add Regular Burrito with Asada to cart"), not generic ("Button").
- WCAG AA contrast: 4.5:1 body, 3:1 large, in both light and dark mode.
- Test at 100%, 150%, 200% system font.
- VoiceOver/TalkBack must be able to complete a full order end-to-end (11.2.5).

### Security & Privacy

- No secrets in repo. Use `.env.local` (gitignored) for local dev, EAS Secrets for builds.
- Delete-account path (`supabase/functions/delete-user`) purges user + orders + saved payments within 30 days per App Store requirement.
- Analytics (post-MVP) must not include user-generated content — only counts and event types.

## Workflow

### 1. Before Writing Code

- Trace the request to a **PRD section** and a **task ID** in `valencias-tasks.md`. If no task exists, ask.
- Identify the architecture layer: `app/` (screen), `src/components/` (UI), `src/stores/` (state), `src/hooks/` (query), `src/utils/` (pure), `src/services/` (SDK wrapper), `src/constants/menu/` (data), `supabase/functions/` (backend).
- If the change touches payments, re-read PRD §5.6 and §10 before editing. If it touches the menu, re-read §7 + Appendix A & B.

### 2. Write the Code

- TypeScript strict — no `any`, no `@ts-ignore`. Type assertions require a comment explaining why.
- NativeWind classNames for all styling. `StyleSheet.create` only for values Tailwind cannot express.
- Reanimated v3 for all animation. Never `Animated`.
- Zustand for cross-screen/persistent state; React `useState` for ephemeral UI (input focus, modal-open flags).
- All user-facing strings extracted to constants — no hardcoded JSX strings (prepping for 14.8 Spanish support).
- Prices always formatted via `formatPrice()` — never template-literal `$${x}`.
- Run `npx expo-doctor` and `npx tsc --noEmit` before committing.

### 3. Branch, Commit, Push

Always use feature branches. Never commit to `dev` or `main` directly.

1. `git checkout dev && git pull origin dev`
2. `git checkout -b <type>/<task-id>-<short-slug>` — e.g. `feature/3.1.1-option-group-templates`, `fix/7.4.4-double-submit-guard`, `test/3.2.2-price-calculator`.
3. One logical change per commit. Conventional Commits: `feat(3.1.1): add option group templates`.
4. Push `git push origin <branch>` and open a PR into `dev`. Link the task ID in the PR description.
5. After merge, delete the local branch: `git branch -d <branch>`.

Branch prefixes: `feature/`, `fix/`, `chore/`, `refactor/`, `test/`, `docs/`.

`main` is store-release stable. `dev` is integration + EAS preview builds. Feature branches merge to `dev`, `dev` promotes to `main` on release.

### 4. Report

After each task:
- What was built or fixed and why (linked to task ID).
- Which layers were touched.
- Whether `expo-doctor`, `tsc`, and tests pass.
- Any 🧑 human blockers surfaced (missing API keys, brand assets, owner decisions).

## CI/CD

| Trigger | Pipeline | Steps |
|---------|----------|-------|
| PR opened/updated | `ci-pr` | ESLint + Prettier → `tsc --noEmit` → Jest unit + RNTL component tests → coverage gate |
| Merge to `dev` | `ci-dev` | Full tests → EAS Build (preview profile) → internal distribution (TestFlight + Play internal track) |
| Merge to `main` | `ci-main` | Full tests → EAS Build (production profile) → EAS Submit to App Store Connect + Play Console |
| Weekly | `ci-e2e` | EAS Build (development) → Maestro 10-flow smoke suite on iOS + Android |

Lockfile is frozen. OTA updates for JS/asset-only changes via EAS Update; native changes require a new build.

## Rules

- **Set git author** before committing: `git config user.email "icarusdeo1@gmail.com" && git config user.name "icarusdeo1"`.
- **Never commit secrets** — `.env.local` is gitignored; use EAS Secrets for build-time values (e.g., `SENTRY_AUTH_TOKEN`).
- **Never delete user order data** without explicit double-confirmation (account deletion flow, task 2.4.2/2.4.3).
- **Never modify `valencias-PRD.md` or `valencias-tasks.md`** without an explicit instruction — they are the spec.
- **Preserve existing code patterns** — match naming and architecture already in use.
- **If unsure about a fix**, explain the issue and your proposal before editing.
- **Don't suppress errors** with empty `catch {}`.
- **No hardcoded strings in JSX.**
- **No `Animated`, no `AsyncStorage`, no `StyleSheet.create` for standard styling, no raw card data, no routed item detail, no direct payment SDK calls from screens, no direct `supabase.auth.*` calls from screens.**
- **Run `npx expo-doctor`** any time a dependency is added or upgraded. If it reports incompatibility, stop and flag.
- **If an error is clearly a platform bug** (Expo, Reanimated, Stripe SDK), surface it instead of papering over it.

## Human-Dependent Blockers (🧑)

These are tracked in `valencias-tasks.md` Summary. Flag them proactively when they block engineering work:

- 🧑 **Supabase project** (1.1.6) — blocks all backend work.
- 🧑 **Stripe / PayPal / Google Places keys** (1.1.7–1.1.9) — blocks Epic 7.
- 🧑 **Apple Developer + Play Console** (1.1.10, 1.1.11) — blocks iOS EAS builds, Apple Sign-In, and store submission.
- 🧑 **Brand assets** (1.1.13) — blocks Home hero, app icon, splash.
- 🧑 **Delivery zone polygons** (7.1.3) — default to concentric radius until provided.
- 🧑 **Order receipt method** (7.4.1) — email / tablet / POS / printer — blocks `submit-order`.
- 🧑 **Restaurant support + catering email** (8.1.2, 9.1.6).
- 🧑 **App Store assets + privacy policy** (13.1.1–13.1.6).
