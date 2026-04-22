# /technology Page — Typography & Design System

> This document governs the technology page (`/technology`) only.
> It is modeled directly on the Mission page (`app/mission/page.tsx`), which is the canonical reference for the brand's current visual direction.
> Other pages: `mission/` (handcrafted, ungoverned), `products/enterprise` → `enterprise-page.md`, `/products` → `products-page.md`.

---

## Typefaces

| Role | Stack | Where |
|------|-------|-------|
| Display / Headings / UI / Body | `var(--font-geist-sans), 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif` | All copy on the page |

No secondary typefaces. Geist is inherited site-wide; the page must not opt out.

---

## Type Scale

**Ratio: ~1.25 (Major Third) — Base: 16px — aligned with the Mission page**

The page uses a 9-step scale derived from Mission. Use only these sizes — do not invent intermediates.

| Step | Size | Name | Usage |
|------|------|------|-------|
| t1 | **61px** | Display L | Hero heading (`TechHeroSection` h1) at lg |
| t2 | **49px** | Display M | Hero heading at md; foundational-model section title at lg |
| t3 | **39px** | Display S | Hero heading at mobile; primary section titles at md |
| t4 | **28px** | Heading L | Section sub-titles ("Our research", "MODEL COLUMBUS-01"), section titles at mobile, globe centerpiece equivalents |
| t5 | **22px** | Heading M | Column headers ("Data Collection", "Fusion", "Core Reasoning"), gen-layers headline, timeline labels |
| t6 | **20px** | Body L | Section leads, short subtitles |
| t7 | **18px** | Body | Default body copy in long-form sections |
| t8 | **16px** | Body S | Secondary body, list items, card body |
| t9 | **13px** | Caption / Eyebrow | Kickers ("A NEW FOUNDATIONAL MODEL", "RESULTS", "CORE REASONING"), year markers (2022 / 2025 / 2026 / 2028), tile captions ("Columbus GenLayer") |

### Deviations to normalize

The current `technology.module.css` uses many off-scale `clamp(...)` values. Map each to the nearest token:

| Current (in `technology.module.css`) | Target |
|--------------------------------------|--------|
| `clamp(1.9rem, 3.2vw, 2.9rem)` (lgmFoundationalTitle) | **t3 39px** at md, **t2 49px** at lg |
| `clamp(1.7rem, 2.8vw, 2.4rem)` (sectionTitle) | **t3 39px** |
| `clamp(1.6rem, 2.4vw, 2.1rem)` (coreResearchTitle) | **t4 28px** at md, **t3 39px** at lg |
| `clamp(1.8rem, 2.8vw, 2.5rem)` (resultsTitle) | **t3 39px** |
| `clamp(1.3rem, 1.9vw, 1.75rem)` (genLayersHeadline) | **t5 22px** at md, **t4 28px** at lg |
| `clamp(1.1rem, 1.4vw, 1.35rem)` (lgmTimelineLabel, resultsCardText) | **t5 22px** |
| `clamp(1rem, 1.2vw, 1.2rem)` (genLayersTileTitle) | **t6 20px** |
| `clamp(1rem, 1.2vw, 1.12rem)` (sectionLead) | **t6 20px** |
| `clamp(0.98rem, 1.1vw, 1.05rem)` (coreResearchLead, resultsLead) | **t6 20px** |
| `clamp(0.95rem, 1.05vw, 1rem)` (coreResearchGroup p) | **t8 16px** |
| `12px` / `13px` (lgmKicker, lgmTimelineYear) | **t9 13px** |
| `11px` (genLayersTileKicker, genLayersGridKicker) | **t9 13px** (or accept as a sub-caption variant — note in code) |

---

## Responsive Scale

Step down one level at mobile. Mobile-first.

| Role | Mobile | md (≥768px) | lg (≥1024px) |
|------|--------|-------------|--------------|
| Hero (t1) | `text-[39px]` | `md:text-[49px]` | `lg:text-[61px]` |
| Section title (t3 → t2) | `text-[28px]` | `md:text-[39px]` | `lg:text-[49px]` |
| Sub-title (t4) | `text-[22px]` | `md:text-[28px]` | `lg:text-[28px]` |
| Lead (t6) | `text-[18px]` | `md:text-[20px]` | `lg:text-[20px]` |
| Body (t7) | `text-[16px]` | `md:text-[18px]` | `lg:text-[18px]` |

