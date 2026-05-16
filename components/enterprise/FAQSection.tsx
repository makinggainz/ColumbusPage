"use client";

import { useState } from "react";

/**
 * Commonly-asked questions — left label + right accordion.
 *
 * Layout is inspired by a standard two-column FAQ, but every visual
 * decision comes from the enterprise/homepage system: Funnel Display
 * heading (via the `.ent-scope :is(h1..h6)` rule), `text-ink` / `text-muted`
 * copy, the `#E7E7F1` `border-gridline` hairline, the 7px homepage card
 * corner (`--ent-radius-card`), and the `#0081AC` interactive accent.
 * Single-open accordion; the first item is open by default.
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
    a: "Enterprise data is encrypted in transit and at rest, access is scoped per organization, and your private data is never used to train shared models. We support the controls enterprise teams expect before rolling Columbus out across an organization.",
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

  return (
    <section
      className="relative w-full py-24 lg:py-32"
      style={{ backgroundColor: "var(--ent-bg-white)" }}
    >
      <div className="ent-content-bounds px-4 md:px-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16">
        {/* Left: section label */}
        <h2
          className="text-[28px] md:text-[32px] lg:text-[36px] font-medium leading-[1.15] max-w-[260px]"
          style={{
            color: "var(--ent-text-primary)",
            letterSpacing: "var(--ent-tracking-heading)",
          }}
        >
          Commonly asked questions
        </h2>

        {/* Right: accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.q}
                className="border border-gridline rounded-[7px] bg-white overflow-hidden"
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 px-6 py-5 text-left cursor-pointer"
                  >
                    <span
                      className="text-[18px] md:text-[20px] font-medium leading-[1.4]"
                      style={{
                        color: "var(--ent-text-primary)",
                        letterSpacing: "var(--ent-tracking-body)",
                      }}
                    >
                      {item.q}
                    </span>
                    <span
                      className="transition-colors duration-300"
                      style={{ color: open ? "var(--ent-accent)" : "var(--ent-text-primary)" }}
                    >
                      <PlusIcon open={open} />
                    </span>
                  </button>
                </h3>

                {/* Answer — grid-rows trick gives a smooth height
                    transition without measuring. */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="px-6 pb-6 text-[15px] md:text-[16px] leading-[1.6] max-w-[680px]"
                      style={{
                        color: "var(--ent-text-secondary)",
                        letterSpacing: "var(--ent-tracking-body)",
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
