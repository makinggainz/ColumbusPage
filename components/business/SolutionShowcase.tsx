"use client";

import { useEffect, useRef, useState } from "react";
import { GridSection } from "../home/ContentGrid";

export default function SolutionShowcase() {
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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{
        "--grid-line": "var(--ent-border-dark-grid)",
        // Transparent so the shared B2+B3 city line-art backdrop (set on
        // the mid-block in app/products/business/page.tsx) reads behind
        // the "Its time for a more powerful…" heading.
        backgroundColor: "transparent",
      } as React.CSSProperties}
    >
      <GridSection
        style={{
          backgroundColor: "transparent",
        }}
      >
        {/* Header row */}
        <div
          className="flex flex-col items-center text-center px-6 md:px-10"
          style={{ paddingTop: "var(--ent-section-lg)", paddingBottom: "var(--ent-section-lg)" }}
        >
          <h2
            className="text-ink leading-[1.1] text-[28px] md:text-[36px] lg:text-[49px]"
            style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 720 }}
          >
            Its time for a more powerful and intuitive GIS
          </h2>
          <p
            style={{
              marginTop: 24,
              fontSize: "clamp(16px, 1.4vw, 20px)",
              color: "var(--ent-dark-text-medium)",
              letterSpacing: "-0.01em",
              fontWeight: 400,
              maxWidth: 540,
              lineHeight: 1.55,
            }}
          >
            See how Columbus Pro can speed up your workflow
          </p>
        </div>
      </GridSection>
    </div>
  );
}
