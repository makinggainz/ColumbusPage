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
    <div ref={sectionRef} style={{ "--grid-line": "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.04)" } as React.CSSProperties}>
      <GridSection
        style={{
          backgroundColor: "transparent",
        }}
      >
        {/* Header row */}
        <div
          className="flex flex-col items-center text-center px-6 md:px-10"
          style={{ paddingTop: 120, paddingBottom: 120 }}
        >
          <h2
            className="text-white leading-[1.1] text-[28px] md:text-[36px] lg:text-[45px]"
            style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 720 }}
          >
            Its time for a more powerful and intuitive GIS
          </h2>
          <p
            style={{
              marginTop: 24,
              fontSize: "clamp(16px, 1.4vw, 20px)",
              color: "rgba(255,255,255,0.45)",
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
