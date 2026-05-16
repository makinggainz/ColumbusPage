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
- **Technology page exception:** while the Gen Layers band overlaps the navbar Y position, `TechnologyPage.tsx` toggles `body.gen-layers-active`. A scoped `:global` rule in `components/technology/technology.module.css` applies a top-down mask (`linear-gradient(to bottom, black 0%, black 30%, transparent 100%)`) plus `border-bottom: none` to the frosted-bg div (the first child of `nav.header-font`). The navbar's existing `backdrop-filter: blur(20px) saturate(1.2)` is therefore strongest at the top of the navbar and fades to nothing at the bottom — a soft "blur gradient" instead of a hard frosted bar. Text/icon colors continue to be controlled by the standard `theme="dark"` prop; only the bg layer's mask is overridden. The class is removed on page unmount so other routes are unaffected.

---

## Nav Links (desktop)

- Rendered only at `≥ 900px` viewport width (`hidden min-[900px]:flex`).
- **Standard pages:** appear once the hero CTA element (`#hero-cta`) scrolls out of the viewport (observed via `IntersectionObserver`).
- **Products page:** appear once `bgTriggerPassed` is true AND the hero scroll transition is not active (`!inHeroTransition || bgTriggerPassed`).
- Animate in via `clip-path: inset(0 0% 0 0)` → `inset(0 100% 0 0)` + opacity fade (400ms spring).
- Links shown: **Products** (`/products/business`), **Research** (`/technology`), **Use Cases** (`/columbus-solutions` — opens a hover dropdown with two cards: Columbus Pro Business Use-Cases → `/columbus-solutions`, Research Applications → `/research-applications`), **Company** (`/mission`).
- The Use Cases link mirrors the Products dropdown pattern (chevron only — no hover/active underline) but renders a different overlay: an empty bordered card for Columbus Pro Business Use-Cases and a bordered card containing an inline globe SVG for Research Applications. Plain text labels sit below each card — no subtitles. The overlay is positioned absolutely over the products card grid and crossfades when `hoverKind === "use-cases"`.
- **Underline behaviour:** the hover/active underline (animated `width 0 → 100%` line below the label) renders only on **Research** and **Company**. Products and Use Cases intentionally have no underline — they rely on the chevron flip alone to indicate their dropdown state.
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
  - `/mission`
  - `/contact` (contact us)
- On desktop, hidden while the CTA is visible (nav links phase) so the wordmark and CTA don't compete for space.
- On the products page, uses `glassStyles.glassTextStatic` for the frosted glass text effect.
- Font size transitions: 24px (tall) → 20px (compact).

> A separate logo-hover wordmark slide-out animation lives on blog article pages, but it's implemented inside [components/blog/BlogArticleStickyNav.tsx](../components/blog/BlogArticleStickyNav.tsx), not the Navbar — those pages don't render the Navbar at all.

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
- Background: matches the navbar — `background: transparent` with `backdrop-filter: blur(20px) saturate(1.2)`. The dropdown reads as a visual continuation of the navbar above it; whatever colour the page is showing underneath shows through both surfaces.

### Mobile vs Desktop height treatment

**Mobile and desktop receive completely different treatments — always confirm before changing dropdown height.**

| | Desktop (≥ 900px) | Mobile (< 900px) |
|-|-------------------|------------------|
| Max height | Content-driven (padding + content) | `100dvh` (always full screen) |
| Top padding | `isCompact ? 84 : 96` (px) — inline style, navbar height + 28px visual gap | `isCompact ? 72 : 88` (px) — more breathing room |
| Bottom padding | `0px` padding + `-24px` margin-bottom (default / products hover) or `-(24 + (cards.bottom - image.bottom))` (company hover) — inline style on the inner content wrapper. Halved from the prior `-10` to reduce visible bottom whitespace by 50% across all hover states. Company hover adds extra clip so the image-bottom-to-dropdown-bottom gap matches the default cards-bottom-to-dropdown-bottom gap (`companyAlign.extraMb = lc.bottom - im.bottom`). | `8px` (from `pb-2`, applies below 768px) |
| Left-column footer alignment | `<dl>` (CONTACT/SOCIAL block) — `marginBottom: 14` (halved from 28) keeps the dl close to the column's bottom while preserving alignment with the right column's title row. Company-hover overrides this with `companyAlign.dlMb`. | `mt-7` — sits naturally below the description |

