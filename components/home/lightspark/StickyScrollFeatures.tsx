"use client";

/**
 * Section 3 of the Lightspark-ported island.
 *
 * Sticky-scroll feature carousel. Left column carries the section
 * heading and stays pinned (CSS `position: sticky`) while the right
 * column scrolls past with three pillar cards that reveal in
 * sequence. Mirrors Lightspark's `StickyScroll_productScroll__*`
 * pattern.
 *
 * Below the `md` breakpoint the layout collapses to a single column
 * and sticky is dropped — the heading and cards stack vertically.
 *
 * Copy rebranded to Columbus per the approved plan: Instant / Open /
 * Grounded (replacing Lightspark's Instant / Open / Simple).
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface Pillar {
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    title: "Instant.",
    body:
      "Generate, query, and reason over maps in real time — built for live data, not nightly batches. Every answer reflects the planet as it is now.",
  },
  {
    title: "Open.",
    body:
      "Works with any data source, any projection, any geometry. No closed pipelines, no vendor lock-in — bring your own data or use ours.",
  },
  {
    title: "Grounded.",
    body:
      "Rooted in physical reality, not synthetic data. Every answer ties back to a verifiable place on Earth — you can always check the receipts.",
  },
];

export function StickyScrollFeatures() {
  return (
    <section className="section">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left rail — sticky heading. self-start so sticky has
             somewhere to anchor; top-[20vh] keeps the heading
             roughly mid-screen as the user scrolls the cards. */}
          <div className="md:sticky md:top-[20vh] md:self-start">
            <h2 className="text-3xl font-medium tracking-tight leading-snug text-ink sm:text-4xl">
              Columbus Earth is making geospatial intelligence{" "}
              <span className="text-brand">instant</span>,{" "}
              <span className="text-brand">open</span>, and{" "}
              <span className="text-brand">grounded</span>.
            </h2>
          </div>

          {/* Right column — three pillar cards that reveal as they
             enter the viewport. */}
          <div className="space-y-6">
            {PILLARS.map((pillar) => (
              <PillarCard key={pillar.title} pillar={pillar} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const animate = reduced || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 };

  return (
    <motion.article
      ref={ref}
      className="card"
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={animate}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-base leading-relaxed text-muted">
        <strong className="font-semibold text-ink">{pillar.title}</strong>{" "}
        {pillar.body}
      </p>
    </motion.article>
  );
}

export default StickyScrollFeatures;
