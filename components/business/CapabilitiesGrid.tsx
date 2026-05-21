"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ── Section: "Enterprise-grade capabilities" ────────────────────────────────
   Six capability tiles in a uniform 3-up grid. Each tile shows its product
   mockup image (public/cap-grid-1..6.png) with a bolded label stacked
   directly below — no subtitle.

   The PNGs are already self-contained rounded cards (own hairline border +
   transparent rounded corners), so the tile adds no border/radius of its
   own — that would double up as a visible frame. The image just renders at
   the cell width with its intrinsic aspect ratio.

   Hover lifts the image 3px and shifts the label to the accent color,
   signalling depth without inventing dead routes (no capability detail
   pages exist yet, so tiles stay non-anchor). */

const ITEMS: { title: string; image: string }[] = [
  { title: "Ask the map anything", image: "/cap-grid-1.png" },
  { title: "Agent research reports", image: "/cap-grid-3.png" },
  { title: "Generative data layers", image: "/cap-grid-5.png" },
  { title: "An AI that considers it all", image: "/cap-grid-2.png" },
  { title: "Data Catalogue", image: "/cap-grid-4.png" },
  { title: "Light-speed due diligence", image: "/cap-grid-6.png" },
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
              <div className="cap-tile-img-wrap">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={915}
                  height={627}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="block w-[88%] h-auto mx-auto"
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

      <style jsx>{`
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
