"use client";

import { useIndustry } from "@/components/use-cases/industry/IndustryContext";
import { INDUSTRY_COLOR } from "@/components/use-cases/industry/content";

/* Shared card chrome for row 3 ("Better Data, Better Prices") — both
   Columbus and the competitor card use the same outer shell. Avatar circle
   + heading on the top row, a "Market price" label below, then a white
   data-layer panel (a layers glyph on a white fill, replacing the old map
   thumbnail), then optional `children`. */

export type ComparisonCardProps = {
  title: string;
  priceLabel?: string;
  price?: React.ReactNode;
  avatar?: React.ReactNode;
  mapAlt?: string;
  children?: React.ReactNode;
  /* When true, the card is painted in a featured/preferred state:
     a 2px --ent-accent border + an accent-tinted fill that reads a
     touch darker than the default white card. Used on the Columbus
     Data Layer side of BetterPricesRow so it visually leads the
     "Best Competitor" card. The non-highlighted card keeps a 2px
     transparent border so both cards stay pixel-identical in size. */
  highlighted?: boolean;
};

export default function ComparisonCard({
  title,
  priceLabel = "Market price",
  price,
  avatar,
  mapAlt = "",
  children,
  highlighted = false,
}: ComparisonCardProps) {
  /* The highlighted (Columbus) card tints its layers glyph with the selected
     industry's accent; the competitor card keeps a neutral grey. */
  const { industryId } = useIndustry();
  const accent = INDUSTRY_COLOR[industryId];
  const iconColor = highlighted ? accent ?? "var(--ent-accent)" : "#52525B";
  return (
    <div
      style={{
        position: "relative",
        background: highlighted ? "rgba(0, 129, 172, 0.06)" : "#FFFFFF",
        border: highlighted
          ? "2px solid var(--ent-accent)"
          : "2px solid transparent",
        borderRadius: "var(--ent-radius-2xl)",
        padding: "clamp(18px, 2vw, 26px)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily:
          "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* "Best value" badge — only on the highlighted (Columbus) card.
          Straddles the top-left edge, tinted with the industry accent. */}
      {highlighted && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            /* Same shape as the "Try Elio" nav CTA (rounded-button = 16px). */
            borderRadius: "var(--radius-button)",
            background: accent ?? "var(--ent-accent)",
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <StarIcon />
          Best Value
        </div>
      )}
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 9999,
            background: avatar ? "rgba(11,27,43,0.06)" : "#E4E4E7",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {avatar}
        </span>
        <div className="flex-1 min-w-0">
          <h4
            style={{
              margin: 0,
              fontSize: "clamp(17px, 1.7vw, 19px)",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: "var(--ent-text-primary)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h4>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              color: "var(--ent-text-secondary)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {priceLabel}
          </p>
          {price ? (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ent-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {price}
            </p>
          ) : null}
        </div>
      </div>

      {/* Competitor card (non-highlighted, the right box) gets a thinner
          layers glyph so Columbus's stays the bolder of the two. */}
      <LayerPanel
        label={mapAlt}
        strokeWidth={highlighted ? 1.6 : 1}
        color={iconColor}
      />

      {children}
    </div>
  );
}

/* Filled star for the "Best value" badge. */
function StarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={{ display: "block" }}
    >
      <path d="M12 2l2.9 6.26 6.1.55-4.6 4.04 1.36 6.15L12 16.9l-5.76 3.1 1.36-6.15-4.6-4.04 6.1-.55z" />
    </svg>
  );
}

/* White data-layer panel — replaces the old 4:3 map thumbnail at the same
   size. A faint hairline keeps the white fill legible on the white
   competitor card (the highlighted card's tinted fill already frames it). */
function LayerPanel({
  label,
  strokeWidth,
  color,
}: {
  label?: string;
  strokeWidth: number;
  color: string;
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        borderRadius: "var(--ent-radius-card)",
        background: "#FFFFFF",
        border: "1px solid var(--ent-border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LayersIcon strokeWidth={strokeWidth} color={color} />
    </div>
  );
}

/* Stacked-layers glyph (top plate + two sheets), centered in the panel. */
function LayersIcon({ strokeWidth, color }: { strokeWidth: number; color: string }) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block" }}
    >
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 12 10 5 10-5" />
      <path d="m2 17 10 5 10-5" />
    </svg>
  );
}
