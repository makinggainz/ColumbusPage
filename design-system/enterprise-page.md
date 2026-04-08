# /products/enterprise Page — Typography & Design System

> This document governs the enterprise product page (`/products/enterprise`) only.
> The rest of the Columbus Earth site uses a separate system defined in `fonts-typescale.md`.
> The consumer product page (`/products`) uses `products-page.md`.

---

## Typefaces

| Role | Stack | Where |
|------|-------|-------|
| Display / Headings / UI | `'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif` | All headings, section labels, CTAs, body text |

No secondary typefaces on this page.

---

## Type Scale

**Ratio: Major Third (1.25) — Base: 16px — aligned with global `fonts-typescale.md`**

The enterprise page uses the same ratio as the global site scale for visual consistency across Columbus Earth. The scale is extended at the small end for card UI elements.

| Step | Size | Name | Current Usage |
|------|------|------|---------------|
| e1 | **76px** | Display XL | EnterpriseHero heading at lg |
| e2 | **64px** | Display L | PromptShowcase heading at lg, DifferenceSection title at lg |
| e3 | **49px** | Display M | EnterpriseHero heading at md, section headings at lg, comparison headings |
| e4 | **39px** | Display S | EnterpriseHero heading at mobile |
| e5 | **28px** | Heading L | Section headings at mobile, PromptShowcase sub-headings at lg |
| e6 | **22px** | Heading M | StickyScrollSection descriptions, PromptShowcase part 2 body |
| e7 | **20px** | Body L | CTA text, SolutionShowcase subtitle, hero subtitle |
| e8 | **16px** | Body | Body text, DifferenceSection list items, comparison details |
| e9 | **15px** | Body S | ProblemCards text, ConsumerEnterpriseToggle labels |
| e10 | **14px** | UI | Button text, links, PromptShowcase card headers, CTA links |
| e11 | **13px** | Caption | PromptShowcase card details, accordion summaries |
| e12 | **11px** | Overline | StickyScrollSection feature category labels (uppercase) |

**Only these sizes should be used. Do not invent intermediate values.**

### Deviations to normalize in existing components
- `45px` (ProblemCards, SolutionShowcase, StickyScrollSection, ProductBanner headings) → move to **e3 (49px)**
- `48px` (DifferenceSection comparison h3) → move to **e3 (49px)**
- `36px` at `lg:` (PromptShowcase section heading) → move to **e3 (49px)** at `lg:`
- `510` weight (PromptShowcase "Columbus is thinking...") → normalize to **500**
- `21px` (hero subtitle) → move to **e7 (20px)**
- `24px` (StickyScrollSection body text) → move to **e6 (22px)** or **e5 (28px)**

### Monitor mockup UI (excluded from scale)

The EnterpriseHero and ChatSection contain a desktop monitor mockup with miniaturized UI elements. These use viewport-relative `clamp()` values and are **not part of the page type scale**:

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

### Deviations to normalize
- `-0.04em` (DifferenceSection title, PromptShowcase heading) → `-0.03em`
- `-0.025em` (ProductBanner heading) → `-0.02em`
- `0.06em` (uppercase "Video Demo" labels) → `0.12em`
- `0.2em` (PromptShowcase "REAL USE CASE STORIES") → `0.12em`

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

### Deviations to normalize
- `1.15` (ChatSection heading) → `1.1`
- `1.6` (StickyScrollSection descriptions) → `1.55`
- `1.65` (DifferenceSection list items, prompt box text) → `1.5` or `1.55`

---

## Gradient Text

Gradient text is used sparingly on the enterprise page, rendered via:
```css
WebkitBackgroundClip: "text"
WebkitTextFillColor: "transparent"
backgroundClip: "text"
```

| Name | Gradient | Element |
|------|----------|---------|
| Part 2 Heading | `linear-gradient(90deg, #06096D 0%, #318BCA 100%)` | PromptShowcase "Ask about a drawn area" |
| Loading Shimmer | `linear-gradient(90deg, #0A1344 0%, #0A1344 30%, #8A9BD4 50%, #0A1344 70%, #0A1344 100%)` | DifferenceSection "Columbus LGM" / "Basic AI" while loading |
| ProductBanner Noise | SVG noise texture (`feTurbulence`) fill clipped to text | "Columbus Pro — GIS made effortless" |

> Use `filter: drop-shadow(...)` not `text-shadow` — `text-shadow` has no effect when `WebkitTextFillColor` is transparent.

---

## Color System

### Text on light backgrounds

| Token | Value | When to use |
|-------|-------|-------------|
| **Text Primary** | `#1D1D1F` | Headings and body text on white/light surfaces |
| **Text Navy** | `#0A1344` | Brand identity text — monitor UI, icon buttons, brand labels |
| **Text Secondary** | `#374151` | Supporting text, card headers |
| **Text Tertiary** | `#6B7280` | Descriptions, placeholders, muted labels |
| **Text Muted** | `rgba(10, 19, 68, 0.40)` | Hero subtitle, breadcrumb separators |

Rules:
- Do not use `#4B5563` or `#111`. Map to Text Primary or Text Secondary.
- Do not introduce new gray hex values. Pick from the tokens above.

### Text on dark backgrounds (4 opacity levels only)

| Token | Value | When to use |
|-------|-------|-------------|
| **Dark Text Full** | `rgba(255,255,255,1.0)` | Headings on dark sections |
| **Dark Text High** | `rgba(255,255,255,0.75)` | Body text on dark. Replaces any 0.70 usage. |
| **Dark Text Medium** | `rgba(255,255,255,0.45)` | Secondary text, subtitles on dark. Replaces 0.35, 0.40. |
| **Dark Text Low** | `rgba(255,255,255,0.25)` | Placeholder text, decorative labels on dark. Replaces 0.20, 0.30. |

