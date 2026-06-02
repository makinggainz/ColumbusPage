# Homepage Bento — Audience Label Treatment (Handoff Report)

> **Purpose:** This is a handoff doc for another AI coding agent (or developer) to continue iterating on **how the homepage product bento cards communicate their audience** ("For business" / "For consumer" / "For the curious"). It captures the goal, the full iteration history (so you don't re-tread rejected ideas), the technical anatomy of the component, the saved checkpoint, and the gotchas.

---

## 1. The problem / goal

The homepage product bento is a 3-card grid (Columbus = business, Elio = consumer, Research = curious). Each card should signal **who the product is for**. The work has been an extended design exploration — primarily on **mobile** — of *how* to present that audience label so it looks good and on-brand. The user is iterating visually and rejecting options quickly; the "right" answer is a matter of taste and is still **not finalized**.

- **Single file:** [`components/home/BentoProducts.tsx`](../components/home/BentoProducts.tsx) — a self-contained client component. All styles live in one big `CSS` template-literal string near the top; markup is the `BentoProducts()` JSX at the bottom.
- **Branch:** `experimentV6-Gdesign`.
- **Live route:** `/` (homepage). The bento is `<section aria-label="Our products">`.

---

## 2. Saved "liked" checkpoint (IMPORTANT — restore point)

The user explicitly liked **one** version and may want to return to it:

- **Version: "audience baked into subtitles"** — no separate label/chip/cut-out at all; each card's subtitle carries the audience:
  - Columbus: `All-in-one map intelligence platform for your business`
  - Elio: `Making maps feel alive for everyone`
  - Research: `Building the Large Geospatial Model for the endlessly curious`
- **Committed at `bdd0fc2`** on `experimentV6-Gdesign` (commit message: *"Bento: bake audience into subtitles (liked version)"*).
- **Restore it with:** `git checkout bdd0fc2 -- components/home/BentoProducts.tsx`
- Also recorded in agent memory: `~/.claude/projects/-Users-alexramirezblonski-Documents-ColumbusPage/memory/reference_bento_liked_versions.md`.

---

## 3. Current state (uncommitted, work-in-progress)

The working tree currently holds the **"corner cut-out + pill"** version (uncommitted on top of `bdd0fc2`). Structure per card:

- A white **cut-out** notched into the card's **top-left corner** (`.bp-cutout`) — the page surface "cut" into the corner, with the cut silhouette (a 1px `#E7E7F1` hairline) on its **right + bottom** edges and a concave bottom-right corner.
- Inside it, a rounded bordered **pill/chip** (`.bp-chip`) holding the audience text, pinned flush to the top-left so its top/left border reads continuous with the card.
- Subtitles were reverted to their **originals** (no baked-in audience), and the `audience` field drives the chip.

The most recent round of fixes (the "last chance" pass):
1. **Tightened the gap** under the chip (`.bp-cutout { margin-bottom: 6px; padding: 0 10px 8px 0 }`).
2. **Removed the fillets** (the old `.bp-cutout::before/::after` 13px radial-gradient corner-eases) because they sat *outside* the cut-out box (`-13px`) and read as border lines extending beyond it.
3. **Removed the card hairline ring** (`.bp-card::after { box-shadow: inset 0 0 0 1px #E7E7F1 }`) — it ran along the card's top/left edges *out of* the cut-out as a stray line. Replaced card-edge definition with a **soft drop shadow on `.bp-card`** (`box-shadow: 0 1px 2px rgba(11,27,43,.05), 0 10px 30px rgba(11,27,43,.07)`). ⚠️ This changed **all** cards from a flat hairline edge to a shadowed/floating look — a global side effect the user has not explicitly blessed; revisit if they want the flat look back.

> If the user says "go back to the version you liked / the subtitles one," do step 2 (restore `bdd0fc2`). The cut-out+pill is a live experiment, not a settled design.

---

## 4. Full iteration history (what was tried, and the verdict)

Chronological, so you don't repeat rejected directions. All mobile-focused unless noted.

| # | Idea | Verdict / why rejected |
|---|------|------------------------|
| 1 | **Centered top-edge cut-out** (white notch centered on the top edge, label inside). Committed at `8f6804d`. | Rejected — opaque white tab too heavy; gave the least-important text the most weight; "file-folder tab" rhythm. |
| 2 | **Inline eyebrow** (small tinted label line above the brand row, no container). | Rejected. |
| 3 | **Pill + image + dark-scrim reorder** (pill top-left, product image, then white text over a dark bottom gradient — a full mobile layout flip). | Rejected. |
| 4 | **Top-of-card navy icon pill** (lucide Briefcase/Users/Compass + label, on the photo). | Rejected ("not vibing"). |
| 5 | **Top-left corner cut-out, label-only** (mirror of the desktop top-right notch). | Iterated past — user wanted the label in its own container. |
| 6 | **Large top-left cut-out panel** wrapping the *entire* text block (label+brand+subtitle+CTA). | Rejected. |
| 7 | **Audience baked into subtitles, no label** → ✅ **LIKED** (`bdd0fc2`). | The current restore point. |
| 8 | **Rounded bordered chip at top-left** (badge on the photo, 13px radius matching card), subtitles reverted. | Stepping stone — user then wanted the chip *inside* a cut-out. |
| 9 | **Cut-out + chip centered inside it.** | Padding too big; chip not flush; stray border lines. |
| 10 | **Cut-out + chip flush top-left, tightened, fillets+ring removed, card drop-shadow** ← **current uncommitted state**. | Awaiting user verdict. |

**Original desktop design (predates all this, still the baseline ≥1024px in some versions):** the audience sat in a white cut-out notched into the card's **top-RIGHT** corner (`.bp-notch`), using a fillet mechanism (see §5). That `.bp-notch` and its `.bp-notch-label` tints have been removed in the current tree but exist in history — useful reference for the cut-out/fillet geometry.

---

## 5. Technical anatomy of `BentoProducts.tsx`

**Card model (`PRODUCTS` array + `Product` interface):** each card has `cellClass` (`bp-card--columbus|elio|research`), `href`, `logo` (+ optional `logoFilter`), `name`, `tagline`, optional `audience`, `ctaLabel`, optional `bg` (static-import photo → AVIF via next/image), optional `visual` (product mockup image), `wide` (Research spans 2 cols on desktop). Columbus/Elio have photos + mockups; **Research has no `visual`** (text-only) and uses a CSS gradient bg + a decorative `ResearchLatticeArt` SVG (hidden <1024px).

**Layout / breakpoints:**
- `.bp-grid`: 1 column < 1024px; `1fr 1fr` ≥ 1024px. Research (`.bp-card--wide`) spans both columns ≥1024px.
- `.bp-card`: `padding: 28px` (base) → `32px` ≥640 → `40px` ≥1024; `border-radius: 13px`; `overflow: hidden`; `display: block`. Mobile cards are **auto-height**; the fixed `height: 560px` only applies ≥1024px.
- The product visual (`.bp-visual`) is **in normal flow at the bottom** <1024px, and **absolutely positioned "peeks from bottom"** ≥1024px (with a hover lift).

**Paint stack (z-index) inside a card:**
- `.bp-bg` (next/image fill photo) + `.bp-bg-tint` (flat `rgba(0,0,0,0.18)`) → z 0
- `.bp-card::before` = **top white scrim** `linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 55%)` → z 1. This is what makes the dark text legible on the photo; it's still present.
- `.bp-text-block` (brand row + tagline + CTA) → z 2
- `.bp-cutout` (audience cut-out) → z 3

**Design tokens / invariants used throughout:**
- **Corner radius `13px`** is the de-facto card radius — the chip and cut-out match it.
- **Hairline `#E7E7F1`** is the shared 1px stroke color.
- **Per-card audience tint** (used by older label versions; keep for consistency if you reintroduce tinted labels): Columbus `#015C94`, Elio `#1E6BAE`, Research `#4B7BC7`.
- Columbus wordmark navy `#0F173C` (also the chip text color currently). Card ink `#0B1B2B`.
- Brand logos are recolored via filter chains (`COLUMBUS_LOGO_FILTER`); the Elio wordmark is an image recolored to navy via `filter`.

**The "cut-out / notch" geometry (how the corner cut works):** a cut-out reads as a notch because it's **flush to two card edges** (the "opening", borderless) while the **inward edges carry the hairline**. Convex corners where the cut meets a card edge were historically eased by **fillets** — 13×13 pseudo-element boxes (`::before`/`::after`) positioned just outside the notch at `-13px`, painted with a `radial-gradient(circle at <corner>, transparent 11.5px, #E7E7F1 12.25–12.75px, #FFFFFF 13.5px)` that both rounds the corner AND carries the hairline arc across it. Mirroring the desktop top-right notch to other corners = flip the gradient origin (`left bottom` ↔ `right bottom`) and reposition the fillets. **The fillets were removed in the current tree** (they read as "lines extending beyond"), so the current cut-out has simple `border-right`/`border-bottom` + a concave `border-radius` BR corner only.

**The corner "bleed" trick:** to make an element sit *flush in the card's corner* despite the card's padding, give it negative margins that cancel the padding. The cut-out uses `margin-left/top` = `-(card_padding − 1)` so its top/left land exactly on where the old hairline ring was (1px inset): `-27px` (<640) / `-31px` (≥640) / `-39px` (≥1024). If you reintroduce anything corner-flush, it **must** track these three padding breakpoints.

---

## 6. Gotchas (things that bit us — read before editing)

- **Backticks inside the `CSS` string break the build.** The styles are a JS template literal (`` const CSS = `…` ``). A stray backtick in a CSS *comment* (e.g. writing `` `right bottom` ``) terminates the literal → "Parsing ecmascript source code failed". Use quotes in comments.
- **Dev server** runs at `http://localhost:3000` (also 3001). After an edit, the first `curl` may race recompilation — re-fetch once; a 200 + expected class/text in the HTML confirms it compiled.
- **The shared Playwright MCP browser is usually locked** by another session ("Browser is already in use … use --isolated"). Workaround that worked every time: drive an **isolated headless Chromium** via a tiny node script using the repo's installed `playwright`. Pattern:
  ```js
  import { chromium } from 'playwright';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:375,height:1600}, deviceScaleFactor:3 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/', { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3500);                       // let it hydrate
  const card = page.locator('section[aria-label="Our products"] .bp-card').first();
  await card.waitFor({ state:'visible' });               // element re-renders on hydration; wait for it
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  await page.screenshot({ path:'x.png', clip:{ x:box.x-6, y:box.y-6, width:240, height:130 } });
  ```
  Use `waitUntil:'domcontentloaded'` (not `networkidle` — it times out), then a fixed wait + `waitFor visible`. Zoom into the corner at `deviceScaleFactor: 3–4` to judge 1px-level issues. **Always delete scratch `.mjs`/`.png` files afterward** (they otherwise litter `git status`).
- **Verify at 320 / 375 / 414 / 800 / 1280px.** 1024px is the desktop breakpoint; 800px is single-column tablet; 320px is the tightest phone.
- **Per-breakpoint padding bleed** (see §5) — forgetting the ≥640/≥1024 margin overrides leaves the corner element not-flush on tablet/desktop.
- **Two `<footer>` and other site-wide gotchas** are in agent memory (`MEMORY.md`), not relevant here but worth a glance.

---

## 7. Project constraints to honor

- **No purple/violet/indigo/fuchsia anywhere**, ever (hard rule — see `feedback_no_purple_ever` memory).
- Match **existing on-page visuals**, not abstract specs: 13px corners, `#E7E7F1` hairline, navbar-style CTAs, blue-on-white palette.
- Mobile-first: unless told otherwise, instructions are **mobile-only** (the audience work has bounced between "mobile only <1024px" and "all breakpoints" — confirm scope with the user each time).
- Don't render a per-page `<Footer/>` etc. — global layout concerns live elsewhere.

---

## 8. How to verify a change end-to-end

1. Edit `components/home/BentoProducts.tsx` (styles in the `CSS` string, markup in `BentoProducts()`).
2. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → expect `200`; re-fetch once if it races.
3. Headless-screenshot the bento at 375 + 1280 + a corner zoom (see §6). Confirm: audience reads clearly; no stray border lines extending out of any label/cut-out; gaps look intentional; **desktop ≥1024px 2-col grid + image peek + Research lattice still intact**.
4. Clean up scratch files. Leave it uncommitted unless the user asks to commit (they commit deliberately; the liked checkpoint is `bdd0fc2`).

---

## 9. Where things stand / open questions

- Current uncommitted version = **cut-out + flush pill, fillets & card-ring removed, card drop-shadow added** (§3). Verdict pending.
- The **card hairline → drop shadow** swap is global; if the user wants the flat hairline look back, you'll need a different approach to the "border lines extending beyond" problem (e.g., keep the ring but clip/mask it around the cut-out, or drop the cut-out entirely).
- If the exploration stalls, the **safe, user-approved answer is `bdd0fc2`** (audience in subtitles, no label).
