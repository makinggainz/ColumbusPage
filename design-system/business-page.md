# /products/business Page — Typography & Design System

> This document governs the business product page (`/products/business`) only.
> The rest of the Columbus Earth site uses a separate system defined in `fonts-typescale.md`.
> The consumer product page (`/products`) uses `products-page.md`.

> **Status — strict homepage parity.** The page reads as the same design
> language as the homepage. All surfaces are white; text is the homepage
> ink/muted; the hairline is `--color-gridline`; filled CTAs use the homepage
> navy at the homepage button radius (`rounded-button-md`, 18px); the single
> interactive accent is `#0081AC`. **Headings render in Funnel Display**
> (`--font-display`) — the homepage heading face; Axiforma is no longer used
> for business headings. **Content cards / media frames / prompt boxes use a
> 7px corner** (`--ent-radius-card`) — the homepage's canonical card radius —
> with the homepage product-visual shadow (`--ent-shadow-card`) and the
> `#E7E7F1` hairline ring. **Business-only gradient text is removed**;
> affected headings render solid `--ent-text-primary`. SVG noise grain and
> vertical structure rails are removed. The e1–e12 type scale, weights,
> spacing scale and motion vocabulary are unchanged. The monitor mockup keeps
> its own device-chrome radii (it has no homepage equivalent). `*-dark*` token
> names are **historical** and resolve to the light palette — see
> `business-tokens.css`.

---

## Typefaces

Two-family system, applied page-wide via `.ent-scope` rules in `business-tokens.css`.

| Role | Stack | Token | Where |
|------|-------|-------|-------|
| Titles / Headings | `Funnel Display` | `--ent-font-heading` (= `--font-display`) | All `h1`–`h6` title texts — same as the homepage |
| Body / UI | `Opening Hours Sans` | `--ent-font-sans` (= `--font-sans`) | Body copy, captions, UI labels, CTAs |

Strict homepage parity: business headings use **Funnel Display**, the same
face the homepage hero and section headings use. Axiforma (`--font-hero`) is
no longer used for business page headings.

Mechanism: `.ent-scope` sets the body face on the whole page; a
`.ent-scope :is(h1,h2,h3,h4,h5,h6):not(footer *)` rule promotes every heading
to Funnel Display. Business sections use semantic `h1`–`h6` tags for their
titles, so no per-component font edits are needed (the one inline override on
the hero `h1` now points at `--ent-font-heading`). The shared `<footer>`
already uses the site-wide Funnel Display heading face — now identical.

---

## Type Scale

**Ratio: Major Third (1.25) — Base: 16px — aligned with global `fonts-typescale.md`**

The business page uses the same ratio as the global site scale for visual consistency across Columbus Earth. The scale is extended at the small end for card UI elements.

| Step | Size | Name | Current Usage |
|------|------|------|---------------|
| e1 | **76px** | Display XL | BusinessHero heading at lg |
| e2 | **64px** | Display L | PromptShowcase heading at lg, DifferenceSection title at lg |
| e3 | **49px** | Display M | BusinessHero heading at md, section headings at lg, comparison headings |
| e4 | **39px** | Display S | BusinessHero heading at mobile |
| e5 | **28px** | Heading L | Section headings at mobile, PromptShowcase sub-headings at lg |
| e6 | **22px** | Heading M | StickyScrollSection descriptions, PromptShowcase part 2 body |
| e7 | **20px** | Body L | CTA text, SolutionShowcase subtitle, hero subtitle |
| e8 | **16px** | Body | Body text, DifferenceSection list items, comparison details |
| e9 | **15px** | Body S | ProblemCards text, ConsumerBusinessToggle labels |
| e10 | **14px** | UI | Button text, links, PromptShowcase card headers, CTA links |
| e11 | **13px** | Caption | PromptShowcase card details, accordion summaries |
| e12 | **11px** | Overline | StickyScrollSection feature category labels (uppercase) |

**Only these sizes should be used. Do not invent intermediate values.**

