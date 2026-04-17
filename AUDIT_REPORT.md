# Valencia's — Codebase Audit Report

**Audit date:** 2026-04-16
**Auditor:** Principal-engineer review pass (per `.claude/prompts/codebase_audit_prompt.md`)
**Baseline:** `npx tsc --noEmit` clean · `npx jest` 8/8 passing · `npx expo-doctor` 17/17

---

## Phase 1 — Discovery

### Inventory

**Runtime & framework**
- Expo **54.0.33** (React Native **0.81.5**, React **19.1.0**)
- New Architecture enabled (`app.config.ts:11 newArchEnabled: true`)
- TypeScript **5.9.2** strict mode + `noUncheckedIndexedAccess`
- Node 22.14.0, npm 10.9.2

**State / data layer**
- Zustand **5.0.12** + MMKV **4.3.1** (`react-native-mmkv` v4 uses `createMMKV()`, not legacy `new MMKV()`)
- TanStack Query **5.99.0** (QueryClient configured at `app/_layout.tsx:19-27`)

**UI**
- Expo Router **6.0.23** (file-based, typed routes enabled)
- NativeWind **4.2.3** + Tailwind **3.4.19** (dark mode via `'media'`)
- `@gorhom/bottom-sheet` **5.2.9**, `@shopify/flash-list` **2.0.2**, Reanimated **4.1.1** (+ `react-native-worklets` 0.5.1)
- `@expo/vector-icons` 15.0.3, expo-image 3.0.11

**Observability / errors**
- Sentry React Native **7.2.0** (init at `app/_layout.tsx:11-15`)

**Tooling**
- Jest **30.3.0** + ts-jest **29.4.9** (`jest.config.js`)
- Lint via `expo lint` (no committed `eslint.config.js`)
- No committed Prettier config

### Entry points

- **Main:** `package.json:4` → `"expo-router/entry"`
- **Root layout:** [app/_layout.tsx](app/_layout.tsx) wires Sentry → TanStack Query → SafeArea → Toast → Slot, plus a session-based auth guard.
- **Tab layout:** [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) — 5 tabs (Home, Taqueria, Market, Catering, Profile).
- **Auth stack:** [app/(auth)/_layout.tsx](app/(auth)/_layout.tsx) — login, register, forgot-password.
- **Standalone routes:** `cart.tsx`, `checkout.tsx`, `order-confirmation.tsx`, `order-history.tsx`, `order-detail/[id].tsx`, `help.tsx`, `settings/index.tsx`, `+not-found.tsx`.

### Architecture

```
Screens (app/)
   ↓ read
Stores (Zustand + MMKV)        Hooks (TanStack Query)
   ↓                                ↓
Services (src/services/)   [currently empty — Supabase/Stripe/PayPal deferred]
   ↓
Backend (Supabase — not provisioned)       Constants (menu, option groups)
```

**Layer counts**
| Dir | Files |
|-----|-------|
| `app/` | 19 routes |
| `src/components/` | 19 components (Button, Card, Input, Toast, Skeleton, QuantitySelector, RadioGroup, ToggleOption, CartFAB, EmptyState, MenuItemCard, CategoryTabBar, MenuSearchBar, CategoryBanner, AgeVerificationModal, MenuScreen, ItemDetailSheet, CartItemRow, index) |
| `src/stores/` | 5 (useAuthStore, useCartStore, usePreferencesStore, mmkv, index) |
| `src/utils/` | 4 (calculateItemTotal, isBusinessOpen, deliveryZone, index) |
| `src/constants/` | 30 (colors, typography, spacing, optionGroups, menu/index, menu/taqueria/×11, menu/market/×14) |
| `src/hooks/` | 1 (useSession) |
| `src/types/` | 1 (index.ts — MenuItem, CartItem, Order, OptionGroup, User, etc.) |
| `src/services/` | 0 (intentionally empty pending Supabase/Stripe/PayPal) |
| `__tests__/unit/` | 1 (calculateItemTotal.test.ts — 8 tests) |

