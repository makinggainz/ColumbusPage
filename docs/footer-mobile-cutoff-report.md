# Footer Mobile Cut-Off — Investigation Report

A protracted debugging session in May/Nov 2025 trying to fix the "Columbus Earth heading is cut off when you scroll to the footer on mobile" issue. The investigation surfaced a fundamental architectural limit in the footer reveal mechanic on mobile, several attempts at fixes that each had their own problems, and a stale-dev-cache trap that masked the eventual correct revert.

This report exists so the next attempt doesn't repeat dead ends.

---

## The problem

On mobile (≤767 px viewports), when the user scrolls to the bottom of any page, the **Columbus Earth** heading at the top of the footer is either obscured by the page card's rounded bottom edge or completely unreachable — depending on viewport height vs footer height.

---

## Root cause — the reveal mechanic has a math ceiling on mobile

The footer uses a "reveal" pattern wired between two files:

- **[components/layout/Footer.tsx](../components/layout/Footer.tsx)** — the footer is `position: fixed; bottom: 0; left: 0; right: 0; z-index: 0` when called with `reveal={true}` (which is always, via RootShell).
- **[components/layout/PageFrame.tsx:131](../components/layout/PageFrame.tsx#L131)** — the white page card has `marginBottom: calc(var(--footer-reveal-height, 100vh) - 60px)`, which reserves scroll space below the card equal to the footer's height minus 60 px. As the user scrolls into that reserved range, the card slides up over the fixed footer.

At max scroll:
- `card.bottom` in viewport coords = `viewport_height − footer_height + 60`
- `footer.top` in viewport coords = `viewport_height − footer_height`
- The card covers the **top 60 px of the footer** permanently (intentional — the card's rounded bottom corners sit on top of the footer's video).

For all footer content to be visible:
- Content's `padding-top` must be ≥ 60 px (so the heading isn't under the 60-px overlap zone).
- The footer's total height must be ≤ `viewport_height + 60`, OTHERWISE the top of the footer extends above viewport top at max scroll AND there's no more scroll to reach it.

**The mobile failure mode:** Phase 1.8 (committed in `c3df3e1`) tightened the desktop-tuned footer for mobile — collapsed the 4-column grid to single-column, stacked the legal row — but kept the brand block, 3 link columns, and tagline. Total mobile footer height ≈ 700–900 px. On any viewport shorter than `footer_height − 60` (i.e., most phones), the **top portion is mathematically unreachable**. Even with maxed-out scroll, the Columbus Earth heading sits above the viewport's upper edge.

Phase 1.8 also dropped the top padding from `pt-32` → `pt-16` mobile. `pt-16` = 64 px = only **4 px clearance** from the 60-px overlap zone. So even on tall enough viewports where the footer technically fits, the heading reads as flush against the card's bottom edge.

---

## Attempts & outcomes

### Attempt 1 — `pt-24` + centered single-column mobile layout

- Bumped mobile padding to `pt-24` (96 px = 36 px clearance from overlap).
- Centered the mobile content stack (`text-center md:text-left`, `mx-auto md:mx-0` on tagline, `justify-center md:justify-start` on socials).
- **Result:** user reported the heading was still cut off. The padding was sufficient mathematically but the **footer height ceiling problem** remained — Columbus Earth was still above the unreachable zone.

### Attempt 2 — Revert centering, push padding to `pt-28`

- Reverted the centering changes (back to left-aligned).
- Bumped padding to `pt-28` (112 px = 52 px clearance from overlap).
- **Result:** user reported the issue still persists. Same root cause — comfortable clearance from overlap doesn't help if the heading sits above viewport top altogether.

### Solution B — Make the footer scroll normally on mobile (saved on branch)

- Forced footer to `position: relative` on mobile via media query (initially tried `static`, but that broke positioning context — see below).
- Zeroed `.page-frame-card`'s `margin-bottom` on mobile via the same media query.
- Reordered RootShell JSX so `<PageFrame>` renders before `<Footer>`, so the static footer lands below the card in normal flow.
- **Result:** worked — footer became a regular bottom-of-page block users scroll into like any other section. Saved as branch **`footer-mobile-solution-b`** (commit `8fa497e`) for comparison.

### Solution B sub-bug — `position: static` broke positioning context

First attempt used `position: static !important` on `[data-footer]`. This destroyed the footer's positioning context, so its `position: absolute` children (the `<video>` background and the `0.25` black scrim) escaped to the nearest positioned ancestor — `<html>` — and filled the entire viewport. Hero appeared dimmed (scrim everywhere), footer area appeared white (video painted on `<html>`). Fixed by switching to `position: relative !important` instead, which keeps the footer in normal flow but preserves the positioning context.

### Solution A — Aggressively shrink mobile footer to fit in revealed frame

- Dropped tagline on mobile (`hidden md:block`).
- Made brand block inline horizontal on mobile (heading + socials on one row).
- Shrunk all type (heading 24→18, link cols 17.5→14).
- Tightened gaps (`gap-10` → `gap-6`, `mb-10` → `mb-6`).
- Hid 2 italic legal taglines on mobile.
- **Result:** footer height dropped from ~800 px to ~450–500 px — fits comfortably on iPhone SE (568 px viewport). User asked to revert without committing — feedback was "didn't like the look."

### Final state — Revert all footer experiments

- User asked to "go back to how it was before this and the last change."
- Footer.tsx restored from commit `10fe8ec` (the pre-responsive-rollout version): `max-w-[1200px] mx-auto px-8 pt-32 pb-6` wrapper, original 2-col grid, horizontal legal row.

