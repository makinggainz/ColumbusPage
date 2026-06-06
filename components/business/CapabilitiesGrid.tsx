"use client";

import { useEffect, useRef, useState } from "react";

/* ── Section: "Enterprise-grade capabilities" ────────────────────────────────
   Three capability tiles in a single panel — same SuperFeatureSection
   `panel` chrome (#FAFAFA fill, 2px --ent-border-card hairline,
   --ent-radius-2xl corner) so the section reads as one demo surface.

   Each tile is left-aligned: a small icon placeholder in the top-left,
   the title below, and a subtitle below the title (lorem ipsum until
   the final copy lands). */

const ITEMS: { title: string; subtitle: string }[] = [
  {
    title: "Agent research reports",
    subtitle:
      "Describe what you’re looking for, then select what type of professional report you want. Our agents will investigate.",
  },
  {
    title: "24/7 Human support",
    subtitle: "Access Columbus’ personal support on any part of your process.",
  },
  {
    title: "Light-speed due diligence",
    subtitle:
      "Input a parcel, select the type of report you want. Our agents will complete due diligence in minutes.",
  },
];

export default function CapabilitiesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ backgroundColor: "#FFFFFF", paddingTop: "var(--ent-section-lg)", paddingBottom: "var(--ent-section-lg)" }}
    >
      <div className="ent-content-bounds">
        <h2
          className="text-center leading-[1.1] text-[28px] md:text-[36px] lg:text-[44px]"
          style={{ color: "var(--ent-text-primary)", fontWeight: 500, letterSpacing: "-0.02em" }}
        >
          Enterprise-grade capabilities
        </h2>

        {/* Single panel wrapping the three tiles — mirrors
            SuperFeatureSection's `panel` chrome so the capabilities grid
            reads as one demo surface. Inner dividers are a 1px gap with
            the panel's gridline color showing through, so each cell
            extends edge-to-edge inside the panel. */}
        <div
          className="mt-14 lg:mt-20 overflow-hidden"
          style={{
            border: "2px solid var(--ent-border-card)",
            borderRadius: "var(--ent-radius-2xl)",
          }}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 3, backgroundColor: "var(--color-gridline)" }}
          >
            {ITEMS.map((item, i) => (
              <article
                key={item.title}
                className="cap-tile group flex flex-col items-start text-left"
                style={{
                  backgroundColor: "#FAFAFA",
                  padding: "clamp(24px, 3vw, 40px)",
                  gap: 16,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(18px)",
                  transition: `opacity 0.6s ease ${0.06 * i}s, transform 0.6s ease ${0.06 * i}s`,
                }}
              >
                {/* Small icon placeholder — flat blue rounded square in
                    the top-left. Stand-in until real per-tile icons
                    land. */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: "#0080FF",
                    flexShrink: 0,
                  }}
                  aria-hidden
                />
                <h3
                  className="cap-tile-title text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                  style={{
                    color: "#0E173C",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--ent-font-sans)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="cap-tile-sub text-[14px] md:text-[15px] leading-[1.5]"
                  style={{
                    color: "var(--ent-text-secondary)",
                    letterSpacing: "-0.005em",
                    margin: 0,
                  }}
                >
                  {item.subtitle}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
