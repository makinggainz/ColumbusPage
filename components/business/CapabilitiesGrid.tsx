"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";
// Static imports → AVIF + blur-up for the six capability tiles.
import cap1 from "@/public/capabilitiesImages/capability-1.png";
import cap2 from "@/public/capabilitiesImages/capability-2.png";
import cap3 from "@/public/capabilitiesImages/capability-3.png";
import cap4 from "@/public/capabilitiesImages/capability-4.png";
import cap5 from "@/public/capabilitiesImages/capability-5.png";
import cap6 from "@/public/capabilitiesImages/capability-6.png";

/* ── Section: "Enterprise-grade capabilities" ────────────────────────────────
   Six capability tiles in a uniform 3-up grid. The whole grid is wrapped in
   a single panel — same chrome the SuperFeatureSection `panel` mode uses
   (#FAFAFA fill, 2px --ent-border-card hairline, --ent-radius-2xl corner) —
   so the section reads as one "live demo" surface containing all six
   capabilities rather than six independently-floating cards.

   Each tile inside is just the product mockup (2px hairline, restrained
   corner) followed by its label. No per-tile backdrop. */

const ITEMS: { title: string; image: StaticImageData }[] = [
  { title: "Ask the map anything", image: cap6 },
  { title: "Agent research reports", image: cap1 },
  { title: "24/7 personal support", image: cap3 },
  { title: "High-fidelity accurate data", image: cap4 },
  { title: "Data Catalogue", image: cap5 },
  { title: "Light-speed due diligence", image: cap2 },
];

export default function CapabilitiesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const warm = useMediaWarm();

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

        {/* Single panel wrapping all six tiles — mirrors
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
                className="cap-tile group flex flex-col items-center"
                style={{
                  backgroundColor: "#FAFAFA",
                  padding: "clamp(24px, 3vw, 40px)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(18px)",
                  transition: `opacity 0.6s ease ${0.06 * i}s, transform 0.6s ease ${0.06 * i}s`,
                }}
              >
                <div
                  className="cap-tile-img-wrap relative w-full overflow-hidden"
                  style={{
                    aspectRatio: "1.65 / 1",
                    borderRadius: 7,
                    border: "1px solid var(--color-gridline)",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    loading={warm ? "eager" : "lazy"}
                    fetchPriority={warm ? "low" : undefined}
                    className="object-contain"
                  />
                </div>
                <h3
                  className="cap-tile-title mt-5 text-center text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                  style={{
                    color: "#0E173C",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--ent-font-sans)",
                  }}
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
