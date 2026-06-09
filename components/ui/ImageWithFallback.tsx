"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Drop-in replacement for next/image that adds graceful loading states:
 *
 *   Non-blur path (no placeholder="blur"):
 *   1. Skeleton — a shimmer-animated surface fills the box while the image
 *      decodes. The skeleton fades out and the image fades in simultaneously
 *      once decoding completes, creating a smooth cross-fade.
 *   2. Fallback — if the request errors the skeleton stays instead of
 *      showing a broken-image glyph.
 *   3. Src-change reset — if the `src` prop changes (e.g. industry switching
 *      on the business page) the component resets to loading state so the
 *      incoming image fades in rather than snapping in.
 *   4. Cached-image fast-path — if the browser already has the image in
 *      cache, it is detected via useLayoutEffect (before first paint) and
 *      shown immediately at opacity:1 with no transition, so revisiting a
 *      page never plays a redundant fade-in on already-loaded assets.
 *
 *   Blur path (placeholder="blur"):
 *   Next.js blur-up handles the transition natively. This component
 *   steps aside completely — no skeleton overlay, no opacity on the
 *   image — so the two mechanisms don't fight each other.
 *
 * Visual identity: skeleton is `.skel-shimmer` (defined in globals.css).
 * The skeleton background is `--image-skel` (white by default) so it is
 * invisible against white pages and never produces a grey flash.
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
  // Set to true when the image was already in cache at mount time so the
  // fade-in transition is skipped — cached images should appear instantly.
  const skipTransitionRef = useRef(false);
  // Tracks the src seen on the previous render so the src-change effect
  // can distinguish a real prop change from the initial mount (and avoid
  // cancelling the cached-image layout-effect check on first render).
  const prevSrcRef = useRef(imageProps.src);
  // Timestamp recorded synchronously at mount (via useLayoutEffect) so
  // the onLoad handler can detect disk-cache hits — images that aren't
  // `complete` at layout time but fire onLoad within 150ms are treated as
  // effectively instant and also skip the fade-in transition.
  const mountTimeRef = useRef<number>(0);

  // When placeholder="blur" is in use, Next.js handles the full
  // blur→sharp transition natively. Step aside entirely.
  const useBlurPath = imageProps.placeholder === "blur";

  // Cached-image fast-path: runs synchronously before first paint via
  // useLayoutEffect. If the image is already complete (memory cache hit or
  // instant decode), set state to loaded NOW so the first painted frame
  // already shows the image at opacity:1 — no visible transition plays.
  // Also records mount time for the disk-cache heuristic in onLoad.
  useLayoutEffect(() => {
    mountTimeRef.current = performance.now();
    const node = imgRef.current;
    if (node?.complete) {
      skipTransitionRef.current = true;
      setState(node.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  // Src-change reset (non-blur path only): when the src prop changes the
  // previous image is gone but the component stays mounted. Reset to
  // "loading" so the skeleton re-appears and the new image fades in.
  // Skips the initial mount (prevSrcRef starts equal to src) so it does
  // not cancel the layout-effect cached check above.
  useEffect(() => {
    if (useBlurPath) return;
    if (prevSrcRef.current === imageProps.src) return;
    prevSrcRef.current = imageProps.src;
    skipTransitionRef.current = false;
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
          // Non-blur path: image fades in on load. Skip the transition for
          // cached images (skipTransitionRef) so they appear instantly.
          ...(useBlurPath
            ? {}
            : {
                opacity: state === "loaded" ? 1 : 0,
                transition:
                  state === "loaded" && !skipTransitionRef.current
                    ? "opacity 250ms ease-out"
                    : "none",
              }),
        }}
        onLoad={(event) => {
          // Disk-cache fast-path: onLoad fired within 150ms of mount,
          // meaning the image was already in disk cache (img.complete was
          // false at layout time only because the decode hadn't been
          // scheduled yet). Treat the same as a memory-cache hit and skip
          // the fade-in transition.
          if (!skipTransitionRef.current && performance.now() - mountTimeRef.current < 150) {
            skipTransitionRef.current = true;
          }
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
