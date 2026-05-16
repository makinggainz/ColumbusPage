# Use-Cases Pages — Independence Reference

> The Use Cases dropdown opens onto **two distinct pages**:
> - [`/columbus-solutions`](../app/columbus-solutions/page.tsx)
> - [`/research-applications`](../app/research-applications/page.tsx)
>
> They began as clones of the original `/use-cases` route and share most
> sub-components (in [`components/use-cases/`](../components/use-cases/)).
> They are *not* the same page in disguise — each carries its own copy,
> theme, and section list, and the differences between them grow over time.

---

## Treat each page as independent

**This is the most important rule of these two pages.**

When you are asked to make a change on **one** of these pages, do **not**
mirror that change on the other page unless the user explicitly says to.
If a request says "on the columbus-solutions page, change X" or "for the
research-applications hero, do Y," that request applies *only* to the
named page.

This even applies to changes that *seem* like they should affect both
(e.g. typography, layout, props on a shared sub-component). If a shared
sub-component would need to change for one page only:

- Prefer adding a prop to the sub-component (e.g. `theme`, `videoSrc`)
  so the other page keeps its existing behaviour.
- Or duplicate the sub-component into a page-specific variant if a prop
  would bloat the shared component too much.
- Do **not** change shared CSS/JSX in a way that affects both pages
  unless the user explicitly asked for the change on both.

When in doubt, ask. The pages are intentionally diverging — assume the
user wants them to look and feel different unless told otherwise.

---

## Shared sub-components

Both pages currently import from [`components/use-cases/`](../components/use-cases/):

- `HeroSection` — full-screen hero with title/subtitle, video bg, structure
  lines, and the 3-panel blur reveal animation. Accepts `title`, `subtitle`,
  `videoSrc`, and (per-page) other props as the pages diverge.
- `ResultsSection` — "THE LATEST RESULTS FROM OUR DEVELOPMENT OF A LARGE
  GEOSPATIAL MODEL" header + 4-card line-art result tiles.
- `UseCasesHero` — "More than Site Selection" / "Industry use cases of
  Columbus Pro" mid-page header.
- `Chat`, `SuperModelSection`, `AgentResearch`, `DataCatalogue`,
  `IndustryGrid`, `ContactSection`, `ScrollProgressTracker` — feature
  bands and supporting widgets.

Plus from elsewhere: `Navbar`, `Footer`, `GenLayersSection`.

---

## Per-page section lists

### `/columbus-solutions` ([app/columbus-solutions/page.tsx](../app/columbus-solutions/page.tsx))

1. `HeroSection` (custom title/subtitle for "Columbus / Professional applications")
2. `UseCasesHero`
3. `Chat`
4. `SuperModelSection`
5. `AgentResearch`
6. `DataCatalogue`
7. `IndustryGrid`
8. `ContactSection`
9. `GenLayersSection`
10. `Footer`

**Unique to this page:** has `UseCasesHero`, **does not** render
`ResultsSection`.

### `/research-applications` ([app/research-applications/page.tsx](../app/research-applications/page.tsx))

1. `HeroSection` (default "Why you should be excited / about our LGM" copy,
   passes `videoSrc="/research-applications-video.mp4"`)
2. `ResultsSection`
3. `Chat`
4. `SuperModelSection`
5. `AgentResearch`
6. `DataCatalogue`
7. `IndustryGrid`
8. `ContactSection`
9. `GenLayersSection`
10. `Footer`

**Unique to this page:** has `ResultsSection`, **does not** render
`UseCasesHero`.

---

## Navbar treatment

Both pages render `<Navbar />` and the navbar's `isUseCasesPage` check in
[`components/layout/Navbar.tsx`](../components/layout/Navbar.tsx) covers
both routes (alongside `/products/business`). See
[design-system/navbar.md](navbar.md) for the navbar's "Use-Cases-Specific
Behaviour" section, which documents the dynamic theme-switching behaviour
shared across these routes.

---

## Diverging styles

Beyond section-level differences, individual visual treatments are also
expected to diverge — colors, hero copy, hero theming, footer theme,
section ordering, etc. Add new entries here whenever a divergence is
introduced so that future changes don't accidentally collapse them back
into a single design.

### Current divergences (kept in sync with code)

| Aspect | `/columbus-solutions` | `/research-applications` |
|---|---|---|
| Hero copy | Custom `Columbus / Professional applications` + lorem-ipsum subtitle | Default `Why you should be excited / about our LGM` |
| Hero video src | Default `/use-cases-video.mp4` | `/research-applications-video.mp4` (satellite earth) |
| Hero black-overlay fade | On (`heroOverlay` state, fades to black) | None |
| `ResultsSection` | Removed | Present |
| `UseCasesHero` | Present | Removed |
| Sections below hero theme | Dark (default) | Light — pages pass `lightTheme` to `Chat`, `SuperModelSection`, `AgentResearch`, `DataCatalogue`, `IndustryGrid`, `ContactSection` |
| Page main bg | Default | `#FFFFFF` |
| Footer | `theme="dark"` | `theme="light"` |
| Navbar | `theme="dark"` (page is all-dark; tracked via `navTheme` state for dynamic-prop compliance, but never changes) | Dynamic — `"dark"` while hero is in view, switches to `"light"` once hero scrolls past the navbar |

### `lightTheme` prop convention

Each shared component under [`components/use-cases/`](../components/use-cases/) below the hero accepts an optional `lightTheme?: boolean` (default `false`):

- [`Chat`](../components/use-cases/Chat.tsx)
- [`SuperModelSection`](../components/use-cases/SuperModelSection.tsx)
- [`AgentResearch`](../components/use-cases/AgentResearch.tsx)
- [`DataCatalogue`](../components/use-cases/DataCatalogue.tsx)
- [`IndustryGrid`](../components/use-cases/IndustryGrid.tsx)
- [`ContactSection`](../components/use-cases/ContactSection.tsx)

When omitted (or `false`), the component renders identically to the original dark theme — `/columbus-solutions` does not pass it. When `true`, each component swaps `bg-black → bg-white`, `text-white → text-[#1D1D1F]`, white borders → low-alpha dark navy, dark accent panels (`bg-[#2a2a2a]`) → light gray (`bg-[#F5F5F7]`), and skips/replaces dark-only decoratives (vignettes, dark gradients). Only `/research-applications` passes it.

If you add a new section below the hero on either page, follow the same prop convention so the two pages stay independently themable.
