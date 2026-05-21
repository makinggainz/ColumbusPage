"use client";

/* ── ForecastCard ──────────────────────────────────────────────────────────
   The chat-style answer card used inside the "Like weather forecasts for
   real-estate" sub-feature. A header (Columbus mark + muted "forecasted
   your question" label), the question recap, a ranked-submarkets panel,
   a key takeaway panel, and a "View Full Report" footer button. Lives on
   top of a map (see ForecastVisual). */

type RankedItem = {
  rank: number;
  label: string;
  delta: string;
};

const TOP_SUBMARKETS: RankedItem[] = [
  { rank: 1, label: "City Core", delta: "+11.8%" },
  { rank: 2, label: "Kings Cross", delta: "+10.3%" },
  { rank: 3, label: "Southbank", delta: "+9.7%" },
  { rank: 4, label: "Stratford", delta: "+8.7%" },
];

/* Numbered badges fade from saturated red → near-black down the list,
   mirroring the gradient in the source design. */
const BADGE_FILLS = ["#D8362B", "#A82424", "#6B1414", "#2A0606"];
const RED_TEXT = "#D8362B";

export default function ForecastCard() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 460,
        background: "#FFFFFF",
        borderRadius: "var(--ent-radius-xl)",
        boxShadow:
          "0 0 0 1px rgba(11, 27, 43, 0.06), 0 24px 60px rgba(11, 27, 43, 0.20)",
        padding: 24,
        color: "var(--ent-text-navy)",
        fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <ColumbusMark />
        <span
          style={{
            color: "#9AA0A6",
            fontSize: 14,
            letterSpacing: "-0.005em",
          }}
        >
          Columbus forecasted your question
        </span>
      </div>

      {/* Question recap */}
      <p
        className="mt-5"
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--ent-text-navy)",
          letterSpacing: "-0.005em",
        }}
      >
        Here are the London office submarkets forcasted to see the strongest
        prime rent growth for Grade A space over the next 24 months
      </p>

      {/* Ranked submarkets panel */}
      <div
        className="mt-5"
        style={{
          background: "#F4F4F5",
          borderRadius: 12,
          padding: "18px 18px 14px",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ent-text-navy)",
            letterSpacing: "-0.01em",
          }}
        >
          Top 5 Submarkets by Forcasted Prime Rent Growth
        </div>
        <div
          className="mt-1"
          style={{
            fontSize: 13,
            color: "#7C7C85",
            letterSpacing: "-0.005em",
          }}
        >
          Next 24 Months
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {TOP_SUBMARKETS.map((item, i) => (
            <li
              key={item.rank}
              className="flex items-center justify-between"
              style={{ fontSize: 14, color: "var(--ent-text-navy)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 9999,
                    background: BADGE_FILLS[i],
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {item.rank}
                </span>
                <span style={{ letterSpacing: "-0.005em" }}>{item.label}</span>
              </div>
              <span
                style={{
                  color: RED_TEXT,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.005em",
                }}
              >
                {item.delta}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key takeaway panel */}
      <div
        className="mt-3"
        style={{
          background: "#F4F4F5",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ent-text-navy)",
            letterSpacing: "-0.01em",
          }}
        >
          Key takeaway
        </div>
        <p
          className="mt-2"
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--ent-text-navy)",
            letterSpacing: "-0.005em",
          }}
        >
          Here are the London office submarkets forcasted to see the strongest
          prime rent growth for Grade A space over the next 24 months
        </p>
      </div>

      {/* Footer CTA */}
      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2"
        style={{
          height: 44,
          borderRadius: 12,
          border: "1px solid #E4E4E7",
          background: "#FFFFFF",
          color: "var(--ent-text-navy)",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          position: "relative",
        }}
      >
        <span>View Full Report</span>
        <ReportIcon />
      </button>
    </div>
  );
}

function ColumbusMark() {
  /* The real Columbus logo at ~20px. Recoloured to dark navy via the same
     filter the navbar uses when rendered on a light background. */
  return (
    <img
      src="/logobueno.png"
      alt=""
      aria-hidden
      width={20}
      height={20}
      style={{
        display: "block",
        objectFit: "contain",
        filter:
          "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
      }}
    />
  );
}

function ReportIcon() {
  /* Small document/report glyph aligned to the right of the CTA. */
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ position: "absolute", right: 14 }}
    >
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4" />
      <path d="M9 12h7" />
      <path d="M9 16h5" />
    </svg>
  );
}