### Resolved
- ProblemCards / SolutionShowcase `lg:` headings → **e3 (49px)** ✓
- BusinessHero subtitle → **e7 (20px, `--ent-text-body-l`)** ✓
- StickyScrollSection body / DifferenceSection comparison h3 / PromptShowcase
  heading & `510` weight — verified already compliant in current code ✓

### Monitor mockup UI (excluded from scale)

The BusinessHero and ChatSection contain a desktop monitor mockup with miniaturized UI elements. These use viewport-relative `clamp()` values and are **not part of the page type scale**:

| Element | Size |
|---------|------|
| URL bar text | `clamp(6px, 0.65vw, 10px)` |
| App nav label | `clamp(7px, 0.75vw, 11px)` |
| Nav buttons | `clamp(5px, 0.58vw, 9px)` |
| Chat text | `clamp(7px, 0.85vw, 13px)` |
| Brand name | `clamp(7px, 0.75vw, 11px)` |

These values scale proportionally with the monitor mockup and should not be changed to match the page scale.

---

## Responsive Scale

Step down one level at mobile. Use Tailwind breakpoints (mobile-first).

| Role | Mobile | md: (768px+) | lg: (1024px+) |
|------|--------|--------------|---------------|
| Display XL (hero) — e1 | `text-[39px]` | `md:text-[49px]` | `lg:text-[76px]` |
| Display L (showcase) — e2 | `text-[28px]` | `md:text-[48px]` | `lg:text-[64px]` |
| Section heading — e3 | `text-[28px]` | `md:text-[36px]` | `lg:text-[49px]` |
| Sub-heading — e5 | `text-[20px]` | `md:text-[22px]` | `lg:text-[28px]` |
| Body L — e7 | `text-[16px]` | `md:text-[16px]` | `lg:text-[20px]` |

---

## Font Weights

| Weight | Name | When to use |
|--------|------|-------------|
| 300 | Light | DifferenceSection title ("See How We're Different"), comparison h3 headings. Deliberate editorial contrast. |
| 400 | Regular | Body text, descriptions, ProblemCards, comparison list items |
| 500 | Medium | Hero heading, section headings (e3–e5), CTA labels, primary UI text |
| 600 | Semibold | Inline emphasis only — "Columbus" brand label in monitor, ProductBanner CTA, emphasized words |

Rules:
- Section headings are always weight **500**. Never 600 for a heading element.
- Weight 300 is reserved for the DifferenceSection editorial heading and comparison h3s — nowhere else.
- 600 is for **inline emphasis**, not headings.

---

## Letter Spacing

Three tiers — simplified from the 7+ values currently scattered across components.

| Size range | Tracking |
|------------|----------|
| e1–e2 (64–76px) | `-0.03em` |
| e3–e6 (22–49px) | `-0.02em` |
| e7–e11 (13–20px) | `-0.01em` |
| e12 (11px) overlines | `+0.12em` |

### Resolved
- ComparisonSection uppercase video label → **`0.12em`** (`--ent-tracking-overline`) ✓
- DifferenceSection title, PromptShowcase heading/overline, ProductBanner
  heading — verified already compliant (`-0.03em` / `0.12em` / `-0.02em`) ✓

---

## Line Height

| Size | Line height |
|------|------------|
| e1 — 76px | `1.1` |
| e2 — 64px | `1.05` |
| e3 — 49px | `1.1` |
| e4–e5 — 28–39px | `1.1` |
| e6 — 22px | `1.55` |
| e7 — 20px | `1.55` |
| e8–e9 — 15–16px | `1.5` |
| e10–e11 — 13–14px | `1.5` |
| e12 — 11px overlines | `1.2` |

### Resolved
- ChatSection heading → **`1.1`** ✓
- StickyScrollSection mobile description → **`1.55`** (matches desktop) ✓
- DifferenceSection list items / prompt box — verified already compliant (`1.5`) ✓

---

## Gradient Text — removed

Strict homepage parity: the homepage has no gradient text, so all
business-only gradient text is **removed**.

