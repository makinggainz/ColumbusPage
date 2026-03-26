# Material Design 3 — Design System Reference

> Source: https://m3.material.io/
> Token naming convention: `md-ref-*` → `md-sys-*` → `md-comp-*`
> All values are codified in `tokens.css`. This document is the human-readable companion.

---

## 0. Philosophy & Golden Rules

1. **Never use raw values in components.** Always reference a token. No hardcoded `#6750a4`, no `16px` margins written inline — use `var(--md-sys-color-primary)` and `var(--md-sys-shape-corner-medium)`.
2. **Use system tokens in components, not reference tokens.** Reference tokens are palette primitives. System tokens carry semantic meaning (e.g. "primary surface", "on-surface text"). Components use system tokens so that light/dark theming works automatically.
3. **Use component tokens for component-specific overrides.** If you need to adjust a specific component's shape or color, override a `--md-comp-*` token rather than the system token.
4. **Never invent spacing values.** All spacing must come from the spacing scale (multiples of 4px).
5. **Never mix type styles.** Use the 15-style type scale — don't create custom font-size/weight combinations outside it.

---

## 1. Token Hierarchy

```
Reference tokens  (md-ref-*)
  └── palette shades, raw typeface names, weight constants

System tokens  (md-sys-*)
  └── color roles, type scale, shape levels, elevation, motion, state layers
  └── Reference these in ALL component and layout code

Component tokens  (md-comp-*)
  └── component-specific values that reference system tokens
  └── Override these to customize individual components
```

---

## 2. Color System

### Color Roles (use these)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--md-sys-color-primary` | `#6750a4` | `#d0bcff` | Key brand action color |
| `--md-sys-color-on-primary` | `#ffffff` | `#381e72` | Text/icons on primary |
| `--md-sys-color-primary-container` | `#eaddff` | `#4f378b` | Lower-emphasis primary surfaces |
| `--md-sys-color-on-primary-container` | `#21005d` | `#eaddff` | Text/icons on primary container |
| `--md-sys-color-secondary` | `#625b71` | `#ccc2dc` | Secondary actions |
| `--md-sys-color-secondary-container` | `#e8def8` | `#4a4458` | Nav bar active indicator, chips |
| `--md-sys-color-tertiary` | `#7d5260` | `#efb8c8` | Complementary accent |
| `--md-sys-color-error` | `#ba1a1a` | `#ffb4ab` | Errors and warnings |
| `--md-sys-color-surface` | `#fffbfe` | `#1c1b1f` | Default page/card background |
| `--md-sys-color-surface-container` | `#e6e1e5` | `#211f26` | Nav bars, sheets |
| `--md-sys-color-on-surface` | `#1c1b1f` | `#e6e1e5` | Body text on surface |
| `--md-sys-color-on-surface-variant` | `#49454f` | `#cac4d0` | Secondary text, icons |
| `--md-sys-color-outline` | `#79747e` | `#938f99` | Borders, dividers |
| `--md-sys-color-outline-variant` | `#cac4d0` | `#49454f` | Subtle borders |

### Surface Container Hierarchy

Use these for layered surfaces (lowest = furthest back, highest = cards on dialogs):

```
surface-container-lowest   (background)
surface-container-low      (default surface / page)
surface-container           (nav bars, bottom sheets)
surface-container-high      (cards, menus)
surface-container-highest   (dialogs, tooltips)
```

### Theming

- Apply `data-theme="light"` or `data-theme="dark"` to `<html>` or a container.
- All system color tokens automatically resolve to the correct value.
- **Dynamic color**: Generate a custom palette at https://m3.material.io/theme-builder and replace the `--md-ref-palette-*` values in `tokens.css`. Every system and component token updates automatically.

### Rules

- Text on any surface must use the paired `on-*` color token. `primary` backgrounds use `on-primary` text.
- Avoid placing text directly on `primary` unless it's a filled button or FAB.
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text and UI components.

---

## 3. Typography — Type Scale

M3 defines 15 named styles across 5 roles × 3 sizes. Use the full token name as a shorthand (font, size, line-height, weight, tracking are all sub-tokens).

