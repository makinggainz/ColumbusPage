"use client";

import { useEffect, useState } from "react";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { cormorant } from "@/lib/typography";

export const Hero = () => {
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setIsActive(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative bg-[#F9F9F9] min-h-[calc(100vh-76px)] overflow-hidden">
      <div className="relative z-10 pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <p className="text-sm md:text-base font-medium tracking-tight text-[#1C274C]/70 uppercase mb-4">
              FRONTIER AI RESEARCH AND PRODUCT COMPANY
            </p>

            {/* Main Heading */}
            <h1
              className={`${cormorant.className} font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight text-[#0A1344]`}
            >
              {mounted ? (
                <ScrambleText
                  text="The frontier AI Lab building the first in-production Large Geospatial Model."
                  isActive={isActive}
                  delay={0}
                />
              ) : (
                "The frontier AI Lab building the first in-production Large Geospatial Model."
              )}
            </h1>

            {/* Tag */}
            <p className="mt-6 text-xs md:text-sm font-medium tracking-widest text-[#1C274C]/70">
              [ COLUMBUS PRO-1 ]
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};