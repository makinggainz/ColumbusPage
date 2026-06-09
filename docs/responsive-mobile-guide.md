# Responsive & Mobile Design Guide

Reference for anyone (human or Claude) doing responsive/mobile work on this site. Captures the design-system primitives that landed in the Nov 2025 mobile-responsiveness rollout, the conventions that emerged, and the rules that should govern future per-component work.

---

## TL;DR — the rules

1. **Mobile content gutter: 20px on the navbar, 20–24px on content sections.** The 4-px inset of `px-6` sections from the navbar pill is intentional whitespace, within the Mobbin best-practice band. Do **not** unify these without product approval.
2. **Max content width: 1287px**, centered ≥768px. Use `.content-bounds`.
3. **Tailwind default breakpoints only**: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. Arbitrary breakpoints need a `WHY:` comment.
4. **44×44px touch target floor on mobile** (WCAG AA). Use `.touch-target` utility (active <1024px only).
5. **Sticky scroll experiences are desktop-only** by default. Mobile gets a static stack. Use `.lg-only-sticky` to neutralize unintended sticky behavior.
6. **Never invent new responsive logic when the existing component already has it.** Check call sites and existing media queries first — the Nov 2025 audit found ~25 "issues" that were already solved in the codebase or targeted dead code.
7. **Verify before implementing.** The audit-driven plan was correct in scope but wrong in several specifics. Always read the actual file before applying the planned fix.

---

## Design system primitives (live, defined in [app/globals.css](../app/globals.css))

### `.content-bounds`

Canonical mobile width rule. **Use this on section outer wrappers when introducing new content blocks.**

```css
.content-bounds {
  max-width: 1287px;
  margin-left: 1.25rem;   /* 20px mobile gutter */
  margin-right: 1.25rem;
}
@media (min-width: 768px) {
  .content-bounds { margin-left: auto; margin-right: auto; }
}
```

