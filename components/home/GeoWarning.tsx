"use client";

import { useEffect, useRef, useState, useMemo } from "react";

/* ── Word-by-word reveal text ── */
const LINE1_WORDS = "Stop using Language models for Geographical work.".split(" ");
const LINE2_WORDS = "LLMs hallucinate and cannot be trusted for the real world".split(" ");
const ALL_WORDS = [...LINE1_WORDS, ...LINE2_WORDS];
const TOTAL_WORDS = ALL_WORDS.length;
const LINE1_COUNT = LINE1_WORDS.length;

export const GeoWarning = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const rect = s.getBoundingClientRect();
      const scrollable = s.offsetHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Compute per-word opacity based on scroll progress */
  const wordOpacities = useMemo(() => {
    const DIM = 0.12;       // starting opacity for unlit words
    const SPREAD = 0.06;    // scroll range over which a single word fades in
    const START = 0.08;     // progress at which first word starts revealing
    const END = 0.85;       // progress at which last word is fully revealed

    return ALL_WORDS.map((_, i) => {
      const wordStart = START + (i / (TOTAL_WORDS - 1)) * (END - START);
      const t = Math.max(0, Math.min(1, (progress - wordStart) / SPREAD));
      return DIM + (1 - DIM) * t;
    });
  }, [progress]);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "300vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: "#FAFAFA",
          backgroundImage: `linear-gradient(rgba(20,60,160,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,60,160,0.06) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="relative" style={{ zIndex: 2 }}>
          <div className="max-w-[900px] mx-auto px-6">
            {/* Line 1 */}
            <p className="text-center leading-[1.12] tracking-[-0.02em]" style={{ fontSize: "clamp(39px, 5vw, 49px)", fontWeight: 500 }}>
              {LINE1_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="text-[#1D1D1F]"
                  style={{
                    opacity: wordOpacities[i],
                    transition: "opacity 0.05s linear",
                  }}
                >
                  {word}{" "}
                </span>
              ))}
            </p>

            {/* Line 2 */}
            <p className="text-center leading-[1.25] tracking-[-0.01em] mt-6" style={{ fontSize: "clamp(25px, 3.5vw, 39px)", fontWeight: 500 }}>
              {LINE2_WORDS.map((word, i) => {
                const globalIdx = LINE1_COUNT + i;
                const isCannot = word === "cannot";
                return (
                  <span
                    key={i}
                    className={isCannot ? "text-[#37288C]" : "text-[#1D1D1F]"}
                    style={{
                      opacity: wordOpacities[globalIdx],
                      transition: "opacity 0.05s linear",
                      fontWeight: isCannot ? 700 : undefined,
                    }}
                  >
                    {word}{" "}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
