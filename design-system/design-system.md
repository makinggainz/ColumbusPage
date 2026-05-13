# catcherX Design System — Spacing & Typography Reference

Extracted from `~/Documents/catcherX` (NewsCatcher marketing site). This is a portable cheat sheet for another AI agent: the rules below govern **section title sizing, label-to-content spacing, section-to-section rhythm, item titles, and subtitle text** — the exact set the asker requested.

Source files of record (consult these if anything below is unclear):
- `tailwind.config.ts` — the actual token values (`bg-brand`, `text-ink`, `max-w-site`, `rounded-card`)
- `src/app/globals.css` — the `@layer components` classes (`.section`, `.container-site`, `.eyebrow`, `.btn`, `.card`)
- `src/components/SectionHeading.tsx` — the canonical section heading block
- `design.md` — the long-form spec (the table of contents is appended at the end of this file)

---

## 1. The canonical heading block — `SectionHeading`

**This is the single most reused pattern in the project. Don't hand-roll a heading; use this composition.**

```html
<div class="max-w-2xl">                                         <!-- or "mx-auto max-w-2xl text-center" -->
  <p class="eyebrow">Cross-industry solutions</p>               <!-- optional kicker -->
  <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
    Turn raw stories into the signals your team acts on
  </h2>
  <p class="mt-4 text-lg text-muted">                            <!-- optional description -->
    Optional supporting paragraph at 18px muted.
  </p>
</div>
```

Internal spacing of the block:
| Gap | Class | px |
|---|---|---|
| Eyebrow → `<h2>` | `mt-3` | **12px** |
| `<h2>` → description `<p>` | `mt-4` | **16px** |

Heading block → first row of content beneath it: **`mt-12` (48px)** (or `mb-12` on the heading row when it sits in a `flex justify-between` row with an "Overview →" link on the right).

Container max-width for the heading block: **`max-w-2xl` (42rem / 672px)** — long lines are deliberately not allowed.

Alignment rule (authoritative): hero `<h1>` + hero subtitle + the CTA-banner heading are **centred**; every section `<h2>` / `<h3>` and all body content are **left-aligned**.

---

## 2. Section title sizes & weights (the headline scale)

There are **no `--font-size-heading-*` tokens** — headings are composed Tailwind utilities. The scale:

