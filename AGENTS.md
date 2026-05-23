# Columbus — AI-powered location intelligence web app

## Cursor Cloud specific instructions

### Overview

Single Next.js 16 application (no backend, no Docker, no database). All pages are static routes served by one dev server on port 3000. Main front-end surfaces: **Home** (`/`), **Technology** (`/technology`), **Use Cases** (`/use-cases`), **MapsGPT** (`/maps-gpt`), **Market Spy** (`/market-spy`), **Company** (`/company`).

### Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| E2E tests | `npm run e2e` |

### Gotchas

- **Playwright lock conflict**: `npm run e2e` starts its own dev server on port 4173. If a dev server is already running, Playwright will fail with a `.next/dev/lock` error. Stop the existing dev server (or remove `.next/dev/lock`) before running E2E tests.
- **Mapbox token**: Pages `/maps-gpt` and `/market-spy` require `NEXT_PUBLIC_MAPBOX_TOKEN` to render maps. Without it, those pages throw a runtime error. The homepage (`/`), `/technology`, and **Use Cases** (`/use-cases`) work without the token. The token is available as a Cursor Cloud secret.
- **Pre-existing lint errors**: ESLint currently reports 3 errors and 5 warnings in the existing codebase (unescaped entities, set-state-in-effect, exhaustive-deps). These are not regressions.

## Design system — non-negotiable

The `design-system/` folder is the source of truth for every visual decision on this site. It MUST be consulted on every UI change, no exceptions.

### Files (consult by surface)

| File | Use for |
|------|---------|
| [fonts-typescale.md](design-system/fonts-typescale.md) | Font families, weights, sizes, line-heights, letter-spacing — applies site-wide |
| [content-and-text-spacing.md](design-system/content-and-text-spacing.md) | Section padding, container widths, content rhythm, vertical spacing |
| [navbar.md](design-system/navbar.md) + [navbar-dropdown.md](design-system/navbar-dropdown.md) | Anything touching the global nav |
| [products-page.md](design-system/products-page.md) | Homepage and product surfaces (cells, glow plates, skeletons) |
| [technology-page.md](design-system/technology-page.md) | `/technology` |
| [business-page.md](design-system/business-page.md) | `/business` and the sticky-scroll feature pattern |
| [use-cases-pages.md](design-system/use-cases-pages.md) | `/use-cases` and per-industry pages |

### Required workflow for every UI change

Whenever the user asks for a UI/UX change — color, spacing, typography, layout, motion, component structure, anything visible — follow this loop:

1. **Before editing — consult the design system.**
   - Identify which surface(s) the change touches and open the matching design-system file(s) above.
   - If the change is site-wide (type, color, spacing tokens), also re-read `fonts-typescale.md` and `content-and-text-spacing.md`.
   - Read the surrounding component(s) on the page to identify the local pattern (glow colors, plate alphas, card radii, hairline grid, fade overlays, container widths, etc.).
   - If a value the user is asking for would violate a rule, surface that to the user *before* editing — don't silently drift.

2. **While editing — match the neighborhood.**
   - The change MUST visually rhyme with the section above and below it: same container width, same hairline-grid behavior, same fade overlays, same type scale, same glow family, same card/skeleton language.
   - Reuse tokens, CSS variables, and class patterns that already exist in the section. Do not invent new ones unless the design system explicitly allows it.
   - When in doubt, copy the pattern from the nearest sibling component and adapt — never freestyle.

3. **After editing — audit against the design system.**
   - Walk through every rule in the relevant design-system file(s) and confirm the change satisfies each one. Call out each rule and whether it passes.
   - Confirm visual continuity with neighboring sections: same gutters, same vertical rhythm, same color family, same component shape language.
   - Report the audit result to the user in the response — a short checklist is fine, but it must be explicit. If anything fails, fix it before declaring the task done.

This audit is mandatory, not optional. A UI change is not "done" until the post-edit audit has been performed and reported.
