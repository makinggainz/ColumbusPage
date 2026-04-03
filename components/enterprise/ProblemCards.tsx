"use client";

import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "../home/ContentGrid";

const PAIN_POINTS = [
  "A single site selection report takes your team 2–3 weeks",
  "You pay $10K+ per seat for software half your team can't use",
  "Your analysts spend 60% of their time finding and cleaning data",
  "Coordinates are copy-pasted from Google and wrong half the time",
  "New hires take 6 months before they can use your GIS tools",
  "You can't get coordinates, demographics, and lot data in the same place",
];

export default function ProblemCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ "--grid-line": "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.04)" } as React.CSSProperties}>
      <GridSection
        style={{
          backgroundColor: "transparent",
        }}
      >
        {/* Header row */}
        <div
          className="flex flex-col items-center text-center px-6 md:px-10"
          style={{ paddingTop: 100, paddingBottom: 100 }}
        >
          <h2
            className="text-white leading-[1.1] text-[28px] md:text-[36px] lg:text-[45px]"
            style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 720 }}
          >
            Legacy GIS slows you down because...
          </h2>
        </div>
      </GridSection>

      {/* Full-width card strip — breaks out of the max-width container */}
      <div
        className="w-full grid"
        style={{
          gridTemplateColumns: `repeat(${PAIN_POINTS.length}, 1fr)`,
          backgroundColor: "#060810",
          borderTop: "1px solid var(--grid-line)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
        }}
      >
        {PAIN_POINTS.map((text, i) => (
          <div
            key={i}
            style={{
              padding: "48px 24px",
              backgroundColor: "transparent",
              borderRight: i < PAIN_POINTS.length - 1 ? "1px solid var(--grid-line)" : "none",
              borderBottom: "1px solid var(--grid-line)",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center" as const,
              letterSpacing: "-0.01em",
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
