# Media-Loading Playbook (ColumbusPage)

A self-contained spec for making any page **always fast (good LCP)** AND
**load all media reliably on first run** (no pop-in, no grey skeleton boxes).
Hand this file to any AI/engineer to replicate the exact treatment already
shipped on the **homepage** and the **consumer/Elio page**, or to apply it to
a new page.

- Branch: `experimentV6-Gdesign`
- Reference commits: `4ece77e` (homepage), `0f062a8` (consumer page)
- Stack: Next.js 16 (App Router) + React 19. `next.config.ts` already serves
  AVIF+WebP with a 1-year cache, so **every `next/image` is automatically
  AVIF** — most of the work is routing raw assets through it + orchestration.

---

## 0. The goal & the strategy (decided with the product owner)

Two requirements that pull against each other — satisfy BOTH:
1. **Fast LCP**: the hero/above-the-fold image must paint ASAP and nothing
   below the fold may contend with it during first paint.
2. **Guaranteed completeness**: on first run, every below-fold image/video must
   be fully loaded by the time the user scrolls to it.

The resolution is a **tiered load + eager prefetch-all**:
- Hero loads first (preloaded, high priority). Below-fold media stays lazy
  during first paint (no LCP contention).
- After `window.load` + the main thread goes idle, a `MediaPrefetcher` flips a
  global "warm" flag; every below-fold image promotes itself `lazy → eager` and
  the footer video pre-buffers. So everything is decoded before the user scrolls.

Standing decisions (apply unless told otherwise):
- **All breakpoints** (loading logic is device-wide).
- **Progressive blur-up, NO source downgrade**: use Next **static imports** so a
  real low-res `blurDataURL` paints instantly then swaps to the full-res AVIF.
  Never permanently shrink the source PNGs.
- **Eager prefetch-all** after load+idle; skip entirely on data-saver.

---

## 1. Reusable utilities (already in the repo — DO NOT re-create)

### `components/ui/MediaPrefetcher.tsx`
Module-level warm store + the prefetcher. Exports:
- `useMediaWarm(): boolean` — subscribe (via `useSyncExternalStore`). Returns
  `false` on SSR + first client render (no hydration mismatch), flips `true`
  after load+idle.
- `markMediaWarm()` — idempotent flag flip (used internally).
- `<MediaPrefetcher/>` — render **once** near the end of a page. After
  `window.load` (or immediately if `document.readyState === "complete"`) +
  `requestIdleCallback` (setTimeout fallback), and **only if not**
  `navigator.connection.saveData`, it calls `markMediaWarm()` then, on a later
  idle tick, pre-buffers `document.querySelector("video[data-footer-video]")`
  (sets `preload="auto"; load()` unless already `auto`).

### `components/ui/ImageWithFallback.tsx`
Drop-in `next/image` wrapper that shows a neutral skeleton while decoding and
keeps it on error. **Already patched** with an `img.complete` `useEffect` so a
cached image (reload/back-forward) never leaves the skeleton stuck. Use it for
decorative full-bleed watermark/backdrop images that want a graceful fallback.

### The warm-promotion pattern (the core idiom)
Any below-fold `next/image` becomes "warm-aware" like this:
```tsx
const warm = useMediaWarm();
// ...
<Image
  src={img}                                  // static import → AVIF + blur-up
  alt=""
  /* fill OR width/height */
  sizes="…"
  placeholder="blur"                         // only with a static import
  loading={warm ? "eager" : "lazy"}
  fetchPriority={warm ? "low" : undefined}
/>
```
- **Absolutely-positioned media** (backdrops, phone screens): use `<Image fill>`
  and put `objectFit`/`objectPosition`/`opacity`/`transition` in `style` (fill
  already supplies `position:absolute; inset:0; width/height:100%`). Parent must
  be `position: relative`.
- **Fixed-size media** (avatars, mockups): use `<Image width={W} height={H}>`
  (or static import for intrinsic dims) + keep the existing `className`/`style`.

---

## 2. The 7 defect classes to hunt for on a page

1. **Hero dual-variant double-fetch** — two hero `<Image>` (desktop+mobile),
   BOTH `priority`/`fetchPriority="high"`, one hidden by CSS `display:none`.
   `priority` preloads BOTH → the hidden one wastes bandwidth & contends with LCP.
