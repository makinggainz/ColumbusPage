"use client";

import Image from "next/image";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";

/**
 * Drop-in replacement for a `background-image: url(<map>)` CSS layer.
 *
 * The business page's industry maps + sky backdrops were painted as CSS
 * background-images, which bypass the next/image optimizer entirely and
 * shipped as raw 2–6 MB PNG. This renders the same asset as an
 * `<Image fill>` so it's served as a small AVIF, and warm-promotes it
 * lazy→eager once the page is loaded + idle (via MediaPrefetcher) so it's
 * decoded before the user scrolls to it.
 *
 * Usage: drop it as a child of the existing wrapper that used to carry the
 * `backgroundImage` — keep that wrapper's `position: relative` (add it if it
 * was unpositioned), `overflow: hidden`, radius, shadow and any `filter`
 * (the filter applies to this image just as it did to the background). Then
 * delete the wrapper's `backgroundImage` / `backgroundSize` /
 * `backgroundPosition` declarations.
 *
 * `src` is a runtime string (industry data path), so there's no static
 * import and no blur-up here — the AVIF + warm-promotion is the win.
 */
export default function MapBgImage({
  src,
  position = "center",
  size = "cover",
  sizes = "(max-width: 1180px) 70vw, 760px",
}: {
  src: string;
  /** Mirrors the old `background-position`. */
  position?: string;
  /** Mirrors the old `background-size` (cover | contain | fill). */
  size?: "cover" | "contain" | "fill";
  sizes?: string;
}) {
  const warm = useMediaWarm();
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      fill
      sizes={sizes}
      loading={warm ? "eager" : "lazy"}
      fetchPriority={warm ? "low" : undefined}
      style={{ objectFit: size, objectPosition: position }}
    />
  );
}
