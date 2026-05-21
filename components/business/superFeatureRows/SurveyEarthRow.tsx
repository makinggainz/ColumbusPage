"use client";

import MapThumb from "./MapThumb";
import RowHeader from "./RowHeader";
import ColumbusMark from "./ColumbusMark";

/* Row 2 — "Survey the earth with a super model".
   Stacked layout, split header (subtitle on the upper-left, heading on the
   upper-right). Below the header: an "investigating" reasoning card and
   a separate prompt-bubble card on the left, a choropleth map on the
   right. */

const FONT =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

const REASONING_BULLETS = [
  "Spike velocity in geo-tagged Instagram and TikTok posts within 3-block radii",
  "Demographic profile of posters via image analysis (age cohort, style cues, income proxies)",
  "Type of activity captured (natural wine bars, specialty coffee, vintage retail, art openings vs. loitering)",
  "Scaffolding density and facade renovation rate from satellite and street-view delta over 18 months",
  "Velocity of “For Rent” and “For Lease” sign appearance and disappearance",
  "New business license filings with the NYC Department of Consumer Affairs (cafes, galleries, boutiques, breweries)",
  "Replacement of security gates and roll-down shutters with glass storefronts",
];

const PROMPT_TEXT =
  "What could be the next Williamsburg or Bushwick? Build me a 'Pre-Vibe Shift Index' for every census tract in Brooklyn, Queens, and the Bronx. Score each tract on the early signals that a neighborhood is 12–24 months from a meaningful retail rent and residential value re-rating";

export default function SurveyEarthRow() {
  return (
    <div style={{ fontFamily: FONT }}>
      <RowHeader
        align="right-heading"
        title="Survey the earth with a super model"
        subtitle={
          <>
            <a href="#" style={{ color: "var(--ent-accent)" }}>
              Smart Layers
            </a>
            , allows you to come up with data layers that would&rsquo;ve been
            too expensive or weird to survey. Taylor data layers to your exact
            needs, create maps about anything you can think of.
          </>
        }
      />

      {/* Overlapping 12-col grid: the card stack occupies cols 1–7 and the
          map occupies cols 6–12, so they overlap in cols 6–7. z-index lifts
          the cards above the map so the map appears tucked under them. */}
      {/* Overlapping 12-col grid: the card stack occupies cols 1–7 and the
          map occupies cols 6–12, so they overlap in cols 6–7. z-index lifts
          the cards above the map so the map appears tucked under them.
          alignItems: stretch lets the left column match the map's height. */}
      <div
        className="hidden lg:grid"
        style={{
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gridTemplateRows: "auto",
          alignItems: "stretch",
        }}
      >
        {/* Left — investigating card grows to fill the row height (so it
            matches the map on the right); the prompt card overlaps its
            bottom edge as a floating overlay. Narrowed to cols 1–4 (~35%
            of the row) so the map can extend further left under it. */}
        <div
          style={{
            gridColumn: "1 / 5",
            gridRow: 1,
            position: "relative",
            zIndex: 2,
            paddingRight: "clamp(8px, 1vw, 16px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, display: "flex" }}>
            <InvestigatingCard />
          </div>
          <div
            style={{
              position: "relative",
              marginTop: "clamp(-40px, -3vw, -24px)",
              zIndex: 2,
            }}
          >
            <PromptCard />
          </div>
        </div>

        {/* Right — choropleth map, widened to cols 3–12 (~83%) so it
            extends well to the left and the card stack appears to float
            on top of it. */}
        <div
          style={{
            gridColumn: "3 / 13",
            gridRow: 1,
            zIndex: 1,
          }}
        >
          <MapThumb
            src="/business/SuperModelback.png"
            alt="NYC pre-vibe shift choropleth across Brooklyn, Queens, and the Bronx"
            aspectRatio="2 / 1"
            radius="var(--ent-radius-2xl)"
          />
        </div>
      </div>

      {/* Mobile / tablet — fall back to a plain stack with no overlap. */}
      <div className="lg:hidden flex flex-col gap-6">
        <div className="relative">
          <InvestigatingCard />
          <div style={{ position: "relative", marginTop: -24, zIndex: 2 }}>
            <PromptCard />
          </div>
        </div>
        <MapThumb
          src="/business/SuperModelback.png"
          alt="NYC pre-vibe shift choropleth across Brooklyn, Queens, and the Bronx"
          aspectRatio="4 / 3"
          radius="var(--ent-radius-2xl)"
        />
      </div>
    </div>
  );
}

function InvestigatingCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "var(--ent-radius-2xl)",
        border: "1px solid var(--ent-border-card)",
        boxShadow: "var(--ent-shadow-card)",
        padding: "clamp(20px, 2.2vw, 28px)",
        /* Fill the parent's height so the left stack matches the map on
           the right. The bullet list sits at the top — extra height shows
           as whitespace below the list, matching the reference design. */
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex items-center gap-2">
        <ColumbusMark size={18} />
        <span
          style={{
            color: "#9AA3AE",
            fontSize: 14,
            letterSpacing: "-0.005em",
            fontWeight: 500,
          }}
        >
          Columbus is investigating
        </span>
      </div>

      <ul
        className="mt-4"
        style={{
          color: "#9AA3AE",
          fontSize: 13.5,
          lineHeight: 1.55,
          letterSpacing: "-0.005em",
          paddingLeft: 18,
          listStyleType: "disc",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          margin: 0,
        }}
      >
        {REASONING_BULLETS.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function PromptCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "var(--ent-radius-2xl)",
        border: "1px solid var(--ent-border-card)",
        /* Stronger, layered shadow so the card reads as a floating overlay
           on top of the InvestigatingCard rather than a flush sibling. */
        boxShadow:
          "0 24px 48px rgba(11, 27, 43, 0.16), 0 8px 16px rgba(11, 27, 43, 0.08)",
        padding: "clamp(18px, 2vw, 22px)",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <p
        style={{
          margin: 0,
          flex: 1,
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--ent-text-primary)",
          letterSpacing: "-0.005em",
        }}
      >
        {PROMPT_TEXT}
      </p>
      <button
        type="button"
        aria-label="Stop"
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 9,
          background: "#E5E7EB",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            background: "#0A1344",
          }}
        />
      </button>
    </div>
  );
}