---

## Font Weights

| Weight | Name | When to use |
|--------|------|-------------|
| 300 | Light | Hero h1 only — deliberate editorial contrast (matches Mission hero) |
| 400 | Regular | Body text, leads, list items, captions |
| 500 | Medium | Section headings (t3, t4), column headers, button/CTA labels, primary UI text |
| 600 | Semibold | Inline emphasis only — strong tags, brand labels, "Why:" prefixes. Never on a heading element. |

Rules:
- Section headings are always **500**. Never 600 on a heading.
- 300 is reserved for the Hero h1. Nowhere else.
- Eyebrows (kickers) use **700** (bold) per the Mission convention — see Letter Spacing.

---

## Letter Spacing

Three tiers. Match Mission exactly.

| Size range | Tracking |
|------------|----------|
| t1–t4 (28–61px) | `-0.02em` |
| t5–t8 (16–22px) | `-0.01em` |
| t9 eyebrows uppercase | `+0.08em` |

Eyebrows (e.g. "A NEW FOUNDATIONAL MODEL") are uppercase, bold (700), at t9 with `+0.08em` tracking — the canonical Mission kicker treatment.

---

## Line Height

| Size | Line height |
|------|------------|
| t1 — 61px | `1.15` |
| t2 — 49px | `1.15` |
| t3 — 39px | `1.2` |
| t4 — 28px | `1.25` |
| t5 — 22px | `1.3` |
| t6 — 20px | `1.55` |
| t7 — 18px | `1.6` |
| t8 — 16px | `1.6` |
| t9 — 13px | `1.5` |

---

## Color System

### Text on light surfaces

| Token | Value | When to use |
|-------|-------|-------------|
| **Text Primary** | `#1D1D1F` | Headings and body text on white / light surfaces |
| **Text Brand Navy** | `#0A1344` | Brand identity text — hero h1, brand labels, monitor UI parallels |
| **Text Secondary** | `#6E6E73` | Supporting text, captions, secondary labels |
| **Text Muted** | `rgba(10, 19, 68, 0.45)` | Hero subtitle, breadcrumb separators, very-low-emphasis copy |

Rules:
- Do not introduce new gray hex values. Pick from the four tokens above.
- Hero h1 uses **Text Brand Navy** (`#0A1344`) per Mission. All other headings use **Text Primary** (`#1D1D1F`).

### Text on dark surfaces (4 opacity tiers only)

| Token | Value | When to use |
|-------|-------|-------------|
| **Dark Text Full** | `rgba(255,255,255,1.0)` | Headings on dark surfaces (e.g. gen-layers band) |
| **Dark Text High** | `rgba(255,255,255,0.75)` | Body text on dark surfaces |
| **Dark Text Medium** | `rgba(255,255,255,0.45)` | Eyebrows, secondary text, captions on dark surfaces |
| **Dark Text Low** | `rgba(255,255,255,0.25)` | Decorative or placeholder text on dark surfaces |

**Only these 4 white-opacity levels.** No 0.30, 0.62, 0.72, etc.

### Accent blues

> Rule: do not introduce new blue hex values. Every blue on this page must be one of these tokens.

| Token | Value | Role |
|-------|-------|------|
| **Blue Primary** | `#2563EB` | Inline links, CTA hover states, arrows, interactive highlights |
| **Blue Tint** | `#0066CC` | Background tints, washes (matches global `--accent`) |
| **Blue Deep** | `#0A1344` | Identity text, dark accents (also serves as Text Brand Navy) |

### Backgrounds & surfaces

