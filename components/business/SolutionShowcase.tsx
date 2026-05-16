"use client";

import Image from "next/image";
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
      className="relative overflow-hidden"
      style={{
        "--grid-line": "var(--ent-border-dark-grid)",
        backgroundColor: "transparent",
      } as React.CSSProperties}
    >
      {/* B3 line-art — a faint hand-drawn galleon hugs the lower-left of
          the screen and a harbour town the lower-right, both sitting
          behind the heading. Scoped to B3 (B2 above stays plain white). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-[26%] max-w-90 aspect-1378/1260">
          <Image
            src="/businessB3/left.png"
            alt=""
            fill
            sizes="26vw"
            className="object-contain object-bottom-left"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-[38%] max-w-140 aspect-1604/1296">
          <Image
            src="/businessB3/right.png"
            alt=""
            fill
            sizes="38vw"
            className="object-contain object-bottom-right"
          />
        </div>
      </div>

      <GridSection
        style={{
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 1,
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