| Role | Size | Font | px size | Line-height | Weight |
|---|---|---|---|---|---|
| Display | Large | Brand | 57px | 64px | Regular |
| Display | Medium | Brand | 45px | 52px | Regular |
| Display | Small | Brand | 36px | 44px | Regular |
| Headline | Large | Brand | 32px | 40px | Regular |
| Headline | Medium | Brand | 28px | 36px | Regular |
| Headline | Small | Brand | 24px | 32px | Regular |
| Title | Large | Brand | 22px | 28px | Regular |
| Title | Medium | Plain | 16px | 24px | **Medium** |
| Title | Small | Plain | 14px | 20px | **Medium** |
| Body | Large | Plain | 16px | 24px | Regular |
| Body | Medium | Plain | 14px | 20px | Regular |
| Body | Small | Plain | 12px | 16px | Regular |
| Label | Large | Plain | 14px | 20px | **Medium** |
| Label | Medium | Plain | 12px | 16px | **Medium** |
| Label | Small | Plain | 11px | 16px | **Medium** |

**Usage guidance:**

- `Display` — Hero text, marketing. Never in dense UI.
- `Headline` — Screen titles, dialog headers.
- `Title` — Section headers, list item primary text, card headers.
- `Body` — Paragraph text, list supporting text.
- `Label` — Buttons, chips, navigation labels, captions.

**Apply a style with CSS:**
```css
.screen-title {
  font-family: var(--md-sys-typescale-headline-large-font);
  font-size:   var(--md-sys-typescale-headline-large-size);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  letter-spacing: var(--md-sys-typescale-headline-large-tracking);
}
```

### Rules

- Do not invent custom font-size/weight combinations. Pick the closest named style.
- Do not apply `Display` styles inside dense list or table UIs.
- Buttons always use `Label Large`.

---

## 4. Shape

M3 uses a 7-level shape scale based on border-radius:

| Token | Value | Use cases |
|---|---|---|
| `--md-sys-shape-corner-none` | `0px` | Dividers, banners |
| `--md-sys-shape-corner-extra-small` | `4px` | Text fields, snackbars, menus |
| `--md-sys-shape-corner-small` | `8px` | Chips, filled text fields |
| `--md-sys-shape-corner-medium` | `12px` | Cards |
| `--md-sys-shape-corner-large` | `16px` | Nav drawer, side sheets, FAB |
| `--md-sys-shape-corner-extra-large` | `28px` | Dialogs, time pickers |
| `--md-sys-shape-corner-full` | `9999px` | Buttons, FAB (extended), badges, sliders |

### Rules

- Do not use arbitrary border-radius values. Always use a shape token.
- Fully rounded pill shapes use `shape-corner-full`, not `50%`.
- Asymmetric corners (e.g. top rounded, bottom square) are valid for sheets and nav drawers.

---

## 5. Spacing

M3 uses a **4px base grid** throughout. All spacing must be a multiple of 4.

| Value | px | Usage |
|---|---|---|
| 1 unit | 4px | Icon inner padding, dense list dividers |
| 2 units | 8px | Icon-to-label gap, chip internal padding |
| 3 units | 12px | — |
| 4 units | 16px | Card padding, list item padding, standard horizontal margins |
| 6 units | 24px | Dialog padding, section separation |
| 8 units | 32px | Large section gaps |
| 12 units | 48px | Page section vertical rhythm |
| 16 units | 64px | Hero spacing, large layout gaps |

**Component minimum touch targets:** 48×48px regardless of visual size.

### Layout grid

| Breakpoint | Columns | Gutter | Margin |
|---|---|---|---|
| Compact (< 600px) | 4 | 16px | 16px |
| Medium (600–840px) | 8 | 24px | 24px |
| Expanded (> 840px) | 12 | 24px | 24px |

---

## 6. Elevation

5 levels expressed as box-shadow. Higher = closer to user, more prominent.

| Token | Level | Use cases |
|---|---|---|
| `--md-sys-elevation-level0` | 0 — no shadow | Flat surfaces, filled containers |
| `--md-sys-elevation-level1` | Tonal + subtle shadow | Cards (resting), nav bars |
| `--md-sys-elevation-level2` | Tonal + light shadow | Menus, dropdowns, popovers |
| `--md-sys-elevation-level3` | Medium shadow | FAB, dialogs |
| `--md-sys-elevation-level4` | Heavier shadow | Modals |
| `--md-sys-elevation-level5` | Strongest shadow | Navigation drawers |

In M3, tonal color surfacing (mixing primary color into surface) replaces heavy shadows for most elevation communication. Elevation levels are not just shadow — higher surfaces should appear slightly tinted toward the primary color.

---

## 7. Motion

### Transition durations

| Token | Duration | Guidance |
|---|---|---|
| `short1–short4` | 50–200ms | Small UI changes: icon swaps, focus rings |
| `medium1–medium4` | 250–400ms | Most transitions: expanded panels, page elements |
| `long1–long4` | 450–600ms | Full-screen transitions, complex sequences |
| `extra-long1–4` | 700ms–1000ms | Rare; hero image transitions only |

