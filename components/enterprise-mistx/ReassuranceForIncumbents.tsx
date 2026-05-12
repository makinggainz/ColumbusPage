import { MistxArrow } from "./MistxArrow";

// ProductBanner (still exported as ReassuranceForIncumbents so the page
// wire stays stable). Original ColumbusPage copy preserved:
// "Columbus Pro — GIS made effortless" + "Try Demo" CTA.
// Rendered as a MistX Pattern B filled-feature panel (bg-mistral-beige-deep
// equivalent = #DCE7FB).
export function ReassuranceForIncumbents() {
  return (
    <section className="relative" style={{ padding: "100px 0" }}>
      <div className="mistx-container">
        <div
          className="px-6 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32 text-center"
          style={{
            background: "#DCE7FB",
            borderRadius: 20,
          }}
          data-reveal
        >
          <h2
            className="text-3xl md:text-5xl lg:text-[64px] mx-auto"
            style={{
              color: "#1f1f1f",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              fontWeight: 400,
              maxWidth: 820,
            }}
          >
            <strong style={{ fontWeight: 600 }}>Columbus Pro</strong> — GIS
            made effortless.
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
              Try Demo
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
