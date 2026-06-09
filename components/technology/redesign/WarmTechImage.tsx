"use client";

import Image, { type ImageProps } from "next/image";

import { useMediaWarm } from "@/components/ui/MediaPrefetcher";

/**
 * A `next/image` that warm-promotes itself (see MEDIA_LOADING_PLAYBOOK.md §1).
 *
 * The Technology/Research sections are server components, so they can't call
 * `useMediaWarm()` directly. This thin client wrapper injects the
 * warm-promotion (`lazy` during first paint → `eager` once <MediaPrefetcher>
 * flips the page warm post-load + idle) while passing every other next/image
 * prop straight through — so it works for `fill` and `width/height` images,
 * static-import (blur-up) or runtime-string `src` alike.
 *
 * Don't pass `priority` here (nothing on these pages is above the fold — the
 * hero is a WebGL canvas); `priority` would conflict with the injected
 * `loading`.
 */
export function WarmTechImage(props: ImageProps) {
  const warm = useMediaWarm();
  return (
    <Image
      {...props}
      loading={warm ? "eager" : "lazy"}
      fetchPriority={warm ? "low" : undefined}
    />
  );
}

export default WarmTechImage;
