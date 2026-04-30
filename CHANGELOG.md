# Changelog

## 2026-04-30 (Dashboard regression fix pass)

- Bug 1 (double hamburger): removed duplicate menu trigger and kept a single drawer trigger below desktop breakpoints in `components/app/AppShell.tsx`.
- Bug 2 (sidebar collapse breakpoint): removed automatic icon-rail collapse; sidebar is expanded at `>=1024` (200px at `1024-1279`, 240px at `>=1280`) and drawer-only below `1024` in `components/app/AppShell.tsx`.
- Bug 3 (overlapping/clipped cards): replaced brittle section-level media overrides with stable flow grid + `min-w-0` children, removed layout hacks, and kept card heights auto in `app/app/page.tsx`.
- Bug 4 (calendar plain text): rebuilt calendar body as explicit 7-column grid with weekday header row (`Пн...Вс`) and button cells in `app/app/page.tsx`.
- Bug 5 (broken/untranslated segmented control): added localized segmented control (`7/30/90 дней`) via `components/ui/SegmentedControl.tsx`, wired i18n keys in `lib/i18n.ts`, and replaced hardcoded English labels in `app/app/page.tsx`.
- Bug 6 (clipped Y-axis labels): added chart margins and explicit Y-axis width for mood/energy charts in `app/app/page.tsx`.
- Bug 7 (floating avatar return): kept avatar action only in header dropdown and strengthened anti-regression test scope in `lib/layout-safety.test.ts`.
- Bug 8 (garbage-input regression): ensured gibberish entries strip AI classification during migration and render neutral marker/tags hidden in `lib/migrations.ts`, `components/EntryList.tsx`, `lib/dashboard.ts`, `app/app/page.tsx`, and `lib/validation.test.ts`.
- Added visual smoke capture artifacts and runner for widths 1440/1280/1024/900/768/414 in `tests/visual/dashboard-smoke.mjs`, `tests/visual/storage-state.json`, and generated `tests/visual/dashboard-*.png` via `package.json` script `test:visual`.

## 2026-04-30

- Reworked `/app` dashboard layout to a dense HR-style information architecture: sidebar navigation, compact KPI strip, chart-first grid, right-rail calendar, and lower secondary blocks.
- Replaced top tab navigation with responsive app shell navigation (desktop sidebar, tablet icon rail, mobile drawer) and moved the scope notice to persistent sidebar footer.
- Added honest KPI empty-state logic and tie-safe top emotion handling (`buildKpis`), plus tests for empty-state regressions (`lib/dashboard-kpi.test.ts`).
- Added calendar-driven day sheet behavior (read existing / create past day), new dashboard implementation notes in `docs/dashboard.md`, and `/about/scope` scope page.
- Tightened dashboard density by reducing default card padding from `24px` to `20px`.

## 2026-04-29

- Unified mood scale across UI to a canonical 1-5 model with shared helpers in `lib/mood.ts`.
- Replaced diary mood/energy inputs with keyboard-accessible emoji pickers (`components/MoodPicker.tsx`).
- Standardized average mood display to `emoji X / 5` + progress bar in Home and Statistics.
- Replaced misleading AI-style summary labels with transparent wording and added auto-summary info tooltips.
- Added deterministic weekly summary generator (`lib/summary.ts`) and 6 unit tests (`lib/summary.test.ts`).
- Removed hardcoded `8/10` and repeated static advice copy from JSX/i18n usage paths.

## 2026-04-29 (Bugfix pass)

- Fixed floating bottom-left dev badge overlap by repositioning Next dev tools button to a safe bottom-right area with safe-area insets in `app/globals.css`; added layout safety test.
- Fixed Statistics mood trend by aggregating entries per day with adaptive locale-aware labels and meaningful one-day/empty states (`lib/chart.ts`, `app/statistics/page.tsx`).
- Added diary meaningful-text validation (`lib/validation.ts`) to avoid analyzing keyboard mash/nonsense; low-confidence tags are hidden in list rendering.
- Hardened Settings destructive actions and PIN flow:
  - typed confirmation modal for wipe (`УДАЛИТЬ` / `DELETE`) with export option
  - PIN validation (4-8 digits, confirm twice)
  - one-time unrecoverable-data warning modal
  - PIN now stored as PBKDF2 salted hash via `crypto.subtle` (no plaintext PIN in storage).

## 2026-04-29 (IA and onboarding pass)

- Split audience flows: `/` now serves marketing-only experience and authenticated users are routed to `/app`.
- Introduced app workspace routes: `/app`, `/app/journal`, `/app/analytics`, `/app/settings`; legacy `/diary`, `/statistics`, `/insights`, `/settings` now redirect.
- Collapsed primary app navigation to three tabs (`Сегодня`, `Дневник`, `Аналитика`) and moved settings/onboarding reset/logout to user menu.
- Added one global write action in app shell (header primary button + mobile FAB) opening entry modal instead of page navigation.
- Added first-run onboarding flow with 3 steps, under-18 safety resources from editable JSON, skip confirmation, and completion state in localStorage.
- Added lazy entry migration via `migrateEntry()` (`lib/migrations.ts`) with entry versioning.

## 2026-04-29 (Safety and honesty pass)

- Added local-only crisis signal detection with curated RU/EN lexicon (`lib/safety/crisisLexicon.ts`, `lib/safety/detector.ts`).
- Added locale safety resources source file and reusable support card UI (`lib/safety/resources.ts`, `components/safety/SupportCard.tsx`).
- Entry flow now suppresses automated analysis for crisis-matched entries and shows calm support actions; entries still save.
- Added visible scope notices to summary/entry surfaces and updated marketing copy to remove overpromising claims.
- Added safety freshness checks and copy audit scripts with CI workflow (`scripts/check-*.mjs`, `.github/workflows/safety-audit.yml`).
- Added privacy/security/safety docs (`docs/security.md`, `docs/safety-checklist.md`, `docs/handoff.md`) and expanded privacy page content.
