/* eslint-disable @next/next/no-img-element */

// PromptShowcase (still exported as AITrustBand so the page wire stays
// stable). Original ColumbusPage copy preserved: "Real use case stories" /
// "See prompts you can ask" + the five prompt examples and the
// "Columbus is thinking..." center card.

const PROMPT_CARDS = [
  {
    image: "/enterprise/citymap.png",
    text: "map of philly to drive my truck to run over as many pedestrians as possible",
  },
  {
    image: "/enterprise/map2.png",
    text: "make me a map of charlotte, but filter only vacant lots next to transportation lines",
  },
  {
    image: "/enterprise/map3.png",
    text: "map of france but in weird colors to make it hard to understand",
  },
  {
    image: "/enterprise/map4.png",
    text: "lava map for silly billies",
  },
] as const;

function ThinkingCard() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: "#ffffff",
        border: "1px solid #C7D7F8",
        borderRadius: 20,
        boxShadow: "0 4px 12px rgba(15,32,86,0.06)",
      }}
    >
      <div className="px-5 py-4 flex flex-col gap-1.5">
        <div
          className="flex items-center gap-2 mb-1"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(31,31,31,0.55)",
          }}
        >
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: "#154ACC",
              color: "#ffffff",
              fontSize: 9,
              fontWeight: 700,
            }}
            aria-hidden="true"
          >
            C
          </span>
          Columbus is thinking…
        </div>
        <p style={{ fontSize: 13, color: "rgba(31,31,31,0.55)" }}>
          Considering demographics of Madrid
        </p>
        <p style={{ fontSize: 13, color: "rgba(31,31,31,0.55)" }}>
          Considering commercial lot prices
        </p>
        <p style={{ fontSize: 13, color: "rgba(31,31,31,0.55)" }}>
          Considering trade area competition
        </p>
      </div>
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          borderTop: "1px solid #C7D7F8",
          background: "#F1F5FE",
        }}
      >
        <span
          className="flex-1 text-sm md:text-base"
          style={{ color: "#1f1f1f", fontWeight: 500 }}
        >
          Where should I open a new pizzeria shop?
        </span>
      </div>
    </div>
  );
}

function PromptCard({ image, text }: { image: string; text: string }) {
  return (
    <div
      className="overflow-hidden flex flex-col"
      style={{
        background: "#ffffff",
        border: "1px solid #C7D7F8",
        borderRadius: 20,
      }}
    >
      <div
        className="px-4 py-3 text-sm flex items-center gap-2"
        style={{
          color: "rgba(31,31,31,0.65)",
          fontWeight: 500,
        }}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{
            width: 16,
            height: 16,
            borderRadius: 9999,
            background: "#154ACC",
            color: "#ffffff",
            fontSize: 9,
            fontWeight: 700,
          }}
          aria-hidden="true"
        >
          C
        </span>
        I created this map for you
      </div>
      <div
        className="relative w-full"
        style={{ height: 200, overflow: "hidden" }}
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div
        className="px-4 py-3 text-sm leading-relaxed"
        style={{ color: "#1f1f1f", borderTop: "1px solid #C7D7F8" }}
      >
        {text}
      </div>
    </div>
  );
}

export function AITrustBand() {
  return (
    <section id="trust" className="relative" style={{ padding: "80px 0" }}>
      <div className="mistx-container">
        <div className="mistx-grid-pattern relative">
          <div className="mb-10 md:mb-20 text-center" data-reveal>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(31,31,31,0.45)",
                marginBottom: 12,
              }}
            >
              Real use case stories
            </p>
            <h2
              className="text-3xl md:text-5xl"
              style={{
                color: "#1f1f1f",
                letterSpacing: "-0.025em",
                fontWeight: 400,
              }}
            >
              See prompts you can ask.
            </h2>
          </div>

          {/* 5-card grid: 4 thumbnail prompts around a centered thinking card */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            data-reveal
            data-reveal-delay="1"
          >
            {PROMPT_CARDS.slice(0, 2).map((p) => (
              <PromptCard key={p.text} image={p.image} text={p.text} />
            ))}
          </div>

          <div className="mt-4 md:mt-6 max-w-2xl mx-auto" data-reveal data-reveal-delay="2">
            <ThinkingCard />
          </div>

          <div
            className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            data-reveal
            data-reveal-delay="3"
          >
            {PROMPT_CARDS.slice(2).map((p) => (
              <PromptCard key={p.text} image={p.image} text={p.text} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