| Was | Now |
|-----|-----|
| PromptShowcase "Ask about a drawn area" — `linear-gradient(90deg, #06096D→#318BCA)` clipped to text | Solid `--ent-text-primary` (`text-ink`) |
| DifferenceSection "Columbus LGM" / "Basic AI" loading shimmer — animated navy→`#8A9BD4` clip | Solid `--ent-text-primary` (no gradient, no `comparison-shimmer` animation) |

The `--ent-gradient-start` / `--ent-gradient-end` tokens are retained but
**deprecated and unreferenced**. Do not reintroduce `WebkitBackgroundClip:
text` / `WebkitTextFillColor: transparent` on this page.

---

## Color System

### Text on light backgrounds

The page is one light surface; text colours map to the homepage palette
(`--color-ink` / `--color-muted`).

| Token | Value | When to use |
|-------|-------|-------------|
| **Text Primary** (`--ent-text-primary`) | `#0B1B2B` | Headings and body text — same as homepage `--color-ink` |
| **Text Navy** (`--ent-text-navy`) | `#0A1344` | Monitor-UI / brand-identity text only (mockup chrome) |
| **Text Secondary / Tertiary / Muted** | `#5A6B7B` | All supporting / muted copy — same as homepage `--color-muted` |

Rules:
- Do not introduce new gray hex values. Use the tokens above.
- The legacy `#1D1D1F`, `#374151`, `#6B7280`, `rgba(10,19,68,0.40)` values are retired.

### Dark backgrounds — removed

The business page has **no dark sections**. The formerly-dark surfaces
(ProblemCards, SolutionShowcase, StickyScrollSection, ComparisonSection,
ChatSection) now render white to match the homepage. The historical
`--ent-dark-text-*` tokens still exist for call-site stability but resolve to
dark ink/muted on white (see `business-tokens.css`). Do not author new
white-on-dark text or reintroduce white-opacity levels.

### Interactive accent & decorative blues

> **Rule: Do not introduce new blue hex values, and no purple/violet/indigo
> anywhere on the site.** Interactive accents use `--ent-accent` only;
> decorative blues are limited to the tokens below.

| Token | Value | Role |
|-------|-------|------|
| **Accent** (`--ent-accent`) | `#0081AC` | The ONLY colour for interactive accents — arrows, links, CTA hover. Matches the homepage accent. |
| **Blue Deep** (`--ent-blue-deep`) | `#1B37CE` | DifferenceSection selected-area checkmark + prompt-box border accent (decorative/identity) |
| **Blue Tint** (`--ent-blue-tint`) | `#0066CC` | ChatSection photo wash / hero overlay tint (decorative) |
| ~~Blue Shimmer~~ (`--ent-blue-shimmer`) | `#8A9BD4` | **Deprecated** — loading-shimmer gradient text removed (strict parity); unused |

`#2563EB` (the former "Blue Primary") is **retired** from interactive use;
`--ent-blue-primary` is kept only as a deprecated, unreferenced token.

### Gradient blues — deprecated

`--ent-gradient-start` (`#06096D`) / `--ent-gradient-end` (`#318BCA`) are
**retired** — strict homepage parity removed all gradient text. The tokens
remain defined but unreferenced; do not use them.

### Backgrounds & surfaces

The whole page is white to match the homepage. `*-dark*` names are historical
and resolve to white.

| Token | Value | Usage |
|-------|-------|-------|
| **Bg Light / Bg White** (`--ent-bg-light` / `--ent-bg-white`) | `#FFFFFF` | Every section background |
| **Bg Card** (`--ent-bg-card`) | `#FDFDFD` | PromptShowcase card surfaces |
| **Bg Dark / Bg Dark Alt** (`--ent-bg-dark` / `--ent-bg-dark-alt`) | `#FFFFFF` | Historical names — resolve to white. Do not reintroduce dark values. |
| **Bg Monitor Frame** (`--ent-bg-monitor-frame`) | `#1D1D1F` | Monitor mockup bezel — the only dark fill, an intentional device frame |
| **Bg Monitor Titlebar** (`--ent-bg-monitor-titlebar`) | `#F5F5F7` | Monitor window title-bar chrome |

### Borders & dividers