2. **Harmful below-fold preloads** — `<link rel="preload" as="image">` for
   heavy/raw images that are below the fold (steals first-paint bandwidth).
3. **CSS `background-image: url('/x.png')`** in styled template strings — bypasses
   the AVIF optimizer; ships raw multi-MB PNG.
4. **Plain `<img>`** for non-trivial images — no AVIF, no dimensions (CLS), no
   loading control.
5. **Below-fold pop-in** — `next/image` that's lazy with no idle warming.
6. **No `MediaPrefetcher`/`useMediaWarm`** mounted on the page.
7. **`<video>`** with no poster + no reliable pre-buffer (or a heavy autoplay).

Also: **stuck grey skeleton** — `ImageWithFallback` (or any onLoad-gated overlay)
that never clears on cached loads. (Already fixed globally in `ImageWithFallback`.)

---

## 3. Fix patterns (copy-paste)

### A. Hero LCP — one variant per viewport (media-scoped preload)
If the hero renders TWO viewport variants, do **not** mark both `priority`.
Drop `priority`/`fetchPriority` from the `<Image>`s (keep them `lazy` so the
hidden `display:none` variant never fetches), and emit **media-scoped** preload
links whose srcset matches the optimizer URL the `<Image>` requests:
```tsx
const DEVICE_SIZES = [640,750,828,1080,1200,1287,1920,2048]; // = next.config deviceSizes
const srcSet = (src: string, q: number) =>
  DEVICE_SIZES.map(w => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q} ${w}w`).join(", ");

<link rel="preload" as="image" media="(min-width: 768px)"
      imageSrcSet={srcSet("/HeroDesktop.png", 80)} imageSizes="100vw" fetchPriority="high" />
<link rel="preload" as="image" media="(max-width: 767px)"
      imageSrcSet={srcSet("/HeroMobile.png", 80)} imageSizes="100vw" fetchPriority="high" />
```
React 19 hoists the `<link>`s to `<head>`. The `media` attr means only the
matching variant fetches. **Verify** the preloaded URL equals the `<img>`'s
chosen srcset URL (else you get a silent double-fetch).

> If the hero is already a **single** variant `<Image … priority>` (like the
> consumer page), leave it — it's correct.

### B. CSS background PNG → `<Image fill>` (+ tint)
Remove the `background-image: url()` photo layer. Render `<Image fill>` as the
**first child** of the card, recreate any gradient overlay as a sibling tint
`<div>`, and **bump the existing scrim/overlay `z-index` up by one** so it stays
above the image. Image+tint at `z-index:0`, scrim at `1`, content `2`, etc.

### C. Plain `<img>` / data-array image → static-import `<Image>`
```tsx
import hero from "@/public/consumer/heroBackground.png"; // @/* → ./*
// <img src="/consumer/heroBackground.png" …>  becomes:
<Image src={hero} … placeholder="blur" loading={warm?"eager":"lazy"} fetchPriority={warm?"low":undefined} />
```
For images held in a **data array** (`LABELS`, `PHONE_IMAGES`, avatar lists),
change the array entries to the static imports (type `StaticImageData`).

### D. Mount the prefetcher (once per page)
```tsx
import { MediaPrefetcher } from "@/components/ui/MediaPrefetcher";
// …at the end of the page's root element:
<MediaPrefetcher />
```
Then add `const warm = useMediaWarm();` to **every component** that renders
below-fold images (including sub-components defined in the same file) and apply
the warm-promotion pattern (§1) to each image.

### E. `<video>` — poster + prefetch hook
Add `poster="/x-poster.jpg"` (generate with
`ffmpeg -i public/x.mp4 -frames:v 1 public/x-poster.jpg`) and a
`data-footer-video` attribute (or similar) so `MediaPrefetcher` can pre-buffer
it. If a scroll gate also calls `video.load()`, guard it to skip when
`video.preload === "auto"` (don't restart a download the prefetcher began).

---

## 4. Per-page recipe (step by step)

1. **Find the route file** (`app/**/page.tsx`) and list every section component
   top-to-bottom. For each, inventory all media (Image/img/video/CSS-bg/SVG) and
   note the `/public` file sizes (`ls -laS public/...`).
2. **Hero (Tier A)**: fix dual-variant preload (§3A) if present; else leave a
   correct single-variant `priority` hero alone. Above-fold non-hero images stay
   eager/high but convert to `next/image`.
3. **Tier B — convert delivery**: every heavy raw `<img>` and CSS-bg PNG →
   `next/image` (§3B/§3C) with static-import **blur-up**. Heavy = anything ≳300KB
   (phone mockups, backdrops, big avatars, globes). Small icons/chips can stay.
4. **Tier C — warm**: mount `<MediaPrefetcher/>` (§3D); thread `useMediaWarm()`
   into all below-fold-rendering components; apply warm-promotion to each image.
5. **Tier D — video** (§3E) if any. WebGL/canvas that already pauses offscreen:
   leave it.
6. **Verify** (§5). **Commit** staging ONLY source files + any generated poster
   (never the stray screenshot PNGs in the repo).

---

## 5. Verification (no Playwright needed — works headless via curl)

Run the dev server (it hot-reloads). A fresh request compiles current code.
```bash
# 1) Types compile (NOTE: *.png imports resolve to `any`, so tsc CANNOT catch a
#    wrong static-import path — verify paths exist separately, see below).
npx tsc --noEmit            # expect 0 errors

