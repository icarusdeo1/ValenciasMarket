# Valencia's Carniceria & Taqueria — Mobile App
# Epics, Features & Task Breakdown

**Derived from:** valencias-PRD.md v1.0
**Date:** April 14, 2026
**Timeline:** 10 weeks (5 phases)
**Methodology:** Tasks sized for 1-day to 3-day sprints. Each task is a single PR.

> **🧑 = Requires human intervention** (business owner decision, third-party account setup, physical device testing, or App Store action). These tasks cannot be completed by an engineer alone.

---

## How to Read This Document

- **Epic** = A major product area that maps to a PRD section. Represents 1–3 weeks of work.
- **Feature** = A user-facing capability within an epic. Represents 2–5 days of work.
- **Task** = A single implementable unit of work. Represents 0.5–3 days. Each task should produce one PR.
- **Priority:** P0 = MVP launch blocker. P1 = Fast-follow (within 2 weeks post-launch). P2 = Future roadmap.
- **Phase** = Which development phase (Week 1–2, 3–5, 6–7, 8–9, 10) the task belongs to.

---

# EPIC 1: Project Setup & Infrastructure
**Phase:** 1 (Week 1)
**PRD Sections:** 7, 8

## Feature 1.1: Project Initialization

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 1.1.1 | Initialize Expo project | Run `create-expo-app` with SDK 55 template. Configure `app.config.ts` with app name "Valencia's", bundle ID, scheme `valencias://`, splash screen config. Enable New Architecture (default in SDK 55). | P0 | 0.5d | |
| 1.1.2 | Configure TypeScript strict mode | Set up `tsconfig.json` with strict mode, path aliases (`@/components`, `@/stores`, `@/constants`, `@/hooks`, `@/utils`, `@/types`). Install and configure `expo-doctor`. | P0 | 0.5d | |
| 1.1.3 | Install and configure NativeWind v4 | Install NativeWind, configure `tailwind.config.js` with Valencia's color palette (Primary `#C41E24`, Primary Dark `#8B1519`, Secondary `#1B5E20`, Background `#F5F5F5`, Surface `#FFFFFF`, Text Primary `#1A1A1A`, Text Secondary `#6B6B6B`, Accent Gold `#D4A844`). Set up `dark:` variant support. Configure spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48px). | P0 | 0.5d | |
| 1.1.4 | Install core dependencies | Install: `zustand`, `react-native-mmkv`, `@tanstack/react-query`, `@gorhom/bottom-sheet`, `react-native-reanimated` v3, `@shopify/flash-list`, `expo-image`, `expo-haptics`, `expo-blur`, `react-native-edge-to-edge`, `react-native-safe-area-context`, `react-hook-form`, `expo-linking`. Run `npx expo-doctor` to verify all deps are New Architecture compatible. | P0 | 0.5d | |
| 1.1.5 | Configure EAS Build | Create `eas.json` with 3 profiles: `development` (dev client), `preview` (internal distribution), `production` (App Store/Play Store). Enable build caching. Configure frozen lockfiles. | P0 | 0.5d | |
| 1.1.6 | 🧑 Create Supabase project | Create Supabase project, note project URL and anon key. Enable Auth with email/password, Google, and Apple providers. Create initial database schema (users, orders, catering_inquiries tables). | P0 | 1d | 🧑 |
| 1.1.7 | 🧑 Create Stripe account & API keys | Create Stripe account for Valencia's. Obtain publishable key and secret key. Enable Apple Pay on Stripe dashboard. Configure webhook endpoint URL (Supabase Edge Function). | P0 | 1d | 🧑 |
| 1.1.8 | 🧑 Create PayPal developer account | Create PayPal developer account. Obtain client ID and secret. Configure sandbox for testing. | P0 | 0.5d | 🧑 |
| 1.1.9 | 🧑 Obtain Google Places API key | Create Google Cloud project, enable Places API and Maps SDK. Obtain API key. Configure API key restrictions (iOS/Android bundle IDs). | P0 | 0.5d | 🧑 |
| 1.1.10 | 🧑 Configure Apple Developer account | Ensure Valencia's has an Apple Developer account ($99/yr). Register app bundle ID. Configure Apple Sign-In capability. Configure push notification certificates (APNs). | P0 | 1d | 🧑 |
| 1.1.11 | 🧑 Configure Google Play Console | Create app listing in Google Play Console. Configure signing key. Set up internal testing track. | P0 | 0.5d | 🧑 |
| 1.1.12 | Set up Sentry error monitoring | Install `@sentry/react-native`. Configure with DSN. Set up source maps upload in EAS Build. | P1 | 0.5d | |
| 1.1.13 | 🧑 Collect brand assets from Valencia's | Obtain high-resolution logo files (PNG, SVG), hero food photography, and any existing brand guidelines from the restaurant owner. Obtain explicit permission to use images in the app. | P0 | 1d | 🧑 |

## Feature 1.2: Navigation Shell

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 1.2.1 | Create Expo Router v5 file structure | Create all route files per PRD Section 7 file structure: `_layout.tsx` (root), `(auth)/` stack, `(tabs)/` layout with 5 tabs, `cart.tsx`, `checkout.tsx`, `order-confirmation.tsx`, `order-history.tsx`, `order-detail/[id].tsx`, `+not-found.tsx`. | P0 | 1d | |
| 1.2.2 | Implement bottom tab navigator | Configure tab bar in `(tabs)/_layout.tsx` with 5 tabs: Home (house icon), Taqueria (utensils icon), Market (store icon), Catering (calendar icon), Profile (person icon). Style tab bar with Valencia's colors. Active tab: primary red. Inactive: text secondary. | P0 | 1d | |
| 1.2.3 | Implement root layout with auth guard | Configure `_layout.tsx` with `Stack.Protected` for auth-guarded routes. Check Supabase auth state. Redirect unauthenticated users (non-guest) to login. Allow guest passthrough to tabs. | P0 | 1d | |
| 1.2.4 | Configure edge-to-edge + safe areas | Enable `react-native-edge-to-edge` for Android. Wrap root layout with `SafeAreaProvider`. Apply `useSafeAreaInsets()` to all screens. Verify content renders behind status bar and nav bar correctly on Android. | P0 | 0.5d | |
| 1.2.5 | Configure deep linking scheme | Register `valencias://` scheme in `app.config.ts`. Configure deep link routes: `valencias://taqueria`, `valencias://market`, `valencias://catering`, `valencias://taqueria/burritos` (category-level). Test with `npx uri-scheme`. | P1 | 0.5d | |