Use `medium2` (300ms) as the default for most component state changes.

### Easing

| Token | When to use |
|---|---|
| `easing-standard` | Default. UI elements that enter and exit the visible area. |
| `easing-emphasized` | Expressive, larger transitions. FABs, bottom sheets, full-page. |
| `easing-emphasized-decelerate` | Elements entering the screen. |
| `easing-emphasized-accelerate` | Elements leaving the screen. |
| `easing-legacy` | Compatibility with older Material components. Avoid for new work. |

### Rules

- Use `emphasized-decelerate` for enter / `emphasized-accelerate` for exit.
- Motion should always have a purpose: communicate state change, guide attention, or indicate hierarchy.
- Avoid decorative animation that adds latency with no information value.

---

## 8. State Layers

Interactive components communicate states through a translucent overlay on top of the container using `--md-sys-color-on-surface` (or the relevant on-color) at a fixed opacity:

| State | Opacity token |
|---|---|
| Hover | `--md-sys-state-hover-state-layer-opacity` → `0.08` |
| Focus | `--md-sys-state-focus-state-layer-opacity` → `0.12` |
| Pressed | `--md-sys-state-pressed-state-layer-opacity` → `0.12` |
| Dragged | `--md-sys-state-dragged-state-layer-opacity` → `0.16` |
| Disabled (container) | `--md-sys-state-disabled-container-opacity` → `0.12` |
| Disabled (content) | `--md-sys-state-disabled-content-opacity` → `0.38` |

**Implementation pattern:**
```css
.button:hover::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--md-sys-color-on-primary);
  opacity: var(--md-sys-state-hover-state-layer-opacity);
  border-radius: inherit;
  pointer-events: none;
}
```

---

## 9. Key Component Specs

### Buttons

| Variant | Height | Shape | Padding | Label style |
|---|---|---|---|---|
| Filled | 40px | Full | 24px H | Label Large |
| Tonal | 40px | Full | 24px H | Label Large |
| Outlined | 40px | Full | 24px H | Label Large |
| Text | 40px | Full | 12px H | Label Large |
| Elevated | 40px | Full | 24px H | Label Large |

- With leading icon: 16px left padding, 24px right
- Icon size: 18px
- Touch target: minimum 48px height

### FAB

| Size | Container | Icon | Shape |
|---|---|---|---|
| Small | 40px | 24px | Large |
| Default | 56px | 24px | Large |
| Large | 96px | 36px | Extra-Large |

### Cards

| Style | Background | Elevation | Outline |
|---|---|---|---|
| Elevated | surface-container-low | Level 1 | None |
| Filled | surface-container-highest | Level 0 | None |
| Outlined | surface | Level 0 | outline-variant |

All cards use `shape-corner-medium` (12px).

### Navigation Bar (bottom nav)

- Container height: 80px
- Container color: `surface-container`
- Active indicator: 64×32px, `shape-corner-full`, `secondary-container`
- Icon size: 24px
- Destination count: 3–5

### Text Fields

| Type | Height | Shape | Label behavior |
|---|---|---|---|
| Outlined | 56px | Extra-Small (4px) | Floating label |
| Filled | 56px | Extra-Small top only | Floating label |

### Chips

- Height: 32px
- Shape: `shape-corner-small` (8px)
- Horizontal padding: 16px (8px with icon)
- Icon size: 18px

### Dialogs

- Shape: `shape-corner-extra-large` (28px)
- Elevation: Level 3
- Background: `surface-container-high`
- Padding: 24px
- Max width: 560px
- Min width: 280px

---

## 10. Do / Don't Summary

| Do | Don't |
|---|---|
| Use `--md-sys-color-*` tokens for all colors | Hardcode any hex value in components |
| Use `--md-sys-typescale-*` tokens for all text | Create custom font-size/weight combos |
| Use `--md-sys-shape-corner-*` for all radii | Use `border-radius: 50%` for pills |
| Use 4px-multiple spacing | Use odd spacing like 5px, 7px, 11px |
| Use `--md-sys-elevation-level*` for shadows | Write custom box-shadow values |
| Use `data-theme="dark"` for dark mode | Maintain a separate dark stylesheet |
| Confirm minimum 48×48px touch targets | Make tap targets smaller for visual neatness |
| Use `emphasized-decelerate` for entering elements | Use `linear` easing for state transitions |
