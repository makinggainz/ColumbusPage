"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ── Section: "Enterprise-grade capabilities" ────────────────────────────────
   Six capability tiles. Tile 1 ("Ask the map anything") is the hero and spans
   2×2 cells on lg, lifting it out of the otherwise uniform 3-up grid — a
   light bento that gives the section a clear focal point without competing
   with the sticky-scroll storytelling that follows.

   Each tile shows its product mockup image (public/cap-grid-1..6.png), a
   bolded label, and a one-line subtitle. The PNGs are already self-contained
   rounded cards (own hairline border + transparent corners), so the tile
   adds no border/radius of its own — that would double up as a visible
   frame.

   Hover state lifts the whole tile by 2px and shifts the label to the
   accent color, signalling interactivity. Tiles aren't anchors (no dedicated
   capability pages exist yet), but the affordance brings the section out of
   "static brochure" territory. */

const ITEMS: { title: string; description: string; image: string }[] = [
  {
    title: "Ask the map anything",
    description: "Natural-language queries across every layer of geospatial data — no GIS expertise required.",
    image: "/cap-grid-1.png",
  },
  {
    title: "Agent research reports",
    description: "Autonomous agents compile site-selection and due-diligence reports in minutes, not weeks.",
    image: "/cap-grid-3.png",
  },
  {
    title: "Generative data layers",
    description: "Spin up custom data overlays on demand, generated from your prompts and our catalogue.",
    image: "/cap-grid-5.png",
  },
  {
    title: "An AI that considers it all",
    description: "Demographics, zoning, coordinates, and your own datasets reasoned over together.",
    image: "/cap-grid-2.png",
  },
  {
    title: "Data Catalogue",
    description: "Thousands of curated, citation-ready datasets ready to query alongside your own.",
    image: "/cap-grid-4.png",
  },
  {
    title: "Light-speed due diligence",
    description: "Run the full diligence stack on a parcel — title, environmental, demographic — in one pass.",
    image: "/cap-grid-6.png",
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

        <div className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 lg:gap-x-12 lg:gap-y-16">
          {ITEMS.map((item, i) => {
            const isHero = i === 0;
            return (
              <article
                key={item.title}
                className={`cap-tile group flex flex-col ${isHero ? "lg:col-span-2 lg:row-span-2" : ""}`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(18px)",
                  transition: `opacity 0.6s ease ${0.06 * i}s, transform 0.6s ease ${0.06 * i}s`,
                }}
              >
                <div className="cap-tile-img-wrap">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={915}
                    height={627}
                    sizes={isHero
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                    className="block w-[92%] h-auto mx-auto cap-tile-img"
                  />
                </div>
                <div className={`mt-5 ${isHero ? "lg:mt-7" : ""} px-2 text-center`}>
                  <h3
                    className={`cap-tile-title font-semibold leading-[1.2] ${isHero ? "text-[22px] md:text-[24px] lg:text-[28px]" : "text-[20px] md:text-[22px]"}`}
                    style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-2 leading-[1.45] mx-auto ${isHero ? "text-[15px] md:text-[16px] lg:text-md max-w-140" : "text-[14px] md:text-[15px] max-w-90"}`}
                    style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.005em" }}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .cap-tile {
          transition: transform 0.35s ease;
        }
        .cap-tile-img-wrap {
          transition: transform 0.35s ease;
        }
        .cap-tile-title {
          transition: color 0.25s ease;
        }
        @media (hover: hover) {
          .cap-tile:hover .cap-tile-img-wrap {
            transform: translateY(-3px);
          }
          .cap-tile:hover .cap-tile-title {
            color: var(--ent-accent);
          }
        }
      `}</style>
    </section>
  );
}
