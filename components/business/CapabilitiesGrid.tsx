"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FileSearch, Headphones, Zap, type LucideIcon } from "lucide-react";

/* ── Section: "Enterprise-grade capabilities" ────────────────────────────────
   Three capability tiles in a single panel — same SuperFeatureSection
   `panel` chrome (#FAFAFA fill, 2px --ent-border-card hairline,
   --ent-radius-2xl corner) so the section reads as one demo surface.

   Each tile is left-aligned: a small icon placeholder in the top-left,
   the title below, and a subtitle below the title (lorem ipsum until
   the final copy lands). */

const ITEMS: { title: string; subtitle: string; Icon: LucideIcon }[] = [
  {
    title: "Agent research reports",
    subtitle:
      "Describe what you’re looking for, then select what type of professional report you want. Our agents will investigate.",
    /* FileSearch — a document being inspected; combines the "agent
       investigates" + "report" sides of the capability. */
    Icon: FileSearch,
  },
  {
    title: "24/7 Human support",
    subtitle: "Access Columbus’ personal support on any part of your process.",
    /* Headphones — universal customer-support glyph. */
    Icon: Headphones,
  },
  {
    title: "Light-speed due diligence",
    subtitle:
      "Input a parcel, select the type of report you want. Our agents will complete due diligence in minutes.",
    /* Zap — lightning bolt for "light-speed". */
    Icon: Zap,
  },
];

/* Partner-org logos for the marquee. Source files live in
   public/BusinessPgMedia/VettedPartners/. Heights are pinned via CSS
   (.cap-logo-slot, 44px row), so each <Image> gets a generous nominal
   width/height for the optimizer to derive sharp 2× retina output. */
const PARTNER_LOGOS: string[] = [
  "/BusinessPgMedia/VettedPartners/logo1.png",
  "/BusinessPgMedia/VettedPartners/logo2.png",
  "/BusinessPgMedia/VettedPartners/logo3.png",
  "/BusinessPgMedia/VettedPartners/logo4.png",
  "/BusinessPgMedia/VettedPartners/logo5.png",
  "/BusinessPgMedia/VettedPartners/logo6.png",
  "/BusinessPgMedia/VettedPartners/logo7.png",
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
                  backgroundColor: "#FFFFFF",
                  padding: "clamp(24px, 3vw, 40px)",
                  gap: 16,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(18px)",
                  transition: `opacity 0.6s ease ${0.06 * i}s, transform 0.6s ease ${0.06 * i}s`,
                }}
              >
                {/* Per-tile icon — lucide glyph in Columbus blue. Sized
                    at 40px so the icon footprint matches the previous
                    placeholder square. */}
                <span
                  aria-hidden
                  style={{
                    display: "inline-flex",
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    color: "#0A1342",
                    flexShrink: 0,
                  }}
                >
                  <item.Icon size={36} strokeWidth={1.6} absoluteStrokeWidth />
                </span>
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
                  className="cap-tile-sub text-[16px] leading-[1.5]"
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

        {/* ── Sub-section: "High-fidelity and smart datasets" ──────────────
            Title + subtitle anchor an autoscrolling band of partner-org
            logos below. Vertical spacing mirrors the capabilities title's
            mt-14 lg:mt-20 rhythm so the two halves sit at the same scale. */}
        <div className="mt-20 lg:mt-28 text-center">
          <h3
            className="leading-[1.15] text-[24px] md:text-[30px] lg:text-[36px]"
            style={{
              color: "var(--ent-text-primary)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            High-fidelity and smart datasets
          </h3>
          <p
            className="mx-auto mt-4 text-[15px] md:text-[16px] leading-[1.5]"
            style={{
              color: "var(--ent-text-secondary)",
              letterSpacing: "-0.005em",
              maxWidth: 560,
            }}
          >
            We vet our data with reputable partner organizations.
          </p>

          {/* Partner-logo marquee. Same edge-fade + duplicate-track loop
              pattern the consumer DestinationsSection uses, just sized
              down for small brand marks (44px row, 48px gap). Real PNGs
              from public/BusinessPgMedia/VettedPartners/. */}
          <style>{`
            .cap-logo-mask {
              -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
              mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
            }
            .cap-logo-track {
              display: flex;
              align-items: center;
              gap: 48px;
              width: max-content;
              animation: cap-logo-scroll 40s linear infinite;
            }
            .cap-logo-mask:hover .cap-logo-track { animation-play-state: paused; }
            @keyframes cap-logo-scroll {
              from { transform: translateX(0); }
              to   { transform: translateX(calc(-50% - 24px)); }
            }
            @media (prefers-reduced-motion: reduce) {
              .cap-logo-track { animation: none; }
            }
            /* Logo cell — fixed 57px row height (44px × 1.3 → +30%);
               width tracks the source PNG's intrinsic aspect via auto
               width + height: 100% on the nested <img>. */
            .cap-logo-slot {
              flex: none;
              height: 57px;
              display: inline-flex;
              align-items: center;
            }
            .cap-logo-slot img {
              height: 100%;
              width: auto;
              object-fit: contain;
            }
          `}</style>
          <div className="cap-logo-mask mt-12 lg:mt-16 overflow-hidden">
            <div className="cap-logo-track">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, idx) => (
                <span key={`${src}-${idx}`} className="cap-logo-slot">
                  <Image
                    src={src}
                    alt=""
                    aria-hidden
                    width={200}
                    height={88}
                    sizes="200px"
                    loading="lazy"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
