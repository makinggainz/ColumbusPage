"use client";

/**
 * Section 4 of the Lightspark-ported island.
 *
 * Case-study card. Mirrors Lightspark's `CoinbaseCard_card__*`:
 * dark-themed surface, two columns. Left holds the partner logo,
 * h3 headline, quote, attribution, and "Learn more" CTA. Right
 * holds a small caption above a phone-shaped mockup.
 *
 * The original Lightspark phone screenshot is inlined as a 50KB+
 * base64 PNG — not portable. We render a styled mockup placeholder
 * that the user can swap for a real Columbus partner screenshot in
 * a follow-up.
 *
 * Copy rebranded to a generic Columbus partner per the approved
 * plan; the user can swap the partner identity later.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(24px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

// Stand-in partner wordmark — replace with a real partner SVG/PNG
// when one is supplied. The cube-and-name treatment reads as a
// neutral placeholder that doesn't impersonate any real brand.
function PartnerLogo() {
  return (
    <div
      className="inline-flex items-center gap-2 text-white/85"
      aria-label="Partner placeholder"
    >
      <span
        aria-hidden
        className="inline-block size-5 rounded-[4px]"
        style={{
          background:
            "linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-soft) 100%)",
        }}
      />
      <span className="text-sm font-semibold uppercase tracking-[0.18em]">
        Partner
      </span>
    </div>
  );
}

// Phone-shaped placeholder. Rounded body, notch hint, three skeleton
// rows. Replaces Lightspark's 580×930 inlined PNG of the Coinbase
// Lightning network selection screen.
function PhoneMockup() {
  return (
    <div
      className="relative mx-auto aspect-[580/930] w-full max-w-[280px] overflow-hidden rounded-[36px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      aria-hidden
    >
      {/* notch */}
      <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-ink/85" />
      {/* status bar */}
      <div className="mt-12 flex justify-between px-6 text-[10px] text-ink/40">
        <span>9:41</span>
        <span>•••</span>
      </div>
      {/* screen content */}
      <div className="mt-5 space-y-3 px-5">
        <div className="h-3 w-2/3 rounded bg-ink/10" />
        <div className="h-3 w-1/2 rounded bg-ink/10" />
        <div className="mt-4 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-[14px] border border-ink/5 bg-bg1 p-3"
            >
              <div className="size-8 rounded-full bg-brand/15" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-3/4 rounded bg-ink/10" />
                <div className="h-2 w-1/2 rounded bg-ink/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CaseStudyCard() {
  return (
    <section className="section">
      <div className="container-site">
        <Reveal>
          <div className="overflow-hidden rounded-[20px] bg-ink text-white">
            <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 md:p-12 lg:p-16">
              {/* Left column — partner logo, headline, quote, CTA */}
              <div>
                <PartnerLogo />
                <h3 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                  Faster, more grounded location intelligence with Columbus
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-white/75">
                  &ldquo;We partnered with Columbus to replace a patchwork of GIS
                  tools with a single platform that lets our team ask questions
                  of the physical world in plain English.&rdquo;
                  <span className="mt-3 block text-sm font-medium text-white/60">
                    Director of Geospatial Engineering, partner placeholder
                  </span>
                </p>
                <a
                  href="#"
                  className="mt-8 inline-flex items-center justify-center rounded-button bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
                >
                  Learn more
                </a>
              </div>

              {/* Right column — caption + phone mockup */}
              <div>
                <p className="mb-4 text-sm text-white/60">
                  Connecting field teams to Earth-scale geospatial reasoning
                </p>
                <PhoneMockup />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CaseStudyCard;
