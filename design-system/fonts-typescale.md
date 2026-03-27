# Typography & Fonts System

Typeface: **Geist** (all weights, site-wide)

---

## Type Scale (Major Third — 1.25 ratio, base 16px)

| Step | Size | Role |
|------|------|------|
| 1 | 76px | Product hero headings (SiteSelection, TravelSection) |
| 2 | 61px | Main hero heading |
| 3 | 49px | Section headings (Vision, Applications, Careers, GeoWarning line 1) |
| 4 | 39px | Secondary headings (PartnerStrip, TrustStrip, Careers subheading, GeoWarning line 2) |
| 5 | 25px | Tertiary headings / subheadings (Capabilities, GeneratedMaps, UniqueSpots) |
| 6 | 20px | Body large, subtitles, bar text, product labels |
| 7 | 16px | Body, buttons, pill toggles, form inputs |
| 8 | 13px | Captions, card labels, fine print |
| 9 | 10px | Reserved (not currently used) |

Only these sizes should be used. Do not invent intermediate values.

---

## Responsive Scale

Every heading steps down one scale level at mobile. Use Tailwind breakpoints — mobile-first (no prefix = mobile, `md:` = 768px+, `lg:` = 1024px+).

| Role | Mobile | md: (768px+) | lg: (1024px+) |
|------|--------|--------------|---------------|
| Product heroes | `text-[39px]` | `md:text-[49px]` | `lg:text-[76px]` |
| Section headings | `text-[31px]` | `md:text-[39px]` | `lg:text-[49px]` |
| Secondary headings | `text-[25px]` | `md:text-[31px]` | `lg:text-[39px]` |
| Subheadings | `text-[20px]` | `md:text-[20px]` | `lg:text-[25px]` |
| Body large | `text-[16px]` | `md:text-[16px]` | `lg:text-[20px]` |
| Hero heading | `text-[39px]` | `md:text-[49px]` | `lg:text-[61px]` |

The hero heading (61px, weight 300, `#0A1344`) follows the same step-down pattern but keeps its unique weight and color at all sizes.

---

## Font Weights

| Weight | Name | When to use |
|--------|------|-------------|
| 300 | Light | Hero heading (61px) only |
| 400 | Regular | Body text (16–20px), subtitles, form inputs, descriptions |
| 500 | Medium | All headings except the hero (76, 49, 39, 25px) and button/label text |
| 600 | Semibold | Inline emphasis only — product names ("Columbus Pro"), CTAs ("Start Now", "Try it out now"), emphasized words ("super-explorer", "Join us now") |
| 700 | Bold | Inline emphasis only — product brand names ("Columbus Pro", "MapsGPT" header label), SVG diagram labels |

Rules:
- Section/subsection headings are always weight **500**. Never 600 or 700 for a heading element.
- 600 and 700 are reserved for **inline spans** that need to stand out within surrounding text, or for product name labels. They are not for headings.
- The hero heading at 300 is a deliberate contrast — it should feel editorial and distinct from the rest of the page.

---

## Text Colors

| Token | Value | When to use |
|-------|-------|-------------|
| Hero | `#0A1344` | Hero section text only (heading, eyebrow, nav links) |
| Primary | `#1D1D1F` | All headings and body text outside the hero |
| Secondary | `#6E6E73` | Subheadings, descriptions, supporting text (e.g. section subtitles in gray) |
| Muted | `rgba(29,29,31,0.45)` | Subtitles directly under large headings, placeholders, fine print |
| Emphasis | `rgba(29,29,31,0.65)` | Emphasized words within muted subtitles (e.g. "super-explorer") |
| Dimmed | `rgba(29,29,31,0.8)` | Slightly emphasized text within muted context (e.g. "Join us now") |
| Accent | `#2563EB` | CTA icons, hover states, interactive highlights |
| White | `#FFFFFF` / `white` | Text on dark backgrounds (buttons, image overlays, dark sections) |
| Black | `#000000` | Button backgrounds only — never for text |

Rules:
- Never use `#717074`. Use `#6E6E73` for all secondary/gray text.
- Never hardcode a new gray. If text needs to be "less important", pick from Secondary, Muted, or Emphasis above.
- White text on images should always have a gradient scrim or dark overlay behind it for contrast.

---

## Letter Spacing

| Size range | Tracking |
|------------|----------|
| 49–76px | `-0.02em` |
| 20–39px | `-0.015em` to `-0.01em` |
| 16px | `0` (default) |
| 10–13px | `0` to `0.01em` |

---

## Line Height

| Context | Line height |
|---------|------------|
| Large headings (49–76px) | `1.05` – `1.15` |
| Hero heading (61px) | `1.2` |
| Section headings (39–49px) | `1.12` |
| Body large (20px) | `1.47` |
| Body (16px) | `1.6` |
| Small text (13px) | `1.5` |
