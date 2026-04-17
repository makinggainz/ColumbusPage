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
      // fully filled when top hits 52.5% of viewport
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
    "We're building foundation models that understand the physical world through geospatial core reasoning.";

  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className="relative z-10 max-w-[1287px] mx-auto px-8 min-[1287px]:px-10 pb-12 md:pb-16"
    >
      <p
        className="text-center text-[1.5rem] leading-[2rem] md:text-[1.75rem] md:leading-[2.25rem] lg:text-[2rem] lg:leading-[2.5rem]"
        style={{
          fontFamily: "var(--md-sys-typescale-headline-large-font)",
          fontWeight: "var(--md-sys-typescale-headline-large-weight)",
          letterSpacing: "var(--md-sys-typescale-headline-large-tracking)",
        }}
      >
        {words.map((word, i) => {
          const wordProgress = (i + 1) / words.length;
          const opacity = progress >= wordProgress ? 1 : 0.12;

          return (
            <span
              key={i}
              style={{
                color: "var(--md-sys-color-on-surface)",
                opacity,
                transition: `opacity var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)`,
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
