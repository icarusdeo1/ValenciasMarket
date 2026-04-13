# CLAUDE.md — Tagalog in Twenty (ᜆi20)

## Project Overview

**Tagalog in Twenty** is an offline-first mobile learning application (Expo/React Native, iOS + Android) that enables users to achieve conversational Tagalog proficiency in 20 hours through 60 structured, 20-minute sessions. The core differentiator is the Pareto approach: the app teaches the 20% of Tagalog that drives 80% of real conversation — ~300 high-frequency words, 3 verb focus systems, and integrated cultural context.

The product is anchored in a personal origin story: it was built by a Filipino-American who moved to the US at age 5 and lost his native language after being told not to speak Tagalog at home. At 34, he decided twenty hours was a small price for a lifetime of connection with family. That story is not marketing — it is the product's reason for existing.

There is **no custom backend server** in MVP. All data is stored on-device via WatermelonDB (or Expo SQLite) with Zustand + MMKV for state persistence. Supabase integration (Auth, PostgreSQL, Storage) is added in Phase 4 for optional cloud sync.

## Role

You are an expert React Native / Expo development assistant for the Tagalog in Twenty project. You help build, debug, test, and maintain a TypeScript-based cross-platform mobile app using Expo SDK 52+. You understand the full architecture — from the WatermelonDB data layer through Zustand stores to the NativeWind-styled UI — and you follow the conventions established in this file.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Expo SDK 52+ (React Native) |
| **Language** | TypeScript (strict mode) |
| **Navigation** | Expo Router (file-based routing) |
| **State Management** | Zustand + MMKV (synchronous persistence) |
| **Local Database** | WatermelonDB or Expo SQLite (offline-first, indexed queries) |
| **Backend (Phase 4)** | Supabase (PostgreSQL + Auth + Storage) |
| **Audio** | Expo AV (playback + recording) |
| **Notifications** | Expo Notifications (local scheduled) |
| **Animations** | React Native Reanimated v3 + Moti |
| **Styling** | NativeWind v4 (Tailwind for RN) |
| **Testing** | Jest + React Native Testing Library (unit/component/integration) + Detox (E2E) |
| **Linting** | ESLint (eslint-config-expo) + Prettier (pre-commit via husky + lint-staged) |
| **CI/CD** | GitHub Actions + EAS Build + EAS Update |
| **Analytics** | PostHog (privacy-respecting) |

### Key Dependencies (npm)

- `zustand` + `react-native-mmkv` — state management + persistence
- `@nozbe/watermelondb` or `expo-sqlite` — local database
- `expo-av` — audio playback and recording
- `expo-notifications` — local push notifications
- `react-native-reanimated` + `moti` — native-thread animations
- `nativewind` — Tailwind CSS for React Native
- `expo-router` — file-based navigation
- `expo-haptics` — haptic feedback
- `expo-file-system` — offline caching
- `@supabase/supabase-js` — backend client (Phase 4)

### What We Do NOT Use

- **Redux / MobX** — Zustand is the sole state management library. No other state libraries.
- **AsyncStorage** — MMKV replaces it for all local persistence. AsyncStorage is banned (performance and sync issues).
- **Styled Components / Emotion** — NativeWind (Tailwind) is the sole styling approach. No CSS-in-JS libraries.
- **Animated API** (React Native built-in) — Reanimated v3 is required for all animations. The legacy `Animated` API runs on the JS thread and cannot hit 60fps targets.
- **localStorage / sessionStorage** — not available in React Native. Use MMKV via Zustand middleware.
- **Combine / RxJS** — no reactive stream libraries. Use React state + `async/await`.
- **Firebase** — PostHog for analytics, Supabase for backend. No Firebase dependencies.

## Architecture

```
Presentation (Expo Router Screens + React Components + NativeWind)
        │
        ▼  reads from Zustand stores
Stores (Zustand + MMKV persistence)
        │
        ▼  queries and mutations
Data (WatermelonDB Models + Curriculum Loader)
        │
        ▼
Services (AudioManager, NotificationScheduler, SyncEngine)
```

### Layer Rules

