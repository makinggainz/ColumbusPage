"use client";

/* Mock UI: "4 patterns detected" card. Pure presentational — a white
   rounded card with a header, four numbered pattern rows, and a "View Full
   Report" footer. Used inside the "See what others cant" super-feature
   row as a floating overlay on top of a map backdrop. */

type Pattern = {
  n: number;
  title: string;
  properties: string;
  roi: string;
};

const PATTERNS: Pattern[] = [
  { n: 1, title: "High ROI Near Transit Coorridors", properties: "342 properties", roi: "Avg ROI: 28%" },
  { n: 2, title: "10-20% Below Median Priced Buys", properties: "342 properties", roi: "Avg ROI: 24%" },
  { n: 3, title: "Pre-1980 Homes, Modern Updates", properties: "342 properties", roi: "Avg ROI: 28%" },
  { n: 4, title: "High ROI Near Transit Coorridors", properties: "342 properties", roi: "Avg ROI: 28%" },
];

/* Numbered badge colour ramps from bright red (1) to near-black (4), so the
   ranked list reads like a heat scale at a glance. */
const BADGE_COLORS = ["#DC2626", "#7F1D1D", "#4A0A0A", "#1F0303"];

export default function PatternsDetectedCard() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#FFFFFF",
        borderRadius: "var(--ent-radius-2xl)",
        boxShadow:
          "0 0 0 1px rgba(11, 27, 43, 0.06), 0 24px 60px rgba(11, 27, 43, 0.20)",
        padding: "clamp(24px, 2.8vw, 34px)",
        color: "var(--ent-text-primary)",
        fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h4
        style={{
          fontSize: "clamp(20px, 2.2vw, 26px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        4 patterns detected
      </h4>
      <p
        style={{
          marginTop: 4,
          fontSize: "clamp(13px, 1.2vw, 15px)",
          color: "var(--ent-text-secondary)",
          letterSpacing: "-0.005em",
        }}
      >
        Accross the Manhatan area [DATE]
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: "clamp(18px, 2.2vw, 26px) 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {PATTERNS.map((p, i) => (
          <li
            key={`${p.n}-${p.title}`}
            style={{
              backgroundColor: "#F2F2F2",
              borderRadius: 12,
              padding: "clamp(14px, 1.6vw, 20px) clamp(14px, 1.6vw, 20px)",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 24,
                height: 24,
                borderRadius: 9999,
                backgroundColor: BADGE_COLORS[i] ?? BADGE_COLORS[BADGE_COLORS.length - 1],
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              {p.n}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: "clamp(13px, 1.3vw, 15px)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--ent-text-primary)",
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  gap: 18,
                  fontSize: "clamp(12px, 1.1vw, 13px)",
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
          marginTop: 16,
          height: 44,
          borderRadius: 12,
          border: "1px solid #E4E4E7",
          background: "#FFFFFF",
          color: "var(--ent-text-navy)",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <span>View Full Report</span>
        <svg
          aria-hidden
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: "absolute", right: 14 }}
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
