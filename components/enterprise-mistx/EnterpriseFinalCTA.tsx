import { MistxArrow } from "./MistxArrow";

// FinalCTA — original ColumbusPage ChatSection copy preserved:
// "Chat with us now about Columbus Pro" + "Talk to Founders" CTA.
// Rendered on MistX pale-blue surface (the page's signature, in place of
// the dark gradient hero of the original).
export function EnterpriseFinalCTA() {
  return (
    <section id="cta" className="relative" style={{ padding: "100px 0 140px" }}>
      <div className="mistx-container">
        <div className="text-center max-w-2xl mx-auto" data-reveal>
          <h2
            className="text-3xl md:text-5xl"
            style={{
              color: "#1f1f1f",
              letterSpacing: "-0.025em",
              fontWeight: 400,
            }}
          >
            Chat with us now about Columbus Pro.
          </h2>
          <div className="mt-8 md:mt-12 flex justify-center">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm transition-colors"
              style={{
                background: "#1f1f1f",
                color: "#ffffff",
                borderRadius: 7,
                fontWeight: 500,
              }}
            >
              Talk to Founders
              <span
                className="transition-transform group-hover:translate-x-0.5"
                style={{ color: "#154ACC" }}
              >
                <MistxArrow className="w-3 h-3 shrink-0" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