| Token | Value | Usage |
|-------|-------|-------|
| **Border Card** (`--ent-border-card`) | `#E7E7F1` | All hairline borders / dividers — the homepage blueprint hairline (`--color-gridline`) |
| **Border Dark Grid** (`--ent-border-dark-grid`) | `#E7E7F1` | Historical name — the same light hairline as Border Card |
| **Border Subtle** (`--ent-border-subtle`) | `rgba(0,0,0,0.07)` | Internal monitor-panel dividers |
| **Border Medium** (`--ent-border-medium`) | `rgba(0,0,0,0.10)` | Monitor window title-bar borders |
| **Border Accent** (`--ent-border-accent`) | `rgba(27,55,206,0.25)` | DifferenceSection prompt-box border (Blue Deep @ 25% — identity) |

### Button & icon backgrounds

Filled CTAs use the homepage navy (`--color-cta`).

| Token | Value | Usage |
|-------|-------|-------|
| **Button Dark / Navy / Navy Alt** (`--ent-btn-dark` / `--ent-btn-navy` / `--ent-btn-navy-alt`) | `#0B1342` | All filled CTA + monitor-UI button backgrounds — same as homepage `--color-cta` |

### Window chrome colors (monitor mockup only)

| Token | Value |
|-------|-------|
| Chrome Red | `#FF5F57` |
| Chrome Yellow | `#FEBC2E` |
| Chrome Green | `#28C840` |

---

## Elevation & Shadows

| Level | Value | Usage |
|-------|-------|-------|
| **Monitor** | `0 40px 100px rgba(0,0,0,0.50), 0 12px 32px rgba(0,0,0,0.30)` | Hero desktop monitor frame |
| **Monitor Top** | `0 -20px 60px rgba(0,0,0,0.30), 0 -6px 20px rgba(0,0,0,0.15)` | ChatSection monitor (shadow upward) |
| **Card** (`--ent-shadow-card`) | `0 24px 60px rgba(11,27,43,0.20)` | Content cards — the homepage product-visual shadow (BentoProducts `.bp-visual`). Paired with the `#E7E7F1` hairline ring (`border border-gridline`), same as the homepage. |
| **Card XL** | Tailwind `shadow-xl` | PromptShowcase larger cards, selected area card |
| **Prompt Glow** (`--ent-shadow-prompt-glow`) | `0px 0px 30px 5px rgba(191,197,235,0.25)` | DifferenceSection prompt box — canonical homepage blue-glow-on-white; kept |
| **Image** | Tailwind `shadow-md` | DifferenceSection comparison images |
| **Image Deep** | Tailwind `shadow-2xl` | StickyScrollSection desk/mobile images |

---

## Spacing

All spacing must be a **multiple of 4px**. No exceptions.

### Section padding (vertical)

| Token | Value | Usage |
|-------|-------|-------|
| Section SM | `96px` (24 × 4) | Compact sections |
| Section MD | `112px` (28 × 4) | DifferenceSection (`py-28`) |
| Section LG | `128px` (32 × 4) | PromptShowcase (`py-32`), SolutionShowcase header |
| Section XL | `160px` (40 × 4) | PromptShowcase at md (`md:py-40`) |
| Section Hero | `192px` (48 × 4) | ProductBanner (`clamp(120px,15vw,192px)`) |

### Resolved
- ProblemCards header padding → **96px** (`--ent-section-sm`) ✓
- SolutionShowcase header padding → **128px** (`--ent-section-lg`) ✓
- ProductBanner padding → **`clamp(120px,15vw,192px)`** (`--ent-section-hero` cap) ✓
- StickyScrollSection sticky column → **96px** (`py-24`); content column → **72px** (`lg:py-18`) ✓

Accepted exception: ChatSection `lg:pt-[280px]` is a deliberate
monitor-overlap value, not on the section-padding scale — left as-is.

### Common gaps

