# Report — Porting the PolarX Hero into `/products/mapsgpt`

**Date:** 2026-05-17
**Branch:** `experimentV6-Gdesign`
**Scope:** Replace the `/products/mapsgpt` hero with the hero from the PolarX project, swapping all content to MapsGPT and restyling to this project's design system.

---

## 1. Goal

Delete the existing MapsGPT hero and rebuild it from the hero in the `Documents/PolarX` project, with:
- **Layout** identical to PolarX.
- **Content** (text + imagery) swapped to MapsGPT-relevant material.
- **Style** (typography, button styling, colour) adapted to this project's design system.

---

## 2. Source material

The `PolarX` folder contains a single `index.html` (~6.3 MB) — a SingleFile capture of the Polarsteps homepage (a Framer site), plus two helper scripts (`append_script.py`, `update_script.py`) and a large appended `<script>` block of custom scroll choreography.

Key findings from reading the code:
- The hero is a Framer-generated DOM with opaque hashed class names (`.framer-116zjzf`, `.framer-s5ylue`, `.framer-1kkkwch`, etc.).
- The appended script implemented scroll-driven choreography: a pinned 3D phone re-posing through keyframes, backdrop scenes, and label highlighting.
- The hero **header** structure (extracted from the markup):
  - `.framer-116zjzf` — header, `65vh`, centered.
  - `.framer-s5ylue` — content column, `max-width:800px`, `gap:32px`.
  - `.framer-o53dh0` — badge/award row (`gap:24px`, `opacity:.7`).
  - `.framer-3drty7` — headline + paragraph column (`gap:16px`).
  - `.framer-1k2356o` — "Get the app" button + star-rating row (`gap:16px`).
  - `.framer-1kkkwch` — sticky device container (`position:sticky; top:140px`), holding the 3D phone.

---

## 3. Decisions confirmed with the user

| Question | Answer |
|----------|--------|
| Reproduction fidelity | Full scrollytelling |
| Existing `ShowcaseSection` | Remove it from the page |
| Three phase words for MapsGPT | Ask / Discover / Go |

---

## 4. Attempt 1 — freelanced composition (rejected)

Without first rendering the PolarX page, I designed an **original** scrollytelling hero loosely "inspired by" the mechanic: giant rotating pill-words `Ask · Discover · Go` as the headline, three cross-fading colour backdrops, and a phone swinging left/right.

**Outcome:** Rejected by the user. It looked nothing like PolarX. In practice it also rendered broken — the oversized pill-words wrapped and overlapped, and the absolutely-positioned subcopy collided with the phone.

**Root cause:** I invented a layout instead of reproducing the source layout. The instruction was "same layout; only style differs."

---

## 5. Attempt 2 — faithful port (accepted)

### Process correction
The user pointed out I should work from the PolarX **code**, not redesign. I:
1. Parsed `index.html` with an HTML parser to extract the real hero DOM tree.
2. Pulled the relevant CSS rules (flex layout, gaps, sizes, sticky offsets, the phone shadow stack).
3. Used Playwright (system Chrome) to render PolarX purely to confirm the visual layout matched my reading of the code.

### What was built
A rewritten `components/products/Hero.tsx` reproducing the PolarX layout 1:1:

**Section 1 — Hero header** (mirrors `.framer-s5ylue`):
- Wordmark row (MapsGPT + globe) where PolarX has its award badges.
- Headline `<h1>`, two lines.
- Paragraph with the three phase words highlighted inline.
- "Get the app" button + ★ star rating, in a row.
- Full-bleed photo background with a legibility veil that fades into the section below.

**Section 2 — Sticky device section** (mirrors `.framer-1kkkwch`):
- A 3D phone that pins and re-poses through four scroll keyframes.
- Four floating photo-cards at the edges with a gentle bob animation.
- A per-phase eyebrow + heading block (Ask / Discover / Go) beside the phone.

### Style adaptation (the only intended differences)
- Typography → SF Pro / SF Compact per `design-system/products-page.md`.
- Colour → teal/cyan palette (`#063140`, `#00B1D4`); dark text on the lighter MapsGPT photo instead of PolarX's white-on-dark.
- Button → dark-teal pill.
- All copy and imagery → MapsGPT assets (MapsGPT phone screenshot, in-repo travel photos, original MapsGPT copy).

### Content note
The `public/QuestionsMapsGPT/` card images were **not** reused — they carry joke/placeholder captions unsuitable for a production page. Floating cards were rebuilt in JSX with clean photos and original captions instead.

---

## 6. Files changed

| File | Change |
|------|--------|
| `components/products/Hero.tsx` | Fully rewritten as the ported hero |
| `app/products/mapsgpt/page.tsx` | Removed `ShowcaseSection` import + usage |

`components/products/ShowcaseSection.tsx` is now unused dead code (not deleted — pending confirmation).

---

## 7. Verification

- Rendered live on the running dev server (`127.0.0.1:3000/products/mapsgpt`) and screenshotted at multiple scroll positions — header, pinned phone, Discover phase, Go phase all render as intended.
- `tsc --noEmit`: **0 errors** in the changed files.

---

## 8. Open items

1. `next build` currently fails on a **pre-existing, unrelated** type error in `components/use-cases/UseCaseStickyScroll.tsx` (four `isLight` parameters lack type annotations). Not touched by this work; trivial to fix if desired.
2. `components/products/ShowcaseSection.tsx` can be deleted (now unreferenced).
3. The phone-screen content is a single static screenshot; PolarX cycled multiple in-app screens. Multi-screen cycling would need additional MapsGPT screenshots.

---

## 9. Lessons

- **Reproduce before reinventing.** "Same layout, different style" means port the source structure first; styling is the last layer, not the starting point.
- **Render the source early.** A quick render of the PolarX page up front would have prevented the rejected first attempt.
- **Extract from code, not memory.** The accepted attempt worked because it was built from the actual extracted DOM/CSS.
