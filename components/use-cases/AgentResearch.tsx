"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIndustry } from "./industry/IndustryContext";
import type { AgentResearchRowContent } from "./industry/types";

type AgenticResearchProps = {
  lightTheme?: boolean;
  embedded?: boolean;
  content?: AgentResearchRowContent;
};

/**
 * "Agentic geospatial research" — the right-column visual for row 3 of the
 * use-case sticky-scroll. Templates column on the left, generated-report
 * panel on the right. Title overlays the top-left of the panel with a
 * gradient backdrop; inner content shifted down to clear the overlay.
 */
export default function AgenticResearch({
  lightTheme = false,
  embedded = false,
  content,
}: AgenticResearchProps) {
  const { industry } = useIndustry();
  const data = content ?? industry.agentResearch;

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

  const outerBorder = lightTheme
    ? "border-[0.7px] border-[rgba(10,19,68,0.15)]"
    : "border-[0.7px] border-white/15";
  const templatesLabelText = lightTheme ? "text-[rgba(29,29,31,0.6)]" : "text-gray-400";
  const calloutBg = lightTheme ? "bg-[#F5F5F7]" : "bg-[#2a2a2a]";
  const calloutHeading = lightTheme ? "text-[#1D1D1F]" : "text-white";
  const calloutBody = lightTheme ? "text-[rgba(29,29,31,0.7)]" : "text-gray-300";

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
        className={`absolute inset-0 overflow-auto rounded-lg ${outerBorder} pt-20 pb-6 px-6`}
      >
        <div className="grid grid-cols-[320px_1fr] gap-8 max-xl:grid-cols-1 p-0 max-md:pt-0">
          {/* TEMPLATE CARDS */}
          <div className="flex flex-col gap-4">
            <p className={`${templatesLabelText} text-[13px] mb-2`}>Templates</p>
            {data.templates.map((tpl) => (
              <div
                key={tpl.title}
                className={`h-[140px] ${calloutBg} rounded-xl p-5 ${calloutHeading}`}
              >
                <h4 className="text-[18px] font-semibold mb-2">{tpl.title}</h4>
                <p className={`text-[14px] ${calloutBody}`}>{tpl.description}</p>
              </div>
            ))}
            <div
              className={`relative ${calloutBg} rounded-[14px] p-5 ${calloutHeading} w-full overflow-hidden`}
            >
              <h4 className="font-semibold text-[15px]">{data.advancedTemplateTitle}</h4>
              {!lightTheme && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 pointer-events-none" />
              )}
            </div>
          </div>

          {/* REPORT PANEL */}
          <div className="bg-white rounded-2xl p-6">
            <p className="text-gray-500 text-[12px] mb-3">🌐 Report Produced by Columbus</p>
            <h3 className="text-[20px] font-semibold text-[#1f2b5c] mb-3">
              {data.reportTitle}
            </h3>
            <p className="text-gray-600 text-[13px] leading-relaxed mb-5">
              {data.reportBody}
            </p>
            <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-4">
              <Image
                src={data.reportMapSrc}
                alt="Map"
                fill
                className="object-cover"
              />
              <button className="absolute top-4 left-4 bg-white text-black text-[12px] px-4 py-1.5 rounded-lg shadow">
                Interact with me
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <p className="text-gray-400 text-[12px]">{data.inputPlaceholder}</p>
              <div className="flex gap-2">
                <button className="bg-gray-200 text-black text-[12px] px-3 py-1.5 rounded-md">
                  Upload File
                </button>
                <button className="bg-gray-200 text-black text-[12px] px-3 py-1.5 rounded-md">
                  Select on map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section title */}
      <h2 className="absolute top-6 left-6 z-20 text-black text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
        Agentic geospatial research
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
