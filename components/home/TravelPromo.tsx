"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GridSection, gl } from "./ContentGrid";

export const TravelPromo = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const rect = s.getBoundingClientRect();
      const scrollable = s.offsetHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ease = (p: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (p - start) / (end - start)));
  const fadeUp = (p: number, dist = 32) => ({
    opacity: p,
    filter: `blur(${(1 - p) * 8}px)`,
    transform: `translateY(${(1 - p) * dist}px)`,
  });

  const titleP = ease(progress, 0.15, 0.38);
  const subtitleP = ease(progress, 0.30, 0.52);
  const ctaP = ease(progress, 0.40, 0.60);

  return (
    <GridSection>
      <div>
        <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
          <div
            className="sticky top-0 h-screen overflow-hidden"
            style={{
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              backgroundColor: "#FAFAFA",
              backgroundImage: `linear-gradient(rgba(55,40,140,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(55,40,140,0.06) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            {/* Text content */}
            <div className="relative h-full">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none" style={{ zIndex: 2 }}>
                <h2
                  className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] mb-4"
                  style={fadeUp(titleP)}
                >
                  Love to travel or go out?
                </h2>
                <p
                  className="text-[21px] md:text-[24px] font-normal leading-[1.38] text-[#6E6E73] max-w-[680px]"
                  style={fadeUp(subtitleP)}
                >
                  <span className="font-semibold text-[#1D1D1F]">MapsGPT</span>{" "}is already answering thousands of queries in your area
                </p>
                <div className="mt-6 pointer-events-auto" style={fadeUp(ctaP)}>
                  <Link href="/maps-gpt" className="text-[#4F46E5] text-sm font-mono tracking-wide hover:underline">
                    TRY MAPSGPT →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GridSection>
  );
};
