"use client";

/* Mock UI: "4 patterns detected" card. Pure presentational — a white
   rounded card with a header, four numbered pattern rows, and a "View Full
   Report" footer. Used inside the "See what others cant" super-feature
   row as a floating overlay on top of a map backdrop.

   Spacing was dialled back from the very-tight pass to a more comfortable
   rhythm modelled on Mobbin (Optimal Workshop's Insights cards / Peec AI's
   ranked rows) — title + small meta stacked inside each row, but with
   tighter padding than the original 14–20px card-style rows. */

export type Pattern = {
  n: number;
  title: string;
  properties: string;
  roi: string;
};

const DEFAULT_PATTERNS: Pattern[] = [
  { n: 1, title: "High ROI Near Transit Coorridors", properties: "342 properties", roi: "Avg ROI: 28%" },
  { n: 2, title: "10-20% Below Median Priced Buys", properties: "342 properties", roi: "Avg ROI: 24%" },
  { n: 3, title: "Pre-1980 Homes, Modern Updates", properties: "342 properties", roi: "Avg ROI: 28%" },
  { n: 4, title: "High ROI Near Transit Coorridors", properties: "342 properties", roi: "Avg ROI: 28%" },
];

const DEFAULT_HEADING = "4 patterns detected";
const DEFAULT_AREA = "Accross the Manhatan area [DATE]";

/* Numbered badge colour ramps from bright red (1) to near-black (4), so the
   ranked list reads like a heat scale at a glance. Industries can override
   via `badgeColors` to match the accent palette of their specific map (e.g.
   residential alternates red + blue to match the map's two-tone building
   paint). */
const DEFAULT_BADGE_COLORS = ["#DC2626", "#7F1D1D", "#4A0A0A", "#1F0303"];

export type PatternsDetectedCardProps = {
  heading?: string;
  area?: string;
  /* Optional original prompt that yielded the pattern result. Displayed as
     a muted quote just under the heading so the card reads as the answer
     to a specific question rather than an anonymous list. */
  prompt?: string;
  patterns?: Pattern[];
  badgeColors?: string[];
};

export default function PatternsDetectedCard({
  heading = DEFAULT_HEADING,
  area = DEFAULT_AREA,
  prompt,
  patterns = DEFAULT_PATTERNS,
  badgeColors = DEFAULT_BADGE_COLORS,
}: PatternsDetectedCardProps = {}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#FFFFFF",
        borderRadius: "var(--ent-radius-2xl)",
        boxShadow:
          "0 0 0 1px rgba(11, 27, 43, 0.06), 0 24px 60px rgba(11, 27, 43, 0.20)",
        padding: "clamp(22px, 2.5vw, 30px)",
        color: "var(--ent-text-primary)",
        fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h4
        style={{
          fontSize: "clamp(18px, 2vw, 23px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        {heading}
      </h4>
      <p
        style={{
          marginTop: 4,
          marginBottom: 0,
          fontSize: "clamp(12px, 1.15vw, 13.5px)",
          color: "var(--ent-text-secondary)",
          letterSpacing: "-0.005em",
        }}
      >
        {area}
      </p>
      {prompt ? (
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: "clamp(12px, 1.1vw, 13px)",
            color: "var(--ent-text-secondary)",
            letterSpacing: "-0.005em",
            lineHeight: 1.5,
            fontStyle: "italic",
            paddingLeft: 10,
            borderLeft: "2px solid #E4E4E7",
          }}
        >
          {prompt}
        </p>
      ) : null}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "clamp(14px, 1.8vw, 20px) 0 0",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {patterns.map((p, i) => (
          <li
            key={`${p.n}-${p.title}`}
            style={{
              backgroundColor: "#F4F4F5",
              borderRadius: 11,
              padding: "clamp(11px, 1.3vw, 14px) clamp(12px, 1.4vw, 16px)",
              display: "flex",
              gap: 11,
              alignItems: "flex-start",
            }}
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: 9999,
                backgroundColor:
                  badgeColors[i] ?? badgeColors[badgeColors.length - 1] ?? DEFAULT_BADGE_COLORS[0],
                color: "#FFFFFF",
                fontSize: 11.5,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              {p.n}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: "clamp(13px, 1.25vw, 14.5px)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--ent-text-primary)",
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  marginTop: 4,
                  display: "flex",
                  gap: 14,
                  fontSize: "clamp(11.5px, 1.05vw, 12.5px)",
                  color: "var(--ent-text-secondary)",
                  letterSpacing: "-0.005em",
                }}
              >
                <span>{p.properties}</span>
                <span>{p.roi}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2"
        style={{
          marginTop: 14,
          height: 40,
          borderRadius: 11,
          border: "1px solid #E4E4E7",
          background: "#FFFFFF",
          color: "var(--ent-text-navy)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <span>View Full Report</span>
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: "absolute", right: 13 }}
        >
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 12h7" />
          <path d="M9 16h5" />
        </svg>
      </button>
    </div>
  );
}
