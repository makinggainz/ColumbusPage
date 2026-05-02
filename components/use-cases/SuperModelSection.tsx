"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIndustry } from "./industry/IndustryContext";
import type { SuperModelRowContent } from "./industry/types";

type SuperModelSectionProps = {
  lightTheme?: boolean;
  embedded?: boolean;
  content?: SuperModelRowContent;
};

/**
 * "Surveying the earth with a super model" — the right-column visual for
 * row 2 of the use-case sticky-scroll. The Havana map fills the full width
 * and height of the container; the section title overlays the top-left
 * with a gradient backdrop for legibility against the photo.
 */
export default function SuperModelSection({
  lightTheme = false,
  embedded = false,
  content,
}: SuperModelSectionProps) {
  const { industry } = useIndustry();
  const data = content ?? industry.superModel;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const visualBlock = (
    <div
      ref={sectionRef}
      className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      <Image src={data.mapImageSrc} alt="Geospatial map" fill className="object-cover" />

      {/* Title gradient backdrop — top, fading to transparent. */}
      <div
        className="absolute top-0 left-0 right-0 h-[140px] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Section title — overlays the gradient. */}
      <h2 className="absolute top-6 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
        Surveying the earth with a super model
      </h2>

      {/* Vertical heat-scale gauge — kept from the original visual. */}
      <div className="absolute left-[20px] top-[180px] h-[220px] w-[12px] rounded-full bg-gradient-to-b from-green-400 via-yellow-400 to-red-500 z-10" />

      {/* Map query card — bottom of the map, original placement preserved. */}
      <div className="absolute bottom-[24px] left-[100px] right-[160px] max-md:left-[20px] max-md:right-[20px] h-[97px] bg-white text-black rounded-xl shadow-xl flex items-center justify-between px-5 z-20">
        <p className="text-[16px] md:text-[18px] leading-snug max-w-[500px]">{data.mapQuery}</p>
        <div className="w-[32px] h-[32px] bg-[#1c2c6b] rounded-md flex-shrink-0" />
      </div>
      <div className="absolute bottom-[24px] right-[24px] text-white text-[13px] opacity-80 z-10">
        Built on Columbus Pro
      </div>
    </div>
  );

  if (embedded) return visualBlock;

  const sectionBgClass = lightTheme ? "bg-white" : "bg-black";
  return (
    <section className={`w-full ${sectionBgClass} flex justify-center`}>
      <div className="w-full max-w-[1287px] mx-auto px-8 md:px-10 py-[120px]">
        {visualBlock}
      </div>
    </section>
  );
}
