"use client";

/**
 * Section 2 of the Lightspark-ported island.
 *
 * Three platform tiles, mirroring Lightspark's `Item_item__*` row
 * (Grid Global Accounts / Grid API / Spark). Each tile leads with a
 * product mark, then `<strong>Commands for the planet.</strong>`-style
 * lead sentence + descriptive body.
 *
 * Lightspark inlines the product wordmarks as inline base64 SVGs; we
 * use the project's existing product logos in `/public` instead since
 * they're proper Columbus brand assets and the user's choice to "use
 * Lightspark's hosted URLs" was effectively pointing at inline assets
 * that have no external counterpart to link to.
 *
 * Reveal-on-enter follows the same IntersectionObserver pattern used
 * in `OurProductsSection.tsx` so the cadence matches across the page.
 */

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SectionHeading } from "@/components/SectionHeading";

interface Tile {
  name: string;
  logo: string;
  logoFilter?: string;
  lead: string;
  body: string;
}

const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

const TILES: Tile[] = [
  {
    name: "Columbus Pro",
    logo: "/logobueno.png",
    logoFilter: COLUMBUS_LOGO_FILTER,
    lead: "Commands for the planet.",
    body: "Ask in natural language; get an answer grounded in physical reality. Live data, real geometries, no batch jobs.",
  },
  {
    name: "MapsGPT",
    logo: "/MapsGPT-logo.png",
    lead: "Maps that think with you.",
    body: "Conversational map generation for everyday questions. Type what you want — get a map that answers it.",
  },
  {
    name: "LGM",
    logo: "/TechnologyPageImages/lgm-globe-icon.png",
    lead: "A foundation model for Earth.",
    body: "Trained on the physical world, not just text. The reasoning core powering every Columbus product.",
  },
];

function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
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
        transition: `opacity 700ms ease-out ${delay}ms, transform 700ms ease-out ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

export function PlatformProducts() {
  return (
    <section className="section">
      <div className="container-site">
        <SectionHeading
          eyebrow="Platform"
          title="Built for the physical world"
          description="Three products, one foundation model. From SDKs to consumer apps, every Columbus surface is grounded in the same Earth-scale reasoning core."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-16">
          {TILES.map((tile, i) => (
            <Reveal key={tile.name} delay={i * 120}>
              <article className="card flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <Image
                    src={tile.logo}
                    alt={`${tile.name} logo`}
                    width={36}
                    height={36}
                    className="object-contain"
                    style={tile.logoFilter ? { filter: tile.logoFilter } : undefined}
                  />
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {tile.name}
                  </h3>
                </div>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  <strong className="font-semibold text-ink">
                    {tile.lead}
                  </strong>{" "}
                  {tile.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlatformProducts;
