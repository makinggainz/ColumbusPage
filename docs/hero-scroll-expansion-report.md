# Products Hero — Scroll-Driven Background Expansion (Unresolved)

## Goal
As the user scrolls down on `/products`, the `BeachLanding.png` hero background image should animate from its current inset/contained state (with gaps on top, left, right) to filling the entire viewport edge-to-edge.

## Current State
- **File**: `components/products/Hero.tsx`
- **Background**: `BeachLanding.png` set via `backgroundImage` on the `<section>` element (line ~611)
- **Section**: `sticky top-0`, `height: 100vh`, `width: 100vw`, `marginLeft: calc(-50vw + 50%)`
- **Outer container**: `height: calc(100vh + 200vh)`, `marginTop: -32` — provides 200vh of scroll space
- **The image currently has visible gaps**: ~68px top gap (below navbar), ~5.5% left/right gaps

## Existing Scroll System
The component already has a scroll-driven animation system (line ~500, `onScroll` handler):
- `raw` progress (0→1) computed from `outerContainerRef.getBoundingClientRect().top` over `2 * innerHeight`
- Drives: phone spring physics, phone transition animation (move to center, pop, fade), content fade, wind explosion at 65%
- Registered via `window.addEventListener("scroll", onScroll, { passive: true })` in a `useEffect([], [])`

## What Was Tried

### Attempt 1: `clip-path` on the `<section>` element
- Added `sectionRef` (`useRef<HTMLElement>(null)`) to the `<section>`
- Set initial inline style: `clipPath: "inset(68px 5.5% 0 5.5%)"`
- In `onScroll`, used first 30% of `raw` to interpolate clip-path to `inset(0 0 0 0)` via ease-out cubic
- **Result**: Animation did not work. The clip-path did not visually change on scroll.

### Attempt 2: `clip-path` on the outer container div
- Moved `clipPath` from section to the outer `div` (`outerContainerRef`)
- Updated scroll handler to use `el` (already confirmed non-null) instead of `sectionRef.current`
- **Result**: Animation still did not work.

### Reverted
Both attempts were reverted. The code is clean — no clip-path logic remains.

## Possible Root Causes (Not Yet Verified)

### 1. `position: sticky` may not be working
- The `<main>` element has `className="overflow-x-hidden"` which sets `overflow-x: hidden`
- CSS spec: `overflow: hidden` (or `auto`/`scroll`) on an ancestor can break `position: sticky`
- Even `overflow-x: hidden` alone may cause browsers to implicitly set `overflow-y: auto`, creating a new scroll container that breaks sticky
- **If sticky is broken**, the section scrolls away normally, and the scroll progress (`raw`) may not behave as expected
- **Test**: In DevTools, check if the `<section>` actually stays fixed at the viewport top during scroll. If it scrolls away, sticky is broken.
- **Fix if confirmed**: Remove `overflow-x-hidden` from `<main>` (or use `overflow-x: clip` which doesn't break sticky), or restructure the DOM so the sticky element isn't a descendant of the overflow container

### 2. `SectionWithLabel` wrapper interference
- The Hero component is wrapped in `<SectionWithLabel>` which renders `<section className="relative">` around it
- This creates an additional containing block between `<main>` and the sticky section
- The sticky section's scroll container might be this wrapper rather than the viewport
- **Test**: Temporarily remove the `SectionWithLabel` wrapper around Hero in `app/products/page.tsx`

### 3. Scroll progress (`raw`) may never increase
- `raw` depends on `outerContainerRef.getBoundingClientRect().top` going negative
- If the outer div starts at `top: 0` (or very close) and the page doesn't scroll (e.g., because viewport is tall enough to show everything), `raw` stays at 0
- **Test**: Add `console.log(raw)` inside `onScroll` to verify values during scroll

### 4. `clip-path` on a `100vw` element with `marginLeft` hack
- The section uses `width: 100vw` + `marginLeft: calc(-50vw + 50%)` to break out of its parent
- Clip-path coordinates are relative to the element's border box
- If the element's visual position doesn't match its layout position (due to negative margin), clip-path inset values may not produce the expected visual result
- **Test**: Try applying clip-path without the 100vw/marginLeft hack first

## Recommended Next Steps
1. **Debug sticky**: Open DevTools, scroll the page, check if the `<section>` stays pinned at `top: 0`. If not, fix the overflow/sticky conflict first.
2. **Debug raw**: Add a temporary `console.log("raw:", raw)` in the `onScroll` handler to verify scroll progress is actually changing.
3. **Isolate clip-path**: Create a minimal test — a simple `div` with `clip-path: inset(50px)` and a scroll handler that sets it to `inset(0)`. Verify clip-path animation works in isolation before integrating into the complex Hero component.
4. **Alternative approach**: Instead of clip-path, consider using CSS `transform: scale()` + `border-radius` on a wrapper div, or using a separate absolutely-positioned background div whose dimensions animate.

## Reference: Working Pattern
The home page's `SiteSelection` component (`components/home/SiteSelection.tsx`) successfully uses the same clip-path expansion approach. Key differences:
- Its outer wrapper uses `width: 100vw` + `marginLeft: calc(-50vw + 50%)` (same)
- It has its own dedicated scroll `useEffect` with `requestAnimationFrame` tick loop (different — uses rAF lerp, not direct scroll event)
- The clip-path is on the wrapper div that contains the image, not on the sticky section itself
- No `overflow-x-hidden` on its ancestor `<main>`
