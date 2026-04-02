"use client";

import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "../home/ContentGrid";

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
    <div ref={sectionRef}>
      <GridSection
        style={{
          borderLeft: gl,
          backgroundColor: "transparent",
        }}
      >
        {/* Header row — Hebbia-scale centered heading + subtitle */}
        <div
          className="flex flex-col items-center text-center px-6 md:px-10"
          style={{ borderRight: gl, borderBottom: gl, paddingTop: 120, paddingBottom: 120 }}
        >
          <h2
            className="font-light leading-[1.08]"
            style={{
              fontSize: "clamp(30px, 3.8vw, 54px)",
              letterSpacing: "-0.03em",
              color: "#0A1344",
              maxWidth: 720,
            }}
          >
            Its time for a more powerful and intuitive GIS
          </h2>
          <p
            style={{
              marginTop: 24,
              fontSize: "clamp(16px, 1.4vw, 20px)",
              color: "rgba(10,19,68,0.45)",
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
