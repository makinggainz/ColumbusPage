"use client";

/* Tiny shared helper — renders the real Columbus logo PNG, recoloured to
   dark navy via the same CSS filter used by MistxNav when on a light
   background. Used as the "Columbus is …" header glyph on every row. */
export default function ColumbusMark({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/logobueno.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      style={{
        display: "block",
        flexShrink: 0,
        objectFit: "contain",
        filter:
          "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
      }}
    />
  );
}
