"use client";

/* ── Columbus reasoning card ───────────────────────────────────────────────
   Visual mockup for the "AI that critically thinks" sub-feature on the
   business page. Shows a user prompt bubble at the top, followed by an
   8-point star + "Columbus is reasoning" header, and a bulleted list of
   internal weighing steps. The list fades to transparent at the bottom so
   it reads as a stream that continues beyond the card. */

export default function ColumbusReasoningCard() {
  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth: 560,
        background: "#FFFFFF",
        borderRadius: "var(--ent-radius-2xl)",
        border: "1px solid var(--ent-border-card)",
        boxShadow: "var(--ent-shadow-card)",
        padding: "clamp(28px, 3vw, 40px)",
        overflow: "hidden",
        fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div className="flex justify-end">
        <div
          style={{
            background: "#EFEFEF",
            color: "var(--ent-text-primary)",
            borderRadius: 18,
            padding: "18px 20px",
            maxWidth: "92%",
            fontSize: 16,
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
            fontWeight: 500,
          }}
        >
          A broker has pitched a €50M mixed-use building in Milan&rsquo;s Porta
          Nuova periphery. Critically evaluate this acquisition. Don&rsquo;t
          just summarize the IM — challenge it. Tell me how the streets are
          and what people say about this neighborhood.
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2">
        <ColumbusLogo />
        <span
          style={{
            color: "#9AA3AE",
            fontSize: 15,
            letterSpacing: "-0.005em",
            fontWeight: 500,
          }}
        >
          Columbus is reasoning
        </span>
      </div>

      <div
        className="mt-5 relative"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%)",
        }}
      >
        <p
          style={{
            color: "#9AA3AE",
            fontSize: 13.5,
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
            marginBottom: 10,
          }}
        >
          Columbus weighs:
        </p>
        <ul
          className="flex flex-col gap-3"
          style={{
            color: "#9AA3AE",
            fontSize: 13.5,
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
            paddingLeft: 18,
            listStyleType: "disc",
          }}
        >
          <li>
            <strong style={{ fontWeight: 600, color: "#7C8591" }}>
              Safety reality vs. official stats:
            </strong>{" "}
            Police data says &ldquo;crime average,&rdquo; but Columbus&rsquo;s
            human-factor model detects broken-window patterns, aggressive
            loitering signatures at night, and near-zero female pedestrians
            after 21:00 within a 200m radius. Score: High Perceived Risk.
          </li>
          <li>
            <strong style={{ fontWeight: 600, color: "#7C8591" }}>
              Activity validation vs. broker narrative:
            </strong>{" "}
            Broker calls it a &ldquo;bustling retail corridor.&rdquo; Columbus
            footfall analysis shows heavy throughput but 92% are transit
            commuters passing through Garibaldi station — dwell time near
            zero, retail conversion negligible. Score: Low Retail Viability.
          </li>
          <li>
            <strong style={{ fontWeight: 600, color: "#7C8591" }}>
              Tenant credit quality
            </strong>{" "}
            of the existing rent roll vs. industry distress signals
          </li>
          <li>
            <strong style={{ fontWeight: 600, color: "#7C8591" }}>
              WALT (weighted average lease term)
            </strong>{" "}
            vs. submarket lease expiry wall
          </li>
          <li>
            <strong style={{ fontWeight: 600, color: "#7C8591" }}>
              Comparable transactions
            </strong>{" "}
            in past 18 months — both closed and busted deals
          </li>
        </ul>
      </div>
    </div>
  );
}

/* The real Columbus logo at small (~18px) size. The raw asset is rendered
   through the same navy-recolour filter used by MistxNav so it matches the
   dark wordmark elsewhere on the page. */
function ColumbusLogo() {
  return (
    <img
      src="/logobueno.png"
      alt=""
      aria-hidden
      width={18}
      height={18}
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
