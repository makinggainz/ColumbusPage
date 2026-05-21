"use client";

/* Rounded, shadowed map thumbnail. Used by row 1 (large hex-bin pane) and
   row 3 (smaller comparison-card thumbnails). The image is set as a
   background so callers can size the slot freely without fiddling with
   <Image> width/height props. */

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
        width: "100%",
        aspectRatio,
        borderRadius: radius,
        overflow: "hidden",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: shadow ? "var(--ent-shadow-card)" : "none",
      }}
    />
  );
}