**Persistence**
- MMKV keys: `auth.isAuthenticated`, `auth.isGuest` ([src/stores/useAuthStore.ts](src/stores/useAuthStore.ts)); `cart.items`, `cart.lastUpdated` ([src/stores/useCartStore.ts:10-11](src/stores/useCartStore.ts)); `prefs.colorScheme`, `prefs.onboarded`, `prefs.isFirstOrder`, `prefs.notifOrders`, `prefs.notifPromos` ([src/stores/usePreferencesStore.ts](src/stores/usePreferencesStore.ts)).
- No `AsyncStorage` usage anywhere.
- No secrets in MMKV (per CLAUDE.md rule — auth tokens live in Supabase SDK's secure storage when wired).

### Current health signals

| Signal | Result |
|--------|--------|
| `tsc --noEmit` | 0 errors |
| `jest` | 8/8 passing (1 test file) |
| `expo-doctor` | 17/17 |
| `any` in `src/` + `app/` | **0** |
| `@ts-ignore` / `@ts-expect-error` | **0** |
| `console.log/error/warn/debug` | **0** |
| `StyleSheet.create` | **0** (NativeWind only) |
| `AsyncStorage` | **0** (MMKV only) |
| Legacy `Animated` API | **0** (Reanimated v4 only) |
| `.then()` chains | **0** (async/await only) |
| Empty `catch {}` blocks | **0** (one `try/catch` at [src/stores/useCartStore.ts:18-23](src/stores/useCartStore.ts) correctly fallbacks on malformed JSON) |
| `useSearchParams` (forbidden) | **0** — uses `useLocalSearchParams` at [app/order-detail/[id].tsx:12](app/order-detail/[id].tsx) |
| Hardcoded secrets / API keys | **0** |
| `eval` / `Function(` / `dangerouslyInnerHTML` | **0** |

### Known pain points

**Deferred work stubs** (expected — tracked on 🧑 human blocker list)
- Supabase auth wiring: 5 files (login, register, forgot-password, order-history, order-detail)
- Stripe/PayPal wiring: `app/checkout.tsx:61`
- `submit-catering` Edge Function: `app/(tabs)/catering.tsx:49`
- Delete account: `app/(tabs)/profile.tsx:130`

**No TODO/FIXME/HACK/XXX comments** in code (one false-positive match is an actual product name — "El Yucateco XXXtra Hot Sauce").

---

## Phase 2 — Issue Catalog

Severity rubric per the audit prompt. Every issue has the full schema.

### Critical
**None.** No data loss, security breach, production crash path, or incorrect business logic affecting users.

---

### High

#### H1 — SDK 54 shipped where PRD specifies SDK 55
- **Category:** Maintainability
- **Severity:** High
- **Location:** `package.json:21` (`"expo": "~54.0.33"`), `app.config.ts`
- **Problem:** `valencias-tasks.md` lines 28 and 31 (task 1.1.1) explicitly spec Expo SDK 55 and RN 0.83. We shipped 54/0.81 because `create-expo-app@latest` pulled 54 during scaffolding. All code is compatible with both SDKs, but the PRD's dependency matrix (@expo/ui, expo-maps, edge-to-edge on Android 16+) targets 55.
- **Evidence:** CLAUDE.md:18 states "Expo SDK 55 (React Native 0.83) — New Architecture (JSI/Fabric/TurboModules) mandatory — no legacy bridge"; installed `expo` version is 54.0.33.
- **Proposed fix:** `npx expo install expo@^55` once SDK 55 is GA, then `npx expo install --check` to align peer deps, re-run `expo-doctor`.
- **Risk of fix:** M — native dependency re-resolution may expose incompatibilities (Reanimated 4 worklets plugin, MMKV 4 nitro modules). Ground in `expo-doctor` output post-upgrade.
- **Effort:** M

#### H2 — Menu data integrity tests missing (PRD task 3.1.14, P0)
- **Category:** Quality · Testability
- **Severity:** High
- **Location:** `__tests__/unit/` (only `calculateItemTotal.test.ts` exists)
- **Problem:** Task 3.1.14 is marked P0 in `valencias-tasks.md:143` and explicitly requires: "every item has a valid price > 0, every required option group has at least 2 choices, every upcharge is a positive number, all 15 option group templates are referenced correctly, Taqueria has exactly 109 items across 11 categories." None of this is tested. A future menu edit could silently break an upcharge (e.g., flip Nacho Lengua from +$0.99 to +$1.99) without any test catching it.
- **Evidence:** `jest.config.js` discovers 1 test file. `TAQUERIA_CATEGORIES` and `MARKET_CATEGORIES` in [src/constants/menu/index.ts](src/constants/menu/index.ts) are never validated.
- **Proposed fix:** Add `__tests__/unit/menuData.test.ts` iterating `ALL_MENU_ITEMS` and `ALL_OPTION_GROUPS` asserting the four invariants above.
- **Risk of fix:** None (tests only; if they fail they've caught real drift).
- **Effort:** S

#### H3 — Cart store tests missing (PRD task 12.1.3, P0)
- **Category:** Quality · Testability
- **Severity:** High
- **Location:** [src/stores/useCartStore.ts](src/stores/useCartStore.ts)
- **Problem:** Cart is the most complex piece of state — persistence, 50-item cap, staleness timestamp, subtotal calc, quantity updates. All untested. A regression in `addItem`'s cap logic or `getSubtotal`'s price computation would reach the checkout screen before anyone noticed.
- **Evidence:** Store is 135 lines; zero coverage.
- **Proposed fix:** `__tests__/unit/useCartStore.test.ts` covering add, remove, update, `updateQuantity(0)` removal, 50-item rejection, `isStale()` at 24h boundary, MMKV persistence on reload.
- **Risk of fix:** None (may need MMKV mocking — use `jest.mock('react-native-mmkv')`).
- **Effort:** M

#### H4 — `isBusinessOpen` tests missing (PRD task 12.1.2, P0)
- **Category:** Quality · Testability
- **Severity:** High
- **Location:** [src/utils/isBusinessOpen.ts](src/utils/isBusinessOpen.ts)
- **Problem:** Home screen's open/closed badge relies entirely on `isBusinessOpen()`. Timezone math (`America/Los_Angeles`) is a classic source of bugs — DST transitions, weekday extended hours (Fri–Sun 8am–9pm vs Mon–Thu 8am–8pm), midnight edges.
- **Evidence:** Function is 48 lines; zero coverage.
- **Proposed fix:** `__tests__/unit/isBusinessOpen.test.ts` with injected `Date` objects covering: Mon 7:59am (closed), Mon 8:00am (open), Mon 7:59pm (open), Mon 8:00pm (closed), Fri 8:59pm (open), Sat 9:00pm (closed), Sun 8:01pm (open).
- **Risk of fix:** None.
- **Effort:** S

---

### Medium

#### M1 — `useAgeVerifiedStore` defined inline in a screen
- **Category:** Inconsistency · Quality
- **Severity:** Medium
- **Location:** [app/(tabs)/market.tsx:17-23](app/(tabs)/market.tsx)
- **Problem:** Zustand store created at module scope inside a route file, violating the convention that all stores live in `src/stores/` and are exported through `src/stores/index.ts`. If another screen later needs to read age verification (e.g., a beer-specific route), it would have to import from `app/(tabs)/market.tsx`, which is wrong directionally.
- **Evidence:**
  ```ts
  // app/(tabs)/market.tsx
  const useAgeVerifiedStore = create<{...}>((set) => ({...}));
  ```
- **Proposed fix:** Extract to `src/stores/useAgeVerifiedStore.ts`, export from `src/stores/index.ts`.
- **Risk of fix:** None (pure import path change, behavior identical).
- **Effort:** S

#### M2 — CLAUDE.md contradicts code on "Extra Burrito Meat" upcharge
- **Category:** Inconsistency · Maintainability
- **Severity:** Medium
- **Location:** `CLAUDE.md:139` vs [src/constants/optionGroups.ts:92-100](src/constants/optionGroups.ts) and `__tests__/unit/calculateItemTotal.test.ts:24-34`
- **Problem:** CLAUDE.md says "Lengua / Tripas / Extra Burrito Meat = +$1.99" but:
  - Code sets `EXTRA_BURRITO_MEAT` `yes` `priceModifier: 2.59`
  - PRD test case TC-OPT-05 confirms: $11.99 + Lengua $1.99 + Extra Meat $2.59 = $16.57 (all four facts match)
  The doc conflates the meat-choice upcharge (Lengua/Tripas = +$1.99) with the separate extra-meat toggle (+$2.59). Someone reading CLAUDE.md without reading the test would introduce a bug.
- **Evidence:** Test passes with $2.59 modifier; CLAUDE.md lies about the rule.
- **Proposed fix:** Update CLAUDE.md to disambiguate: "Lengua / Tripas (on Burrito Meat Choice) = +$1.99. Extra Burrito Meat toggle = +$2.59. Quesadilla Extra Meat toggle = +$1.99. Nacho Lengua/Tripas = +$0.99."
- **Risk of fix:** None (doc only).
- **Effort:** S

#### M3 — `null as Order | null` cast in order-detail
- **Category:** Quality
- **Severity:** Medium
- **Location:** [app/order-detail/[id].tsx:16](app/order-detail/[id].tsx)
- **Problem:** To sidestep TS narrowing `null` to `never`, the file uses `const order = null as Order | null` with a lint-disable comment above. It's an awkward workaround that will be replaced the moment Supabase lands.
- **Evidence:**
  ```ts
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const order = null as Order | null;
  ```
- **Proposed fix:** Replace with a typed `useQuery` stub that returns `{ data: null as Order | null }` — matches the eventual Supabase integration shape and drops the cast. Mark `enabled: false` until service is wired.
- **Risk of fix:** S — same runtime behavior, different mental model.
- **Effort:** S

#### M4 — Module-level mutable cart-item ID counter
- **Category:** Quality · Bug (latent)
- **Severity:** Medium
- **Location:** [src/stores/useCartStore.ts:28](src/stores/useCartStore.ts)
- **Problem:** `let nextCartItemId = Date.now();` at module scope. IDs survive re-renders but not hot reloads. On Fast Refresh during dev, the counter resets to the current `Date.now()`, potentially colliding with persisted cart item IDs from MMKV. Harmless in practice but smells.
- **Evidence:** Line 28 sets the counter; incremented at line 72.
- **Proposed fix:** Replace with `expo-crypto`'s `randomUUID()` (or a short nanoid). Removes mutable module state and guarantees uniqueness across hot reloads.
- **Risk of fix:** S — test cart persistence round-trip after change.
- **Effort:** S

#### M5 — Document `EXPO_PUBLIC_SENTRY_DSN` bundling behavior
- **Category:** Security · Maintainability
- **Severity:** Medium (informational — Sentry DSN is publishable, so not a leak)
- **Location:** `.env.example:4`
- **Problem:** By Expo convention, `EXPO_PUBLIC_*` env vars are inlined into the client JS bundle at build time. Sentry DSNs are public by design, so this is fine — but a future contributor might add a truly-secret key with the `EXPO_PUBLIC_` prefix and leak it.
- **Proposed fix:** Add a comment at the top of `.env.example` explaining the convention and that secret keys must go to EAS Secrets, not `EXPO_PUBLIC_*`.
- **Risk of fix:** None.
- **Effort:** S

---

### Low

#### L1 — No committed ESLint / Prettier config
- **Category:** Maintainability
- **Severity:** Low
- **Location:** repo root
- **Problem:** `npm run lint` shells to `expo lint`, which generates a default ESLint config on first run (not persisted). Without a committed `eslint.config.js`, rules are invisible and can't be extended or overridden.
- **Proposed fix:** Run `npx expo lint` once, commit the generated `eslint.config.js`. Optionally add a minimal `.prettierrc.json` with team conventions.
- **Risk of fix:** None.
- **Effort:** S

#### L2 — Hardcoded user-facing strings (deferred to task 14.8)
- **Category:** Inconsistency
- **Severity:** Low
- **Location:** ~40 instances across `app/(auth)/*.tsx`, `app/cart.tsx`, `app/checkout.tsx`, `app/(tabs)/*.tsx`
- **Problem:** CLAUDE.md workflow rule: "All user-facing strings extracted to constants — no hardcoded JSX strings (prepping for 14.8 Spanish support)." Not followed.
- **Proposed fix:** **Defer to PRD task 14.8 Post-MVP** — fixing now would rework all the same strings later when `expo-localization` + `i18next` land. Flagging for tracking only.
- **Risk of fix:** L if attempted now (huge churn).
- **Effort:** L (deferred)

#### L3 — Cart persistence writes full JSON on every mutation
- **Category:** Performance
- **Severity:** Low
- **Location:** [src/stores/useCartStore.ts:12-14](src/stores/useCartStore.ts)
- **Problem:** `persistCart` re-serializes and writes the whole items array on every add/remove/update. For a cap of 50 items × ~200 bytes each, it's ~10 KB per write — well inside MMKV's performance envelope (MMKV writes 100 KB in <1 ms on iOS). Not worth fixing unless profiling shows regression.
- **Proposed fix:** Monitor. Revisit only if cart-mutation frames drop below 60 FPS on a budget device.
- **Effort:** Deferred

#### L4 — Inline `onPress` in `CategoryTabBar` creates new closure per render
- **Category:** Performance (micro)
- **Severity:** Low
- **Location:** [src/components/CategoryTabBar.tsx:32](src/components/CategoryTabBar.tsx)
- **Problem:** `renderTab` creates a fresh `onPress={() => onTabPress(index)}` on each render, which means each `Pressable` rerenders even if nothing changed. Scale is tiny (≤14 tabs), so impact is negligible.
- **Proposed fix:** Memoize if profiling flags it. Skip for now.
- **Effort:** Deferred

#### L5 — Missing `accessibilityLabel` on open/closed badge
- **Category:** Quality · a11y
- **Severity:** Low
- **Location:** [app/(tabs)/index.tsx:17-29](app/(tabs)/index.tsx) `OpenClosedBadge`
- **Problem:** VoiceOver reads only the text "Open Now" without context. Several Cards on the home screen also lack explicit `accessibilityLabel`.
- **Proposed fix:** Address in PRD task 11.2.1 (accessibility pass). Flagging only.
- **Effort:** Deferred

---

## Recommended Phase 3 execution order

If approved, I would execute in this order as 8 discrete commits on a `chore/audit-fixes` branch:

1. **H2** — add `__tests__/unit/menuData.test.ts`
2. **H3** — add `__tests__/unit/useCartStore.test.ts`
3. **H4** — add `__tests__/unit/isBusinessOpen.test.ts`
4. **M1** — extract `useAgeVerifiedStore` to `src/stores/`
5. **M2** — fix CLAUDE.md upcharge docs
6. **M3** — replace `null as Order | null` with typed query stub
7. **M4** — swap cart-item ID counter for `expo-crypto` UUID
8. **L1** — scaffold and commit `eslint.config.js`

Then add a **Changes Summary** section to this file listing each commit hash, the issue ID addressed, and post-fix verification evidence (tsc + jest counts).

**Deferred (with reason):**
- **H1 (SDK 55 upgrade)** — needs owner sign-off and a fresh `expo-doctor` baseline.
- **M5 (`.env.example` note)** — trivial, will bundle with L1 if approved.
- **L2 (i18n refactor)** — tracked under PRD task 14.8 Post-MVP.
- **L3, L4, L5** — future-work notes; no fix needed unless profiling/a11y pass surfaces them.

---

## Stop point

Per the audit prompt's explicit gate (*"Stop and confirm priorities with me before writing code"*), I'm halting here. Please confirm the Phase 3 order above or re-rank / drop items before I begin fixes.