| Token | Value | Usage |
|-------|-------|-------|
| **Bg Light** | `#F9F9F9` | Default page surface for all light sections (hero, what's an LGM, foundational, our research, results) |
| **Bg White** | `#FFFFFF` | Card surfaces — research-blog research cards, product pills |
| **Bg Dark** | `#060810` | Sole dark surface — gen-layers band (matches Mission Philosophy) |
| **Bg Card on Dark** | `rgba(255,255,255,0.06)` | Cards / tiles when nested inside `Bg Dark` (e.g. gen-layer tiles) |

The article CTA card (`.lgmArticleCard`) is its own surface — the radiance image at 0.75 opacity over white. It does **not** flip when nested in a dark band.

### Borders & dividers

| Token | Value | Usage |
|-------|-------|-------|
| **Border Grid Line** | `rgba(37, 99, 235, 0.3)` | Horizontal dividers between sections (matches global `--grid-line`) |
| **Border Subtle** | `rgba(0, 0, 0, 0.07)` | Internal dividers (sidebar, card borders on light) |
| **Border Card** | `rgba(10, 19, 68, 0.10)` | Result cards in section 4, product pills |
| **Border Dark Grid** | `rgba(255, 255, 255, 0.10)` | Dividers on dark surfaces (gen-layers) |
| **Border Dark Subtle** | `rgba(255, 255, 255, 0.06)` | Fainter structural lines on dark surfaces |

---

## Spacing

All spacing must be a **multiple of 4px**.

### Section padding (vertical)

| Token | Value | Usage |
|-------|-------|-------|
| Section SM | `96px` | Compact sections, careers / hiring |
| Section MD | `112px` | Standard section padding (mirrors Mission `py-28`) |
| Section LG | `128px` | Foundational, core-reasoning, results |
| Section XL | `160px` | Optional — denser sections |
| Section Hero | `192px` | TechHeroSection (matches Mission hero `pt-40 md:pt-52 pb-40 md:pb-56` averaged) |

### Common gaps

| Value | Usage |
|-------|-------|
| `8px` | Small internal gaps |
| `12px` | Icon-to-label gaps |
| `16px` | Standard component padding |
| `24px` | Card internal padding, section padding-x default |
| `32px` | Card gap (research card grid), medium spacing |
| `40px` | Section-to-content spacing |
| `64px` | Mid-section gaps |
| `80px` | Large layout gaps |
| `96px` | Extra-large gaps (between hero and first body section) |

### Content max-width

| Value | Usage |
|-------|-------|
| `1287px` | Primary content constraint (matches `--tech-shell-inline` site grid) |
| `900px` | Centered text columns (Mission "How We Differ") |
| `700px` | Lead / mission statement width |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **Radius SM** | `3px` | Small UI elements |
| **Radius Base** | `6px` | Card sub-elements |
| **Radius MD** | `10px` | Result cards, gen-layer tiles, grid art |
| **Radius LG** | `14px` | Result card art frames |
| **Radius XL** | `18px` | Article CTA cards (currently `20px` — round to `18px`) |
| **Radius 2XL** | `24px` | Reserved for future large surfaces |
| **Radius Full** | `9999px` | Pill shapes — product chips, "Explore more maps" button |

---

## Light ↔ Dark Variation

The page has **one dark surface**: the gen-layers band inside the research-blog section. Everything else is light.

### Pairing rules

| Property | Light surface (default) | Dark surface (`.darkSurface`) |
|----------|------------------------|-------------------------------|
| Background | `Bg Light` (`#F9F9F9`) | `Bg Dark` (`#060810`) |
| Card background | `Bg White` (`#FFFFFF`) | `Bg Card on Dark` (`rgba(255,255,255,0.06)`) |
| Headline text | `Text Primary` (`#1D1D1F`) | `Dark Text Full` (white 1.0) |
| Body text | `Text Primary` (`#1D1D1F`) | `Dark Text High` (white 0.75) |
| Secondary text | `Text Secondary` (`#6E6E73`) | `Dark Text Medium` (white 0.45) |
| Eyebrow / kicker | `Text Primary` (`#1D1D1F`) | `Dark Text Medium` (white 0.45) |
| Inline link | `Blue Primary` (`#2563EB`) | `Blue Primary` (`#2563EB`) — unchanged |
| Border | `Border Grid Line` (rgba blue 0.3) | `Border Dark Grid` (white 0.10) |
| Divider | `Border Subtle` (black 0.07) | `Border Dark Subtle` (white 0.06) |

### Implementation pattern

Tokens are CSS custom properties scoped via `.page` (light defaults) and overridden by `.darkSurface`. Because CSS variables cascade through the DOM tree (independent of CSS module scope), a single `.darkSurface` className on a wrapper div automatically flips every nested element that uses `var(--tech-color-*)` — no per-element overrides needed.

```css
.page {
  --tech-color-text: #1D1D1F;
  --tech-color-text-secondary: #6E6E73;
  --tech-color-bg: #F9F9F9;
  --tech-color-border: rgba(37,99,235,0.3);
  /* ... */
}

.darkSurface {
  --tech-color-text: rgba(255,255,255,1);
  --tech-color-text-secondary: rgba(255,255,255,0.75);
  --tech-color-bg: #060810;
  --tech-color-border: rgba(255,255,255,0.10);
  /* ... */
}
```

### Article CTA cards exception

The `.lgmArticleCard` (radiance image at 0.75 opacity over white, used at the bottom of foundational, core-reasoning, and results sections) is **a self-contained surface** — its tokens do **not** inherit from `.darkSurface`. It always renders as a light card with dark text, regardless of parent. Implement by reasserting `--tech-color-text: #1D1D1F` inside `.lgmArticleCard` if it's ever placed inside a `.darkSurface` block.

---

## Elevation & Shadows

| Level | Value | Usage |
|-------|-------|-------|
| **None** | `none` | Default light surfaces |
| **Card** | `0 4px 16px rgba(10, 19, 68, 0.06)` | Light cards on light backgrounds |
| **Card Lifted** | `0 6px 28px rgba(37, 99, 235, 0.08)` | Article CTA cards (current treatment, keep) |
| **Card Hover** | `0 10px 32px rgba(37, 99, 235, 0.12)` | Article CTA cards on hover |
| **Tile Dark** | `0 12px 32px rgba(0, 0, 0, 0.18)` | Gen-layer tile row, grid art image |
| **Grid Hero Dark** | `0 18px 48px rgba(0, 0, 0, 0.28)` | Shibuya / The Grid image |

---

## Motion

The page uses `RevealOnView` (existing component) for scroll-triggered fade-ins.

| Name | Easing | Duration | Usage |
|------|--------|----------|-------|
| **Reveal** | `ease-out` | 700ms | Section fade-in (`RevealOnView` default) |
| **Hero Reveal** | `ease-out` | 700ms | Hero h1 + subtitle blur(8px → 0) + translateY(16px → 0) |
| **Hover Shift** | `ease` | 200–300ms | Inline link / CTA hover transitions |
| **Card Lift** | `ease` | 320ms | Article card translateY(-2px) on hover |

**Critical rule (regression hazard):** any `transform` or `filter` value other than `none` on an element that contains a `backdrop-filter` descendant will scope the backdrop-filter to that ancestor. The hero nav fade-in helper must transition to `transform: none / filter: none` at rest (not `translateY(0) / blur(0)`) for the nav-item glass blur to render against the hero image. See [TechHeroSection.tsx:18](components/technology/TechHeroSection.tsx#L18).

---

## Scroll Reveal Pattern

All sections use the existing `RevealOnView` component (`components/technology/redesign/RevealOnView.tsx`) — the technology page's parallel to Mission's `useScrollReveal()` hook. Keep using `RevealOnView`; do not introduce a new hook.

---

## Out of Scope (this spec)

- Section 6 (Careers form) and Section 7 (Hiring Humans) were not part of the recent redesign and may have their own conventions. Leave them alone unless they conflict with the page-root tokens.
- The result-card map-art tiles in Section 4 (`.resultsCardArt` — `#1d3fa6` background) intentionally use a deeper saturated blue to host SVG wireframe illustrations. They are content surfaces, not chrome — keep their bespoke color.
- The radiance image (`/TechnologyPageImages/techpg-radiance.png`) on `.lgmArticleCard` is a content asset, not a token. Keep it at `0.75` opacity, full-bleed.
