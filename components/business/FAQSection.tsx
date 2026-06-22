"use client";

import { useState } from "react";

/**
 * Commonly-asked questions — left label + right accordion.
 *
 * Visual system is now lifted from ComparisonSection's left-side feature
 * accordion so the two sections read as members of the same family:
 *  • single rounded-3xl host with a 2px --ent-border-card hairline
 *  • items separated by 1px hairlines (no per-card borders)
 *  • idle rows render at opacity-70; the open row (or any hovered row)
 *    snaps to opacity-100 — same hierarchy logic as the comparison
 *    accordion's "active or hovered" rule
 *  • open row carries a flat #F2F2F2 fill behind its content (the static
 *    sibling of ComparisonSection's countdown bar)
 *  • title typography matches ComparisonSection (#0E173C, 20/22px,
 *    font-semibold, -0.01em); the answer copy uses --ent-text-secondary
 *    at 14/15px, same as the row subtitles in the comparison accordion
 *  • the open-state PlusIcon swaps to --ent-accent on the right
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "Why doesn't Claude or ChatGPT work?",
    a: "General chat models are built for text, not space. They regurgitate old articles about an area, hallucinate coordinates, can't reach live data, and produce no map or GIS output. Columbus is built for the physical world — highest-fidelity fresh data, real spatial and contextual reasoning, and actual maps and visuals as the answer.",
  },
  {
    q: "How do we collect our data?",
    a: "We continuously ingest and fuse authoritative public, commercial, and partner datasets, then validate them spatially so what you query is current and coordinate-accurate — not scraped article text. Coverage and freshness keep expanding as new sources come online.",
  },
  {
    q: "What security measures do we take?",
    a: "Business data is encrypted in transit and at rest, access is scoped per organization, and your private data is never used to train shared models. We support the controls business teams expect before rolling Columbus out across an organization.",
  },
  {
    q: "Is this only for GIS professionals?",
    a: "No. Columbus is designed so anyone — from analysts to non-technical teams — can ask spatial questions in plain language and get map-grade answers, while still giving GIS professionals the full depth and control they need.",
  },
];

function PlusIcon({ open }: { open: boolean }) {
  // A plus whose vertical bar collapses to a minus when open.
  return (
    <span
      aria-hidden
      className="relative inline-block shrink-0 transition-colors duration-300"
      style={{ width: 18, height: 18 }}
    >
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{ width: 18, height: 1.5, backgroundColor: "currentColor" }}
      />
      <span
        className="absolute left-1/2 top-0 -translate-x-1/2 transition-transform duration-300"
        style={{
          width: 1.5,
          height: 18,
          backgroundColor: "currentColor",
          transform: open ? "scaleY(0)" : "scaleY(1)",
        }}
      />
    </span>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      data-faq-section
      className="relative w-full py-24 lg:py-32"
      style={{ backgroundColor: "var(--ent-bg-white)" }}
    >
      <div className="ent-content-bounds grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16">
        {/* Left: section label */}
        <h2
          className="text-[28px] md:text-[36px] lg:text-[44px] font-medium leading-[1.15] max-w-[260px]"
          style={{
            color: "var(--ent-text-primary)",
            letterSpacing: "var(--ent-tracking-heading)",
          }}
        >
          Commonly asked questions
        </h2>

        {/* Right: accordion — single rounded host, hairline-divided rows,
            matches ComparisonSection's left accordion chrome. */}
        <ul
          className="flex flex-col list-none m-0 p-0 overflow-hidden rounded-3xl border-2 border-(--ent-border-card)"
          style={{ background: "transparent" }}
        >
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            const isHovered = hoveredIndex === i;
            const isLast = i === FAQS.length - 1;
            return (
              <li
                key={item.q}
                className={[
                  "relative transition-opacity duration-200",
                  isOpen ? "opacity-100" : isHovered ? "opacity-100" : "opacity-70",
                ].join(" ")}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Open-state fill — flat #F2F2F2 behind the whole row,
                    matching the colour ComparisonSection's countdown bar
                    paints over its active cell. Static (no animation)
                    because FAQs are click-to-toggle, not auto-cycled. */}
                {isOpen && (
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ backgroundColor: "#F2F2F2", zIndex: 0 }}
                  />
                )}

                <h3 className="m-0 relative z-10">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full text-left cursor-pointer flex items-center justify-between gap-6 px-6 md:px-10 py-7 md:py-8"
                  >
                    <span
                      className="text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                      style={{ color: "#0E173C", letterSpacing: "-0.01em" }}
                    >
                      {item.q}
                    </span>
                    <span
                      className="transition-colors duration-300 shrink-0"
                      style={{
                        color: isOpen ? "var(--ent-accent)" : "#0B1B2B",
                      }}
                    >
                      <PlusIcon open={isOpen} />
                    </span>
                  </button>
                </h3>

                {/* Answer — grid-rows trick gives a smooth height
                    transition without measuring. */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="relative z-10 grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="px-6 md:px-10 pb-7 md:pb-8 text-[15px] md:text-[16px] leading-[1.6] max-w-170"
                      style={{
                        // Deep slate — confidently dark for primary reading
                        // content, but a hair softer than the heading ink
                        // (--ent-text-primary #0B1B2B) so the bold question
                        // still leads the row's hierarchy.
                        color: "#2E3D4C",
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>

                {/* Row separator — skipped on the last cell (the host's
                    own border carries the bottom edge). Matches the 1px
                    SOFT separator used between rows in
                    ComparisonSection's left accordion. */}
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute left-0 bottom-0 w-full"
                    style={{ height: 1, backgroundColor: "var(--ent-border-card)" }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