- **Screens** (in `app/`) read from Zustand stores and call store actions. They never import WatermelonDB models or Supabase client directly.
- **Stores** (`useProgressStore`, `useFlashcardStore`, `useUserStore`) encapsulate all business logic: streak calculation, SM-2 algorithm, mastery aggregation. They interact with the database and services.
- **Data layer** contains WatermelonDB model definitions, migrations, and the curriculum loader. It is the single source of truth for persistent data.
- **Services** are platform-specific wrappers: `AudioManager` (Expo AV singleton), `NotificationScheduler` (Expo Notifications), `SyncEngine` (Supabase, Phase 4). They are injected into stores, not imported directly by screens.
- **Domain types** (`types/`) are plain TypeScript interfaces with no React or platform imports (portable).
- All async work uses `async/await`. No callback patterns, no `.then()` chains.

### Dependency Injection Pattern

```typescript
// Services are created in app/_layout.tsx and passed to stores
const audioManager = new AudioManager();
useFlashcardStore.getState().setAudioManager(audioManager);

// In tests, inject mocks
useFlashcardStore.getState().setAudioManager(mockAudioManager);
```

Service instances are created once in the root layout and injected into stores. This keeps stores testable without import-level mocking.

## Project Structure

```
tagalog-in-twenty/
├── app/                          -- Expo Router screens (file-based routing)
│   ├── (tabs)/                   -- Tab navigator layout
│   │   ├── index.tsx             -- Home / Dashboard
│   │   ├── sessions/             -- Sessions tab (stack)
│   │   │   ├── index.tsx         -- Phase list
│   │   │   └── session/[id].tsx  -- Session detail
│   │   ├── flashcards.tsx        -- Flashcards tab
│   │   ├── progress.tsx          -- Progress tab
│   │   └── settings.tsx          -- Settings tab
│   ├── onboarding.tsx            -- Onboarding flow
│   └── _layout.tsx               -- Root layout (providers, theme, fonts)
├── components/                   -- All 35 reusable UI components
│   ├── brand/                    -- BrandMark, StreakBadge, StreakCalendar
│   ├── cards/                    -- PhaseCard, SessionListItem, StatCard, FlashcardView
│   ├── content/                  -- TagalogExampleBlock, PhraseChip, ReviewBox, ResourceLink
│   ├── controls/                 -- CheckButton, SRSRatingBar, SearchBar, SchedulePicker
│   ├── feedback/                 -- CelebrationModal, EmptyState, SkeletonLoader, BottomSheet
│   ├── layout/                   -- AppShell, TabBar, SectionHeader, ExpandableSection
│   └── media/                    -- AudioPlayerInline, AudioRecorder
├── stores/                       -- Zustand stores
│   ├── useUserStore.ts           -- User preferences, schedule, theme
│   ├── useProgressStore.ts       -- Session completion, streak calculation
│   └── useFlashcardStore.ts      -- SRS state, due cards, mastery stats
├── lib/                          -- Pure business logic (no React imports)
│   ├── sm2.ts                    -- SM-2 spaced repetition algorithm
│   ├── streak.ts                 -- Streak calculation engine
│   ├── curriculum.ts             -- Curriculum loader and query service
│   └── notifications.ts         -- Notification scheduling logic
├── data/                         -- Database layer
│   ├── models/                   -- WatermelonDB model definitions
│   ├── migrations/               -- Schema migrations
│   └── seed/                     -- Curriculum JSON + VocabularyCard seed data
├── services/                     -- Platform-specific service classes
│   ├── AudioManager.ts           -- Expo AV singleton (playback + recording)
│   ├── NotificationScheduler.ts  -- Expo Notifications wrapper
│   └── SyncEngine.ts             -- Supabase sync (Phase 4)
├── types/                        -- TypeScript interfaces (portable, no React imports)
│   ├── session.ts
│   ├── flashcard.ts
│   ├── user.ts
│   └── progress.ts
├── theme/                        -- Brand identity system
│   ├── colors.ts                 -- Filipino Gold palette + semantic colors
│   ├── fonts.ts                  -- Sora, DM Serif Display, Outfit, JetBrains Mono, Noto Sans Tagalog
│   ├── animations.ts             -- Reanimated presets (entrance, flip, progress, celebration)
│   └── provider.tsx              -- Theme context provider (dark/light)
├── assets/
│   ├── data/                     -- Curriculum JSON (60 sessions)
│   ├── audio/                    -- Native pronunciation clips
│   └── fonts/                    -- Custom font files
├── docs/
│   ├── adr/                      -- Architecture Decision Records
│   └── Ti20-PRD.md               -- Product Requirements Document
├── __tests__/
│   ├── unit/                     -- Pure function tests (SM-2, streak, curriculum)
│   ├── component/                -- RNTL component tests (all 35 components)
│   ├── integration/              -- Data flow tests (completion → streak → dashboard)
│   └── e2e/                      -- Detox E2E tests (Journeys A, B, C)
├── tailwind.config.js            -- NativeWind config with brand tokens
├── app.json                      -- Expo config
├── eas.json                      -- EAS Build profiles
└── tsconfig.json                 -- Strict TypeScript config
```

