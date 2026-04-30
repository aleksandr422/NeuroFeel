# Dashboard redesign (`/app`)

## Header

- Right-aligned controls in content area: language switcher, primary `Записать сегодня` action with plus icon, user menu trigger.
- Data source: UI state + existing write modal flow from `AppShell`.
- Empty state behavior: not data-driven.

## Hero block

- Eyebrow + honest headline/subheadline + honest description.
- Primary CTA opens today writer; secondary CTA links to analytics.
- Decorative illustration uses placeholder SVGs (`src/assets/*.svg`, mirrored in `public/assets/*.svg`) with TODO for design-provided final art.
- Empty state behavior: not data-driven.

## KPI row

- `Среднее настроение`: uses `buildKpis(entries).avgMood`; empty state `— / Недостаточно данных` when insufficient weekly entries.
- `Изменение за неделю`: uses `buildKpis(entries).delta`; empty state `— / Нужна ещё одна неделя данных` until two-week window is available.
- `Самая частая эмоция`: uses `buildKpis(entries).emotion`; tie state renders `Несколько` and list of tied labels.
- `Серия дней`: uses `buildKpis(entries).streak`; for streak < 3 shows `запишите 3 дня подряд, чтобы начать серию`.

## Main row

- `Динамика настроения` chart:
  - data source: `aggregateMoodTrend(entries, language)` sliced by selected range (`7/30/90`)
  - tooltip shows date, mood, energy for hovered day
  - empty state: uses Prompt 2 rule when <2 days available.
- `Наблюдение за последние 30 дней` card:
  - data source: deterministic `generateWeeklySummary(entries, language)`
  - body renders `summary.suggestion`, fallback is honest sentence when suggestion is `null`
  - footer includes mandatory scope line.
