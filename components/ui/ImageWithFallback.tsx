"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Drop-in replacement for next/image that adds graceful loading states:
 *
 *   Non-blur path (no placeholder="blur"):
 *   1. Skeleton — a shimmer-animated neutral surface fills the box while
 *      the image decodes. The skeleton fades out and the image fades in
 *      simultaneously once decoding completes, creating a smooth cross-fade
 *      rather than an abrupt snap-in.
 *   2. Fallback — if the request errors the skeleton stays instead of
 *      showing a broken-image glyph.
 *   3. Src-change reset — if the `src` prop changes (e.g. industry
 *      switching on the business page) the component resets to loading
 *      state so the incoming image fades in rather than snapping in.
 *
 *   Blur path (placeholder="blur"):
 *   Next.js blur-up handles the transition natively. This component
 *   steps aside completely — no skeleton overlay, no opacity on the
 *   image — so the two mechanisms don't fight each other.
 *
 * Visual identity: skeleton is `.skel-shimmer` (defined in globals.css) —
 * a 90° gradient highlight that sweeps left→right every 1.4 s. Degrades
 * to flat `--image-skel` grey when `prefers-reduced-motion: reduce`.
 *
 * Container requirements: when using `fill`, the parent must be
 * `position: relative` (already required by next/image itself). The
 * skeleton is `position: absolute; inset: 0` so it paints across the
 * parent.
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
  const imgRef = useRef<HTMLImageElement | null>(null);

  // When placeholder="blur" is in use, Next.js handles the full
  // blur→sharp transition natively. Step aside entirely.
  const useBlurPath = imageProps.placeholder === "blur";

  // Cached-image recovery: if the <img> is already `complete` before
  // React attaches `onLoad` (reload / back-forward / warm cache), the
  // load event already fired and `onLoad` will never run. Reconcile on
  // mount so a cached image clears state immediately.
  useEffect(() => {
    const node = imgRef.current;
    if (node?.complete) {
      setState(node.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  // Src-change reset (non-blur path only): when the src prop changes
  // the previous image is gone but the component stays mounted. Reset
  // to "loading" so the skeleton re-appears and the new image fades in.
  useEffect(() => {
    if (useBlurPath) return;
    setState("loading");
  }, [imageProps.src]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!useBlurPath && (
        <div
          aria-hidden
          className={`skel-shimmer${fallbackClassName ? ` ${fallbackClassName}` : ""}`}
          style={{
            position: "absolute",
            inset: 0,
            // Opacity drives the exit — skeleton stays in the DOM so the
            // 300ms ease-out transition actually plays (conditional unmount
            // would kill the transition before it starts).
            opacity: state === "loaded" ? 0 : 1,
            transition: "opacity 300ms ease-out",
            pointerEvents: "none",
            // Caller-supplied fallbackStyle (e.g. a gradient) overrides the
            // .skel-shimmer background via inline > class specificity.
            ...fallbackStyle,
          }}
        />
      )}
      <Image
        {...imageProps}
        ref={imgRef}
        style={{
          ...imageProps.style,
          // Non-blur path: image fades in on load. `transition: none` on
          // the loading state prevents an accidental 0→0 animation on
          // first render. The 250ms fade and the 300ms skeleton fade-out
          // overlap, producing a smooth cross-fade rather than a gap.
          ...(useBlurPath
            ? {}
            : {
                opacity: state === "loaded" ? 1 : 0,
                transition:
                  state === "loaded" ? "opacity 250ms ease-out" : "none",
              }),
        }}
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
