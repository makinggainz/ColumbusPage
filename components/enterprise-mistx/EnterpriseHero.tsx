/* eslint-disable @next/next/no-img-element */
import { MistxArrow } from "./MistxArrow";

// Hero — original ColumbusPage copy preserved verbatim, restyled in MistX
// visual language (centered headline, declarative voice, MistX pale-blue
// surface, brand-blue arrow on the CTA).
export function EnterpriseHero() {
  return (
    <section
      className="relative"
      style={{
        background: "#F1F5FE",
        paddingTop: "var(--mistx-nav-height, 72px)",
        paddingBottom: "100px",
        minHeight: "100vh",
      }}
    >
      <div className="mistx-container pt-24 md:pt-36 lg:pt-44 relative z-10">
        <div
          className="max-w-3xl mx-auto flex flex-col items-center text-center gap-10 md:gap-12"
          data-reveal
        >
          <h1
            className="text-4xl sm:text-5xl md:text-[56px] lg:text-[72px]"
            style={{
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: "#1f1f1f",
              fontWeight: 400,
            }}
          >
            An Agentic GIS platform.
          </h1>

          <p
            className="text-xl md:text-2xl"
            style={{
              color: "rgba(31,31,31,0.60)",
              letterSpacing: "-0.015em",
              lineHeight: 1.25,
              fontWeight: 400,
              maxWidth: 520,
            }}
          >
            GIS so easy, the janitor could be your new researcher.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm transition-colors"
              style={{
                background: "#1f1f1f",
                color: "#ffffff",
                borderRadius: 7,
              }}
            >
              Talk to Founders
              <span
                className="inline-block transition-transform group-hover:translate-x-0.5"
                style={{ color: "#154ACC" }}
              >
                <MistxArrow className="w-3 h-3 shrink-0" />
              </span>
            </a>
          </div>
        </div>

        {/* Platform screenshot — masked so the bottom dissolves into the page. */}
        <div
          className="mt-12 md:mt-20 relative"
          data-reveal
          data-reveal-delay="1"
        >
          <img
            src="/enterprise/desk.png"
            alt="Columbus Pro platform"
            className="block w-full h-auto"
            style={{
              borderRadius: 20,
              border: "1px solid #C7D7F8",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 35%, transparent 96%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 35%, transparent 96%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
