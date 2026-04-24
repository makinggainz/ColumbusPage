# Navbar Dropdown — Rules & Behaviour Reference

> This document is the single source of truth for the navbar dropdown's
> layout, alignment and spacing rules. It is a companion to
> [`design-system/navbar.md`](./navbar.md) — which covers the navbar
> itself — and focuses specifically on the panel that expands below the
> navbar on hover (desktop) or tap of the hamburger (mobile).
>
> Any change to the dropdown JSX or layout in
> [`components/layout/Navbar.tsx`](../components/layout/Navbar.tsx) must
> stay consistent with the rules below.

---

## Philosophy

The dropdown is a **visual extension of the navbar above it.** On desktop,
every content column in the dropdown is horizontally anchored to an
element in the navbar — so each piece of content reads as sitting
directly "underneath" its corresponding navbar element. Readers scan
the navbar, then the dropdown, and the x-positions feel continuous.

Mobile does not inherit this anchoring. The nav links collapse to a
hamburger, so there is no row of x-positions to mirror. Mobile is a
single full-width stacked list.

---

## Desktop x-anchors

The dropdown reads off three x-positions measured from the navbar DOM at
runtime via `getBoundingClientRect()`.

| Anchor | Source | Purpose |
|---|---|---|
| `LOGO_LEFT` | container inner-left (where the Columbus Earth logo starts) | Start edge of the left dropdown column |
| `PRODUCTS_LEFT` | left edge of the first nav link (`Products`) | End edge of left column (minus gap) + start edge of right column |
| `CTA_RIGHT` | right edge of the `Start Now` CTA | End edge of right column |
| `CONTAINER_RIGHT` | right edge of the `max-w-1287` (or `max-w-1408` on wide) container | Not used directly; reference only |

### Zones

These three anchors slice the row into three zones:

```
├─ LEFT ZONE ────────┤      gap       ├─ RIGHT ZONE ───────┤
LOGO_LEFT            │                PRODUCTS_LEFT        CTA_RIGHT
                     └── (≥ GAP px) ──┘
```

- **`LEFT ZONE`** — from `LOGO_LEFT` to `PRODUCTS_LEFT − GAP`
- **`GAP`** — `40px` minimum (natural empty space between left column and right column)
- **`RIGHT ZONE`** — from `PRODUCTS_LEFT` to `CTA_RIGHT`

### Measurement

Implemented in a single `useEffect` inside `Navbar.tsx` that runs on:

- `isMenuOpen`, `isCompact`, `isWideScreen`, `hoverKind` change
- Window `resize`

It reads the refs below and writes the computed values into a single
state object consumed by the dropdown's inline styles.

| Ref | Attached to | Role |
|---|---|---|
| `productsLinkRef` | `Products` nav link (via `hasDropdown` flag) | Measures `PRODUCTS_LEFT` |
| `ctaRef` | `Start Now` CTA `<Link>` | Measures `CTA_RIGHT` |
| `productsColRef` | Dropdown right column wrapper | Target for `padLeft`/`padRight` alignment |
| `leftColRef` | Dropdown left column wrapper | Target for `maxWidth` alignment |

Output state:

```ts
{
  padLeft: number,        // applied to right column: inline paddingLeft
  padRight: number,       // applied to right column: inline paddingRight
  leftMaxWidth: number,   // applied to left column: inline maxWidth
}
```

---

## Vertical spacing

| Token | Value | Usage |
|---|---|---|
| `TOP_BREATHING` | `48px` | Distance between the navbar's bottom edge and the first line of dropdown content. Applies in every hover state. |
| Top padding (compact navbar) | `56 + TOP_BREATHING = 104px` | Inline `paddingTop` — `isCompact ? 104 : 116` |
| Top padding (tall navbar) | `68 + TOP_BREATHING = 116px` | Inline `paddingTop` |
| `BOTTOM_PADDING` | `32px` | `md:py-8` on the dropdown content wrapper |
| Grid gap between columns | `32px` | `md:gap-8` |
| Min content height | `320px` | `md:min-h-[320px]` — keeps the dropdown's visual height constant across both hover states |

---

## Hover states (desktop)

A single state — `hoverKind: "products" | null` — controls which layout
the dropdown uses.