### Final-state sub-bug — Stale dev cache served Solution B's orphan CSS

After reverting Footer.tsx, the user reported "the footer is appearing above the page." Working tree was clean. The build was clean. The bug was in **`.next/dev/`**: the dev server's cached CSS chunk (`app_globals_71f961d1.css`) still contained the `.page-frame-card { margin-bottom: 0 !important }` rule from Solution B's media query. The source `app/globals.css` no longer had this rule, but HMR hadn't reconciled. Combined with the now-original Footer.tsx (no Solution B JSX swap, no Solution B position override), the orphan CSS zero'd PageFrame's scroll reserve while everything else expected the reserve to be present — putting the footer effectively "at the top of the page."

**Fix:** killed dev server, `rm -rf .next/`, restarted `npm run dev:lan`. Verified the rebuilt `.next/dev/` no longer contained `.page-frame-card`.

---

## Current state (end of session)

- **Working tree on `experimentV6-Gdesign`:** clean, matches HEAD (`1383837`).
- **Footer state:** [components/layout/Footer.tsx](../components/layout/Footer.tsx) is at the committed Phase 1.8 state (content-bounds wrapper, `pt-16 md:pt-32`, grid-cols-1 mobile collapse, stacked legal row). **The Columbus Earth cut-off issue is still present** — no fix has been merged.
- **Branch artifact:** `footer-mobile-solution-b` (commit `8fa497e`) preserves the "footer scrolls normally on mobile" implementation in case we want to revisit. Cleanly diffable from `experimentV6-Gdesign`.
- **Dev server:** restarted fresh in `dev:lan` mode on port 3000, with cleared `.next/` cache.

---

## Key lessons for the next attempt

### 1. The reveal mechanic has a hard mathematical limit on mobile

The reveal can only show `footer_height − 60` px of the footer at once. If the footer is taller than the viewport, the top is unreachable. **No amount of padding tweaks fix this.** Two ways forward:

- **(A)** Shrink the mobile footer to fit (Solution A approach). Fragile if content ever grows; needs careful per-viewport tuning. Risk: iPhone SE = 568 px is the limiting case.
- **(B)** Drop the reveal mechanic on mobile, let the footer scroll like a normal block (Solution B approach). Architecturally distinct desktop/mobile paths but robust to any viewport. **Saved on `footer-mobile-solution-b` branch.**
- **(C)** Hybrid — accept that some content isn't visible on the smallest phones (compromise).

### 2. `position: static` is a footgun when an element has absolutely-positioned children

If you're tempted to override `position: fixed` → `position: static` for mobile, use `position: relative` instead. `static` removes the element from the positioning system entirely, and any descendant `position: absolute` elements will climb up to the next positioned ancestor (often `<html>`), often with destructive visual results.

### 3. Stale dev cache can outlive working-tree reverts

Next.js's Turbopack dev server caches compiled CSS chunks in `.next/dev/`. When you revert source CSS rules, HMR usually re-emits — but **not always**, especially after rapid back-and-forth edits across multiple sessions. If a layout bug doesn't match the source code's current state:

1. Check `.next/dev/static/chunks/*.css` for stale rules with `grep`.
2. If found, the fix is to kill the dev server, `rm -rf .next/`, and restart. **Hard browser reload alone is not enough** — the server is still serving the stale chunk.

### 4. Match the user's dev script (`dev` vs `dev:lan`)

`npm run dev` binds to `127.0.0.1` (local-only). `npm run dev:lan` binds to `0.0.0.0` (network-accessible from phone). If the user is testing on a phone via LAN IP, use `dev:lan` — the local-only version is invisible to the phone.

### 5. Don't make rapid layout-architecture changes while the dev server is running without verifying the cache

Each iteration in this session (centered → left-aligned → Solution B with `static` → Solution B with `relative` → Solution A → revert) added more chances for the dev cache to drift from source. Consider restarting the dev server between substantively-different approaches.

### 6. Always verify a revert by comparing against `git diff HEAD` + checking `.next/dev/` cache

A clean `git status` doesn't mean the running app reflects the source. Cross-check the dev cache before assuming a revert took effect.

---

## Files involved

- [components/layout/Footer.tsx](../components/layout/Footer.tsx) — the footer component (default + compact variants)
- [components/layout/PageFrame.tsx](../components/layout/PageFrame.tsx) — the white card with reveal-reserve `margin-bottom`
- [components/layout/RootShell.tsx](../components/layout/RootShell.tsx) — renders `<Footer reveal />` + `<PageFrame>` for all non-article routes
- [app/globals.css](../app/globals.css) — `.content-bounds` primitive, `.footer-reveal-overlay` (orphan CSS, no JSX consumer)
- [docs/responsive-mobile-guide.md](responsive-mobile-guide.md) — the broader responsive rules; this report supplements its footer guidance

---

## Open questions for the next session

1. Is the design intent "user must see all footer content at once" (forces Solution B) or "user scrolls past content to brand block at top" (allows Solution A)?
2. Is the dramatic mobile/desktop layout split of Solution B acceptable (different architectures) or should the mobile layout be visually a scaled version of desktop (favoring Solution A)?
3. If Solution A: how aggressively can we tighten the design language without losing brand voice? (Tagline dropped? Italic legal lines dropped? Heading shrunk?)
4. Is the reveal mechanic itself worth preserving on desktop, given it adds nontrivial complexity and was the root cause of all these issues? Or simplify to a normal-flow footer everywhere?

---

*Reported May 28, 2026. State at end of session: experimentV6-Gdesign clean, Solution B saved on branch `footer-mobile-solution-b`, cut-off issue unresolved.*
