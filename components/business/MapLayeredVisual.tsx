"use client";

/* Composes a map "context" panel with a data UI card anchored to the left.
   Two variants:
   - "full-bleed" (default): the map fills the surrounding rounded frame
     and a leader line + pin reach out from the card's right edge to a
     marker on the map — so the card reads as "data about this point on
     the map".
   - "floating": the map is a smaller rounded rectangle in the center-right
     of the frame with the surrounding backdrop (e.g. sky/cityscape) still
     visible on both sides; the card overlaps the map's left portion. No
     leader/pin — the card and map relate by overlap, not by connector. */
export default function MapLayeredVisual({
  map,
  alt = "",
  children,
  maxWidth = 460,
  variant = "full-bleed",
}: {
  map: string;
  alt?: string;
  children: React.ReactNode;
  maxWidth?: number;
  variant?: "full-bleed" | "floating";
}) {
  if (variant === "floating") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Floating map — centred-right rounded rectangle, leaves the
            parent backdrop visible around it. The card overlaps its left
            edge so most of the visible map sits to the card's right. */}
        <div
          aria-label={alt || undefined}
          role={alt ? "img" : undefined}
          style={{
            position: "absolute",
            top: "4%",
            bottom: "4%",
            left: "33%",
            right: "10%",
            borderRadius: "var(--ent-radius-2xl)",
            overflow: "hidden",
            backgroundImage: `url(${map})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "var(--ent-shadow-card)",
          }}
        />

        {/* Card — anchored to the left of the frame, vertically centred,
            sits on top of the map's left portion. */}
        <div
          style={{
            position: "absolute",
            left: "clamp(12px, 2vw, 28px)",
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            maxWidth,
            zIndex: 1,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Map fills the entire visual frame */}
      <div
        aria-label={alt || undefined}
        role={alt ? "img" : undefined}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "var(--ent-radius-2xl)",
          overflow: "hidden",
          backgroundImage: `url(${map})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow:
            "0 0 0 1px rgba(11, 27, 43, 0.06), 0 24px 60px rgba(11, 27, 43, 0.20)",
        }}
      />

      {/* Card + connector group, anchored to the left of the frame and
          vertically centered. The connector emerges from the card's right
          edge and lands on a pin marker further to the right. */}
      <div
        style={{
          position: "absolute",
          left: "clamp(12px, 2vw, 28px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: "100%",
          maxWidth,
        }}
      >
        <div style={{ position: "relative" }}>
          {children}

          {/* Leader line — short white hairline from card right edge */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "100%",
              top: "50%",
              width: "clamp(28px, 5vw, 64px)",
              height: 1,
              background: "rgba(255,255,255,0.85)",
              boxShadow: "0 0 6px rgba(0,0,0,0.25)",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />

          {/* Pin marker at the end of the leader line — accent ring on
              white core, with a soft halo so it reads against any map. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "100%",
              top: "50%",
              marginLeft: "clamp(28px, 5vw, 64px)",
              width: 14,
              height: 14,
              borderRadius: "9999px",
              background: "#FFFFFF",
              border: "2px solid var(--ent-accent)",
              boxShadow:
                "0 0 0 6px rgba(0,129,172,0.20), 0 2px 8px rgba(0,0,0,0.25)",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
