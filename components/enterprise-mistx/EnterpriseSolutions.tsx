"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

// FeatureScroll (still exported as EnterpriseSolutions so the page wire
// stays stable). The six product capabilities from the original
// ColumbusPage StickyScrollSection, restyled in MistX's sticky-scroll
// vocabulary: tall text rail on the left, single sticky visual on the
// right that swaps in time with the scrolled item.

type Feature = {
  id: string;
  label: string;
  description: string;
  image: string;
};

const FEATURES: Feature[] = [
  {
    id: "data-collection",
    label: "Data Collection",
    description:
      "Columbus enables anyone to be super-explorers. Let us help you find answers faster.",
    image: "/enterprise/desk.png",
  },
  {
    id: "proprietary-data",
    label: "Proprietary Data",
    description:
      "The most expansive geospatial data catalogue available — vetted, high-fidelity datasets that no one else has.",
    image: "/enterprise/dmap.png",
  },
  {
    id: "map-chat",
    label: "Map Chat",
    description:
      "Query any location on Earth in natural language. Ask questions, get maps and spatial answers instantly.",
    image: "/enterprise/mapchatEnterprise.png",
  },
  {
    id: "research-reports",
    label: "Research Reports",
    description:
      "Generate full site-selection and due diligence reports from a single prompt. What took weeks now takes minutes.",
    image: "/enterprise/bmapp.png",
  },
  {
    id: "generated-layers",
    label: "Generative Geodata",
    description:
      "AI-generated geospatial datasets that fill gaps where traditional surveying is too expensive or unavailable.",
    image: "/enterprise/geocoding.png",
  },
  {
    id: "human-support",
    label: "24/7 Human Support",
    description:
      "Real humans available around the clock — find datasets, get platform tips, or connect with a live agent instantly.",
    image: "/enterprise/humanbg.png",
  },
];

export function EnterpriseSolutions() {
  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best = -1;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) {
              best = idx;
              bestRatio = entry.intersectionRatio;
            }
          }
        });
        if (best >= 0) setActiveIdx(best);
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="solutions" className="relative" style={{ padding: "80px 0" }}>
      <div className="mistx-container">
        <div className="mistx-grid-pattern relative">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 lg:gap-16">
            {/* LEFT — text rail */}
            <div className="flex flex-col">
              {FEATURES.map((s, i) => (
                <div
                  key={s.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-idx={i}
                  className="py-10 lg:py-24 lg:min-h-[60vh] flex flex-col justify-center gap-4"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid #C7D7F8",
                  }}
                  data-reveal
                >
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color:
                        i === activeIdx
                          ? "#154ACC"
                          : "rgba(31,31,31,0.40)",
                    }}
                  >
                    {s.label}
                  </span>
                  <p
                    className="text-2xl md:text-3xl transition-colors duration-500"
                    style={{
                      color:
                        i === activeIdx ? "#1f1f1f" : "rgba(31,31,31,0.35)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                      fontWeight: 400,
                    }}
                  >
                    {s.description}
                  </p>

                  {/* Mobile inline visual */}
                  <div
                    className="lg:hidden mt-4 relative h-[320px] overflow-hidden"
                    style={{
                      border: "1px solid #C7D7F8",
                      borderRadius: 20,
                      background: "#ffffff",
                    }}
                  >
                    <img
                      src={s.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT — sticky visual (desktop only) */}
            <div className="hidden lg:block">
              <div
                className="sticky top-24 h-[640px] overflow-hidden"
                style={{
                  border: "1px solid #C7D7F8",
                  borderRadius: 20,
                  background: "#ffffff",
                }}
              >
                {FEATURES.map((s, i) => (
                  <div
                    key={s.id}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      opacity: i === activeIdx ? 1 : 0,
                      pointerEvents: i === activeIdx ? "auto" : "none",
                    }}
                    aria-hidden={i !== activeIdx}
                  >
                    <img
                      src={s.image}
                      alt={s.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