If you are unsure whether a height/padding change affects mobile or desktop, **ask before making the change.**

### Company-hover layout overrides (desktop only)

When `hoverKind === "company"`, the right-column layout switches from "image left, ul right (flexed, 40px gap)" to a measured layout that pulls the image to the dropdown's left content edge and aligns the ul with the Company nav link. Driven by the `companyAlign` state, computed in the same `useEffect` as `productsAlign`.

| Element | Default (no hover / products hover) | Company hover |
|--------|-------------------------------------|---------------|
| **Image** (CEHQ.png) | Sits at `productsCol.content.left` (Products link x) via flex flow, `marginLeft: 0` | `marginLeft: ulLeft - 24 - 350` — image's right edge sits 24px before the ul's left edge, so it's slightly padded from the Mission/Vision/Blog buttons. (350 = image max-w; 24 = gap to ul.) |
| **Mission/Vision/Blog ul** | In flex flow after image with `gap-10` (40px) | `position: absolute`, `left: companyAlign.ulLeft` — the ul's left edge aligns with the Company nav link's **text** (`companyLink.box.left + 12px` for the link's `px-3` padding). |
| **CONTACT/SOCIAL dl** (left col) | `marginBottom: 28px` (lifted 28px above leftCol bottom) | `marginBottom: companyAlign.dlMb` — dynamically computed as `leftCol.bottom - image.bottom`, so the dl's bottom edge aligns with the image's bottom edge. |

`companyAlign` is recomputed on `[isMenuOpen, isCompact, isWideScreen]` and on window resize.

**Both image bottom and grid row bottom are calculated, not measured.** Two layout invariants force this:

1. The overlay containing the image has a `translateY(6px → 0)` entrance animation. A `getBoundingClientRect()` on the image while `hoverKind !== "company"` returns a position 6px low.
2. ProductsCol's padding is `0` during products-hover and `padLeft + padRight` during company-hover. That padding controls the products cards' content width; cards are `aspect-[16/10]` so their rendered height (and therefore `productsCol.height` and `leftCol.bottom`) depends on hoverKind. At narrow viewports the cards visibly shrink under company-hover padding. Measuring during products-hover captures the taller layout, bakes that into `extraMb`, and clips the company image when the user transitions Products → Company.

So we calculate both:
- `imBottomAtRest = productsCol.top + 219` (image height = `350 × 10/16`)
- `expectedLcBottom = productsCol.top + EYEBROW_BLOCK + cardImageHeight + CARDS_TEXT_BLOCK`, where `cardImageHeight` is derived from the cards grid width that *will apply* in company hover (`min(productsCol.outer − padLeft − padRight, 760)`)

The constants — `CARDS_GAP=24`, `CARDS_MAX_WIDTH=760`, `CARDS_TEXT_BLOCK=72.5`, `EYEBROW_BLOCK=35.5` — are pinned to the cards/eyebrow CSS classes; if those change, the constants must move with them.

**extraMb formula:** `extraMb = max(0, expectedLcBottom − imBottomAtRest − 20)`. The `−20` corrects for the base `−10` already in the inner-wrapper `marginBottom` formula and the desired `+10` gap below the image, so the final `marginBottom = −10 − extraMb` positions the visible dropdown bottom exactly 10px below the image — matching the 10px gap in the default state.

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
- Logo: 46px → 42px.
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

## Per-Page Treatment

The navbar adapts its behaviour per page via props, pathname checks, and DOM markers.

| Page | Props | Theme | Wordmark on mobile | Nav links trigger | Special behaviour |
|------|-------|-------|--------------------|-------------------|-------------------|
| `/` (homepage) | `<Navbar />` | light | **Visible** | Hero CTA (`#hero-cta`) scrolls out of viewport | Standard behaviour — frosted glass appears on compact scroll |
| `/products` | `<Navbar wide />` | light (glass) | **Hidden** | `[data-navbar-bg-trigger]` passes viewport top + hero transition complete | Glass CTA button, glass wordmark text, hero-transition tracking hides links/CTA mid-scroll, `hasScrolled` forced true after 1700ms entrance animation, hamburger always visible with 12px left margin from CTA |
| `/mission` | `<Navbar theme="dark" />` | dark | **Visible** | Immediate (no hero CTA) | Dark frosted glass, inverted logo via `brightness(0) invert(1)` |
| `/contact` | `<Navbar />` | light | **Visible** | Immediate (no hero CTA) | Standard behaviour |
| `/business` | `<Navbar theme="light" />` | light | **Hidden** | Immediate (no hero CTA) | Standard light navbar — hero background is `#E8EEF8` |
| `/maps-gpt` | `<Navbar theme="dark" />` | dark | **Hidden** | Immediate (no hero CTA) | Dark frosted glass |
| `/columbus-solutions` | `<Navbar theme={navTheme} />` | dynamic | **Hidden** | Immediate (no hero CTA) | See **Use-Cases-Specific Behaviour** section below |
| `/research-applications` | `<Navbar theme={navTheme} />` | dynamic | **Hidden** | Immediate (no hero CTA) | See **Use-Cases-Specific Behaviour** section below |
| `/mission` | `<Navbar />` | light | **Hidden** | Immediate (no hero CTA) | Standard behaviour |
| `/market-spy` | `<Navbar />` | light | **Hidden** | Immediate (no hero CTA) | Standard behaviour |
| `/blog` (index) | `<Navbar />` | light | **Visible** | Immediate (no hero CTA) | Standard navbar — full nav links, Start Now CTA, and hamburger render normally. |
| `/blog/<slug>` | **No `<Navbar />`** | n/a | n/a | n/a | **The article page does not render the Navbar at all.** The Columbus home link, "← All posts" back link, article section index, and the `<AccessibilityMenu />` all live inside the floating left-side dock ([components/blog/BlogArticleStickyNav.tsx](../components/blog/BlogArticleStickyNav.tsx)) which replaces the navbar entirely. The dock recedes at rest and expands on hover/focus-within. |

### Use-Cases-Specific Behaviour

The `/columbus-solutions` and `/research-applications` pages share the same navbar requirements — both clone the original use-cases page layout (dark hero + dynamic section backgrounds). Controlled via `isUseCasesPage` (`pathname === "/products/business" || pathname === "/columbus-solutions" || pathname === "/research-applications"`).

| Behaviour | Detail |
|-----------|--------|
| **Immediate visibility** | `hasScrolled` is forced `true` on mount (both `useLayoutEffect` and `useEffect`) — no hero entrance animation to wait for. |
| **Transparent initial background** | No frosted glass at scroll 0. The standard `isCompact` logic handles this (glass appears after 10px scroll). |
| **Dynamic theme** | Page passes `theme={navTheme}` which switches between `"dark"` (white text) and `"light"` (dark text) based on which section the navbar overlaps. **`/columbus-solutions`** is dark end-to-end below its dark hero, so its `navTheme` stays at `"dark"` for the lifetime of the page. **`/research-applications`** has a dark hero with a light page below it; `navTheme` stays `"dark"` while the hero is in view and flips to `"light"` once the hero's bottom passes the navbar. Both pages still wire the prop through state so they comply with the dynamic-theme contract. |
| **Nav link colours follow theme** | Nav links use `isDark ? "white" : "#111111"` so they remain readable across dark/light section transitions. |
| **CTA button transitions with theme** | Dark sections: 10% white background, white text, hover fills solid white with black text. Light sections: solid black background, white text, standard hover. Transitions smoothly between states via `background-color 300ms` and `color 300ms`. |
| **Logo + wordmark in dark dropdown** | When menu opens on a dark section, logo stays inverted (white) and wordmark stays white — unlike other pages where `navColor` forces `#111111` on menu open. |
| **Dropdown arrows follow theme** | Menu item arrows use `stroke-white` on dark sections, `stroke-[#0A1344]` on light. |

### Key per-page variables in code

- **Blog article pages** do **not** render `<Navbar />` at all — see [components/blog/BlogArticleStickyNav.tsx](../components/blog/BlogArticleStickyNav.tsx) for the floating dock that replaces it.
- **`logoHovered`** — Local navbar state. Set to `true` when the logo `<Link>` receives `mouseenter` while `isBlogArticle` is true; reset to `false` on `mouseleave`. Drives the wordmark wrapper's `max-width` and the inner span's `opacity` + `translateX`.
- **`isProductsPage`** — `pathname === "/mapsgpt"`. Controls: glass CTA style, `bgTriggerPassed` bg logic, Start Now text colour (always black), hero-transition tracking.
- **`isUseCasesPage`** — `pathname === "/use-cases"`. Controls: immediate navbar visibility, CTA light/dark variants, nav link theme-aware colouring, dark-aware dropdown (logo, wordmark, arrows stay white when menu opens on dark sections).
- **`showWordmarkOnMobile`** — `pathname === "/" || "/mission" || "/contact"`. Controls: wordmark opacity on mobile.
- **`wide`** — Prop. Controls: glass text effects (`glassTextStatic`), wider max-width (1408px vs 1287px), hero-outer scroll tracking, `[data-navbar-bg-trigger]` usage, hamburger always showing on desktop.

### DOM markers by page

| Marker | Page(s) | Purpose |
|--------|---------|---------|
| `#hero-cta` | `/` (homepage) | IntersectionObserver hides nav links until CTA scrolls out |
| `[data-hero-outer]` | `/products` | Tracks hero scroll progress to hide links/CTA during transition |
| `[data-navbar-bg-trigger]` | `/products` | Zero-height div — when it passes viewport top, frosted glass bg appears |
| `[data-footer]` | All pages | Hides entire navbar when footer is 50% in view |

---

## Page Transitions

All internal link clicks (navbar links, CTAs, in-page links) are intercepted by `PageTransitionProvider` (`components/layout/PageTransition.tsx`), which wraps the entire app in `layout.tsx`.

The transition uses a **clip-path wipe** (inspired by noomoagency.com) with a branded interstitial screen.

| Phase | Duration | Effect |
|-------|----------|--------|
| **Wipe in** | 800ms | Light overlay (`#F9F9F9`) wipes upward from the bottom of the screen via `clip-path` animation (Quart in-out easing) |
| **Typing** | ~50ms/char | Logo fades in (centred), then a unique quote about the destination page types out in italic with a blinking cursor. Quote is randomly selected from a pool per route. |
| **Hold** | 400ms | Brief pause after typing completes, then Next.js router pushes the new route |
| **Wipe out** | 800ms | Overlay wipes upward out of view, revealing the new page beneath |

**Logo selection:**
- Default: Columbus Earth logo (`/logobueno.png`)
- `/maps-gpt` and `/mapsgpt` routes: MapsGPT logo (`/MapsGPT-logo.png`)

**Typed quote** (what gets typed on the interstitial):
Each route has a pool of 2–3 unique quotes that are randomly selected per navigation. Examples: `/` → "Mapping the future of our planet.", `/technology` → "Inside the Large Geospatial Model.", `/use-cases` → "See what spatial intelligence can do." Unknown routes fall back to generic exploration quotes. Quotes are defined in `ROUTE_QUOTES` in `PageTransition.tsx`.

**Behaviour notes:**
- Modifier-key clicks (Cmd/Ctrl+click) are not intercepted — they open in a new tab as normal.
- External links (`http`, `mailto:`, `tel:`, `#` anchors, `target="_blank"`) are not intercepted.
- Scroll position resets to top on route change.
- The overlay sits at `z-index: 9999` so it covers everything including the navbar.
- During transition, pointer events are blocked on the overlay to prevent double-clicks.
- When adding a new page, add its route to the `ROUTE_NAMES` map in `PageTransition.tsx`.

---

## Adding a New Page

When adding a new page to the site, decide:

1. Should the **Columbus Earth wordmark** be visible on mobile? If yes, add the pathname to the allowlist in `Navbar.tsx` (currently: `/`, `/mission`, `/contact`).
2. Does the page have a **hero CTA** (`id="hero-cta"`)? If yes, nav links will auto-appear once it scrolls out — no extra work needed.
3. Does the page need the **products glass navbar** (`wide` mode)? Only `/products` uses this. Do not apply `wide` to other pages.
4. Does the page need a **`[data-navbar-bg-trigger]`** element? Only needed on pages using `wide` mode.