| Value | Usage |
|-------|-------|
| `8px` | Small internal gaps (gap-2) |
| `12px` | Icon-to-label gaps (gap-3) |
| `16px` | Standard component padding |
| `20px` | Card spacing (gap-5) |
| `24px` | Standard section padding-x, card internal padding |
| `32px` | Card gaps (gap-8), medium spacing |
| `40px` | Section-to-content spacing (gap-10, mt-10) |
| `64px` | Section gaps (mt-16, mb-16) |
| `80px` | Large layout gaps (mt-20, mb-20) |
| `96px` | Extra-large gaps (mt-24) |

### Content max-width

| Value | Usage |
|-------|-------|
| `1287px` | Primary content constraint (grid width) |
| `1100px` | Monitor mockup max-width |
| `759px` | DifferenceSection prompt box |
| `503px` | PromptShowcase center prompt card |

---

## Border Radius

Strict homepage parity: **every content card, media frame and prompt box uses
the homepage card corner — `--ent-radius-card` (7px)** (the homepage blog +
feature cards and careers map). Filled CTAs use the homepage content-CTA
radius, `rounded-button-md` (18px). The monitor mockup keeps its own
device-chrome radii (no homepage equivalent — see note). Small inner chips
stay at 3–8px (homepage micro-element scale).

| Token | Value | Usage |
|-------|-------|-------|
| **Radius Card** (`--ent-radius-card`) | `7px` | All content cards / media frames / prompt boxes — the homepage card corner |
| **Radius SM** | `3px` | Small UI elements, monitor nav buttons |
| **Radius Base** | `6px` | Tiny icon tiles (homepage micro-elements) |
| **Radius MD** | `10px` | Reserved — superseded by Radius Card for cards/media |
| **Radius LG** | `14px` | Reserved — superseded by Radius Card |
| **Radius XL** | `18px` | Reserved — CTAs use `rounded-button-md` (18px) instead |
| **Radius 2XL** | `24px` | Monitor-mockup device chrome (responsive: `clamp(12px, 1.6vw, 24px)`) — hardware, not a card |
| **Radius Full** | `9999px` | Pill shapes, circular buttons, toggle |

---

## Motion

This page uses its own easing vocabulary, not the global M3 tokens.

| Name | Easing | Duration | Usage |
|------|--------|----------|-------|
| **Reveal** | `ease-out` | 600ms | Scroll-triggered section fade-ins (all sections) |
| **Reveal Slow** | `ease` | 750ms | Hero element reveal with translateY |
| **Spring Pop** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 450ms | PromptShowcase card scale-in (overshoots to 1.0) |
| **Blur Reveal** | `ease-out` | 600ms | PromptShowcase header blur(8px → 0) + translateY(16px → 0) |
| **Typewriter** | Linear | 38ms/char (hero), 18ms/char (DifferenceSection) | Character-by-character text reveal |
| **Shimmer** | `ease-in-out` | 1600ms infinite | DifferenceSection loading gradient sweep |
| **Hover Shift** | — | 300ms | CTA hover color/transform transitions |
| **Toggle Nudge** | `cubic-bezier(0.25, 1, 0.5, 1)` | 300ms | ConsumerBusinessToggle active state |

### Scroll-trigger pattern

All sections use the same IntersectionObserver pattern:
```tsx
const obs = new IntersectionObserver(
  ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
  { threshold: 0.1–0.2 }
);
```

Fade-in style applied via a shared helper:
```tsx
const fadeIn = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
});
```

Stagger delays: 0s, 0.15s, 0.3s, 0.45s for sequential elements.

---

## Background Treatment (Line-Art)

The SVG noise grain and the blueprint vertical structure rails are **removed**.
They are replaced by a single faint city line-art image,
`/businessartbackground.png`, anchored along the bottom horizon:

| Where | Treatment |
|-------|-----------|
| Mid-block (ProblemCards → ComparisonSection wrapper), ProductBanner | `background-image: url(/businessartbackground.png)`; `background-size: 100% auto`; `background-repeat: no-repeat`; `background-position: center bottom`; on `#FFFFFF` |
| StickyScrollSection | Same image, `filter: invert(1)`, `mix-blend-mode: screen`, `opacity: 0.5`, height `min(70%, 700px)` — reads as a faint light wash on white |