Rules:
- **Only these 4 white-opacity levels.** Do not use ad-hoc values like 0.35 or 0.62.
- If text feels too faint at 0.25, step up to 0.45. If too strong at 0.75, step down to 0.45.

### Accent blues

> **Rule: Do not introduce new blue hex values.** Every blue on this page must be one of these tokens.

| Token | Value | Role |
|-------|-------|------|
| **Blue Primary** | `#2563EB` | CTA hover states, chevron arrows, interactive highlights |
| **Blue Deep** | `#1B37CE` | Selected area checkmark, prompt box border accent |
| **Blue Tint** | `#0066CC` | Hero background overlay tint, blue washes |
| **Blue Shimmer** | `#8A9BD4` | Loading shimmer gradient midpoint |

### Gradient blues (PromptShowcase only)

| Token | Value |
|-------|-------|
| Gradient Start | `#06096D` |
| Gradient End | `#318BCA` |

### Backgrounds & surfaces

| Token | Value | Usage |
|-------|-------|-------|
| **Bg Light** | `#F9F9F9` | Hero, ProductBanner — default light section background |
| **Bg White** | `#FFFFFF` | PromptShowcase, DifferenceSection, card surfaces |
| **Bg Card** | `#FDFDFD` | PromptShowcase card backgrounds. Replaces `#F7F7F7`, `#FAFAFA`. |
| **Bg Dark** | `#060810` | Dark sections — ProblemCards, SolutionShowcase, StickyScrollSection, ComparisonSection |
| **Bg Dark Alt** | `#1a1a1a` | ChatSection background |
| **Bg Monitor Frame** | `#1D1D1F` | Monitor mockup outer frame |
| **Bg Monitor Titlebar** | `#F5F5F7` | Monitor window title bar chrome |

### Borders & dividers

| Token | Value | Usage |
|-------|-------|-------|
| **Border Card** | `#EDEDED` | Card borders on light backgrounds |
| **Border Subtle** | `rgba(0,0,0,0.07)` | Internal panel dividers, sidebar borders |
| **Border Medium** | `rgba(0,0,0,0.10)` | Window title bar borders |
| **Border Dark Grid** | `rgba(255,255,255,0.10)` | Grid lines, vertical structure lines on dark backgrounds |
| **Border Dark Subtle** | `rgba(255,255,255,0.06)` | Fainter structural lines on dark backgrounds |
| **Border Accent** | `rgba(27,55,206,0.25)` | DifferenceSection prompt box border (Blue Deep at 25% opacity) |

### Button & icon backgrounds

| Token | Value | Usage |
|-------|-------|-------|
| **Button Dark** | `#1D1D1F` | "More use cases" button, dark CTA backgrounds |
| **Button Navy** | `#0A1344` | Monitor UI send button, sidebar active icon |
| **Button Navy Alt** | `#0E1A44` | Prompt card icon, alternate dark button |

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
| **Card** | `0px 0px 30px rgba(0,0,0,0.2)` | PromptShowcase cards |
| **Card XL** | Tailwind `shadow-xl` | PromptShowcase larger cards, selected area card |
| **Prompt Glow** | `0px 0px 30px 5px rgba(191,197,235,0.25)` | DifferenceSection prompt box |
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
| Section LG | `128px` (32 × 4) | PromptShowcase (`py-32`), SolutionShowcase (120px → 128px) |
| Section XL | `160px` (40 × 4) | PromptShowcase at md (`md:py-40`) |
| Section Hero | `192px` (48 × 4) | ProductBanner (230px → 192px) |

### Deviations to normalize
- `100px` (ProblemCards padding) → `96px` or `104px`
- `230px` (ProductBanner padding) → `192px` or `224px` (56 × 4)
- `280px` (ChatSection paddingTop) → `288px` (72 × 4) or `256px` (64 × 4)
- `120px` (SolutionShowcase padding) → `128px`
- `74px` (StickyScrollSection py) → `72px` (18 × 4) or `76px` (19 × 4)

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

| Token | Value | Usage |
|-------|-------|-------|
| **Radius SM** | `3px` | Small UI elements, monitor nav buttons |
| **Radius Base** | `6px` | Card sub-elements |
| **Radius MD** | `10px` | DifferenceSection images, data cards |
| **Radius LG** | `14px` | Large cards, prompt boxes, rounded containers |
| **Radius XL** | `18px` | PromptShowcase cards |
| **Radius 2XL** | `24px` | Monitor frame (responsive: `clamp(12px, 1.6vw, 24px)`) |
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
| **Toggle Nudge** | `cubic-bezier(0.25, 1, 0.5, 1)` | 300ms | ConsumerEnterpriseToggle active state |

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

## Noise Grain Texture

Multiple dark sections share a consistent SVG noise overlay:

```html
<svg style="opacity: 0.40–0.50; mixBlendMode: multiply">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)" />
</svg>
```

| Section | Opacity |
|---------|---------|
| Dark sections (ProblemCards → ComparisonSection wrapper) | `0.40` |
| ProductBanner | `0.50` |
| StickyScrollSection | `0.40` |

---

## Grid Structure Lines

Dark sections use vertical structure lines at the content constraint boundary:

```
max-width: 1287px, centered
border-left: 1px solid rgba(255,255,255,0.10)
border-right: 1px solid rgba(255,255,255,0.10)
```

Horizontal dividers between sub-sections use the same color at 1px height.