## Feature 1.3: Design System & Shared Components

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 1.3.1 | Create design token constants | Create `src/constants/colors.ts`, `typography.ts`, `spacing.ts` with all values from PRD Section 9. Export both light and dark mode color maps. | P0 | 0.5d | |
| 1.3.2 | Build Button component | Primary, secondary, outline, and ghost variants. Loading state with spinner. Disabled state. Minimum 44×44pt touch target. Haptic feedback on press. Dark mode support. | P0 | 1d | |
| 1.3.3 | Build Card component | Surface background, subtle shadow, 12–16px rounded corners. Pressable variant with opacity feedback. Dark mode surface color. | P0 | 0.5d | |
| 1.3.4 | Build Input component | Text input with label, placeholder, error state, helper text. Phone number formatting. Email validation visual indicator. Character count for multiline. Dark mode support. | P0 | 1d | |
| 1.3.5 | Build Toast notification system | Non-blocking toast at top of screen. Success (green), error (red), info (neutral) variants. Auto-dismiss after 3 seconds. Swipe to dismiss. Uses Reanimated for enter/exit animations. | P0 | 1d | |
| 1.3.6 | Build Skeleton loading component | Shimmer animation using Reanimated. Configurable shape (rectangle, circle, text lines). Used as placeholder while content loads. | P0 | 0.5d | |
| 1.3.7 | Build QuantitySelector component | Minus/plus buttons with numeric display. Minimum 1. Haptic feedback on increment/decrement. Supports high counts (10+) for produce items. | P0 | 0.5d | |
| 1.3.8 | Build RadioGroup component | Single-select radio buttons for option groups. Required badge indicator. Inline upcharge display (+$1.99). Visual highlight on selected option. Disabled state when parent group is loading. | P0 | 1d | |
| 1.3.9 | Build ToggleOption component | Optional toggle (Yes/No) for extras like Extra Burrito Meat. Shows upcharge amount. Dark mode support. | P0 | 0.5d | |
| 1.3.10 | Build CartFAB component | Floating action button anchored bottom-right. Shows item count badge and formatted subtotal. Primary red background. Animated entrance (scale + fade). Tapping navigates to cart screen. Hidden when cart is empty. | P0 | 1d | |
| 1.3.11 | Build EmptyState component | Reusable empty state with illustration, title, subtitle, and CTA button. Used for empty cart, empty order history, no search results. | P0 | 0.5d | |

## Feature 1.4: State Management Setup

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 1.4.1 | Create auth Zustand store | `useAuthStore`: user object, isAuthenticated, isGuest, login/logout/setGuest actions. Persist auth state reference to MMKV (tokens stored in secure storage via Supabase SDK). | P0 | 1d | |
| 1.4.2 | Create cart Zustand store | `useCartStore`: items array (with customizations), addItem, removeItem, updateItem, updateQuantity, clearCart, getSubtotal, getItemCount. Persist to MMKV. Include cart staleness timestamp. | P0 | 1.5d | |
| 1.4.3 | Create preferences Zustand store | `usePreferencesStore`: darkMode (system/light/dark), notificationPrefs, hasCompletedOnboarding, isFirstOrder. Persist to MMKV. | P0 | 0.5d | |
| 1.4.4 | Configure TanStack Query | Set up `QueryClientProvider` in root layout. Configure default stale time, cache time, retry logic. Set up persistence with MMKV for offline cache. | P0 | 0.5d | |

---

# EPIC 2: Authentication & Onboarding
**Phase:** 1 (Week 1–2)
**PRD Section:** 5.1

## Feature 2.1: Email/Password Authentication

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 2.1.1 | Build Login screen UI | Email input, password input (with show/hide toggle), "Sign In" button, "Forgot Password" link, divider, social login buttons, "Continue as Guest" link. Valencia's logo at top. | P0 | 1d | |
| 2.1.2 | Build Registration screen UI | Name, email, password, confirm password inputs. "Create Account" button. Link to login. Inline validation (email format, password 8+ chars, passwords match). | P0 | 1d | |
| 2.1.3 | Implement Supabase email/password auth | Wire login form to `supabase.auth.signInWithPassword()`. Wire registration to `supabase.auth.signUp()`. Handle error states: duplicate email, wrong password, invalid format, weak password. Display inline errors. | P0 | 1d | |
| 2.1.4 | Implement email verification flow | After registration, show "Check your email" screen. Handle deep link return from verification email. Auto-navigate to Home on verification. | P0 | 1d | |
| 2.1.5 | Implement Forgot Password flow | Build forgot-password screen. Wire to `supabase.auth.resetPasswordForEmail()`. Show success message. Handle "email not found" error. | P0 | 0.5d | |
| 2.1.6 | Implement session persistence | On app launch, check `supabase.auth.getSession()`. If valid session exists, skip login and navigate to tabs. Handle token refresh automatically via Supabase SDK. Store tokens in secure storage (Keychain/Keystore). | P0 | 1d | |

## Feature 2.2: Social Authentication

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 2.2.1 | Implement Google OAuth | Configure `expo-auth-session` with Google provider. Wire "Continue with Google" button. Import profile name and photo on success. Handle cancel and network failure states gracefully. | P0 | 1.5d | |
| 2.2.2 | Implement Apple Sign-In | Install `expo-apple-authentication`. Wire "Continue with Apple" button. Handle "Hide My Email" relay addresses. Only show on iOS. Follow Apple HIG for button styling. | P0 | 1.5d | |
| 2.2.3 | 🧑 Test social auth on physical devices | Google OAuth and Apple Sign-In require physical device testing (simulators may not work correctly). Test on at least 1 iOS device and 1 Android device. Verify account creation, profile import, and session persistence. | P0 | 1d | 🧑 |