Horizontal dividers (e.g. the page mid-block rule) are a 1px line in
**`--ent-border-card` (`#E7E7F1`)**, drawn from the screen edge to the
1287px content bound. Vertical structure rails are suppressed page-wide via
`.ent-scope .grid-section::before/::after { display:none }` in
`business-tokens.css` — do not reintroduce them.

---

## BusinessHero — Background & Navbar Treatment

The hero (`components/business/BusinessHero.tsx`) is a full-bleed photo
hero whose background runs to the very top of the page, behind the navbar.

### Background

| Layer | Value |
|-------|-------|
| Image | `/ColumbusBackgroundbento.png` — the same sky photo as the homepage Columbus bento tile (`BentoProducts`). `background-size: cover`, `background-position: center`. |
| Dark overlay | Flat `rgba(0,0,0,0.10)` black scrim — the bento tile's scrim (`0.18`) lightened so the sky reads brighter. |
| Bottom fade | `linear-gradient(to bottom, transparent, var(--ent-bg-light))` over the bottom 40%, blending the hero into the section below. |

### Extending behind the navbar

`MistxNav` is `position: sticky` and stays in document flow (~83–90px tall by
breakpoint). The hero is pulled up with `margin-top: -120px` and a matching
`padding-top: 120px`:

- the negative margin lets the sky background span the full page width up
  behind the navbar;
- the equal padding keeps hero content in place (nothing shifts);
- `120px` deliberately exceeds the navbar height so no white PageFrame card
  peeks through above the hero at any breakpoint — the overshoot is clipped
  by the card's `overflow: clip`.

`MistxNav` must be rendered as a **direct child of `<main>`**, not wrapped in
a `SectionWithLabel` (or any short `position: relative` section) — a wrapper
becomes the sticky containing block and lets the navbar scroll away.

### Hero text

`h1`, the subtitle, and the "Talk to Founders" link all render in white
(`#FFFFFF`) for contrast against the sky. The link's arrow and hover state
use the `#0081AC` (`--ent-accent`) interactive accent.

### Navbar backdrop + colour over the hero

The hero `<section>` carries `data-hero-section` and `MistxNav` is passed
the `heroWhite` prop. `heroWhite` is opt-in and defaults off, so every other
page keeps the standard transparent→solid-white behaviour. On the business
page the navbar has **three** states, keyed off scroll position and whether
the navbar still overlaps the hero (`overHero` — the hero's bottom edge is
still below the navbar's):

| State | Condition | Backdrop | Contents |
|-------|-----------|----------|----------|
| **Transparent** | At page top (not scrolled) | None — sky reads through | White (logo, wordmark, links, Contact) |
| **Gradient scrim** | Scrolled **and** still over the hero | Sky-tinted top-down gradient (see below) | White |
| **Solid** | Scrolled past the hero | Normal `#FFFFFF` backdrop | Dark (default) |

Nav contents stay **white the entire time the navbar is in front of the
hero** (transparent state + gradient-scrim state); they revert to the
default dark colours only once the hero scrolls out and the solid backdrop
pins. The "Try Elio" CTA keeps its filled navy pill in all three states.

**Gradient scrim backdrop:** an absolutely-positioned layer behind the nav
content row (`z-0` vs the row's `z-10`):

- tinted to the hero image's dominant sky colour, **#018ADE**
  (`rgb(1,138,222)`) — the same value `BentoProducts` uses for the
  Columbus tile's `/ColumbusBackgroundbento.png`, so the navbar reads as
  a continuation of the sky;
- `background: linear-gradient(to bottom, rgba(1,138,222,1) 0%, rgba(1,138,222,0.55) 50%, rgba(1,138,222,0) 100%)`
  — fully opaque at the top, fading to fully transparent (alpha 0)
  exactly at the navbar's bottom border (`top:0; bottom:0`), so it
  blends into the real sky below with no hard edge;
- no blur (the earlier frosted-glass/black-gradient versions were
  removed);
- driven by `opacity` + a 300ms transition so it cross-fades with the
  solid backdrop as the hero scrolls out from behind the navbar.
