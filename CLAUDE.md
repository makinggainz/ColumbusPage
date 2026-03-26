# CLAUDE.md — Project Instructions

## Design System

This project uses **Material Design 3 (M3)** as its design system.

Before writing any UI code, read `design-system/design-system.md`.
All design tokens (colors, typography, shape, spacing, elevation, motion) are defined in `design-system/tokens.css`.

### Enforcement rules (these are constraints, not suggestions)

**Colors**
- Always use `var(--md-sys-color-*)` tokens. Never hardcode hex or RGB values in components.
- Use the correct pairing: `primary` backgrounds → `on-primary` text; `surface` → `on-surface`, etc.
- Apply `data-theme="light"` or `data-theme="dark"` for theming. Never maintain a separate dark stylesheet.

**Typography**
- Always use `var(--md-sys-typescale-*)` tokens (font-family, font-size, line-height, font-weight, letter-spacing).
- Never create font-size or font-weight values outside the 15-style type scale.
- Buttons and chips always use `Label Large`. Screen titles use `Headline`. Body copy uses `Body Large` or `Body Medium`.

**Shape / Border Radius**
- Always use `var(--md-sys-shape-corner-*)` tokens. Never write arbitrary `border-radius` values.
- Pill/fully-rounded shapes use `shape-corner-full` (not `50%`).

**Spacing**
- All spacing must be a **multiple of 4px**. No exceptions (no 5px, 7px, 11px values).
- Standard component padding: 16px horizontal, 8–16px vertical.
- Minimum touch target size: 48×48px.

**Elevation**
- Use `var(--md-sys-elevation-level*)` tokens for `box-shadow`. Never write custom shadow values.

**Motion**
- Use `var(--md-sys-motion-duration-*)` and `var(--md-sys-motion-easing-*)` tokens for all transitions.
- Default state change duration: `--md-sys-motion-duration-medium2` (300ms).
- Entering elements: `easing-emphasized-decelerate`. Exiting: `easing-emphasized-accelerate`.

**State layers**
- Interactive states (hover, focus, pressed) must use the `--md-sys-state-*-layer-opacity` tokens over the relevant `on-*` color.

### When in doubt

If a design decision isn't covered by an existing token, **ask before inventing a value**. Do not improvise spacing, color, or type values to fill a gap — the answer is almost always to find the correct M3 token or to compose existing tokens.

---

## File structure

```
design-system/
  tokens.css         — Import this in every page/component
  design-system.md   — Full spec reference
CLAUDE.md            — This file
```

Import tokens at the top of your stylesheet or in your root layout:
```html
<link rel="stylesheet" href="/design-system/tokens.css">
```
