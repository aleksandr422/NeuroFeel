# MindDiary Information Architecture

## Core model

- Marketing and application flows are separated by auth state.
- `/` serves only unauthenticated landing content.
- Authenticated users work inside `/app/*` with one persistent write action.

## Sitemap

```mermaid
flowchart TD
  Root[/ /] -->|unauthenticated| Landing[Landing]
  Root -->|authenticated| App[/app/]
  Landing --> About[/about]
  Landing --> How[/how-it-works]
  Landing --> Privacy[/privacy]
  App --> Dashboard[Today dashboard]
  App --> Journal[/app/journal]
  App --> Analytics[/app/analytics]
  App --> Settings[/app/settings]
```

## Navigation

- Top nav (authenticated): `Сегодня`, `Дневник`, `Аналитика`.
- Settings moved to user menu.
- One global write entry point (header button + mobile FAB).