- `.ent-content-bounds` is kept as a global alias for backward compatibility with business-page components that already use it.
- Tailwind equivalent for ad hoc use: `max-w-[1287px] mx-5 md:mx-auto` (this is what `MistxNav` uses at [components/layout/MistxNav.tsx:469](../components/layout/MistxNav.tsx#L469)).

### Typography ramp tokens

CSS custom properties for headings that risk overflow at narrow viewports:

```css
--type-display:  clamp(36px, 7vw, 76px);   /* hero h1 */
--type-h2:       clamp(28px, 5vw, 56px);   /* section heading */
--type-h3:       clamp(22px, 3.5vw, 36px); /* sub heading */
--type-body:     clamp(15px, 1.6vw, 18px);
--type-eyebrow:  clamp(11px, 1.2vw, 13px);
```

Use these only when replacing a fixed `text-[Npx]` that the audit flags for overflow. Do **not** apply globally — they have wider top ranges than some existing per-section type scales, and bulk-converting would change the desktop look.

### Vertical rhythm tokens

```css
--section-py:        clamp(56px, 8vw, 128px);
--section-py-tight:  clamp(32px, 5vw, 80px);
```

For section wrappers where fixed `py-32` / `py-40` dominate the mobile viewport. Don't apply unless a real visual problem on mobile is observed.

### `.touch-target`

WCAG AA hit-area floor. Floors interactive elements at 44×44 px on mobile only, leaves desktop alone.

```css
@media (max-width: 1023px) {
  .touch-target { min-height: 44px; min-width: 44px; }
}
```

Apply to small pills, icon buttons, accordion triggers that render below 44px tall. Already applied to [`CtaButton`](../app/contact/page.tsx) on the contact page.

### `.lg-only-sticky`

Kills `position: sticky` below `lg` (1024px) so desktop-only sticky elements degrade to normal flow on mobile:

```css
@media (max-width: 1023px) {
  .lg-only-sticky { position: static !important; }
}
```

### `.mockup-fit`

Wrapper for hardcoded-pixel mockup frames that need to scale to fit narrow viewports:

```css
.mockup-fit {
  max-width: 100%;
  height: auto;
  aspect-ratio: var(--mockup-aspect, 5184 / 3003);
}
```

**Important:** the four industry mockup components in [components/business/](../components/business/) (`DataManagerMockup`, `AgenticResearchMockup`, `DashboardMockup`, `MapChatPlatform`) **already build their own responsive sizing** using `className="relative w-full mx-auto"` + `aspectRatio` + `maxWidth: 1180` + `containerType: "inline-size"` (CSS container queries scale internal typography). **Do not wrap them in `.mockup-fit`** — they're already correct. The utility is for new components that don't have this baked in.

---

## Mobile-first patterns (solved problems)

### Sticky-scroll experiences on mobile → static stack

The Consumer Hero ([components/products/Hero.tsx](../components/products/Hero.tsx)) is the canonical example:

1. Desktop layers wrapped with `hidden lg:block`:
   - sticky white backdrop
   - sticky pinned phone + pill row
   - scrolling label content
2. Mobile path added as a separate `<MobileScenes />` block wrapped in `lg:hidden`. Renders each scene as a normal-flow section: photo backdrop → label → phone with matching screen → notifications.
3. Reuses the same data constants (`LABELS`, `PHONE_IMAGES`, `NOTIFICATIONS`) and presentational components (`NotifCard`). Same Axiforma 590 type, same 0.55 black scrim, same PolarX device geometry.

Pattern: **build a dedicated mobile JSX path that reuses the same design tokens; don't try to bend the desktop sticky-scroll component to also work narrow.**

### Auto-advance / scroll-driven animations on mobile

Pattern: gate the trigger element with `hidden lg:block`. Example: [components/business/ComparisonSection.tsx:271-287](../components/business/ComparisonSection.tsx) — the gray fill bar that fires `advance()` on `animationEnd` is hidden on mobile via `hidden lg:block`. Because the element gets `display: none`, the CSS animation never plays, so `advance()` never fires. Mobile becomes a tap-to-select list. The active-state feedback shifts to opacity contrast (already present on the parent).

### Photo-backdrop hero images on mobile

Source images authored at wide aspect ratios (e.g., 1672×941 hero, 1881×836 contact backdrop) need explicit `object-position` overrides on mobile if a key subject sits anywhere other than the visual center. Default `object-position: right center` will crop the subject to the edge or under a readability gradient.

Example fix: [components/home/HeroNew.tsx](../components/home/HeroNew.tsx) — adds `@media (max-width: 767px) { .hn-bg { object-position: 75% center; } }` to land the tall-ship in the section's gradient-transparent zone.

### Industry mockup frames

Already responsive. They use `aspectRatio` + `maxWidth: 1180` + container queries. The overflow problem people see on mobile is almost always in the **parent wrapper** that forces `width: 1180` inline (as ComparisonSection did before being fixed). Fix the parent, not the mockup.

### Hero-page H1 type scaling

Use `font-size: clamp(min, vw, max)` when the headline is a key visual element. Hardcoded `fontSize: "76px"` will push CTAs off-screen on phones. Example: [components/products/Hero.tsx](../components/products/Hero.tsx) hero `<h1>` uses `clamp(36px, 9vw, 76px)`.

---

## Standards & conventions

### Mobile gutter spectrum (in use across the site)

| Token | Value | Where |
|---|---|---|
| `mx-5` / 20px | site standard | MistxNav, ContentGrid, `.content-bounds`, blog article, contact form, ProductBanner (Phase 2), MapsGPT page (Phase 2), blog index hero (Phase 2) |
| `px-6` / 24px | accepted band | most home/business sections — 4-px inset from navbar is intentional whitespace |
| `--hiw-content-px` / 24px | self-contained system | FinalCTASection (scoped tokens, do not normalize) |

Rule: **never use less than 16px or more than 32px mobile horizontal padding** without explicit product approval. The Mobbin median for SaaS landing pages is 20–24px.

### Max-widths

- **1287px**: site-wide content max (navbar, home sections, business sections, footer). Use `.content-bounds`.
- **720px**: blog article reading column ([app/blog/[slug]/page.tsx:50](../app/blog/[slug]/page.tsx#L50)). Keep narrow for readability.
- **640px**: contact form ([app/contact/page.tsx:313](../app/contact/page.tsx#L313)). Keep narrow.
- **1408px** (`--hiw-max-width`): only used inside the FinalCTASection's `hiw-scope` system. Self-contained.

The legacy `--container-site: 1200px` var and `.container-site` class were deleted in Phase 1 — do not re-introduce.

### Grid collapse defaults

Multi-column grids should collapse via Tailwind:
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (most common)
- Or via CSS module with `@media (max-width: …)` rules

Never use hardcoded inline `style={{ gridTemplateColumns: "repeat(N, 1fr)" }}` without media queries — that was the bug at Company page [line 247](../app/company/page.tsx#L247) before Phase 2.7.

### Footer

Single source — [components/layout/Footer.tsx](../components/layout/Footer.tsx). Mobile uses single-column link layout, stacks the bottom legal row vertically, uses `.content-bounds`. Don't fork it; if you need a narrow variant, the `variant="compact"` path exists.

---

## Files changed in the Nov 2025 rollout

Foundation:
- [app/globals.css](../app/globals.css) — added the responsive primitives block (~lines 395-485); deleted legacy `--container-site` and `.container-site`
- [components/business/business-tokens.css](../components/business/business-tokens.css) — replaced duplicated `.ent-content-bounds` rule with pointer comment
- [components/layout/Footer.tsx](../components/layout/Footer.tsx) — mobile column collapse, `.content-bounds`, stacked bottom row

Per-page:
- [components/home/Careers.tsx](../components/home/Careers.tsx) — easter-egg canvas skipped on mobile
- [components/home/HeroNew.tsx](../components/home/HeroNew.tsx) — mobile `object-position: 75% center` so the tall-ship is visible
- [components/business/ComparisonSection.tsx](../components/business/ComparisonSection.tsx) — major rebuild: killed 1180px overflow, gated auto-advance to desktop, mobile host card auto-sizes
- [components/business/ProductBanner.tsx](../components/business/ProductBanner.tsx) — `px-4 md:px-10` → `px-5 md:px-10`
- [components/products/Hero.tsx](../components/products/Hero.tsx) — major rebuild: desktop sticky stage gated to `lg:`, new `<MobileScenes />` static stack, hero `<h1>` uses clamp
- [components/products/DestinationsSection.tsx](../components/products/DestinationsSection.tsx) — source-app chips hidden on mobile
- [app/contact/page.tsx](../app/contact/page.tsx) — `CtaButton` and `.cf-tab` touch-target floors
- [app/blog/blog-index.module.css](../app/blog/blog-index.module.css) — mobile hero padding clamp
- [app/blog/[slug]/page.tsx](../app/blog/[slug]/page.tsx) — article gutter `px-4 → px-5`
- [app/company/page.tsx](../app/company/page.tsx) — "Read more" cards collapse `3 → 2 → 1`

Unchanged (verified already responsive):
- All four industry mockup components — built with container queries, already responsive
- `components/technology/*` — Research page redesign already has mobile collapse + carousel; the audit's targeted classes (`lgmColumns`, `dataCards`, `timelineLabels`, `indexSlide`) are dead CSS with zero call sites
- `components/layout/MistxNav.tsx` — drawer was rebuilt prior to this session and is excellent on mobile
- `components/products/FinalCTASection.tsx` — uses its own `hiw-scope` design tokens; mobile path already at `lg:hidden`

---

## Rules for future sessions

### DO

- **Verify before implementing.** Read the actual file. Check `grep` for call sites. The audit gets scope right and specifics wrong about 30% of the time.
- **Reuse existing primitives**: `.content-bounds`, `.touch-target`, `.lg-only-sticky`, `.mockup-fit`, the type/rhythm clamp tokens.
- **Prefer one mobile-only JSX path over CSS contortion** when a component has fundamentally different mobile + desktop UX (Hero MobileScenes is the canonical pattern).
- **Document `WHY:`** when introducing custom breakpoints (anything outside Tailwind defaults).
- **Test at 320, 360, 375, 390, 414, 768, 1024px** viewports before merging.
- **Maintain design language**: same fonts, same color palette, same shadows, same corner radii on mobile. Mobile is a different *layout*, not a different *design*.

### DO NOT

- **Do not wrap the industry mockups (`DataManagerMockup` / `AgenticResearchMockup` / `DashboardMockup` / `MapChatPlatform`) in `.mockup-fit`.** They're already responsive via container queries. Wrapping is harmless but creates a misleading "fix" record.
- **Do not change the navbar gutter (`mx-5` = 20px).** It's the visual baseline of the site.
- **Do not unify the 20px-vs-24px section gutter mix** without product approval. The 4-px inset is intentional whitespace.
- **Do not introduce backwards-compat shims** (renamed `_unused` vars, re-exports, "removed" comments). Delete cleanly.
- **Do not add automation around responsiveness** (no `useMediaQuery` hooks for things CSS can handle).
- **Do not edit any file under `components/technology/`** unless explicitly asked. The Research page has its own thoughtful responsive system that the Nov 2025 audit misread as broken.
- **Do not create new docs files** (this guide is the exception — the user explicitly asked).
- **Do not pause CSS animations on mobile** purely on theoretical battery/perf grounds. The marquee animations on this site (DestinationsSection, etc.) are part of the design language and `prefers-reduced-motion` already handles user preferences.
- **Do not use Tailwind v3 syntax** (`bg-gradient-to-r`). The project is on v4; canonical class is `bg-linear-to-r`. The maps-gpt page had pre-existing v3 syntax that surfaced as IDE warnings during edits — those are out of scope for responsive work, but don't *add* v3 syntax in new code.

### When in doubt

- **Skip > implement** if the planned fix targets something that's already correct. Document the skip with a one-line reason.
- **Ask the user** for taste calls (gutter values, narrow-layout max-widths, "is this design intent?"). Don't guess.
- **Run `npm run build`** after every change. The hero image edit in this rollout broke the build (backticks in a template literal CSS comment) — caught immediately by build, would have been a runtime error if shipped.

---

## Verification checklist (before declaring "responsive")

For every page or component touched:

1. **`npm run build` passes** — no TypeScript errors, no Turbopack errors
2. **At 320, 360, 375, 390, 414, 768, 1024, 1280px viewports** in Chrome DevTools:
   - No horizontal scrollbar
   - No content overlapping
   - No text clipped at viewport edges
   - All interactive elements have ≥44×44px touch area on mobile
   - Sticky elements either work cleanly or fall back to static stack
3. **Visual parity with desktop design language**:
   - Same Funnel Display headings
   - Same `#1F1F1F` ink color
   - Same `#154ACC` / `--color-accent` blue
   - Same 7px MistX placeholder corner radius (or design-system equivalent)
   - **No purple** anywhere (hex, Tailwind utility, gradient stop, hue-rotate)
4. **Real-device spot check** on iPhone Safari and Android Chrome before merging.
5. **Lighthouse mobile** for new/significantly-changed routes: accessibility ≥95.

---

## Related plan files (historical)

- `/Users/alexramirezblonski/.claude/plans/ok-without-making-any-transient-ember.md` — the original content-bounds plan (now superseded by Phase 1 of the responsive rollout)
- `/Users/alexramirezblonski/.claude/plans/site-responsive-rollout.md` — the executed plan (8 phases, ~14 real changes, ~25 skipped-after-verification items)

---

*Last updated: Nov 2025 rollout. Maintained by hand. If conventions drift, fix this doc.*
