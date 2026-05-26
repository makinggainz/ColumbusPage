"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * Drop-in replacement for next/image that adds two graceful UI states:
 *
 *   1. Skeleton — while the image is decoding, a neutral surface fills
 *      the same box so the layout doesn't jump and the viewer isn't
 *      staring at a transparent gap. The skeleton fades out the moment
 *      the image finishes decoding (`onLoad`). For LCP images, this is
 *      visible for only a few frames; for below-the-fold images on
 *      slow networks it bridges the loading window.
 *
 *   2. Fallback — if the request errors (CDN miss, broken URL, blocked
 *      by content filter), the skeleton sticks instead of leaving a
 *      broken-image glyph. Callers can pass `fallbackClassName` /
 *      `fallbackStyle` for a custom error surface, but the default is
 *      the same neutral surface, so a 4xx looks indistinguishable from
 *      a 200 that just hasn't decoded yet.
 *
 * Visual identity: the skeleton is a flat neutral grey
 * (token: `--image-skel`) — no shimmer animation. The brief was
 * "without changing any of the UI"; a quiet grey block during the
 * decode window matches what the browser would already render for a
 * background-image-less wrapper.
 *
 * Container requirements: when using `fill`, the parent must be
 * `position: relative` (this is already required by next/image
 * itself). The skeleton is `position: absolute; inset: 0` so it
 * paints across the parent.
 */
type Props = ImageProps & {
  /** Override class for the skeleton + error surface. */
  fallbackClassName?: string;
  /** Override inline style for the skeleton + error surface. */
  fallbackStyle?: React.CSSProperties;
};

export function ImageWithFallback({
  fallbackClassName,
  fallbackStyle,
  onLoad,
  onError,
  ...imageProps
}: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  const showSurface = state !== "loaded";

  return (
    <>
      {showSurface && (
        <div
          aria-hidden
          className={fallbackClassName}
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--image-skel, #ECECEE)",
            transition: "opacity 200ms ease-out",
            opacity: 1,
            pointerEvents: "none",
            ...fallbackStyle,
          }}
        />
      )}
      <Image
        {...imageProps}
        onLoad={(event) => {
          setState("loaded");
          onLoad?.(event);
        }}
        onError={(event) => {
          setState("error");
          onError?.(event);
        }}
      />
    </>
  );
}

export default ImageWithFallback;
