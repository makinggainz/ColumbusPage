"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ── Section: "Enterprise-grade capabilities" ────────────────────────────────
   Six capability tiles in a uniform 3-up grid. Each tile shows its product
   mockup image (public/capabilitiesImages/capability-1..6.png) with a bolded
   label stacked directly below — no subtitle.

   Each image carries the design-system card chrome — a hairline #E7E7F1
   border (--ent-border-card, same hairline used by the IndustrySelector
   panel directly below this section) and a 7px corner (--ent-radius-card,
   the canonical card radius). overflow:hidden via rounded-[7px] clips the
   raw screenshot to that corner.

   Hover lifts the image 3px and shifts the label to the accent color,
   signalling depth without inventing dead routes (no capability detail
   pages exist yet, so tiles stay non-anchor). */

const ITEMS: { title: string; image: string }[] = [
  { title: "Ask the map anything", image: "/capabilitiesImages/capability-6.png" },
  { title: "Agent research reports", image: "/capabilitiesImages/capability-1.png" },
  { title: "24/7 personal support", image: "/capabilitiesImages/capability-3.png" },
  { title: "High-fidelity accurate data", image: "/capabilitiesImages/capability-4.png" },
  { title: "Data Catalogue", image: "/capabilitiesImages/capability-5.png" },
  { title: "Light-speed due diligence", image: "/capabilitiesImages/capability-2.png" },
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

        {/* Card panel — matches the ComparisonSection content card
            (--ent-bg-card surface, hairline border, 2xl radius) so this
            grid reads as part of the same design-system family. */}
        <div
          className="mt-14 lg:mt-20"
          style={{
            backgroundColor: "#FAFAFA",
            border: "2px solid var(--ent-border-dark-grid)",
            borderRadius: "var(--ent-radius-2xl)",
            paddingTop: "var(--ent-space-12)",
            paddingBottom: "var(--ent-space-12)",
            paddingLeft: "clamp(20px, 3vw, 40px)",
            paddingRight: "clamp(20px, 3vw, 40px)",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-16 lg:gap-y-20">
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
                {/* Aspect-locked wrapper — the source PNGs span 1.60–1.67
                    ratios, so leaving `h-auto` makes each tile a slightly
                    different height and the titles below misalign across a
                    row. Pinning the wrapper to 1.65 + object-cover keeps
                    every tile identical in height. */}
                <div className="cap-tile-img-wrap relative w-[88%] mx-auto aspect-[1.65/1] rounded-[7px] border-2 border-gridline overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <h3
                  className="cap-tile-title mt-4 text-center text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                  style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
                >
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
