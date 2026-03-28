# Navbar — Rules & Behaviour Reference

> This document is the single source of truth for all navbar behaviour on the Columbus Earth site.
> Any change to `components/layout/Navbar.tsx` must be consistent with the rules below.

---

## Props

| Prop | Type | Default | Usage |
|------|------|---------|-------|
| `theme` | `"light" \| "dark"` | `"light"` | Controls text/icon colour when the frosted background is not yet visible |
| `wide` | `boolean` | `false` | Set to `true` on the `/products` page only. Enables glass-button CTA, products-specific scroll logic, and hero-transition tracking |

---

## Constants

| Name | Value | Purpose |
|------|-------|---------|
| `COMPACT_THRESHOLD` | `10px` scroll | Below this → tall navbar (68px). Above → compact (56px) |
| `NAV_BREAKPOINT` | `900px` | Below → mobile layout (hamburger only). Above → desktop layout (nav links visible) |

---

## Visibility

### Overall navbar
- Hidden (`opacity: 0`, `translateY(-8px)`) until `hasScrolled` is true.
- **Products page exception:** `hasScrolled` is forced `true` after 1700ms on initial load (timed to match the hero entrance animation completing).
- Listens to a custom `hero-reveal` DOM event as an additional trigger for `hasScrolled`.
- Hides again (`opacity: 0`, `translateY(-12px)`, `pointerEvents: none`) when the footer (`[data-footer]`) reaches 50% intersection.
- A polling fallback (100ms / 300ms / 1000ms after mount) syncs scroll state for mobile, slow devices, and private browsing.
- Transitions are suppressed on first paint (`navMounted` flag via `requestAnimationFrame`) to prevent a flash on reload.

### Frosted glass background
- Fades in when `isCompact` is true (standard pages) **or** when `bgTriggerPassed` is true (products page).
- Hidden while the hamburger dropdown is open (overridden by a full-width white background on the nav bar itself).
- `[data-navbar-bg-trigger]` is a zero-height div placed in the page between the hero and the first content section on the products page. When it scrolls past the top of the viewport, `bgTriggerPassed` → `true`.

---

## Nav Links (desktop)

- Rendered only at `≥ 900px` viewport width (`hidden min-[900px]:flex`).
- **Standard pages:** appear once the hero CTA element (`#hero-cta`) scrolls out of the viewport (observed via `IntersectionObserver`).
- **Products page:** appear once `bgTriggerPassed` is true AND the hero scroll transition is not active (`!inHeroTransition || bgTriggerPassed`).
- Animate in via `clip-path: inset(0 0% 0 0)` → `inset(0 100% 0 0)` + opacity fade (400ms spring).
- Links shown: **Product** (`/enterprise`), **Use Cases** (`/use-cases`), **Technology** (`/technology`).
- On the products page, link text uses `glassStyles.glassTextStatic` for the frosted glass look.

---

## "Start Now" CTA Button

- Appears under the same conditions as nav links (`ctaVisible` flag).
- **Standard pages:** solid black background (`#000000`), white text.
- **Products page:** glass button (`glassStyles.btn`) with `blur(6px)` backdrop filter.
- Text colour:
  - Products page → always `text-black`
  - Other pages, menu open → `text-black`
  - Other pages, menu closed → `text-white`
- Hover: text transitions to `#2563EB`.
- Width animates from `0` → `145px` when `ctaVisible` becomes true.
- **Products page mobile (`< 900px`):** the CTA and hamburger are wrapped in an isolated `relative` container. The CTA is `position: absolute` within this wrapper (anchored `right: 46px`, vertically centred) so it cannot push the hamburger. The hamburger stays in normal flex flow with `flex-shrink: 0`.
- Links to `/maps-gpt`.

---

## Columbus Earth Wordmark

- Sits to the right of the logo image inside the left-side `<Link href="/">`.
- **Hidden** (opacity 0) on mobile (`< 900px`) on all pages **except**:
  - `/` (homepage)
  - `/our-mission`
  - `/contact` (contact us)
- On desktop, hidden while the CTA is visible (nav links phase) so the wordmark and CTA don't compete for space.
- On the products page, uses `glassStyles.glassTextStatic` for the frosted glass text effect.
- Font size transitions: 24px (tall) → 20px (compact).

---

## Hamburger Menu

- Always visible on mobile (`< 900px`).
- On desktop, hidden (width → 0, opacity → 0) only on non-products pages when nav links are visible at wide screen.
- **Products page mobile:** always present with a fixed `12px` left margin from the Start Now CTA.
- Animates between ☰ and ✕ (two bars rotate ±45°, middle bar fades out).
- Clicking toggles `isMenuOpen` and sets `isManuallyToggled = true` (prevents hover from re-opening immediately after a manual close).

---

## Dropdown Menu

- Opens on hamburger click **or** on mouse hover over any nav item (desktop).
- `isManuallyToggled` flag prevents hover from conflicting with click-to-close.
- Closes when the mouse moves below the navbar bottom edge.
- Backdrop: `backdrop-blur-md bg-black/10` overlay covers the page behind the dropdown.
- Background:
  - Light theme: `rgba(248, 249, 252, 0.92)` with `blur(20px)`
  - Dark theme: `rgba(6, 8, 20, 0.96)` with `blur(24px)`

---

## Hero Transition Tracking (products page only)

- Tracks a `[data-hero-outer]` element to detect when the products hero scroll transition is in progress.
- `inHeroTransition = true` when the hero's scroll progress is between 5% and 95% of the transition zone (2× viewport height).
- While transitioning, nav links and CTA are hidden to avoid visual conflict with the hero animation.
- `heroTransitionStarted` is a latch — once set true it stays true until the hero scrolls back to the top, preventing a flash of nav links mid-transition.

---

## Compact Mode

- Triggered when `scrollY > 10px`.
- Navbar height: 68px → 56px.
- Logo: 40px → 36px.
- Wordmark font size: 24px → 20px.
- All size transitions use `500ms cubic-bezier(0.22, 1, 0.36, 1)`.

---

## Theme Tokens

| Context | Text colour |
|---------|-------------|
| Compact, light theme | `#0A1344` |
| Compact, dark theme | `white` |
| Not compact, light | `#0A1344` |
| Not compact, dark | `white` |
| Menu open (any) | `#111111` |

---

## Adding a New Page

When adding a new page to the site, decide:

1. Should the **Columbus Earth wordmark** be visible on mobile? If yes, add the pathname to the allowlist in `Navbar.tsx` (currently: `/`, `/our-mission`, `/contact`).
2. Does the page have a **hero CTA** (`id="hero-cta"`)? If yes, nav links will auto-appear once it scrolls out — no extra work needed.
3. Does the page need the **products glass navbar** (`wide` mode)? Only `/products` uses this. Do not apply `wide` to other pages.
4. Does the page need a **`[data-navbar-bg-trigger]`** element? Only needed on pages using `wide` mode.
