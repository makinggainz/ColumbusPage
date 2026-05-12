// SolutionBanner (still exported as DesignPartnersStrip so the page wire
// stays stable). Original ColumbusPage SolutionShowcase copy preserved:
// "Its time for a more powerful and intuitive GIS." + subtitle.
export function DesignPartnersStrip() {
  return (
    <section className="relative" style={{ padding: "100px 0" }}>
      <div className="mistx-container">
        <div
          className="flex flex-col items-center text-center max-w-2xl mx-auto"
          data-reveal
        >
          <h2
            className="text-3xl md:text-5xl"
            style={{
              color: "#1f1f1f",
              letterSpacing: "-0.025em",
              fontWeight: 400,
              maxWidth: 720,
            }}
          >
            Its time for a more powerful and intuitive GIS.
          </h2>
          <p
            className="mt-6 md:mt-10 text-lg md:text-xl leading-relaxed"
            style={{
              color: "rgba(31,31,31,0.55)",
              letterSpacing: "-0.01em",
              maxWidth: 540,
            }}
          >
            See how Columbus Pro can speed up your workflow.
          </p>
        </div>
      </div>
    </section>
  );
}
