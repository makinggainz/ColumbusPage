/* eslint-disable @next/next/no-img-element */

// DifferenceSection (still exported as WatchItWork so the page wire stays
// stable). Original ColumbusPage copy preserved: "See How We're Different"
// + the Columbus-vs-Basic-AI bullet comparison.
// Restyled in MistX's pattern A outlined two-card layout.

const COLUMBUS_BULLETS = [
  "Highest fidelity and fresh data",
  "Understands space and coordinates",
  "Spatial and contextual reasoning",
  "Thinks with human-like intuition",
  "Produces maps and visuals",
  "Built for physical world, enterprises",
] as const;

const BASIC_BULLETS: ReadonlyArray<{ text: string; source?: boolean }> = [
  { text: "Regurgitates old articles about areas" },
  { text: "Hallucinates coordinates 60% of time", source: true },
  { text: "Limited data reach" },
  { text: "Text outputs, no map or GIS" },
  { text: "Built for text, consumers" },
];

const PROMPT_TEXT =
  "Generate the fastest route for next Tuesday 10am. It'll be a multi-stop route through Philadelphia. I've attached a file with vehicle type and each location.";

export function WatchItWork() {
  return (
    <section className="relative" style={{ padding: "100px 0" }}>
      <div className="mistx-container">
        <div className="mb-10 md:mb-16 text-center" data-reveal>
          <h2
            className="text-3xl md:text-5xl"
            style={{
              color: "#1f1f1f",
              letterSpacing: "-0.025em",
              fontWeight: 400,
            }}
          >
            See how we&rsquo;re different.
          </h2>
        </div>

        {/* Shared prompt card (one question, two answers) */}
        <div
          className="mx-auto max-w-[760px] mb-10 md:mb-16 px-5 md:px-6 py-5 flex items-center gap-4"
          style={{
            background: "#ffffff",
            border: "1px solid #C7D7F8",
            borderRadius: 14,
          }}
          data-reveal
          data-reveal-delay="1"
        >
          <p
            className="text-sm md:text-base leading-relaxed flex-1"
            style={{ color: "#1f1f1f", fontWeight: 400 }}
          >
            {PROMPT_TEXT}
          </p>
          <span
            className="shrink-0 inline-flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#1f1f1f",
              color: "#ffffff",
            }}
            aria-hidden="true"
          >
            →
          </span>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
          data-reveal
          data-reveal-delay="2"
        >
          {/* Columbus */}
          <div
            className="flex flex-col overflow-hidden"
            style={{
              border: "1px solid #C7D7F8",
              borderRadius: 20,
              background: "#F1F5FE",
            }}
          >
            <div
              className="px-6 md:px-8 pt-6 md:pt-8 pb-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid #C7D7F8" }}
            >
              <div className="flex items-center gap-2">
                <img
                  src="/enterprise/logo.png"
                  alt=""
                  aria-hidden="true"
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                />
                <span
                  className="text-base md:text-lg"
                  style={{ color: "#1f1f1f", fontWeight: 600 }}
                >
                  Columbus
                </span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#154ACC",
                }}
              >
                Agentic GIS
              </span>
            </div>
            <ul className="px-6 md:px-8 py-6 md:py-8 flex flex-col gap-3 flex-1">
              {COLUMBUS_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span
                    className="shrink-0 inline-flex items-center justify-center"
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9999,
                      background: "rgba(10,122,71,0.15)",
                      color: "#0a7a47",
                      fontSize: 11,
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: "#1f1f1f" }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Basic AI */}
          <div
            className="flex flex-col overflow-hidden"
            style={{
              border: "1px solid #C7D7F8",
              borderRadius: 20,
              background: "#F1F5FE",
            }}
          >
            <div
              className="px-6 md:px-8 pt-6 md:pt-8 pb-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid #C7D7F8" }}
            >
              <span
                className="text-base md:text-lg"
                style={{ color: "rgba(31,31,31,0.55)", fontWeight: 500 }}
              >
                Basic AI
              </span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(31,31,31,0.40)",
                }}
              >
                General-purpose
              </span>
            </div>
            <ul className="px-6 md:px-8 py-6 md:py-8 flex flex-col gap-3 flex-1">
              {BASIC_BULLETS.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <span
                    className="shrink-0 inline-flex items-center justify-center"
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9999,
                      background: "rgba(31,31,31,0.08)",
                      color: "rgba(31,31,31,0.55)",
                      fontSize: 11,
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                    aria-hidden="true"
                  >
                    ✕
                  </span>
                  <span
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: "rgba(31,31,31,0.65)" }}
                  >
                    {b.text}
                    {b.source && (
                      <span
                        className="ml-1"
                        style={{ color: "#154ACC", fontSize: 12 }}
                      >
                        Source
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