## Feature 2.3: Guest Mode

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 2.3.1 | Implement guest session | "Continue as Guest" creates anonymous session. Set `isGuest: true` in auth store. Allow full menu browsing, cart, and checkout access. | P0 | 0.5d | |
| 2.3.2 | Build guest-to-auth conversion | At checkout, show non-blocking "Create an account to track your order" prompt. If user creates account, merge existing cart items into new authenticated session. Cart must survive the conversion. | P0 | 1.5d | |

## Feature 2.4: Account Management

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 2.4.1 | Implement sign-out | Profile → Sign Out clears auth state, clears cart, navigates to login screen. Confirm with dialog. | P0 | 0.5d | |
| 2.4.2 | Implement account deletion | Profile → Delete Account shows `ConfirmationDialog` (Expo UI). On confirm, call Supabase Edge Function to delete user data. Purge local state. Navigate to login. Backend must delete within 30 days per App Store requirement. | P0 | 1d | |
| 2.4.3 | Build Supabase Edge Function: delete-user | Server-side function that receives authenticated user ID, deletes user record, orders, saved payments, and any associated data from Supabase Postgres. Logs deletion request timestamp. | P0 | 1d | |

---

# EPIC 3: Menu Data Layer
**Phase:** 2 (Week 3)
**PRD Section:** 7, Appendix A & B

