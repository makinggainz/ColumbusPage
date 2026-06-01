"use client";

/* Rounded, shadowed map thumbnail. Used by row 1 (large hex-bin pane) and
   row 3 (smaller comparison-card thumbnails). The map renders as an
   <Image fill> (via MapBgImage) so the optimizer ships an AVIF instead of
   the raw multi-MB PNG the old CSS background-image carried; the wrapper
   keeps its radius / shadow / vibrancy filter. */

import MapBgImage from "../MapBgImage";

export type MapThumbProps = {
  src: string;
  alt?: string;
  aspectRatio?: string;
  radius?: string;
  shadow?: boolean;
};

export default function MapThumb({
  src,
  alt = "",
  aspectRatio = "16 / 10",
  radius = "var(--ent-radius-card)",
  shadow = true,
}: MapThumbProps) {
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: radius,
        overflow: "hidden",
        /* Vibrancy lift — brings muted industry maps (residential weather,
           geomarketing predict-future, academic choropleths) up to the
           saturation level of the CRE reference map. Applied to the wrapper
           so it carries onto the <Image> below just as it did the bg. */
        filter: "saturate(1.2) contrast(1.08)",
        boxShadow: shadow ? "var(--ent-shadow-card)" : "none",
      }}
    >
      <MapBgImage src={src} />
    </div>
  );
}
