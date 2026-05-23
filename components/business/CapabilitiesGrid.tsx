"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ── Section: "Enterprise-grade capabilities" ────────────────────────────────
   Six capability tiles in a uniform 3-up grid. Each tile is a miniature
   product-display panel: the same /Environmental/env-bg-1.png sky + clouds
   + palm-tree backdrop the ComparisonSection host card uses, with the
   capability mockup floating in the top-center of the panel so the
   surrounding sky reads as a SuperFeatureSection demo frame. Title sits
   below each panel — no subtitle.

   The inner mockup keeps its 2px design-system hairline (--ent-border-card,
   same border the IndustrySelector panel uses) and a 7px corner
   (--ent-radius-card). overflow:hidden clips both the inner mockup and
   the outer backdrop to their respective corners. */

/* Per-tile backdrop gradient — six distinct top-to-horizon blue ramps,
   each derived from the sky region of the matching industry's chatHero
   ("first SuperFeatureSection background") so the six tiles share a
   palette but every one has its own slightly different blue. Stops are
   (top of sky → mid sky → horizon) for a natural sky-to-horizon falloff. */
const ITEMS: { title: string; image: string; backdrop: string }[] = [
  {
    title: "Ask the map anything",
    image: "/capabilitiesImages/capability-6.png",
    backdrop: "linear-gradient(180deg, #0174D5 0%, #0286E9 50%, #33A8F6 100%)",
  },
  {
    title: "Agent research reports",
    image: "/capabilitiesImages/capability-1.png",
    backdrop: "linear-gradient(180deg, #2F6EC7 0%, #3A84DB 50%, #51A1ED 100%)",
  },
  {
    title: "24/7 personal support",
    image: "/capabilitiesImages/capability-3.png",
    backdrop: "linear-gradient(180deg, #009EFF 0%, #00A8FF 50%, #50CDFF 100%)",
  },
  {
    title: "High-fidelity accurate data",
    image: "/capabilitiesImages/capability-4.png",
    backdrop: "linear-gradient(180deg, #0187EF 0%, #1A99EF 50%, #61BBF7 100%)",
  },
  {
    title: "Data Catalogue",
    image: "/capabilitiesImages/capability-5.png",
    backdrop: "linear-gradient(180deg, #028FEE 0%, #0898F3 50%, #66BFF9 100%)",
  },
  {
    title: "Light-speed due diligence",
    image: "/capabilitiesImages/capability-2.png",
    backdrop: "linear-gradient(180deg, #0A8EEE 0%, #1095F1 50%, #40ADF7 100%)",
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
          className="text-center leading-[1.1] text-[28px] md:text-[36px] lg:text-[45px]"
          style={{ color: "var(--ent-text-primary)", fontWeight: 500, letterSpacing: "-0.02em" }}
        >
          Enterprise-grade capabilities
        </h2>

        <div className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-16 lg:gap-y-20">
          {ITEMS.map((item, i) => (
            <article
              key={item.title}
              className="cap-tile group"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(18px)",
                transition: `opacity 0.6s ease ${0.06 * i}s, transform 0.6s ease ${0.06 * i}s`,
              }}
            >
              {/* Product backdrop panel — per-industry blue-sky gradient
                  behind a tight 6px gutter that frames the inner capability
                  mockup. Outer aspect is set just slightly taller than the
                  1.65 inner so the inner fills with a uniform 6px backdrop
                  showing on every side. Corner radii are kept restrained
                  (rounded-2xl outer, 4px inner) so the tiles read as crisp
                  panels rather than soft cards. */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "1.62 / 1",
                  padding: 6,
                  background: item.backdrop,
                  borderRadius: 13,
                }}
              >
                <div
                  className="cap-tile-img-wrap relative w-full h-full border-2 border-gridline overflow-hidden"
                  style={{ borderRadius: 13 }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <h3
                className="cap-tile-title mt-4 text-center text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                style={{
                  /* Mirrors ComparisonSection's feature-title typography
                     (same size class, weight, leading, tracking, and
                     #0E173C ink) so the two grids read as the same type
                     family across the page. */
                  color: "#0E173C",
                  letterSpacing: "-0.01em",
                  /* Override the .ent-scope heading rule (which forces
                     Funnel Display on every h1–h6) so these tile titles
                     read in the body sans face instead. The h3 stays
                     for accessibility / heading hierarchy. */
                  fontFamily: "var(--ent-font-sans)",
                }}
              >
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
