/**
 * Hero asset registry — the single source of truth for every primary route's
 * above-the-fold hero image. Page render, the page's own `<link rel=preload>`,
 * and the cross-page `<HeroPrefetcher>` all derive their optimizer URL from
 * here, so the three can never drift apart and a prefetched hero is always an
 * exact HTTP-cache hit when the user navigates. See MEDIA_LOADING_PLAYBOOK.md.
 *
 * Why this exists: every page preloads its OWN hero, but nothing warmed the
 * NEXT page's hero — so navigating cold-fetched it (optimize + download +
 * decode) and the hero was briefly absent. HeroPrefetcher warms siblings into
 * cache while the current page idles; the blurDataURLs give an instant low-res
 * base so the area is never empty.
 */

/** == next.config.ts `deviceSizes`. The optimizer only emits these widths. */
export const HERO_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1287, 1920, 2048];

/**
 * Build the exact srcset the next/image optimizer serves for a `fill`/`100vw`
 * hero, so a hand-written preload or a JS `new Image()` prefetch requests the
 * same cache entry the rendered `<Image>` will. `src` is the optimizer `url=`
 * value — `import.src` for a static-import hero, or the literal /public path
 * for the getImageProps heroes left on a string src.
 */
export function heroOptimizerSrcSet(src: string, quality: number): string {
  return HERO_DEVICE_SIZES.map(
    (w) =>
      `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality} ${w}w`,
  ).join(", ");
}

/** `src` = the optimizer `url=` the page renders; `quality` MUST match the
    page's rendered quality or the prefetched URL won't be a cache hit. */
type HeroSrc = { src: string; quality: number; blurDataURL?: string };
export type HeroEntry = { desktop: HeroSrc; mobile?: HeroSrc };

export const HERO_ASSETS: Record<string, HeroEntry> = {
  "/": {
    desktop: { src: "/HomeHero.png", quality: 80 },
    mobile: { src: "/HomeHeroBackMobile.png", quality: 80 },
  },
  // Business + consumer render a string `src`, so the prefetch `src` must be the
  // literal /public path to match the optimizer url= they request.
  "/products/business": {
    desktop: { src: "/ColumbusBackgroundV2.png", quality: 80 },
  },
  "/products/consumer": {
    desktop: { src: "/consumer/heroBackground.png", quality: 80 },
  },
  // getImageProps heroes left on a string src — mirror their literal /public
  // paths + rendered quality (75). Cross-prefetched; no blurDataURL (their own
  // pages already preload + eager-load them).
  "/blog": {
    desktop: { src: "/ColumbusWorldLinesBG.png", quality: 75 },
    mobile: { src: "/BlogHeroMobile-v2.png", quality: 75 },
  },
  "/company": {
    desktop: { src: "/company-illustration-enhanced.png", quality: 75 },
    mobile: { src: "/company-illustration-enhanced-mobile.png", quality: 75 },
  },
  "/contact": {
    desktop: { src: "/contactbackimg.png", quality: 75 },
    mobile: { src: "/contactbackimg-mobile.png", quality: 75 },
  },
};
