"use client";

import MapThumb from "./MapThumb";

/* Shared card chrome for row 3 ("Better Data, Better Prices") — both
   Columbus and the competitor card use the same outer shell. Avatar circle
   + heading on the top row, a "Market price" label below, then a map
   thumbnail, then optional `children` (Card B intentionally renders nothing
   below the map per the screenshot). */

export type ComparisonCardProps = {
  title: string;
  priceLabel?: string;
  price?: React.ReactNode;
  avatar?: React.ReactNode;
  mapSrc: string;
  mapAlt?: string;
  children?: React.ReactNode;
};

export default function ComparisonCard({
  title,
  priceLabel = "Market price",
  price,
  avatar,
  mapSrc,
  mapAlt = "",
  children,
}: ComparisonCardProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "var(--ent-radius-2xl)",
        border: "1px solid var(--ent-border-card)",
        boxShadow: "var(--ent-shadow-card)",
        padding: "clamp(18px, 2vw, 26px)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily:
          "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
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

      <MapThumb src={mapSrc} alt={mapAlt} aspectRatio="4 / 3" shadow={false} />

      {children}
    </div>
  );
}