## Domain Glossary

| Term | Definition |
|------|-----------|
| **Session** | A 20-minute lesson (1–60). Contains: Core Activity, Key Phrases, Resources, 5-Min Review. Stored in curriculum JSON, loaded to local DB. |
| **Phase** | A group of 12 sessions. Five phases: Foundation (1–12), Building Blocks (13–24), Expansion (25–36), Fluency Push (37–48), Real-World Application (49–60). |
| **SessionProgress** | Tracks completion state per user per session: completed flag, timestamp, notes, audio recording URI. |
| **VocabularyCard** | A flashcard entry: Tagalog text, English translation, pronunciation audio, example sentences. ~600 total across 60 sessions. |
| **FlashcardReview** | SRS state per card per user: ease_factor, interval_days, repetitions, next_review_date. Drives the SM-2 scheduling algorithm. |
| **SM-2 Algorithm** | Modified SuperMemo 2 spaced repetition algorithm. 4-point rating: Again (0), Hard (1), Good (2), Easy (3). Ease factor minimum: 1.3. |
| **Streak** | Count of consecutive calendar days (timezone-aware) where at least one session was completed. Resets to 0 on a missed day. |
| **Schedule** | User's chosen study pace: Intensive (6/day, 10 days), Focused (3/day, 20 days), Steady (2/day, 30 days), Casual (1/day, 60 days). |
| **Mastery Level** | Vocabulary card classification: New (0 reps), Learning (1–2 reps), Review (3–5 reps), Mastered (6+ reps). |
| **Baybayin** | Pre-colonial Filipino writing system. The ᜆ (Ta) character is used as the brand logomark. Rendered via Noto Sans Tagalog font. |
| **Taglish** | Natural mix of Tagalog and English used in everyday Filipino communication. The app's brand voice uses Taglish. |
| **Filipino Gold** | Primary brand color (#D4A843), derived from the Philippine flag. Used for CTAs, streaks, achievements, and the ᜆ logo. |

## Key Data Models

All dates are stored as **ISO 8601 strings in UTC** (e.g., `2026-03-12T14:30:00Z`). Conversion to local timezone happens only at the Presentation layer for display and in the streak calculation engine using the user's IANA timezone.

### Session Tags (6 types)

```typescript
type SessionTag = 'vocab' | 'grammar' | 'speaking' | 'listening' | 'culture' | 'review';
```

Each tag maps to a brand semantic color:
- `vocab` → Bayani Blue (#2E75B6)
- `grammar` → Liwanag Purple (#7D3C98)
- `speaking` → Sikat Orange (#E67E22)
- `listening` → Dagat Teal (#17A2B8)
- `culture` → Filipino Gold (#D4A843)
- `review` → Tagumpay Green (#1E8449)

### SM-2 Rating Scale

```typescript
type SRSRating = 0 | 1 | 2 | 3; // Again | Hard | Good | Easy
```

Maps to SM-2 quality: Again=0, Hard=2, Good=3, Easy=5. Ease factor never drops below 1.3.

### Database Entities

`users`, `sessions`, `session_progress`, `vocabulary_cards`, `flashcard_reviews`

Schema version tracked via migrations. **Never modify an existing migration — only append new ones.**

## Brand Identity

The visual identity is defined in the Brand Strategy document and must be followed precisely.

### Color Tokens (defined in `theme/colors.ts`)

| Token | Hex | Usage |
|-------|-----|-------|
| `gold` | #D4A843 | Logo, CTAs, achievements, streak flames |
| `gold.deep` | #B8892E | Gradients, pressed states, light-mode logo |
| `gold.light` | #E8C060 | Hover states, progress fills |
| `bg.dark` | #0C0B0F | Dark mode background (default) |
| `bg.light` | #FAF8F4 | Light mode background |
| `text.primary` | #F0EDE6 (dark) / #1B1A1F (light) | Primary text |
| `text.secondary` | #8A8690 (dark) / #5D6D7E (light) | Secondary text |
| `semantic.green` | #1E8449 | Completion, mastery (Tagumpay) |
| `semantic.blue` | #2E75B6 | Vocab, links, info (Bayani) |
| `semantic.orange` | #E67E22 | Speaking, warnings (Sikat) |
| `semantic.teal` | #17A2B8 | Listening, audio (Dagat) |
| `semantic.purple` | #7D3C98 | Grammar (Liwanag) |
| `semantic.red` | #E74C3C | Errors, "Again" rating (Peligro) |

### Typography (defined in `theme/fonts.ts`)

| Role | Font | Usage |
|------|------|-------|
| Display / Logo | Sora 800 | Logo "i20" numerals, phase titles, hero stats |
| Headings | DM Serif Display | Section headers, onboarding, celebrations |
| Body | Outfit 400–600 | Lesson content, UI labels, descriptions |
| Language | JetBrains Mono | Tagalog examples, phrase chips, session numbers |
| Baybayin | Noto Sans Tagalog | ᜆ logo mark only |

### Animation Presets (defined in `theme/animations.ts`)

| Preset | Behavior | Usage |
|--------|----------|-------|
| `entrance` | Spring rise from below | Screen load, card entrance |
| `cardFlip` | 3D Y-axis rotation + shadow shift | Flashcard flip |
| `progressFill` | Slow ease-out fill | ProgressRing, PhaseProgressBar |
| `celebration` | Gold confetti particles | CelebrationModal |
| `pulse` | Scale 1 → 1.15 → 1 | StreakBadge on new record |

**All animations must check `AccessibilityInfo.isReduceMotionEnabled`** and fall back to instant transitions.

## Workflow

### 1. Before Writing Code

- Understand the **requirement** — trace it to the PRD section (e.g., §4.3 for SRS) or task ID (e.g., E7-P2-001).
- Check the **architecture layer** the change belongs to: `app/` (screen), `components/` (UI), `stores/` (logic), `lib/` (pure functions), `data/` (database), `services/` (platform).
- Verify which **store** and **pure functions** are involved.
- If the change touches audio, review the `AudioManager` singleton pattern — only one sound plays at a time.
- If the change touches notifications, review the scheduling logic in `NotificationScheduler.ts`.
- If the change touches the database, check if a new migration is needed.

### 2. Write the Code

- **Follow the architecture rules** — Screens → Stores → Data/Services. No shortcuts.
- **Use TypeScript strictly** — no `any`, no `@ts-ignore`, no type assertions unless truly necessary with a comment explaining why.
- **Use Reanimated** for all animations. Never use the legacy `Animated` API.
- **Use NativeWind** for all styling. No `StyleSheet.create()` except for values NativeWind cannot express (e.g., `transform`).
- **Use Zustand stores** for all state that persists or is shared across screens. React `useState` only for ephemeral UI state (e.g., input focus, modal open).
- **Write tests alongside the feature** — not after. Target 80% coverage for components, 90% for `lib/` pure functions.
- **All user-facing strings** should support future localization — extract to constants or i18n files, no hardcoded strings in JSX.
- **Use Taglish** for all motivational/engagement copy per the brand voice guidelines.

### 3. Branch, Commit, and Push

**Always use feature branches.** Never commit directly to `dev` or `main`.

Before making any code changes:

1. Make sure you are on the `dev` branch and it is up to date: `git checkout dev && git pull origin dev`
2. Create a new feature branch from `dev`: `git checkout -b <type>/<task-id>-<short-description>` — use a descriptive kebab-case name with one of these prefixes:
   - `feature/<task-id>-<description>` — for new features (e.g., `feature/E7-P2-001-sm2-algorithm`)
   - `fix/<task-id>-<description>` — for bug fixes (e.g., `fix/E6-MVP-002-streak-timezone`)
   - `chore/<description>` — for maintenance tasks (e.g., `chore/update-expo-sdk`)
   - `refactor/<description>` — for code refactors (e.g., `refactor/flashcard-store`)
   - `test/<task-id>-<description>` — for adding or improving tests (e.g., `test/E14-P2-001-sm2-unit-tests`)
3. Make your changes and commit to this feature branch
4. Stage only the files you changed
5. Write a clear commit message: `feat(E7-P2-001): implement SM-2 algorithm` (Conventional Commits with optional task ID scope)
6. Push the feature branch to remote: `git push origin <branch-name>`
7. Open a Pull Request against `dev` with: description of what changed, link to task ID, and passing CI
8. After merge, EAS Build triggers automatically for preview builds
9. If the build introduced a new error, fix it — repeat until CI is green
10. After a successful merge, clean up the local branch: `git branch -d <branch-name>`

### Commit Message Format

```
<type>(<scope>): <concise description of what and why>
```

Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`, `perf`
Scope (optional): task ID (e.g., `E7-P2-001`) or area (e.g., `flashcards`, `audio`, `theme`)

One logical change per commit. Keep commits atomic and easy to revert.

### 4. Report

After completing a task or fixing an issue, give a brief summary:

- What was built or fixed and why
- Which architecture layers were touched (screens, components, stores, lib, data, services)
- Whether tests pass and coverage is maintained
- Any remaining warnings, TODOs, or issues that need human attention

## Mobile-Specific Guardrails

### Audio

- **Only one sound plays at a time.** The `AudioManager` is a singleton that stops the current sound before playing a new one. Never create `Audio.Sound` instances directly in components — always go through the manager.
- **Pre-buffer the next audio clip** when displaying a flashcard or session content with audio. Call `audioManager.preload(nextUri)` while the current clip plays.
- **Warm up the recorder** on screen mount for session detail screens to reduce recording start latency (target: < 150ms). Call `audioManager.prepareRecorder()` in a `useEffect`.
- **Clean up audio resources on unmount.** Every component that uses audio must call `audioManager.release()` in its cleanup function. Failing to do this causes memory leaks.
- **Recording file naming:** `recording_{sessionId}_{timestamp}.m4a` saved to `FileSystem.documentDirectory`.

### Notifications

- **All notifications are local** — no server-side push infrastructure in MVP through Phase 3.
- **Use `NotificationScheduler`** for all scheduling — never call `Notifications.scheduleNotificationAsync()` directly from screen or component code.
- **Notification content uses Taglish brand voice:** e.g., "5-day streak! Magaling! Session 18 is ready."
- **Streak-at-risk notification** fires at 10 PM local time if no session completed today.
- **Handle notification taps** by routing to the correct screen via Expo Router deep links.

### Permissions

- **Never request a permission without explaining why first.** The onboarding flow handles initial notification permissions. Mid-app requests must show an explanation before the system dialog.
- **Handle every denial gracefully.** Notifications denied → study reminders disabled with banner explaining how to re-enable. Microphone denied → AudioRecorder shows disabled state with explanation.
- **Check permission status before using APIs** — don't assume granted. Use `Audio.getPermissionsAsync()` and `Notifications.getPermissionsAsync()`.

### Database

- **All dates in ISO 8601 UTC.** Convert to local timezone only in the presentation layer or in `lib/streak.ts` using the user's IANA timezone.
- **Never modify an existing migration.** Append new migrations only.
- **Index `next_review_date`** on the flashcard_reviews table — the due-cards query must complete in < 50ms with 600 rows.
- **Curriculum data is read-only** — loaded from bundled JSON on first launch, versioned for OTA updates.

### Offline-First

- **The app must work 100% offline** after first launch (curriculum + Phase 1 audio cached).
- **Audio files cache to `FileSystem.documentDirectory`** on first play. Track cached files in MMKV as a `Set<string>`.
- **Cloud sync (Phase 4) uses optimistic local updates** — write to local DB first, then sync to Supabase in the background. Never block UI on network requests.
- **Queue offline changes** in a `pendingSync` array in MMKV. Process queue when connectivity is restored.

### Accessibility

- **All animations must check `AccessibilityInfo.isReduceMotionEnabled`** and provide non-animated alternatives (instant transitions).
- **All interactive elements need meaningful accessibility labels** — not "Button" but "Mark Session 5 as complete" or "Rate flashcard as Good, next review in 7 days."
- **Minimum tap target: 44x44pt.**
- **Support Dynamic Type** — test UI at 1x, 1.5x, and 2x system font sizes.
- **Color contrast: WCAG AA** — 4.5:1 for body text, 3:1 for large text. Verify against both dark and light mode palettes.

### Performance

- **Cold start: < 2 seconds** to interactive (see PRD §12).
- **Session detail render: < 300ms** from local database.
- **Flashcard flip: 60fps** — Reanimated native-thread animation, no JS thread blocking.
- **Audio playback latency: < 200ms** — pre-buffer next clip.
- **Audio recording start: < 150ms** — warm up recorder on screen mount.
- **SRS due-cards query: < 50ms** — indexed query on `next_review_date` with 600 rows.
- **App bundle: < 25MB** — lazy-load audio assets, gzip curriculum JSON.
- **Active memory: < 150MB** — FlashList for long lists, dispose audio players on unmount.

## Rules

- **Always set the correct git author before committing**: Run `git config user.email "jayemdeo@gmail.com" && git config user.name "JM"` if not already set.
- **Never commit secrets, tokens, or API keys** — use `.env` files excluded from git, or EAS Secrets for build-time variables.
- **Never delete user progress data** without explicit double-confirmation (see E11-P3-003 for reset flow).
- **Preserve existing code patterns** — match the style, naming conventions, and architecture already in use.
- **If you're unsure about a fix**, explain the error and your proposed fix before applying it.
- **Don't suppress errors** with empty `catch {}` or `catch (e) { /* ignore */ }` — actually fix the root cause.
- **If an error is clearly a platform issue** (Expo bug, Reanimated edge case, Android-specific), report it instead of trying to work around it in code.
- **Run tests before committing** — don't push code that breaks existing tests or drops coverage below thresholds.
- **One logical change per commit** — keep changes atomic and easy to revert.
- **No user-generated content in analytics payloads** — only counts, types, and completion rates (per privacy requirements).
- **No hardcoded strings in JSX** — all user-facing text extracted to constants or i18n files.
- **No `Animated` API** — use Reanimated v3 for all animations.
- **No `AsyncStorage`** — use MMKV via Zustand persistence middleware.
- **No `StyleSheet.create()`** for standard styling — use NativeWind classNames. StyleSheet only for values NativeWind cannot express.
- **No direct database queries from screens** — go through Zustand stores.
- **No direct `Audio.Sound` creation in components** — go through `AudioManager` singleton.
- **No direct `Notifications.scheduleNotificationAsync` calls** from feature code — go through `NotificationScheduler`.

## CI/CD Pipeline

| Trigger | Pipeline | What It Does |
|---------|----------|-------------|
| PR opened/updated | `ci-pr` | ESLint + Prettier → TypeScript type-check → Jest unit tests → RNTL component tests → Coverage gate (≥ 80%) |
| Merge to `dev` | `ci-dev` | Full test suite → EAS Build (preview profile) → Internal distribution |
| Merge to `main` | `ci-main` | Full test suite → EAS Build (production profile) → App Store Connect + Play Console submission |
| Weekly (scheduled) | `ci-e2e` | EAS Build (development profile) → Detox E2E suite (Journeys A, B, C + offline) on both platforms |

**Build profiles** (in `eas.json`):
- `development` — dev client for local testing and Detox
- `preview` — internal distribution for team testing (TestFlight + Play Console internal track)
- `production` — app store submission builds

**Branch strategy**: `main` (stable, store releases) ← `dev` (integration, preview builds) ← feature branches.

**OTA updates**: Curriculum content changes deploy via EAS Update without app store review. Code changes require a new build.
