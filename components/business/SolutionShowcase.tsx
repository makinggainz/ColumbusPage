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
        backgroundColor: "transparent",
      } as React.CSSProperties}
    >
      <GridSection
        style={{
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header row — this block is the title of the merged B3·C section.
            paddingTop is the section's top padding (--ent-section-lg);
            paddingBottom is the heading→content gap to ComparisonSection
            below (--ent-space-16), not a full section gap. */}
        <div
          className="flex flex-col items-center text-center px-6 md:px-10"
          style={{ paddingTop: "var(--ent-section-lg)", paddingBottom: "var(--ent-space-16)" }}
        >
          <h2
            className="text-ink leading-[1.1] text-[28px] md:text-[36px] lg:text-[49px]"
            style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 720 }}
          >
            Its time for a more powerful and intuitive GIS
          </h2>
        </div>
      </GridSection>
    </div>
  );
}