## Feature 3.1: Menu Data Constants

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 3.1.1 | Create option group templates | Create `src/constants/optionGroups.ts` defining all 15 reusable option group templates from PRD Section 7 with correct IDs, names, required flags, types, and choices (including exact upcharge amounts). | P0 | 1d | |
| 3.1.2 | Create Taqueria menu data — Breakfast | Create `src/constants/menu/taqueria/breakfast.ts` with Breakfast Plates (7 items) and Breakfast Burritos (7 items) categories. Map each item to its correct option group template(s). Verify Chilaquiles has both Tortilla Choice AND Chili Sauce. Verify #34 Burrito Combinado uses Breakfast Meat Choice (Bacon/Ham/Chorizo). | P0 | 1d | |
| 3.1.3 | Create Taqueria menu data — Burritos | Create `burritos.ts` with all 11 burrito items. Map Regular Burrito, Super Burrito, and Chimichanga to Burrito Meat Choice + Extra Burrito Meat. Verify Chimichanga is NOT "special instructions only." | P0 | 0.5d | |
| 3.1.4 | Create Taqueria menu data — Tacos | Create `tacos.ts` with all 13 taco items. Individual tacos: special instructions only. Super Taco: Taco Meat Choice. 3 Quesabirria: special instructions only. | P0 | 0.5d | |
| 3.1.5 | Create Taqueria menu data — Sides, Antojitos, Soups | Create `sides.ts` (7 items, all special instructions), `antojitos.ts` (Torta, Torta de Milanesa/Jamon/Pechuga, Taco Salad, Tamal, Tostada, Sope, Nachos ×2, 5 soups). Map meat choices correctly. Verify Nachos (With meat) uses Nacho Meat template with +$0.99 upcharges (NOT +$1.99). | P0 | 1d | |
| 3.1.6 | Create Taqueria menu data — Seafood, Quesadillas | Create `seafood.ts` (13 items, mostly special instructions only; Tostada de Ceviche has Tortilla Choice). Create `quesadillas.ts` (4 items). Verify Quesadilla with meat uses Burrito Meat Choice + Extra Meat (+$1.99, NOT +$2.59). | P0 | 0.5d | |
| 3.1.7 | Create Taqueria menu data — Combo Plates | Create `comboPlates.ts` with all 19 items. Map Tortilla Choice to items 1–5, 7–13, 17. Map Fajitas (#6) to Fajita Size (Chicken/Steak). Map Enchiladas (#14) to Size (Beef/Chicken/Pork/Cheese) + Tortilla Choice. Verify Enchiladas Verdes (#15) has Tortilla Choice ONLY (no Size). Map Flautas (#16) to Size + Tortilla Choice. Map #18 Tacos and #19 Tacos Dorados to Tortilla Choice + Taco Meat Choice. | P0 | 1d | |
| 3.1.8 | Create Taqueria menu data — Beverages & Catering | Create `beverages.ts` (6 items; Sodas has Soda Choice with 9 options). Create `catering.ts` (6 items; Tamales has Tamale Size + Tamale Ingredients). | P0 | 0.5d | |
| 3.1.9 | Create Market menu data — Meats | Create `src/constants/menu/market/beef.ts` (15 items, Arrachera has Seasoning option), `pork.ts` (13 items), `seafood.ts` (5 items), `poultry.ts` (9 items). Set `maxQuantityNote: "10 POUND MAX"` on beef category. Set correct `unit` values (Per lb., lb, etc.). | P0 | 1d | |
| 3.1.10 | Create Market menu data — Cheese, Produce | Create `cheese.ts` (15 items with size labels), `produce.ts` (34 items with ea/bag/bunch/charola units). | P0 | 0.5d | |
| 3.1.11 | Create Market menu data — Packaged Goods | Create `tortillas.ts` (16 items), `canned.ts` (37 items), `grocery.ts` (34 items), `dryGoods.ts` (11 items), `hotSauces.ts` (18 items). All have size labels and special instructions only. | P0 | 1d | |
| 3.1.12 | Create Market menu data — Hot Food, Beverages, Beer | Create `hotFood.ts` (3 items), `beverages.ts` (17 items with size labels), `beer.ts` (24 items with size/format labels). Beer items must be flagged with `requiresAgeVerification: true`. | P0 | 0.5d | |
| 3.1.13 | Create menu index and category maps | Create `src/constants/menu/index.ts` that exports all items organized by channel and category. Create category display order arrays for Taqueria (11 categories) and Market (13 categories). | P0 | 0.5d | |
| 3.1.14 | Write unit tests for menu data integrity | Test that: every item has a valid price > 0, every required option group has at least 2 choices, every upcharge is a positive number, all 15 option group templates are referenced correctly, Taqueria has exactly 109 items across 11 categories, Market has all items across 13 categories. | P0 | 1d | |

## Feature 3.2: Price Calculation Engine

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 3.2.1 | Build price calculator utility | `calculateItemTotal(basePrice, selectedChoices, quantity)`: sum base price + all priceModifiers from selected choices, multiply by quantity. Return formatted string and raw number. | P0 | 0.5d | |
| 3.2.2 | Write price calculation tests | Test cases from PRD TC-OPT-04 through TC-OPT-08: Regular Burrito + Lengua = $13.98, + Extra Meat = $16.57, × qty 2 = $33.14. Test Nachos Lengua +$0.99 (not +$1.99). Test Quesadilla Extra Meat +$1.99 (not +$2.59). | P0 | 0.5d | |

---

# EPIC 4: Menu Browsing UI
**Phase:** 2 (Week 3–4)
**PRD Section:** 5.3, 5.4, 9

## Feature 4.1: Menu Screen — Taqueria

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 4.1.1 | Build sticky category tab bar | Horizontal scrollable tab bar. 11 category labels. Tapping a tab scrolls FlashList to that category section. Scrolling the list updates the active tab. Use `SectionList`-style header detection with `onViewableItemsChanged`. Active tab: primary red underline + bold. | P0 | 2d | |
| 4.1.2 | Build menu item card | Card with: item image (left, 80×80, rounded), name (bold, truncated 1 line), description (truncated 2 lines, text secondary), price (right-aligned, bold). Uses `expo-image` with blurhash placeholder. Items without images show branded placeholder. | P0 | 1d | |
| 4.1.3 | Implement FlashList menu rendering | Replace any FlatList with FlashList. Configure `estimatedItemSize` for optimal recycling. Render section headers for each category with category name and description (e.g., "Served with Rice, Beans, Corn or Flour Tortillas."). | P0 | 1d | |
| 4.1.4 | Build search bar | Search input at top of menu (below tabs). Real-time filtering across all categories. Debounce 300ms. Empty state component when no results. Clear button to restore full menu. | P0 | 1d | |
| 4.1.5 | Implement Apple Zoom transition (iOS) | When user taps item card, use Expo Router's native Apple Zoom transition to animate the card image into the bottom sheet hero image on iOS. On Android, use standard Reanimated slide-up. | P1 | 1d | |

## Feature 4.2: Menu Screen — Market

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 4.2.1 | Build Market menu with per-unit pricing | Reuse menu screen architecture from Taqueria but adapt item card to show unit label below item name (e.g., "Per lb.", "ea", "10oz"). 13 category tabs. | P0 | 1d | |
| 4.2.2 | Build category-level banners | Display "10 POUND MAX" banner at top of Beef category. Styled as a warning/info banner (gold accent background). | P0 | 0.5d | |
| 4.2.3 | Implement beer age verification gate | When user taps any item in Beer category, show age verification modal before opening item detail: "Are you 21 or older?" Yes/No buttons. Store confirmation per session (Zustand, not persisted). If "No," return to menu without adding item. | P0 | 1d | |

## Feature 4.3: Item Detail Bottom Sheet

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 4.3.1 | Build bottom sheet container | `@gorhom/bottom-sheet` with snap points (60%, 90%). Backdrop blur using `expo-blur`. Swipe-to-dismiss. Handle keyboard avoidance for Special Instructions field. | P0 | 1d | |
| 4.3.2 | Build item detail content | Hero image at top (or branded placeholder). Item name, description, base price. Scrollable content area for option groups. | P0 | 1d | |
| 4.3.3 | Render option groups dynamically | For each option group on the item: render RadioGroup (if single_select required), ToggleOption (if optional_toggle). Show "Required" badge. Show upcharge inline on choices. Highlight unselected required groups if user tries to add to cart. | P0 | 1.5d | |
| 4.3.4 | Build Special Instructions field | Multiline text input with placeholder "Example: No pepper / sugar / salt please." 500-character limit with character counter. Present on ALL items. | P0 | 0.5d | |
| 4.3.5 | Build Add to Cart button bar | Fixed to bottom of sheet. Shows dynamically calculated total (base + modifiers × quantity). Disabled if any required option group is unselected. On tap: add to cart store, fire haptic feedback, show toast "Added to cart," dismiss bottom sheet. | P0 | 1d | |
| 4.3.6 | Implement edit-from-cart flow | When opening an item from the cart (tap to edit), pre-fill all previously selected options, special instructions, and quantity. "Update Cart" button replaces "Add to Cart." | P0 | 1d | |

---

# EPIC 5: Cart Management
**Phase:** 2 (Week 4–5)
**PRD Section:** 5.5

## Feature 5.1: Cart Screen

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 5.1.1 | Build cart screen layout | Header: "Your Cart." Items grouped by source (Taqueria / Market section headers). Each item row shows: name, selected options summary, quantity, line total. Swipe-to-delete or delete icon. | P0 | 1.5d | |
| 5.1.2 | Implement quantity adjustment in cart | Plus/minus buttons on each item row. Quantity update recalculates line total and subtotal in real time. Decreasing to 0 removes item (with confirmation or undo toast). | P0 | 0.5d | |
| 5.1.3 | Build cart summary footer | Sticky footer showing: subtotal, item count, "Proceed to Checkout" button. If cart is empty, show EmptyState component with CTAs to browse Taqueria or Market. | P0 | 1d | |
| 5.1.4 | Implement cart persistence | Cart state serialized to MMKV on every change. On app launch, deserialize and restore cart. Include timestamp of last cart update for staleness detection. | P0 | 0.5d | |
| 5.1.5 | Build cart staleness warning | If cart was last updated > 24 hours ago, show info banner at top of cart: "Your cart was updated over 24 hours ago. Prices may have changed." | P1 | 0.5d | |
| 5.1.6 | Enforce 50-item cart limit | When user tries to add item 51, show toast: "Cart limit reached (50 items)." Prevent add. | P1 | 0.25d | |

---

# EPIC 6: Home Screen
**Phase:** 2 (Week 4)
**PRD Section:** 5.2

## Feature 6.1: Home Screen

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 6.1.1 | Build hero section | Full-width food hero image with Valencia's logo overlaid. Use `expo-image` for fast loading. Promo banner overlay: "10% Off Your 1st Order" (conditionally shown for first-time users based on `isFirstOrder` from preferences store). | P0 | 1d | |
| 6.1.2 | Build ordering CTA cards | Two large tappable cards: "Order from the Taqueria" and "Order from the Market." Each navigates to the respective tab. Use food imagery or icon + description. | P0 | 0.5d | |
| 6.1.3 | Build open/closed indicator | Compute open/closed status from device time against business hours (Mon–Thu 8AM–8PM, Fri–Sun 8AM–9PM, location: America/Los_Angeles timezone). Green badge "Open Now" or red badge "Closed — Pre-order for later." Create `isBusinessOpen()` utility function. | P0 | 1d | |
| 6.1.4 | Build location & contact card | Address: "8040 Greenback Ln, Citrus Heights, CA 95610." Tappable phone: opens dialer with `(916) 729-2926`. Directions button: opens Apple Maps (iOS) / Google Maps (Android) with address. Static map image (or `expo-maps` pin). Business hours display. | P0 | 1d | |
| 6.1.5 | Build quick action buttons | Row of icon buttons: Call, Directions, Catering. Call opens dialer. Directions opens maps. Catering navigates to Catering tab. | P0 | 0.5d | |

---

# EPIC 7: Checkout & Payments
**Phase:** 3 (Week 6–7)
**PRD Section:** 5.6, 10

## Feature 7.1: Checkout Screen — Order Setup

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 7.1.1 | Build order type toggle | Pickup / Delivery toggle at top of checkout screen. Default: Pickup. Selecting Delivery reveals address input and delivery fee. | P0 | 0.5d | |
| 7.1.2 | Build delivery address input | Google Places autocomplete input. On address selection, validate against delivery zones. Show computed fee. If out-of-zone, show error: "This address is outside our delivery area. Would you like to switch to pickup?" | P0 | 1.5d | |
| 7.1.3 | Implement zone-based delivery fee calculation | Create utility: takes lat/lng from Google Places, determines zone (1–5), returns fee ($7.99–$12.99). 🧑 **Requires Valencia's to define exact zone boundaries (radius or polygon coordinates).** Use concentric radius from store address as default until confirmed. | P0 | 1d | 🧑 (zone definitions) |
| 7.1.4 | Build schedule order picker | "ASAP" (default) or "Schedule for later" toggle. Date/time picker using Expo UI `DatePicker` (native SwiftUI/Compose). Constrain to business hours. No past dates. | P0 | 1d | |
| 7.1.5 | Build tip selector | Preset buttons: 10%, 15% (default selected), 20%, 25%, Custom. Custom opens numeric input. Tip calculated from subtotal. Editable after initial selection. | P0 | 1d | |
| 7.1.6 | Build order summary | Itemized list: each item with name, customizations, quantity, line total. Subtotal, discount (if applicable), delivery fee (if delivery), tax, tip, grand total. All values computed reactively from cart store. | P0 | 1d | |

## Feature 7.2: Payment Integration — Stripe

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 7.2.1 | Build Supabase Edge Function: create-payment-intent | Server-side function that receives order total, creates Stripe PaymentIntent, returns client secret. Validates total server-side (don't trust client). | P0 | 1d | |
| 7.2.2 | Integrate Stripe prebuilt payment UI | Install `@stripe/stripe-react-native`. Initialize with publishable key. Show `CardField` or `PaymentSheet` for card entry. No raw card data touches the app. | P0 | 1.5d | |
| 7.2.3 | Implement Apple Pay via Stripe | Configure `ApplePayButton` from Stripe SDK. Only show on iOS devices with Apple Pay capability. Single biometric confirmation. | P0 | 1d | |
| 7.2.4 | Implement saved card management | After successful payment with "Save card" checked, store Stripe customer + payment method IDs in Supabase. On future checkout, show saved cards with last-4 digits and brand icon. Allow selecting saved card or entering new. | P0 | 1.5d | |

## Feature 7.3: Payment Integration — PayPal

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 7.3.1 | Build Supabase Edge Function: create-paypal-order | Server-side function that creates PayPal order via PayPal Orders API. Returns order ID and approval URL. | P0 | 1d | |
| 7.3.2 | Integrate PayPal React Native SDK | PayPal checkout flow opens in-app (not external Safari). On approval, capture payment server-side. Handle cancel (return to checkout, cart preserved). Handle errors. | P0 | 1.5d | |

## Feature 7.4: Order Submission & Confirmation

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 7.4.1 | Build Supabase Edge Function: submit-order | Receives: items with customizations, payment token/confirmation, order type, address (if delivery), tip, discount. Validates everything server-side. Inserts order record. Returns order ID and estimated time. 🧑 **Requires Valencia's to define how orders are received (email, tablet, POS integration, printer).** | P0 | 2d | 🧑 (order receipt method) |
| 7.4.2 | Implement first-order discount logic | Check if user (or device for guests) has placed a previous order. If first order, apply 10% discount to subtotal. Show discount line in order summary. Backend validates discount eligibility. | P0 | 1d | |
| 7.4.3 | Build order confirmation screen | Display: order number, estimated ready/delivery time, full order summary, "Done" button (returns to Home). Animation: checkmark success animation. Clear cart on display. | P0 | 1d | |
| 7.4.4 | Implement double-submission prevention | Disable "Place Order" button after first tap. Show loading spinner with `ProgressView` (Expo UI). If network timeout, show "Checking order status..." — poll for order creation before allowing retry. Never submit same payment intent twice. | P0 | 1d | |
| 7.4.5 | Handle payment failure gracefully | On declined card or payment error, show error message. Cart is NOT cleared. User can retry with different card or payment method. Error message is specific (e.g., "Card declined" vs "Network error — please try again"). | P0 | 0.5d | |

---

# EPIC 8: Catering Inquiry
**Phase:** 4 (Week 8)
**PRD Section:** 5.7

## Feature 8.1: Catering Form

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 8.1.1 | Build catering form screen | React Hook Form with 6 fields: Name (required), Email (required, validated), Phone (required, US format auto-formatting), Event Date (required, Expo UI `DatePicker`, no past dates), Number of Guests (required, positive integer), Additional Info (optional, multiline). Pre-fill name/email/phone for authenticated users. | P0 | 1.5d | |
| 8.1.2 | Build Supabase Edge Function: submit-catering | Receives form data. Validates all fields server-side. Sends email to restaurant (🧑 **need restaurant email address**). Sends confirmation email to user. Inserts record in `catering_inquiries` table. Rate limit: 3 per hour per user/device. Returns 429 on limit exceeded. | P0 | 1.5d | 🧑 (restaurant email) |
| 8.1.3 | Build success confirmation screen | "Thank you! We'll get back to you within 24 hours." with checkmark animation. "Done" button returns to Home. | P0 | 0.5d | |

---

# EPIC 9: Profile & Account
**Phase:** 4 (Week 8–9)
**PRD Section:** 5.8

## Feature 9.1: Profile Screen

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 9.1.1 | Build profile screen layout | Header: user name, email, profile photo (from social auth or default avatar). Menu items: Order History, Saved Payment Methods, Notification Preferences, App Settings, Help & Support, Sign Out, Delete Account. Guest users see "Create Account" CTA instead of profile details. | P0 | 1d | |
| 9.1.2 | Build order history screen | Fetch orders from `/orders/history` via TanStack Query. List sorted by date (newest first). Each row: order number, date, total, item count, order status. Tapping opens order detail. Empty state if no orders. | P0 | 1.5d | |
| 9.1.3 | Build order detail screen | Full order breakdown: items with customizations, subtotal, discount, delivery fee, tax, tip, total, order type, delivery address (if applicable), payment method, order status. | P0 | 1d | |
| 9.1.4 | Build saved payment methods screen | List saved cards from Supabase (last-4 digits, brand icon). Add card button (opens Stripe CardField). Delete card (swipe or button, with confirmation). Set default card. | P0 | 1d | |
| 9.1.5 | Build app settings screen | Dark mode: 3-option selector (System, Light, Dark). Uses Expo UI `Toggle` for switches. Notification preferences toggles (see Epic 10). App version display. | P0 | 0.5d | |
| 9.1.6 | Build help & support screen | Phone: tappable call link. Email: tappable mailto link. 🧑 **Confirm support email and any FAQ content with Valencia's.** In-app feedback form (for beta, reusable post-launch). | P0 | 0.5d | 🧑 (support email/FAQ) |

---

# EPIC 10: Push Notifications
**Phase:** 4 (Week 9)
**PRD Section:** 5.9

## Feature 10.1: Notification Infrastructure

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 10.1.1 | Configure expo-notifications | Install `expo-notifications`. Configure push notification handling in root layout. Register for push token. Store token in Supabase user profile. | P0 | 1d | |
| 10.1.2 | Implement deferred permission prompt | Do NOT prompt for notifications on first launch. After first successful order, show a contextual prompt explaining value: "Get notified when your order is ready?" Then trigger system permission dialog. | P0 | 0.5d | |
| 10.1.3 | Send order confirmed notification | After successful order submission, send push notification: "Order #[number] confirmed! Estimated ready time: [time]." Triggered from submit-order Edge Function. | P0 | 1d | |
| 10.1.4 | Build notification preferences UI | In Profile → Settings: toggles for "Order Updates" (on by default) and "Promotions & Specials" (off by default, opt-in). Persist preferences in Supabase and respect them when sending. | P1 | 0.5d | |

---

# EPIC 11: Dark Mode & Polish
**Phase:** 4 (Week 9)
**PRD Section:** 9

## Feature 11.1: Dark Mode

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 11.1.1 | Implement dark mode color scheme | Define dark mode color map: dark backgrounds, light text, dark card surfaces, dark bottom sheet surfaces. Use `Host.colorScheme` for Expo UI components. Use NativeWind `dark:` variants for all custom components. | P0 | 1d | |
| 11.1.2 | Apply dark mode to all screens | Audit every screen (Home, Taqueria, Market, Item Detail, Cart, Checkout, Confirmation, Catering, Profile, Order History, Settings, Auth screens). Apply dark mode classes. Verify item images are NOT tinted. | P0 | 2d | |
| 11.1.3 | Implement dark mode toggle | In Settings, 3-option selector: System (default), Light, Dark. Persist choice in preferences store (MMKV). Apply immediately without app restart. | P0 | 0.5d | |

## Feature 11.2: Accessibility Pass

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 11.2.1 | Add accessible labels to all interactive elements | Audit all buttons, tabs, cards, radio buttons, toggles, inputs. Add `accessibilityLabel`, `accessibilityRole`, `accessibilityState` props. Ensure logical reading order. | P0 | 1.5d | |
| 11.2.2 | Verify touch target sizes | Audit all interactive elements. Ensure all are ≥ 44×44pt. Fix any undersized targets. | P0 | 0.5d | |
| 11.2.3 | Verify color contrast ratios | Check all text/background combinations against WCAG AA (4.5:1 body, 3:1 large). Fix any failing combinations in both light and dark mode. | P0 | 0.5d | |
| 11.2.4 | Test font scaling at 200% | Set device font to maximum. Navigate all screens. Fix any layout breaks, overlaps, or text truncation. | P0 | 0.5d | |
| 11.2.5 | 🧑 VoiceOver/TalkBack testing | Full manual testing with VoiceOver (iOS) and TalkBack (Android) enabled. Complete a full order flow using only screen reader. Fix any navigation issues. | P0 | 1d | 🧑 |

## Feature 11.3: Performance Optimization

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 11.3.1 | Profile and optimize cold start | Measure cold start time. Target: < 1.5 seconds. Optimize with: async route splitting (verify lazy loading), reduce initial bundle, optimize splash screen transition. Consider Hermes v1 opt-in. | P0 | 1d | |
| 11.3.2 | Profile and optimize menu scroll performance | Measure FPS on Taqueria (109 items) and Market (200+ items) with Flashlight or Perf Monitor. Target: 60fps. Tune FlashList `estimatedItemSize`, reduce re-renders with React Compiler prep (`npx expo lint`). Test on Samsung A54 (budget device). | P0 | 1d | |
| 11.3.3 | Optimize image loading | Ensure all `expo-image` instances use blurhash or thumbhash placeholders. Verify images are appropriately sized (not loading 1920px images for 80px thumbnails). Implement image caching strategy. | P0 | 0.5d | |

---

# EPIC 12: Testing & QA
**Phase:** 5 (Week 10)
**PRD Section:** 12

## Feature 12.1: Automated Tests

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 12.1.1 | Write unit tests — price calculator | All price calculation edge cases from PRD TC-OPT-04 through TC-OPT-08. Target: 100% coverage on price utils. | P0 | 0.5d | |
| 12.1.2 | Write unit tests — business hours utility | Test `isBusinessOpen()` for: weekday open, weekday closed, Friday extended, weekend boundary. | P0 | 0.25d | |
| 12.1.3 | Write unit tests — cart store | Test add, remove, update, quantity change, clear, persistence, 50-item limit, staleness timestamp. | P0 | 1d | |
| 12.1.4 | Write unit tests — menu data integrity | Validate all 300+ items: prices > 0, required groups have choices, option group references are valid, category counts match expected values. | P0 | 0.5d | |
| 12.1.5 | Write integration tests — auth flows | Mock Supabase auth. Test email login, registration errors, session persistence, sign-out, guest-to-auth conversion with cart merge. | P0 | 1d | |
| 12.1.6 | Write E2E tests — Maestro | Create Maestro flows for the 10 regression smoke tests from PRD Section 12.6. Automate on CI. | P0 | 2d | |

## Feature 12.2: Manual QA

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 12.2.1 | 🧑 Execute full test case suite on iOS | Run all TC-AUTH, TC-HOME, TC-MENU, TC-OPT, TC-CART, TC-CHECKOUT, TC-CATERING, TC-PROFILE, TC-BEER, TC-PERF, TC-OFFLINE, TC-ACCESS, TC-SECURITY, TC-DARKMODE test cases from PRD Section 12.4–12.5 on physical iOS device. Log all bugs. | P0 | 2d | 🧑 |
| 12.2.2 | 🧑 Execute full test case suite on Android | Same full test suite on physical Android device (including budget Samsung A54 for performance). Log all bugs. | P0 | 2d | 🧑 |
| 12.2.3 | Bug fix sprint | Fix all P0 bugs found during manual QA. Retest fixed bugs. | P0 | 2d | |

## Feature 12.3: Beta Testing

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 12.3.1 | 🧑 Deploy beta to TestFlight & Google Play Internal | Build production profile via EAS Build. Upload to TestFlight (iOS) and Google Play Internal Testing (Android). | P0 | 0.5d | 🧑 |
| 12.3.2 | 🧑 Recruit beta testers | Recruit 20–30 real customers from Valencia's existing customer base via in-store signage, social media, and email. Mix of taqueria regulars, market shoppers, and catering customers. | P0 | 2d | 🧑 |
| 12.3.3 | 🧑 Monitor beta feedback | Collect feedback via in-app form and direct conversations with 5 selected power users. Monitor crash reports via Sentry. Track: crash-free rate, successful order count, user satisfaction. | P0 | 3d | 🧑 |
| 12.3.4 | Fix critical beta bugs | Fix any P0 bugs found during beta. Retest. Push OTA update via EAS Update if possible. | P0 | 2d | |

---

# EPIC 13: App Store Launch
**Phase:** 5 (Week 10)
**PRD Section:** 13

## Feature 13.1: App Store Preparation

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 13.1.1 | 🧑 Create app icon | Design 1024×1024 app icon featuring Valencia's brand. Must look good at all sizes (60pt, 120pt, 180pt). Provide both iOS and Android versions. | P0 | 1d | 🧑 |
| 13.1.2 | 🧑 Capture App Store screenshots | Take screenshots on 6.7" (iPhone 15 Pro Max) and 5.5" (iPhone 8 Plus) — minimum 3 screens each: Home, Menu with item detail, Checkout. Add marketing text overlays. Take equivalent Android screenshots. | P0 | 1d | 🧑 |
| 13.1.3 | 🧑 Write App Store description | Write app description (max 4000 chars). Keywords: Valencia's, Mexican food, taqueria, carniceria, Citrus Heights, Mexican restaurant, birria tacos, tamales, Mexican grocery, online ordering. Category: Food & Drink. | P0 | 0.5d | 🧑 |
| 13.1.4 | 🧑 Create privacy policy page | Publish privacy policy at a public URL (Valencia's website or hosted page). Must disclose data collection, CCPA compliance, data deletion mechanism. | P0 | 1d | 🧑 |
| 13.1.5 | 🧑 Complete Apple Privacy Nutrition Labels | Accurately declare data collection: email, name, payment info, order history, device identifiers. | P0 | 0.5d | 🧑 |
| 13.1.6 | 🧑 Complete Google Play Data Safety section | Accurately declare data handling consistent with Apple Privacy Labels. | P0 | 0.5d | 🧑 |
| 13.1.7 | Configure App Tracking Transparency | If Sentry or any analytics SDK is integrated, implement ATT prompt on first launch. If no tracking, declare "App does not track" in submission. | P0 | 0.5d | |

## Feature 13.2: Submission & Launch

| ID | Task | Description | Priority | Est. | Human? |
|----|------|-------------|----------|------|--------|
| 13.2.1 | Production EAS Build | Build final production binaries via `eas build --profile production` for both iOS and Android. | P0 | 0.5d | |
| 13.2.2 | 🧑 Submit to Apple App Store | Upload via EAS Submit or Xcode/Transporter. Submit for review. Monitor review status. Respond to any reviewer questions. Typical review: 1–3 days. | P0 | 1d | 🧑 |
| 13.2.3 | 🧑 Submit to Google Play Store | Upload via EAS Submit or Play Console. Submit for review. Typical review: 1–3 days. | P0 | 0.5d | 🧑 |
| 13.2.4 | 🧑 Prepare launch marketing | Coordinate with Valencia's for: in-store QR code signage, social media announcement, email to existing customers. Highlight: "Download our new app — 10% off your first order!" | P0 | 2d | 🧑 |
| 13.2.5 | 🧑 Post-launch monitoring (Week 1) | Monitor: crash-free rate (target > 99.5%), App Store reviews (respond daily), order volume, AOV, payment method distribution. Be ready to push OTA hotfixes via EAS Update. | P0 | 5d | 🧑 |

---

# EPIC 14: Post-MVP Features (P1/P2)
**Phase:** Post-launch
**PRD Section:** 15

| ID | Feature | Description | Priority | Est. | Human? |
|----|---------|-------------|----------|------|--------|
| 14.1 | Venmo payments | Enable Venmo as a payment method via PayPal SDK (Venmo is a PayPal flow). | P1 | 1w | |
| 14.2 | Cash App Pay | Integrate Square Cash App Pay SDK or deep link integration. | P1 | 1w | |
| 14.3 | Dynamic menu admin panel | Build Supabase admin web UI for Valencia's to update menu items, prices, and availability without a code deployment. Migrate app from hardcoded constants to API-fetched menu with local caching. | P1 | 3w | 🧑 |
| 14.4 | Real-time order tracking | Supabase Realtime subscriptions for order status updates (confirmed → preparing → ready → out for delivery). Push notifications for each status change. | P1 | 2w | |
| 14.5 | Analytics integration | Mixpanel or Amplitude SDK. Define event taxonomy: app_open, menu_view, item_detail_view, add_to_cart, checkout_start, order_complete, payment_method_selected. | P1 | 1w | |
| 14.6 | Reorder previous orders | "Reorder" button on order history detail. Adds all items from a past order to cart with same customizations. Handle unavailable items gracefully. | P2 | 1w | |
| 14.7 | Favorites / saved items | Heart icon on item cards. Favorites list in profile. Persistent across sessions. | P2 | 1w | |
| 14.8 | Spanish language support | `expo-localization` + `i18next`. Translate all UI strings. Language selector in settings. 🧑 **Requires professional translation of all 300+ menu item names/descriptions and UI copy.** | P2 | 2w | 🧑 |
| 14.9 | Loyalty / rewards program | Points system: earn points per dollar spent, redeem for discounts. Design points economy, backend tracking, UI for points balance and redemption. 🧑 **Requires Valencia's to define rewards structure.** | P2 | 4w | 🧑 |
| 14.10 | Referral program | Unique referral codes. Both referrer and referee get discount (define amount with Valencia's). Tracking and attribution. | P2 | 2w | 🧑 |
| 14.11 | In-app review prompts | After 3rd successful order, prompt user to rate on App Store / Play Store using `expo-store-review`. | P2 | 0.5w | |

---

# Summary

## Task Counts by Epic

| Epic | Features | Tasks | 🧑 Human Tasks |
|------|----------|-------|----------------|
| 1. Project Setup | 4 | 24 | 7 |
| 2. Authentication | 4 | 12 | 1 |
| 3. Menu Data | 2 | 16 | 0 |
| 4. Menu UI | 3 | 11 | 0 |
| 5. Cart | 1 | 6 | 0 |
| 6. Home Screen | 1 | 5 | 0 |
| 7. Checkout & Payments | 4 | 13 | 2 |
| 8. Catering | 1 | 3 | 1 |
| 9. Profile | 1 | 6 | 1 |
| 10. Push Notifications | 1 | 4 | 0 |
| 11. Dark Mode & Polish | 3 | 11 | 1 |
| 12. Testing & QA | 3 | 10 | 5 |
| 13. App Store Launch | 2 | 10 | 8 |
| 14. Post-MVP | 11 | 11 | 4 |
| **TOTAL** | **41** | **142** | **30** |

## Phase Timeline

| Phase | Weeks | Epics | Key Deliverables |
|-------|-------|-------|-----------------|
| Phase 1 | 1–2 | Epic 1, Epic 2 | Project scaffold, auth flows (email, Google, Apple, guest), navigation shell, design system |
| Phase 2 | 3–5 | Epic 3, Epic 4, Epic 5, Epic 6 | Complete menu data, menu browsing UI, item customization, cart, home screen |
| Phase 3 | 6–7 | Epic 7 | Stripe (cards + Apple Pay), PayPal, checkout flow, order submission, confirmation |
| Phase 4 | 8–9 | Epic 8, Epic 9, Epic 10, Epic 11 | Catering form, profile, push notifications, dark mode, accessibility, performance |
| Phase 5 | 10 | Epic 12, Epic 13 | Testing, beta, bug fixes, App Store submission, launch |

## Critical Path Human Dependencies

These 🧑 tasks block engineering progress and must be completed on schedule:

| Task | Blocks | Needed By |
|------|--------|-----------|
| 🧑 1.1.6 Supabase project | All backend work | Week 1 Day 1 |
| 🧑 1.1.7 Stripe account | Checkout (Epic 7) | Week 5 |
| 🧑 1.1.8 PayPal account | PayPal checkout | Week 5 |
| 🧑 1.1.9 Google Places API | Delivery address | Week 5 |
| 🧑 1.1.10 Apple Developer account | Apple Sign-In, TestFlight, App Store | Week 1 |
| 🧑 1.1.13 Brand assets from Valencia's | Home screen hero, app icon | Week 3 |
| 🧑 7.1.3 Delivery zone definitions | Zone fee calculation | Week 6 |
| 🧑 7.4.1 Order receipt method | Order submission backend | Week 6 |
| 🧑 8.1.2 Restaurant email address | Catering form | Week 8 |
| 🧑 13.1.1–13.1.6 App Store assets | Submission | Week 10 |
| 🧑 13.2.4 Launch marketing materials | Launch day | Week 10 |

---

*End of Document*
