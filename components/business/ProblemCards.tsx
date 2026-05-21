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
    <div ref={sectionRef} style={{ "--grid-line": "var(--ent-border-dark-grid)", backgroundColor: "transparent" } as React.CSSProperties}>
      <GridSection
        style={{
          backgroundColor: "transparent",
        }}
      >
        {/* Header row. This heading rides up onto the hero photo's bled-down
            lower edge, so a soft white radial gradient sits behind it as a
            legibility wash — bright at the centre, fading to transparent so
            the photo still reads around the text. */}
        <div
          className="flex flex-col items-center text-center px-6 md:px-10"
          style={{
            paddingTop: "var(--ent-section-sm)",
            paddingBottom: "var(--ent-section-sm)",
            background:
              "radial-gradient(ellipse 55% 100% at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.78) 42%, rgba(255,255,255,0) 78%)",
          }}
        >
          <h2
            className="text-ink leading-[1.1] text-[28px] md:text-[36px] lg:text-[49px]"
            style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 720 }}
          >
            Legacy GIS slows you down because...
          </h2>
        </div>
      </GridSection>

      {/* Card strip — slightly narrowed to the standard content bound
          (1287px) so it no longer hits the viewport edges. Scrollable
          on mobile, grid on desktop. Fully bordered on all 4 sides
          with the design-system's 2xl radius (24px) for panel-sized
          containers. */}
      <div
        className="w-full max-w-[1287px] mx-auto overflow-x-auto lg:overflow-x-visible"
        style={{
          // Transparent so the shared B2+B3 city line-art backdrop reads
          // through the strip; only the individual cards paint white.
          backgroundColor: "transparent",
          border: "1px solid var(--grid-line)",
          borderRadius: "var(--ent-radius-2xl)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          className="flex lg:grid"
          style={{
            gridTemplateColumns: `repeat(${PAIN_POINTS.length}, 1fr)`,
          }}
        >
          {PAIN_POINTS.map((text, i) => {
            const isFirst = i === 0;
            const isLast = i === PAIN_POINTS.length - 1;
            return (
              <div
                key={i}
                className="shrink-0 lg:shrink lg:w-auto! lg:h-auto! px-9 py-5 lg:px-6 lg:py-12"
                style={{
                  width: 210,
                  height: 210,
                  // Subtle off-white fill (#FAFAFA) — same tint used in
                  // PromptShowcase / StickyScrollSection so the pain-point
                  // cards read as part of the same surface family while
                  // still lifting off the city line-art backdrop behind.
                  backgroundColor: "#FAFAFA",
                  borderRight: !isLast ? "1px solid var(--grid-line)" : undefined,
                  borderTopLeftRadius: isFirst ? "var(--ent-radius-2xl)" : undefined,
                  borderBottomLeftRadius: isFirst ? "var(--ent-radius-2xl)" : undefined,
                  borderTopRightRadius: isLast ? "var(--ent-radius-2xl)" : undefined,
                  borderBottomRightRadius: isLast ? "var(--ent-radius-2xl)" : undefined,
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: "var(--ent-dark-text-high)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center" as const,
                  letterSpacing: "-0.01em",
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
