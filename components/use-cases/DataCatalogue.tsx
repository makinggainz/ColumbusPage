"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIndustry } from "./industry/IndustryContext";
import type { DataCatalogueRowContent } from "./industry/types";

type DataCatalogueProps = {
  lightTheme?: boolean;
  embedded?: boolean;
  content?: DataCatalogueRowContent;
};

/**
 * "The most accurate data catalogue" — the right-column visual for row 4 of
 * the use-case sticky-scroll. Data-type tabs above a 3-column card grid;
 * title overlays the top with a gradient backdrop. The data-type tabs (My
 * Data / Suggested / …) are NOT industry options — they stay.
 */
export default function DataCatalogue({
  lightTheme = false,
  embedded = false,
  content,
}: DataCatalogueProps) {
  const { industry } = useIndustry();
  const data = content ?? industry.dataCatalogue;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Theme tokens
  const outerBorder = lightTheme ? "border-[#0A1344]/15" : "border-white/15";
  const tabIdleColor = lightTheme ? "text-[rgba(29,29,31,0.5)]" : "text-gray-400";
  const tabHoverColor = lightTheme ? "hover:text-[#1D1D1F]" : "hover:text-white";
  const tabActiveColor = lightTheme ? "text-[#1D1D1F]" : "text-white";
  const tabActiveBorder = lightTheme ? "border-[#1D1D1F]" : "border-white";
  const cardBg = lightTheme ? "bg-[#F5F5F7]" : "bg-white";

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
      {/* Panel content fills the container; padding-top reserves space for the
          overlaid title at the top. */}
      <div
        className={`absolute inset-0 overflow-auto rounded-lg border-[0.7px] ${outerBorder} pt-20 pb-6 px-6`}
      >
        <div className={`flex gap-6 ${tabIdleColor} text-[14px] mb-6 overflow-x-auto`}>
          {data.tabs.map((tab) => {
            const isActive = tab === data.activeTab;
            return (
              <button
                key={tab}
                type="button"
                className={
                  isActive
                    ? `cursor-pointer ${tabActiveColor} font-semibold border-b ${tabActiveBorder} pb-1 shrink-0`
                    : `cursor-pointer ${tabHoverColor} shrink-0`
                }
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-2 max-md:grid-cols-1">
          {data.cards.map((card) => (
            <div key={card.title} className={`${cardBg} rounded-xl overflow-hidden flex flex-col`}>
              <div className="relative h-[220px]">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex-1">
                <h4 className="font-semibold text-[18px] mb-1">{card.title}</h4>
                <p className="text-gray-500 text-[13px] mb-2">{card.rows}</p>
                <p className="text-gray-600 text-[13px]">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section title */}
      <h2 className="absolute top-6 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
        The most accurate data catalogue
      </h2>
    </div>
  );

  if (embedded) return visualBlock;

  const sectionBg = lightTheme ? "bg-white" : "bg-black";
  return (
    <section className={`w-full ${sectionBg} flex justify-center`}>
      <div className="w-full max-w-[1287px] mx-auto px-8 md:px-10 py-[120px]">
        {visualBlock}
      </div>
    </section>
  );
}
