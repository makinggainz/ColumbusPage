"use client";

/* Composes a map "context" panel with a data UI card anchored to the left.
   Three variants:
   - "full-bleed" (default): the map fills the surrounding rounded frame
     and a leader line + pin reach out from the card's right edge to a
     marker on the map — so the card reads as "data about this point on
     the map".
   - "floating": the map is a smaller rounded rectangle in the center-right
     of the frame with the surrounding backdrop (e.g. sky/cityscape) still
     visible on both sides; the card overlaps the map's left portion. No
     leader/pin — the card and map relate by overlap, not by connector.
   - "flush": the card and map sit side-by-side with no overlap. The map's
     left edge butts against the card's right edge, and the map stretches
     to exactly match the card's height — so the top and bottom borders
     line up perfectly. The map fills the remaining horizontal room out
     to the parent frame's right edge. */
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
  variant?: "full-bleed" | "floating" | "flush";
}) {
  if (variant === "flush") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(16px, 2vw, 28px)",
        }}
      >
        {/* Inline flex row — `alignItems: stretch` makes the map take the
            card's natural height, so the top and bottom borders match. */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {/* Card — natural width up to `maxWidth`. */}
          <div style={{ flexShrink: 0, width: "100%", maxWidth }}>
            {children}
          </div>
          {/* Map — flexes to fill remaining width, stretches to card
              height. Outer-right corners rounded; inner-left corners
              left square so the seam reads as a clean butt-join. */}
          <div
            aria-label={alt || undefined}
            role={alt ? "img" : undefined}
            style={{
              flex: 1,
              minWidth: 0,
              borderTopRightRadius: "var(--ent-radius-2xl)",
              borderBottomRightRadius: "var(--ent-radius-2xl)",
              overflow: "hidden",
              backgroundImage: `url(${map})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "var(--ent-shadow-card)",
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === "floating") {
    /* The card determines the layout height; the map matches it. The map
       is absolutely positioned with top:0 / bottom:0 inside an inline-flex
       wrapper whose height is set by the card alone — so the map can never
       be taller than the UI it accompanies. The map's left edge sits at
       50% of the card's width so the card visually covers half the map. */
    const overlap = maxWidth * 0.5;
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(16px, 2vw, 28px)",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            maxWidth: maxWidth + 320,
          }}
        >
          {/* Card — fixed width, flex-shrink:0; its natural height
              determines the wrapper height that the map then matches. */}
          <div
            style={{
              width: maxWidth,
              flexShrink: 0,
              position: "relative",
              zIndex: 2,
            }}
          >
            {children}
          </div>

          {/* Map — absolutely positioned so it doesn't influence wrapper
              height. top:0/bottom:0 makes it exactly the card's height;
              left starts halfway across the card so the card hides ~50%
              of the map. */}
          <div
            aria-label={alt || undefined}
            role={alt ? "img" : undefined}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: overlap,
              right: 0,
              borderRadius: "var(--ent-radius-2xl)",
              overflow: "hidden",
              backgroundImage: `url(${map})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "var(--ent-shadow-card)",
              zIndex: 1,
            }}
          />
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