| Element | Classes | Effective size (mobile → sm ≥640 → lg ≥1024) | Weight |
|---|---|---|---|
| **Hero `<h1>`** | `text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl` + `text-balance max-w-4xl` (centred) | **36 → 48 → 60 px** | **700 bold** |
| **Section `<h2>`** (via `SectionHeading`) | `text-3xl font-bold tracking-tight sm:text-4xl` | **30 → 36 px** | **700 bold** |
| **CTA-banner `<h2>`** | `text-3xl font-bold sm:text-4xl`, `max-w-3xl`, centred | **30 → 36 px** | **700 bold** |
| **Testimonial quote `<blockquote>`** | `text-2xl font-medium leading-snug sm:text-3xl`, `max-w-3xl` | **24 → 30 px** | **500 medium** (deliberate exception — it's a voice, not a statement) |
| **Card title `<h3>`** — compact card | `text-lg font-semibold` | **18 px** | **600 semibold** |
| **Card title `<h3>`** — Solutions cards | `text-xl font-semibold` | **20 px** | **600 semibold** |
| **Card title `<h3>`** — Products cards | `text-2xl font-semibold` | **24 px** | **600 semibold** |
| **Footer column title `<h3>`** | `text-sm font-semibold` | **14 px** | **600 semibold** |
| **Eyebrow / kicker** (`.eyebrow`) | `text-sm font-semibold uppercase tracking-[0.18em] text-brand` | **14 px**, +0.18em tracking, brand blue | **600 semibold** |

Tracking:
| Utility | Where |
|---|---|
| `tracking-tight` (-0.025em) | hero `<h1>`, section `<h2>` |
| `tracking-[0.18em]` | `.eyebrow` (uppercase kicker) |
| `tracking-wide` (0.025em) | small uppercase card-eyebrows (e.g. `01`/`02` Case Studies), enterprise badges |
| `tracking-wider` (0.05em) | nav dropdown group titles, `click / drag` hint |

Leading:
| Utility | Where |
|---|---|
| `leading-tight` (1.25) | hero `<h1>` |
| `leading-snug` (1.375) | testimonial quote, Case-Study card titles |
| `leading-normal` (1.5, default) | everything else |

**Weight discipline (rule):** 700 for display headings only; 600 for structural labels and links; 500 for nav/quote/meta; 400 for prose. Never bold small text to make it "pop" — bump the size or the contrast instead. No 900 (`font-black`) anywhere.

---

## 3. Body / subtitle / supporting text sizes

Standard Tailwind `text-*`, no custom font-size tokens:

| Class | Size | Used for |
|---|---|---|
| `text-xs` | **12 px** | the `click / drag` hint, social-link pills, cube-face label, footer micro-text |
| `text-sm` | **14 px** | section descriptions on dark, nav links, button labels, compact card body, badge text, FAQ tab labels, "Learn more →" links, footer link text, copyright/legal |
| `text-base` | **16 px** | marquee logo wordmarks, default `<p>` |
| **`text-lg`** | **18 px** | **hero subtitle, section description (the `SectionHeading` `description` prop), Solutions card body** |
| `text-2xl` / `text-3xl` | 24 / 30 px | testimonial quote (see heading scale) |

Default body colour: `text-ink` (`#0B1B2B`). Secondary / supporting: `text-muted` (`#5A6B7B`). Brand blue (`text-brand`, `#1451E8`) is reserved for the eyebrow and link/affordance text — never for body or headings.

---

## 4. Section-to-section rhythm (vertical padding)

**There is one `.section` class. Use it.** Defined in `globals.css`:

```css
.section {
  @apply py-20 lg:py-28;   /* 80px mobile → 112px ≥1024px */
}
```

- **Standing rule:** new sections use `.section` for vertical rhythm. Don't use margins (they collapse). Don't introduce `py-24` / `py-32` / other off-scale values — `py-20 lg:py-28` is the system.
- **Hero is slightly tighter at the bottom** (because the marquee follows): `pt-20 pb-16 lg:pt-28 lg:pb-20`.

**Surface oscillation (rule):** the page alternates surfaces top-to-bottom to create rhythm. Don't put two same-surface sections back to back without intent. The cadence is:

```
Hero (gradient halo)
HowItWorks (white)
Products (white)            ← BlueprintGrid graph-paper
WhyBetter (white)           ← BlueprintGrid graph-paper
Solutions (bg-bg2/40, pale blue wash)
Industries (white)
EnterpriseReady (bg-bg2/40)
CaseStudies (white)
Testimonials (bg-ink, dark — the one dark band)
Faq (white)
CtaBanner (white wrapping a blue-gradient rounded-card block)
Footer (bg-bg1)
```

When two same-surface sections sit next to each other (Products → WhyBetter, both white), they share a layout device (the BlueprintGrid hairlines) so the relationship is intentional, not accidental.

---

## 5. Container & gutters

**One container class — `.container-site`** — wraps the inner content of every section:

```css
.container-site {
  @apply mx-auto w-full max-w-site px-6 lg:px-8;   /* 1200px max, 24px gutter → 32px ≥1024px */
}
```

Full-bleed backgrounds (`bg-bg2/40` wash, `bg-ink`) are applied on the `<section>` itself; `.container-site` sits inside.

Inner content width caps:
| Token | Value | Use |
|---|---|---|
| `max-w-site` | 1200px | The single content-column width (the canonical one) |
| `max-w-4xl` | 56rem / 896px | hero `<h1>` line length |
| `max-w-3xl` | 48rem / 768px | hero subtitle, testimonial quote, CTA heading |
| `max-w-2xl` | 42rem / 672px | `SectionHeading` block (left-aligned and centred variants) |
| `max-w-xs` | 20rem / 320px | the footer brand blurb |

---

## 6. Item / card internals

Inside cards and grid items:

| Context | Class | px |
|---|---|---|
| Card internal padding | `.card` → `p-7` | **28 px** |
| Card grid gaps | `gap-6` (most), `gap-5` (drag rails) | **24 / 20 px** |
| Card title → body | `mt-2` (Solutions example) | **8 px** |
| Inside-card image placeholder | `h-28 rounded-xl mb-5` | image is 112px tall, 12px radius, 20px gap to title |
| Marquee item gap | `gap-12` | 48 px |
| Navbar height | `h-16` | 64 px |
| Footer block padding | `py-16` | 64 px |
| Button padding (`.btn`) | `px-5 py-2.5` | 20 / 10 px (CTA-banner white button is the bigger `px-6 py-3`) |
| Badge / pill padding | `px-4 py-1.5` | 16 / 6 px |

The full `.card` recipe:
```css
.card {
  @apply rounded-card border border-black/5 bg-white/80 p-7
         shadow-[0_1px_2px_rgba(11,27,43,0.04),0_12px_32px_rgba(11,27,43,0.06)]
         backdrop-blur;
}
```

---

## 7. Border radius (system anchor)

**Pills on interactive things, a 20px squircle on containers, square on full-width layout.**

| Token / class | Value | Use |
|---|---|---|
| `rounded-full` | 9999px (pill) | All buttons (`.btn`), badges/chips, FAQ category tabs, social-link pills, testimonial nav arrows + progress dots, decorative dots |
| **`rounded-card`** *(theme token in `tailwind.config.ts` = 20px)* | **20 px** | **Every `.card`, Navbar dropdown panel, CTA-banner block, cookie consent dialog — the signature container radius** |
| `rounded-xl` | 12 px | Card-image placeholder block at the top of Industries / Solutions cards |
| `rounded-lg` | 8 px | Cookie-dialog inner preference rows (`bg-bg1` rows) |
| `rounded` | 4 px | Nav-dropdown link hover targets |
| _(none)_ | 0 | Every `<section>`, the `<header>` (Navbar), the `<footer>`, and the blueprint-grid cells (square so hairlines meet cleanly) |

Rules:
- A contained surface with visual weight gets `rounded-card` (20px) unless it's a button/chip (pill) or a tiny inner block (`rounded-xl` / `rounded-lg`).
- **Interactive controls are pills.** No 8px buttons, no square chips.

---

## 8. Heading-row variant — "Heading-left / link-right"

Several sections (Solutions, Industries, EnterpriseReady, CaseStudies) pair the heading with an "… Overview →" link on the right:

```html
<div class="mb-12 flex flex-wrap items-end justify-between gap-4">
  <SectionHeading eyebrow="…" title="…" />
  <a href="…" class="text-sm font-semibold text-brand hover:underline">
    Use Cases Overview →
  </a>
</div>
<!-- grid / rail follows immediately -->
<div class="grid gap-6 sm:grid-cols-2"> … </div>
```

Spacing rules in this variant:
- `mb-12` (48px) on the heading row, **not** `mt-12` on the grid — because the heading row owns the gap to its content.
- `items-end` aligns the link to the baseline of the heading block, even when the description wraps to multiple lines.
- The link uses `text-sm font-semibold text-brand` — the same recipe everywhere; never restyle.

---

## 9. Recurring grid patterns

| Pattern | Classes |
|---|---|
| 2-up medium cards (Solutions) | `grid gap-6 sm:grid-cols-2` |
| 3-up step / pillar cards (HowItWorks, EnterpriseReady pillars) | `grid gap-6 md:grid-cols-3` |
| 4-up blueprint grid (Products, WhyBetter) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (gap 0, hairlines instead) |
| Horizontal drag rail (Industries, CaseStudies) | `.drag-track` + fixed-width `shrink-0` children (`w-72 sm:w-80` or `w-80 sm:w-96`) |
| Footer mega-grid | `grid gap-10 lg:grid-cols-[1.2fr_repeat(5,1fr)]` |

---

## 10. Breakpoints (Tailwind defaults — no customisation)

| Name | Min width | What it triggers |
|---|---|---|
| `sm` | 640 px | heading size bumps (`sm:text-4xl`, `sm:text-5xl`), card grids 1→2 col, drag-card widths |
| `md` | 768 px | footer block 2-col, FAQ layout, `md:grid-cols-3` pillar grid |
| `lg` | 1024 px | `.section` padding bump (`lg:py-28`), `.container-site` gutter bump (`lg:px-8`), desktop nav, `lg:grid-cols-2` Products, `lg:text-6xl` hero |
| `xl` / `2xl` | 1280 / 1536 px | not specifically targeted; capped at `max-w-site` (1200px) anyway |

---

## 11. Colour summary (because typography rules reference these tokens)

| Token | Hex | Used for |
|---|---|---|
| `bg1` | `#F6F8FB` | page surface (default), footer surface |
| `bg2` | `#E5EDFB` | hero halo, pale wash sections (`bg-bg2/40`) |
| `ink` | `#0B1B2B` | headings, body text |
| `muted` | `#5A6B7B` | secondary copy, descriptions |
| `gridline` | `#E7E7F1` | blueprint-grid hairlines |
| `brand` | `#1451E8` | eyebrows, links, primary CTA, accents |
| `brand-soft` | `#74A0FE` | gradient stops paired with `brand` |

Body gradient (declared on `body` in `globals.css`):
```css
background: linear-gradient(180deg, var(--color-bg1) 0%, #ffffff 40%);
```

---

## 12. Font families

Two stacks, in `tailwind.config.ts`:

| Tailwind class | Stack | Use |
|---|---|---|
| `font-sans` (default on `body`) | `"Ppneuemontreal", "PP Neue Montreal", "Arial", "ui-sans-serif", "system-ui", "sans-serif"` | Everything — headings, body, nav, labels, buttons |
| `font-mono` | `"Ppneuemontrealmono", "PP Neue Montreal Mono", "Arial", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"` | Only the `01` / `02` product captions |

⚠️ The licensed PP Neue Montreal faces are **not bundled** — without local font files this resolves to Arial. To ship the real face: licence from Pangram Pangram, drop `.woff2` in `public/fonts/`, load via `next/font/local` in `layout.tsx`, prepend the bound CSS variable to both stacks.

---

## 13. Quick-look "what do I use when?" cheat sheet

| Job | Answer |
|---|---|
| New section | Wrap in `<section class="section">` (`py-20 lg:py-28`); inside, use `<div class="container-site">` (max-w-1200 + 24/32px gutter) |
| Section heading | Use `<SectionHeading eyebrow="…" title="…" description="…" />`. Never hand-roll. |
| Heading + "Overview" link on the right | `flex flex-wrap items-end justify-between gap-4 mb-12` row, then the grid below |
| Hero h1 | `text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance max-w-4xl` (centred) |
| Hero subtitle | `text-lg text-muted max-w-2xl mt-6` (centred) |
| Card | `.card` (`rounded-card`, `p-7`, white/80, subtle shadow) |
| Card title (compact / medium / large card) | `text-lg` / `text-xl` / `text-2xl` — all `font-semibold` |
| Card body | default body + `text-muted`, `mt-2` from title |
| Button | `.btn-primary` (filled brand pill) or `.btn-ghost` (outlined brand pill); both are `px-5 py-2.5 text-sm font-semibold rounded-full` |
| Badge / pill | `px-4 py-1.5 rounded-full text-xs/text-sm`, brand or ink colour as needed |
| Eyebrow / kicker | apply class `.eyebrow` (`text-sm font-semibold uppercase tracking-[0.18em] text-brand`) |
| Inline "Learn more →" link | `text-sm font-semibold text-brand hover:underline` |

---

## 14. design.md — full table of contents (for deeper questions)

If you need a rule not covered above, the long-form `~/Documents/catcherX/design.md` is organised:

```
0. Philosophy
1. Color (palette, surfaces, ink, borders, gradients, z-index, page-scoped exceptions)
2. Typography (families, heading scale, body scale, weights, tracking + leading, pairing, confidence rules)
3. Border Radius
4. Spacing (and §4.1 Section rhythm & surface oscillation)
5. Layout (container, page patterns, breakpoints, recurring grids)
6. Elevation
7. Motion (easing, keyframes, reduced motion, recommended transitions)
8. Component patterns (Buttons, Cards, Badges, Inputs, Tabs, Accordion, Marketing tiles, Navbar, Logo marquee, DragScroll, Cube, Reveal, CookieBanner, dark feature band, CTA banner, Section heading, Footer, BlueprintGrid)
9. Logo & brand mark
10. Imagery / photography
11. Iconography
12. Do's and Don'ts
13. Responsive
14. Iteration guide & known gaps (especially §14.2 — the prime directive)
15. Provenance / sources
```

The prime directive (from §14.2 and `CLAUDE.md`): **when asked to change an element on the page, change the *design-system rule* — the token, the `@layer components` class, or the shared component — not a single instance.** Scope to one place only if the user explicitly says so. After any design-system change, update both `design.md` and `CLAUDE.md` in the same commit.

---

_Generated 2026-05-12 from `~/Documents/catcherX`. The values above were valid at extraction time; if a rule on this sheet conflicts with `design.md`, `tailwind.config.ts`, or `globals.css` in the live project, the live project wins._
