"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ── Section: "Enterprise-grade capabilities" ────────────────────────────────
   Bento grid of six capability tiles, on a 4-column / 3-row layout:

     ┌──────────┬──────┐
     │  hero    │  t2  │   hero  = col-span-2, row-span-2  (Ask anything)
     │  (2×2)   ├──────┤   t2/t3 = col-span-2              (wide)
     │          │  t3  │   t4/t5 = col-span-1              (small)
     ├────┬─────┼──────┤   t6    = col-span-2              (wide)
     │ t4 │ t5  │  t6  │
     └────┴─────┴──────┘

   Each tile is a white card with the canonical 7px radius and #E7E7F1
   hairline (matches PromptShowcase, FAQSection, etc.). Title + description
   live INSIDE the card with padded text, then a product mockup fills the
   remaining space — composition adjusts per variant:

     - hero  : text top, large image fills the rest, centered
     - wide  : text left half, image right half (horizontal split)
     - small : text-only (no image — too cramped to read at 1×1)

   Below `lg`, the grid collapses: 2-col on `sm` (all tiles equal weight,
   variant treatments still apply per tile shape) and a single stacked
   column on mobile. */

type Variant = "hero" | "wide" | "small";

const ITEMS: { title: string; description: string; image: string; variant: Variant; span: string }[] = [
  {
    title: "Ask the map anything",
    description: "Natural-language queries across every layer of geospatial data — no GIS expertise required.",
    image: "/cap-grid-1.png",
    variant: "hero",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Agent research reports",
    description: "Autonomous agents compile site-selection and due-diligence reports in minutes, not weeks.",
    image: "/cap-grid-3.png",
    variant: "wide",
    span: "lg:col-span-2",
  },
  {
    title: "Generative data layers",
    description: "Spin up custom data overlays on demand, generated from your prompts and our catalogue.",
    image: "/cap-grid-5.png",
    variant: "wide",
    span: "lg:col-span-2",
  },
  {
    title: "An AI that considers it all",
    description: "Demographics, zoning, coordinates, and your own datasets reasoned over together.",
    image: "/cap-grid-2.png",
    variant: "small",
    span: "lg:col-span-1",
  },
  {
    title: "Data Catalogue",
    description: "Thousands of curated, citation-ready datasets ready to query.",
    image: "/cap-grid-4.png",
    variant: "small",
    span: "lg:col-span-1",
  },
  {
    title: "Light-speed due diligence",
    description: "Run the full diligence stack on a parcel — title, environmental, demographic — in one pass.",
    image: "/cap-grid-6.png",
    variant: "wide",
    span: "lg:col-span-2",
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

        <div
          className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
          style={{ gridAutoRows: "minmax(240px, auto)" }}
        >
          {ITEMS.map((item, i) => (
            <article
              key={item.title}
              className={`cap-tile group relative overflow-hidden bg-white border border-gridline rounded-[7px] ${item.span}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(18px)",
                transition: `opacity 0.6s ease ${0.06 * i}s, transform 0.6s ease ${0.06 * i}s, border-color 0.25s ease, box-shadow 0.25s ease`,
              }}
            >
              {item.variant === "hero" && <HeroTile item={item} />}
              {item.variant === "wide" && <WideTile item={item} />}
              {item.variant === "small" && <SmallTile item={item} />}
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (hover: hover) {
          .cap-tile:hover {
            border-color: var(--ent-border-accent);
            box-shadow: 0 6px 24px -10px rgba(0, 129, 172, 0.18);
          }
        }
      `}</style>
    </section>
  );
}

/* ── Variant subcomponents ──────────────────────────────────────────────── */

type Item = { title: string; description: string; image: string };

function TileCopy({ item, size }: { item: Item; size: "hero" | "wide" | "small" }) {
  const titleClass =
    size === "hero" ? "text-[24px] md:text-[26px] lg:text-[30px]"
    : size === "wide" ? "text-[19px] md:text-[21px]"
    : "text-[17px] md:text-[18px]";
  const descClass =
    size === "hero" ? "text-[15px] md:text-[16px] max-w-[460px]"
    : size === "wide" ? "text-[13.5px] md:text-[14.5px] max-w-[360px]"
    : "text-[13px] md:text-[13.5px]";
  return (
    <div>
      <h3
        className={`${titleClass} font-semibold leading-[1.2]`}
        style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
      >
        {item.title}
      </h3>
      <p
        className={`${descClass} mt-2 leading-[1.45]`}
        style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.005em" }}
      >
        {item.description}
      </p>
    </div>
  );
}

function HeroTile({ item }: { item: Item }) {
  return (
    <div className="flex h-full flex-col p-7 md:p-9">
      <TileCopy item={item} size="hero" />
      <div className="relative mt-6 flex-1 min-h-55 md:min-h-65">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}

function WideTile({ item }: { item: Item }) {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <div className="flex flex-col justify-center p-6 md:p-7 md:w-[44%] md:shrink-0">
        <TileCopy item={item} size="wide" />
      </div>
      <div className="relative flex-1 min-h-40 md:min-h-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 33vw"
          className="object-contain object-bottom-right p-3 md:p-4"
        />
      </div>
    </div>
  );
}

function SmallTile({ item }: { item: Item }) {
  return (
    <div className="flex h-full flex-col justify-between p-6 md:p-7">
      <TileCopy item={item} size="small" />
      <div
        aria-hidden
        className="mt-5 h-0.75 w-10 rounded-full"
        style={{ backgroundColor: "var(--ent-accent)" }}
      />
    </div>
  );
}
