# Columbus — AI-powered location intelligence web app

## Cursor Cloud specific instructions

### Overview

Single Next.js 16 application (no backend, no Docker, no database). All pages are static routes served by one dev server on port 3000.

### Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| E2E tests | `npm run e2e` |

### Gotchas

- **Playwright lock conflict**: `npm run e2e` starts its own dev server on port 4173. If a dev server is already running, Playwright will fail with a `.next/dev/lock` error. Stop the existing dev server (or remove `.next/dev/lock`) before running E2E tests.
- **Mapbox token**: Pages `/maps-gpt`, `/market-spy`, and `/our-mission` require `NEXT_PUBLIC_MAPBOX_TOKEN` to render maps. Without it, those pages throw a runtime error. The homepage (`/`) and `/technology` work without the token.
- **Pre-existing lint errors**: ESLint currently reports 3 errors and 5 warnings in the existing codebase (unescaped entities, set-state-in-effect, exhaustive-deps). These are not regressions.