| State | `hoverKind` | Trigger | Left zone | Right zone |
|---|---|---|---|---|
| **Default** | `null` | Logo hover, hamburger click, any non-`Products` trigger | `COLUMBUS EARTH` heading + description + `CONTACT` email + `SOCIAL` LinkedIn | 2 product cards (Columbus Pro + Elio) |
| **Products** | `"products"` | `Products` nav link hover | Hidden — left zone collapsed | 2 product cards, **horizontally centred** inside the full dropdown width (max-w ~760px) |

### Reset

`hoverKind` resets to `null` on:

- Menu close (`closeMenu()`)
- Route change (dropdown `useEffect` on `pathname`)

### Layout column bounds per state

| State | Left column | Right column |
|---|---|---|
| `null` (default) | `md:col-span-5` + `style={{ maxWidth: leftMaxWidth }}` | `md:col-span-6` + `style={{ paddingLeft, paddingRight }}` |
| `"products"` | Hidden via `md:hidden` | `md:col-start-1 md:col-span-12` — full row; inner cards grid centred via `md:mx-auto md:max-w-[760px]` |

### Products-hover mode specifics

- **No side CTA.** Earlier iterations placed a "Ready to experience the future of GIS?" + *Get a Demo* link on the right — this block has been removed. The products-hover dropdown contains **only** the two centred cards.
- Cards retain the same 16:10 image, stacked title + subtitle, hover-scale-1.03 behaviour defined in the default mode.

---

## Desktop vs Mobile

| Aspect | Desktop (`≥ 900px`) | Mobile (`< 900px`) |
|---|---|---|
| Trigger | Hover on logo or `Products` link | Tap hamburger icon |
| Anchor system | `LOGO_LEFT / PRODUCTS_LEFT / CTA_RIGHT` | None (nav links hidden behind hamburger) |
| Column layout | 12-col grid with anchored widths | Single column, full-width stacked |
| Side gutter | `px-8` | `px-6` |
| Hover states | `null` ⇄ `"products"` | Always `null` (no hover) |
| Animation | Max-height expand (500ms) + staggered content fade-in | Same expand; full `100dvh` height |

The alignment `useEffect` is gated by `isWideScreen` (`window.innerWidth ≥ NAV_BREAKPOINT`) — on mobile the refs are measured but the computed values are **not applied**, so the mobile stack keeps its default column sizing.

---

## Content inventory

### Default mode

**Left column** (`leftColRef`, `md:col-span-5`, capped by `leftMaxWidth`)

1. **COLUMBUS EARTH** eyebrow — 13px uppercase tracked, muted tone
2. **Description paragraph** — "Columbus Earth Inc. is a spatial frontier AI company..." — 16px, 1.6 line-height, `max-w-md`
3. **CONTACT / SOCIAL** sub-grid — 2-column sub-grid with email + LinkedIn links

**Right column** (`productsColRef`, `md:col-span-6`, anchored via `padLeft/padRight`)

1. **PRODUCTS** eyebrow (only in default mode)
2. **Product cards** — 2-card grid (Columbus Pro + Elio)
3. Mobile-only: text product list + COMPANY sub-section

### Products-hover mode

**Right column** (`productsColRef`, `md:col-span-12`, centred)

1. 2 centred product cards — no eyebrow, no side CTA

---

## Content blocks — card anatomy

Each product card (both hover states share this structure):

| Slot | Style |
|---|---|
| Image container | `aspect-[16/10]`, `rounded-[10px]`, `bg-[#F5F5F5]` (no border) |
| Title | `20px`, weight 500, `tracking-[-0.005em]`, navy; hover → `#2563EB` |
| Subtitle | `15px`, navy @ 55% opacity, `leading-[1.5]` |
| Hover | Image scales to 1.03 over 500ms |

---

## Shadow / border

Both the dropdown panel and the card images are **shadow-less**. The
dropdown relies on its translucent blurred background + border-bottom
hairline to separate from the page content below. Card images use a
flat `#F5F5F5` fill instead of a drop-shadow frame.

---

## Quick reference — implementation notes

- Alignment `useEffect`: `~line 256` in `Navbar.tsx`
- Refs: `productsLinkRef` (50), `ctaRef` (51), `productsColRef` (52), `leftColRef` (add alongside)
- Inline style on left column: `{ maxWidth: productsAlign?.leftMaxWidth }`
- Inline style on right column: `{ paddingLeft: productsAlign?.padLeft, paddingRight: productsAlign?.padRight }`
- `hoverKind` toggled by: Products link `onMouseEnter` → `"products"`; logo `onMouseEnter` → `null`
- Dropdown root: `<div ref={dropdownRef}>` at ~line 680, wraps the grid content
