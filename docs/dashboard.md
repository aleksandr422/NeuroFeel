# Dashboard layout (Today)

## Grid and breakpoints

- Desktop (`>=1024`): app shell uses a persistent `240px` left sidebar and a `12`-column content grid with `16px` gaps.
- Tablet (`768-1023`): icon rail at left (expandable), content switches to an `8`-column interpretation (`5+3` on chart/calendar row; lower rows stacked).
- Mobile (`<768`): single-column flow; KPI strip collapses to a `2x2` card grid, calendar is compact week-view by default with month toggle.

## Dashboard blocks and data source

- `Среднее настроение` KPI: derived from last 7 days entries (`localStorage` via `getEntries()`), average of canonical mood values (`legacyMoodToMoodValue`).
- `Изменение за неделю` KPI: compares current 7-day average vs previous 7-day average from local entries.
- `Самая частая эмоция` KPI: counts `entry.emotions` over available entries; ties are rendered as `Несколько`.
- `Серия дней` KPI: consecutive unique day keys from newest backward.
- `Динамика настроения`: range-based (7/30/90) chart from aggregated daily mood trend (`aggregateMoodTrend`).
- `Календарь`: month cells built from local entries; dot color uses `moodToColor()` from daily average; click opens read/create sheet based on day and existence.
- `Последние записи`: top 5 newest entries from `getEntries()`.
- `Сводка за неделю`: deterministic summary from `generateWeeklySummary()` with mandatory scope line.
- `Темы за месяц`: top tags in current month where confidence is `>= 0.6`.
- `Энергия`: daily average energy trend over same 7/30/90 range.

## Density rules applied

- Card default padding reduced to `20px`.
- Vertical section spacing reduced to `16px`.
- No placeholder/fake metrics are injected when data is missing; explicit empty states are shown.
