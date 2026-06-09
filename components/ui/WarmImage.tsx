"use client";

import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import { useMediaWarm } from "@/components/ui/MediaPrefetcher";

/**
 * A below-fold `fill` image with blur-up + warm-promotion (see
 * MEDIA_LOADING_PLAYBOOK.md §1). Requires a static-import `src` so next/image
 * emits a real low-res `blurDataURL` — the box is never empty, it paints the
 * blur instantly. Loads `lazy` during first paint (no LCP contention), then
 * promotes to `eager` once <MediaPrefetcher> flips the page warm (post-load +
 * idle), so the full-res AVIF is decoded before the user scrolls to it.
 *
 * Parent must be `position: relative` (next/image `fill` requirement).
 * `object-fit` is supplied either via `style` or a CSS rule on the rendered
 * `<img>` — pass `style={{ objectFit: "cover" }}` when there's no CSS for it.
 */
export function WarmImage({
  src,
  sizes,
  alt = "",
  style,
  className,
}: {
  src: StaticImageData;
  sizes: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}) {
  const warm = useMediaWarm();
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      placeholder="blur"
      loading={warm ? "eager" : "lazy"}
      fetchPriority={warm ? "low" : undefined}
      style={style}
      className={className}
    />
  );
}

export default WarmImage;
