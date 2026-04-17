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
    "Columbus-01 processes satellite imagery, terrain data, human activity, and temporal patterns to generate actionable intelligence across real estate, research, and consumer domains.";
  const tagline = "Think of us like the OpenAI for maps.";

  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className="relative z-10 max-w-[700px] mx-auto px-8 md:px-10 pb-12 md:pb-16"
    >
      <p
        className="text-center text-[16px] leading-[1.65] md:text-[18px] lg:text-[20px]"
        style={{
          fontWeight: 400,
          letterSpacing: "-0.01em",
        }}
      >
        {words.map((word, i) => {
          const wordProgress = (i + 1) / words.length;
          const opacity = progress >= wordProgress ? 1 : 0.12;

          return (
            <span
              key={i}
              style={{
                color: "rgba(10,19,68,0.55)",
                opacity,
                transition: `opacity var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)`,
              }}
            >
              {word}{" "}
            </span>
          );
        })}
        <br />
        <span style={{ color: "#0A1344", fontWeight: 500, opacity: progress >= 1 ? 1 : 0.12, transition: "opacity var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)" }}>
          {tagline}
        </span>
      </p>
    </div>
  );
}
