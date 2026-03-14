"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";

export const GeoWarning = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Each element has a [start, end] scroll range over which it goes 0→1
  const ease = (p: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (p - start) / (end - start)));

  // Background: interpolate from #EBEBEB to #FFFFFF
  const bgProgress = ease(progress, 0, 0.25);
  const bgChannel = Math.round(235 + (255 - 235) * bgProgress); // 235 → 255
  const bgColor = `rgb(${bgChannel}, ${bgChannel}, ${bgChannel})`;

  // Eyebrow
  const eyebrowP = ease(progress, 0.05, 0.22);
  // Line 1
  const line1P = ease(progress, 0.18, 0.38);
  // Line 2
  const line2P = ease(progress, 0.32, 0.52);

  const fadeUp = (p: number, dist = 36) => ({
    opacity: p,
    filter: `blur(${(1 - p) * 8}px)`,
    transform: `translateY(${(1 - p) * dist}px)`,
  });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "200vh" }}
    >
      {/* Sticky viewport — stays pinned while section scrolls past */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        style={{ backgroundColor: bgColor, transition: "background-color 0.05s linear" }}
      >
        <Container>
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <p
              className="text-sm font-medium tracking-widest uppercase text-[#1C274C]/60 mb-8"
              style={fadeUp(eyebrowP, 20)}
            >
              GEOSPATIAL INTELLIGENCE
            </p>

            {/* Line 1 */}
            <h2
              className="font-thin leading-[1.05] tracking-tight text-[#0A1344]"
              style={{ fontSize: "clamp(48px, 6vw, 80px)", ...fadeUp(line1P) }}
            >
              Stop using language models
            </h2>

            {/* Line 2 */}
            <h2
              className="font-thin leading-[1.05] tracking-tight text-[#838383]"
              style={{ fontSize: "clamp(48px, 6vw, 80px)", ...fadeUp(line2P) }}
            >
              for geographical work.
            </h2>

          </div>
        </Container>
      </div>
    </section>
  );
};