# 2) No leftover raw <img> in the converted files
grep -c "<img " components/products/Hero.tsx   # expect 0

# 3) Every @/public static import points at a real file (catches the #1 pitfall)
grep -rhoE 'from "@/public/[^"]+"' <files> | sed -E 's/from "@\/(public\/[^"]+)"/\1/' \
  | while read p; do [ -f "$p" ] && echo "OK $p" || echo "MISS $p"; done

# 4) Page renders 200, no error overlay
curl -s http://127.0.0.1:3000/<route> -o /tmp/p.html -w "HTTP %{http_code}\n"
grep -ic "Module not found\|Unhandled Runtime Error" /tmp/p.html   # expect 0

# 5) Heavy assets now serve AVIF (and are tiny). Grab the optimizer URL from the
#    HTML, then request a representative width:
#    curl -s -o /dev/null -w "%{content_type} %{size_download}\n" \
#      -H "Accept: image/avif,*/*" "http://127.0.0.1:3000<optimizer-url>&w=1080&q=75"
#    expect: image/avif  and ~50–120KB (was multi-MB PNG)

# 6) Blur-up placeholders present
grep -oc 'data:image/' /tmp/p.html   # expect several

# 7) Hero LCP preload still emitted (single variant or media-scoped)
grep -o 'rel="preload"[^>]*<heroAsset>[^>]*' /tmp/p.html
```
If a Playwright browser is free, also screenshot-diff the page (esp. any
sticky-scroll choreography) at mobile + desktop to confirm pixel-parity.

---

## 6. Pitfalls (learned the hard way — read before you start)

1. **Backticks inside a CSS template literal break the file.** Many components
   hold CSS in a `` const CSS = `…` `` string. If you add a comment containing a
   backtick (e.g. `` `background-image: url()` ``), it terminates the template and
   the rest parses as TS garbage. Use plain quotes in CSS comments.
2. **`tsc` will NOT catch a wrong `@/public/...` static-import path** — the
   `*.png` module declaration resolves to `any`, so a bad path compiles fine and
   only fails at runtime with a 500 "Module not found". Always run the
   file-existence check (§5 step 3). (Real example: `forYourTravels.png` lives at
   `public/consumer/forYourTravels.png`, not `public/forYourTravels.png`.)
3. **Hero hidden variant must stay `lazy`, not `eager`.** `loading="eager"` on a
   `display:none` image still fetches it → reintroduces the double-fetch. Lazy +
   `display:none` is what prevents the hidden variant from loading; the
   media-scoped preload handles priority for the visible one.
4. **`placeholder="blur"` needs a static import** (or an explicit `blurDataURL`).
   With a plain string `src` it errors. Data-array string srcs: either switch the
   array to static imports, or skip blur and rely on warm-promotion.
5. **`<Image fill>` needs a positioned parent** and you must move
   `objectFit`/`objectPosition`/`opacity`/`transition` into `style` (drop the old
   `position/inset/width/height` — fill supplies them). Keep opacity-crossfade
   inline styles verbatim so sticky-scroll choreography is unchanged.
6. **Don't double-load the footer video.** Guard the scroll gate's `load()` with
   `if (video.preload !== "auto")`.
7. **Commit hygiene**: the repo accumulates stray `*.png` screenshots + a
   `design-extract-output/` dir. Stage source files (and generated posters)
   **explicitly by path** — never `git add -A`.

---

## 7. Status — what's DONE vs TODO

**DONE** (don't redo):
- **Homepage** `app/page.tsx` (`4ece77e`): HeroNew media-scoped preload; bento
  backdrops + Careers map → AVIF `<Image>`; blur-up on watermarks/bento/careers;
  `MediaPrefetcher` mounted; footer video poster + `data-footer-video`;
  `ImageWithFallback` cached-load fix (global). Wins: bento 1.6MB→47KB,
  Careers map 1.8MB→17KB AVIF.
- **Consumer/Elio page** `app/products/consumer/page.tsx` (`0f062a8`): Hero phone
  mockups + scene backdrops (incl. 6.3MB beach→104KB AVIF), MobilePhone,
  NotifCard avatars, DestinationsSection Friends/carousel avatars + bento mockups,
  FinalCTA globe — all `next/image` + blur-up + warm; `MediaPrefetcher` mounted.
- **Business page** `app/products/business/page.tsx` (`4a0d13f`): the most
  image-dense page (~130 industry PNGs / 6 industries). New shared helper
  `components/business/MapBgImage.tsx` converts the raw-PNG **CSS
  `background-image` maps/backdrops** → AVIF `<Image fill>` + warm in the shared
  primitives (`MapThumb`, `MapLayeredVisual` ×3, `SuperFeatureSection` SkyBackdrop,
  `SmartLayerRow`); static-import blur-up on bounded images (SolutionShowcase,
  CapabilitiesGrid, Comparison/Chat/Banner backdrops, 4 mockup chrome frames);
  `MapChatPlatform` chrome priority became an `eager` prop (hero passes it,
  reused below-fold instances stay warm-gated); `MediaPrefetcher` mounted. Wins:
  becomeartistMap 6.1MB→260KB, SuperModelback 3.9MB→124KB, res-bg-1 1.9MB→119KB AVIF.
- **Research page** `app/research/page.tsx` (`7a6d104`): renders the shared
  `TechnologyPage` (server components), so a client wrapper
  `components/technology/redesign/WarmTechImage.tsx` (general next/image +
  warm-promotion passthrough) injects warming into the RSC sections. Converted
  the heavy plain `<img>` (techDiagram 519KB, the Columbus/Elio/competitor logos)
  → static-import next/image (AVIF + blur-up on the large ones); warm-gated the
  existing next/image (Voyager, timeline markers, blog cards); `MediaPrefetcher`
  mounted on `/research` only (the AVIF conversions also benefit `/technology`,
  which renders the same component without the prefetcher). Wins: meta
  184KB→1.4KB, logobueno 150KB→2.2KB, techDiagram 519KB→197KB AVIF. Left as-is:
  the WebGL hero, the `techpg-radiance.png` `::before` CSS bg (pseudo-element —
  can't be a next/image node), and 2–7KB model icons.
- Shared utilities: `components/ui/MediaPrefetcher.tsx`, the
  `ImageWithFallback.tsx` fix. **Reuse these as-is.** For a page whose maps/photos
  are painted as CSS `background-image`, reuse `components/business/MapBgImage.tsx`
  (or copy the pattern). For server-component sections that can't call
  `useMediaWarm()`, use a thin client passthrough like
  `components/technology/redesign/WarmTechImage.tsx`. NOTE: a `::before`/`::after`
  **pseudo-element** background can't be converted to next/image (no DOM node) —
  leave it, or restructure the element to carry a real child Image.

**TODO** (apply this playbook): remaining routes — e.g.
`app/technology` (mostly covered by the shared TechnologyPage conversions; just
needs its own `MediaPrefetcher` mount), `app/company`, `app/blog`,
and any other `app/**/page.tsx`. Each: run §4 recipe, §5 verify.
`MediaPrefetcher`/`useMediaWarm`/`ImageWithFallback` already exist — just import
and apply. (Note: a CSS-`background-image: url()` map/photo is defect class #3 —
convert it, don't just warm it; warming can't help a CSS background.)

### Parallelizing across multiple AIs
Give each AI a **different route** (one page per worktree/branch) to avoid edit
conflicts — the shared utilities are already committed, so page work is
independent. Each AI: read §1–§3, run §4 on its page, verify with §5, then commit
only its page's files. Don't touch `components/ui/MediaPrefetcher.tsx` or
`ImageWithFallback.tsx` (shared, done).
