# /products Page — Typography & Color System

> This document governs the MapsGPT consumer product page (`/products`) only.
> The rest of the Columbus Earth site uses a separate system defined in `fonts-typescale.md`.

---

## Typefaces

| Role | Stack | Where |
|------|-------|-------|
| Display / Headings / UI | `'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif` | All headings, section labels, pills, buttons |
| Hero badge title | `'SF Compact', -apple-system, BlinkMacSystemFont, sans-serif` | "MapsGPT" hero title only |
| Micro-labels / Inputs | `'Inter', sans-serif` | Input placeholder, "Roll the dice" label |

---

## Type Scale

**Ratio: Perfect Fourth (1.333) — Base: 15px**

Each step = previous × 1.333, rounded to the nearest integer. This ratio produces more dramatic jumps than the home page's Major Third (1.25), appropriate for a cinematic consumer product showcase.

| Step | Exact | Canonical | Name | Current Usage |
|------|-------|-----------|------|---------------|
| s1 | 15.0px | **15px** | Caption / Body S | Card descriptions, "Powered by" label, rating text |
| s2 | 20.0px | **20px** | Body / UI | Input placeholder, CTA text, "We work with data", category pills |
| s3 | 26.7px | **27px** | Body L | Reserved — not yet in use |
| s4 | 35.6px | **36px** | Subheading | FinalCTA bottom heading |
| s5 | 47.5px | **48px** | Display S | Section headings: ShowcaseSection, FavoritesSection, HowItWorks |
| s6 | 63.3px | **64px** | Display M | Hero "Travel Like a Boss", HowItWorks primary heading |
| s7 | 84.4px | **80px** | Display L | FinalCTA "We're always there for you" *(capped from 85 for visual balance)* |

**Only these sizes should be used. Do not invent intermediate values.**

### Deviations to normalize in existing components
- `32px` (FinalCTA, QuestionsSection) → move to **s4 (36px)**
- `19px` (ShowcaseSection feature pills) → move to **s2 (20px)**
- `16px` (badge text) → acceptable alias for s1; both 15–16px are fine for this role

---

## Responsive Scale

Step down one level at mobile. Use Tailwind breakpoints (mobile-first).

| Role | Mobile | md: (768px+) | lg: (1024px+) |
|------|--------|--------------|---------------|
| Display L — s7 | `text-[48px]` | `md:text-[64px]` | `lg:text-[80px]` |
| Display M — s6 | `text-[36px]` | `md:text-[48px]` | `lg:text-[64px]` |
| Display S — s5 | `text-[27px]` | `md:text-[36px]` | `lg:text-[48px]` |
| Subheading — s4 | `text-[20px]` | `md:text-[27px]` | `lg:text-[36px]` |
| Body — s2 | `text-[15px]` | `md:text-[15px]` | `lg:text-[20px]` |

---

## Font Weights

| Weight | Name | When to use |
|--------|------|-------------|
| 400 | Regular | Body copy, card descriptions, "Powered by" label, muted text |
| 500 | Medium | UI labels, pills, badge text, placeholder text, "We work with data" |
| 590 | Semi-medium† | Gradient headline text, rotating subtitles |
| 600 | Semibold | Section headings (s4–s6), button labels, feature pill headers |
| 700 | Bold | Display headings (s6–s7), maximum emphasis |

† **On weight 590:** SF Pro supports a variable weight axis. `fontWeight: 590` sits between Medium and Semibold, and renders gradient text (`WebkitTextFillColor: transparent`) slightly lighter and more legibly than 600. Use it specifically on gradient headings.

---

## Letter Spacing

| Size range | Tracking |
|------------|----------|
| s6–s7 (64–80px) | `-0.02em` |
| s4–s5 (36–48px) | `-0.02em` |
| s2–s3 (20–27px) | `-0.02em` |
| s1 (15px) | `0` |

All headings on this page use `-0.02em` uniformly — tighter than the home page, which relaxes to `-0.01em` at mid sizes.

---

## Line Height

| Size | Line height |
|------|------------|
| s7 — 80px | `105%` |
| s6 — 64px | `140%` |
| s5 — 48px | `130%` |
| s4 — 36px | `150%` |
| s2–s3 — 20–27px | `140%` |
| s1 — 15px | `135%` |

---

## Gradient Text

Gradient text is a primary typographic pattern on this page, rendered via:
```css
WebkitBackgroundClip: "text"
WebkitTextFillColor: "transparent"
backgroundClip: "text"
```

| Name | Gradient | Element |
|------|----------|---------|
| Hero Headline | `linear-gradient(to bottom, #00B1D4 40%, #F9C795 95%)` | "Travel Like a Boss" |
| Hero Badge Title | `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(180,156,83,0.75) 40%, rgba(140,120,60,0.6) 100%)` | "MapsGPT" (SF Compact) |
| HowItWorks Heading | `linear-gradient(90deg, #063140 0%, #00B1D4 100%)` | "Chat to find…" |
| Favorites Top | `linear-gradient(90deg, #DE2F32 0%, #B00098 100%)` | FavoritesSection top heading |
| Favorites Bottom | `linear-gradient(180deg, #000000 0%, #666666 100%)` | FavoritesSection bottom heading |
| Showcase Subtitle | `linear-gradient(180deg, #063140 0%, rgba(6, 49, 64, 0.38) 100%)` | Rotating subtitle text |
| Inspiration | `linear-gradient(180deg, #063140 0%, #01A35D 100%)` | "Need some travel inspiration?" |
| Powered By | `linear-gradient(90deg, #0A1342 0%, #2A2A2A 100%)` | "Powered by Columbus-01" |

### Text drop shadows (gradient text only)

