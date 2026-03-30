"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollRevealQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start filling when top of element hits 95% of viewport,
      // fully filled when top hits 52.5% of viewport (15% faster fill)
      const start = vh * 0.95;
      const end = vh * 0.525;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const text =
    "LLMs hallucinate and cannot be trusted in critical operations, a fundamentally new model is needed for this task";

  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className="relative z-10 max-w-[1287px] mx-auto px-8 min-[1287px]:px-10 pt-0 pb-40 md:pb-52 -mt-16 md:-mt-24"
    >
      <p
        className="text-[24px] md:text-[32px] lg:text-[40px] font-medium leading-[1.3] tracking-[-0.02em]"
      >
        {words.map((word, i) => {
          // Each word fills in based on its position in the sentence
          const wordProgress = (i + 1) / words.length;
          const opacity = progress >= wordProgress ? 1 : 0.12;

          return (
            <span
              key={i}
              style={{
                color: "#1D1D1F",
                opacity,
                transition: "opacity 0.3s ease",
              }}
            >
              {word}{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
}
