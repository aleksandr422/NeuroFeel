# NeuroFeel

Private mood diary web app built with Next.js.

## Routes

- `/` (unauthenticated): marketing landing with one primary CTA.
- `/about` (unauthenticated): product overview page.
- `/how-it-works` (unauthenticated): short 3-step explainer.
- `/privacy` (unauthenticated): privacy and safety page.
- `/app` (authenticated): dashboard with today's status and weekly snapshot.
- `/app/journal` (authenticated): journal list with filters.
- `/app/analytics` (authenticated): merged analytics page (numbers + observations).
- `/app/settings` (authenticated): settings, export/import, PIN, onboarding reset.
- Legacy redirects: `/diary` -> `/app/journal`, `/statistics` -> `/app/analytics`, `/insights` -> `/app/analytics`, `/settings` -> `/app/settings`.

## Getting Started

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