| Effect | Value | Usage |
|--------|-------|-------|
| White glow | `drop-shadow(0 0 100px rgba(255,255,255,1))` | Hero "Travel Like a Boss" — luminous glow effect |
| Subtle depth | `drop-shadow(0 1px 2px rgba(0,0,0,0.1))` | Hero "MapsGPT" badge title |

> Use `filter: drop-shadow(...)` not `text-shadow` — `text-shadow` has no effect when `WebkitTextFillColor` is transparent.

---

## Color System

### Teal & Cyan — Consolidated palette (4 values)

> **Rule: Do not introduce new teal/cyan hex values.** Every teal or cyan on this page must be one of these four tokens.

| Token | Value | Role | Replaces |
|-------|-------|------|----------|
| **Teal Dark** | `#063140` | Dark text, labels, pill text, gradient starts | `#083445`, `#06403A`, `#00454A` |
| **Teal Mid** | `#0F6B6E` | Section headings on light backgrounds | `#1F6F6C` |
| **Cyan Accent** | `#00B1D4` | CTAs, links, interactive highlights, gradient endpoints | `#5AB7AE`, `#00A4B0` |
| **Cyan Light** | `#8DF7FF` | Text highlights on dark backgrounds, particles, glows | `#59E1EB`, `rgba(139,235,225,0.8)` |

### Glassmorphism tints

| Name | Value | Usage |
|------|-------|-------|
| Glass Tint | `rgba(150, 225, 255, 0.10)` | ShowcaseSection desktop card background |
| Glass Tint Strong | `rgba(150, 225, 255, 0.20)` | Hero phone glass border div |
| Glass Border | `rgba(150, 200, 220, 0.35)` | ShowcaseSection card border |
| Input Border | `rgba(0, 69, 74, 0.5)` | HowItWorks search input outline |

### Accent warms — gradient tails & particles

| Name | Value | Usage |
|------|-------|-------|
| Peach | `#F9C795` | Hero headline bottom gradient stop |
| Gold | `#FFD166` | Sparkle particles, confetti |
| Coral | `#FF9A8B` | Sparkle particles, confetti |
| Rose | `#FFC3E1` | Confetti only |
| Champagne | `rgba(180, 156, 83, 0.75)` | Hero badge title gradient mid-stop |

### Section-scoped accents

| Name | Value | Section |
|------|-------|---------|
| Crimson | `#DE2F32` | FavoritesSection gradient start only |
| Magenta | `#B00098` | FavoritesSection gradient end only |
| Coral Star | `#E46962` | RecommendationsSection star rating icon |

### Backgrounds & neutrals

| Name | Value | Usage |
|------|-------|-------|
| Page Background | `#F9F9F9` | Default section bg (HowItWorks, Favorites, Questions, Recommendations) |
| Alt Background | `#F6F7F8` | SeeWhatPeopleSection, InspirationSection |
| White | `#FFFFFF` | FinalCTA section background, recommendation cards |
| Dark UI | `#2C2C2C` | CTA button text, FinalCTA body copy |
| Muted Label | `#9F9F9F` | "We work with data from the most reputable brands" |
| Input Placeholder | `#839694` | HowItWorks search input text |
| Disabled Fill | `#E5E5E5` | FavoritesSection decorative background numeral |
| Rating Chip | `rgba(217, 217, 217, 0.6)` | RecommendationsSection rating badge |

### Brand navy — identity anchor

| Name | Value | Usage |
|------|-------|-------|
| Brand Navy | `#0A1344` | "Powered by Columbus-01" gradient, chat message text |

---

## Elevation & Shadows

| Level | Value | Usage |
|-------|-------|-------|
| Flat | none | Cards at rest |
| Subtle | `0 4px 12px rgba(0, 0, 0, 0.06)` | ShowcaseSection desktop card (default) |
| Low | `0 0 30px rgba(0, 0, 0, 0.05)` | HowItWorks answer card |
| Medium | `0 -2px 10px rgba(0, 0, 0, 0.15)` | Hero phone glass border |
| High | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` | FavoritesSection card |
| Dynamic tilt | `{-rotY×2}px {rotX×2+16}px 48px rgba(0,50,80,0.14), 0 8px 16px rgba(0,50,80,0.06)` | ShowcaseSection card on mouse move |

---

## Glassmorphism Pattern

All glass surfaces share this recipe:

| Property | Value |
|----------|-------|
| Background | `rgba(150, 225, 255, 0.10)` to `0.20` depending on prominence |
| Border | `rgba(150, 200, 220, 0.35)` — or teal `rgba(0, 69, 74, 0.5)` for inputs |
| Backdrop filter | `blur(10px)` to `blur(24px)`, optionally `saturate(1.2)` |
| Shape (pill) | `border-radius: 999px` |
| Shape (card) | `border-radius: 12px` |
| CSS reuse | `glassStyles.btn`, `rec-glass-card`, `rec-glass-pill` |

---

## Motion

This page uses its own easing vocabulary, not the global M3 tokens.

| Name | Easing | Duration | Usage |
|------|--------|----------|-------|
| Spring standard | `cubic-bezier(0.25, 1, 0.5, 1)` | 400ms | Glass pill hover, feature pill open/close |
| Reveal | `ease-out` | 600–700ms | Scroll-triggered section fade-ins |
| Tilt enter | `ease-out` | 150ms | ShowcaseSection card following cursor |
| Tilt exit | `cubic-bezier(0.23, 1, 0.32, 1)` | 500ms | ShowcaseSection card return to flat |
| Feature pill | `cubic-bezier(0.25, 1, 0.5, 1)` | 550ms open / 500ms close | ShowcaseSection accordion expand |
| Gradient sweep | `cubic-bezier(0.25, 1, 0.5, 1)` | 1400ms | HowItWorks gradient text background-position animation |
