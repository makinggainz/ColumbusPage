// PainPoints (still exported as EnterprisePrompts so the page wire stays
// stable). Original ColumbusPage copy: "Legacy GIS slows you down because…"
// + the six pain points, rendered in MistX's outlined-card grid vocabulary.

const PAIN_POINTS = [
  "A single site selection report takes your team 2–3 weeks",
  "You pay $10K+ per seat for software half your team can't use",
  "Your analysts spend 60% of their time finding and cleaning data",
  "Coordinates are copy-pasted from Google and wrong half the time",
  "New hires take 6 months before they can use your GIS tools",
  "You can't get coordinates, demographics, and lot data in the same place",
];

export function EnterprisePrompts() {
  return (
    <section className="relative" style={{ padding: "80px 0" }}>
      <div className="mistx-container">
        <div className="mistx-grid-pattern relative">
          <div className="mb-10 md:mb-20 text-center" data-reveal>
            <h2
              className="text-3xl md:text-5xl"
              style={{
                color: "#1f1f1f",
                letterSpacing: "-0.025em",
                fontWeight: 400,
                maxWidth: 720,
                margin: "0 auto",
              }}
            >
              Legacy GIS slows you down because…
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            data-reveal
            data-reveal-delay="1"
          >
            {PAIN_POINTS.map((text, i) => (
              <div
                key={i}
                className="p-6 md:p-8 flex items-center"
                style={{
                  border: "1px solid #C7D7F8",
                  borderRadius: 20,
                  background: "#F1F5FE",
                  minHeight: 160,
                }}
              >
                <p
                  className="text-base md:text-lg leading-snug"
                  style={{ color: "#1f1f1f", fontWeight: 400 }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
