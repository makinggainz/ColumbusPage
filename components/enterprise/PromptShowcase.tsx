"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function PromptCard({ image, text, popStyle }: { image: string; text: string; popStyle?: React.CSSProperties }) {
  return (
    <div
      className="w-[320px] md:w-[360px] lg:w-[376px] rounded-[18px] bg-[#FDFDFD] border border-[#EDEDED] shadow-lg overflow-hidden"
      style={popStyle}
    >

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 text-[14px] text-[#374151] font-medium">
        🌐 I created this map for you
      </div>

      {/* Image */}
      <div className="relative w-full h-[180px] md:h-[200px]">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Prompt */}
      <div className="flex items-center justify-between px-4 py-3 bg-white text-[14px] leading-[140%]">
        <span className="max-w-[240px] md:max-w-[260px]">{text}</span>
        <div className="w-6 h-6 bg-[#0E1A44] rounded-[6px]" />
      </div>

    </div>
  );
}

function CenterPrompt({ popStyle }: { popStyle?: React.CSSProperties }) {
  return (
    <div
      className="relative w-[320px] md:w-[420px] lg:w-[503px] rounded-[18px] bg-[#F7F7F7] border border-[#EDEDED] shadow-xl overflow-visible"
      style={popStyle}
    >

      <div className="px-5 py-4 text-[13px] text-[#6B7280] leading-[150%]">

        <div className="flex items-center gap-2 mb-2 font-medium text-[#4B5563]">
          🌐 Columbus is thinking...
        </div>

        <p>Considering demographics of Madrid</p>
        <p>Considering commercial lot prices</p>
        <p>Considering trade area competition</p>

      </div>

      <div className="flex items-center gap-3 px-5 py-3 bg-white border-t border-[#EDEDED] rounded-b-[18px]">
        <span className="text-[15px] font-medium flex-1 min-w-0">
          Where should I open a new pizzeria shop?
        </span>
      </div>

    </div>
  );
}

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function popStyle(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.82)",
    transition: `opacity 0.45s ease-out ${delay}s, transform 0.45s ${SPRING} ${delay}s`,
  };
}

export default function PromptShowcase() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cards pop in after header has faded in
  useEffect(() => {
    if (!headerVisible) return;
    const t = setTimeout(() => setCardsVisible(true), 600);
    return () => clearTimeout(t);
  }, [headerVisible]);

  const fadeInStyle = (visible: boolean, delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : "blur(8px)",
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

  return (
    <section className="w-full py-24 md:py-32 overflow-hidden" style={{ backgroundColor: "#ffffff", paddingBottom: 100 }}>

      {/* ═══ PART 1: See prompts you can ask ═══ */}
      <div data-prompt-area="part-1">
      {/* Part 1 header */}
      <div ref={headerRef} className="text-center mb-16 md:mb-20 px-6">
        <p
          className="text-[12px] md:text-[14px] tracking-[0.2em] text-[#6B7280] uppercase"
          style={fadeInStyle(headerVisible, 0)}
        >
          REAL USE CASE STORIES
        </p>

        <h2
          className="font-medium text-[28px] md:text-[48px] lg:text-[64px] leading-[140%] tracking-[-0.02em] mt-3"
          style={fadeInStyle(headerVisible, 0.15)}
        >
          See prompts you can ask
        </h2>
      </div>

      {/* Part 1 — MOBILE STACK */}
      <div className="flex flex-col items-center gap-8 lg:hidden px-6">

        <PromptCard
          image="/enterprise/citymap.png"
          text="map of philly to drive my truck to run over as many pedestrians as possible"
          popStyle={popStyle(cardsVisible, 0)}
        />

        <PromptCard
          image="/enterprise/map2.png"
          text="make me a map of charlotte, but filter only vacant lots next to transportation lines"
          popStyle={popStyle(cardsVisible, 0.08)}
        />

        <CenterPrompt popStyle={popStyle(cardsVisible, 0.16)} />

        <PromptCard
          image="/enterprise/map3.png"
          text="map of france but in weird colors to make it hard to understand"
          popStyle={popStyle(cardsVisible, 0.24)}
        />

        <PromptCard
          image="/enterprise/map4.png"
          text="lava map for silly billies"
          popStyle={popStyle(cardsVisible, 0.32)}
        />

      </div>

      {/* Part 1 — DESKTOP: gradient, barca, prompt cards, tool images */}
      <div className="hidden lg:block relative max-w-[1235px] h-[1036px] mx-auto overflow-visible" data-prompt-area="part-1-desktop">

            {/* MAIN MAP */}
            <Image
                src="/enterprise/bmapp.png"
                alt="map"
                fill
                className="object-cover"
            />

            {/* Image layer — same size as container, underneath gradient */}
            <Image
              src="/barca.png"
              alt=""
              fill
              className="object-cover"
            />

        {/* radial fade — on top of barca image (stronger vignette) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,white_60%)]" />

        {/* CENTER */}
        <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2">
          <CenterPrompt popStyle={popStyle(cardsVisible, 0.1)} />
        </div>

        {/* TOP LEFT */}
        <div className="absolute left-[2%] top-[3%]">
          <PromptCard
            image="/enterprise/citymap.png"
            text="map of philly to drive my truck to run over as many pedestrians as possible"
            popStyle={popStyle(cardsVisible, 0)}
          />
        </div>

        {/* TOP RIGHT */}
        <div className="absolute right-[2%] top-[3%]">
          <PromptCard
            image="/enterprise/map2.png"
            text="make me a map of charlotte, but filter only vacant lots next to transportation lines"
            popStyle={popStyle(cardsVisible, 0.08)}
          />
        </div>

        {/* BOTTOM LEFT */}
        <div className="absolute left-[2%] bottom-[3%]">
          <PromptCard
            image="/enterprise/map3.png"
            text="map of france but in weird colors to make it hard to understand"
            popStyle={popStyle(cardsVisible, 0.16)}
          />
        </div>

        {/* BOTTOM RIGHT */}
        <div className="absolute right-[2%] bottom-[3%]">
          <PromptCard
            image="/enterprise/map4.png"
            text="lava map for silly billies"
            popStyle={popStyle(cardsVisible, 0.24)}
          />
        </div>

        {/* 3 tool images: to the right of white gradient's right edge, top-most layer */}
        <div
          className="absolute flex flex-col items-center gap-2 top-[52%] -translate-y-1/2 z-[100]"
          style={{ left: "calc(100% + 12px)" }}
        >
          <Image src="/enterprise/tool1.png" alt="" width={100} height={100} className="rounded object-cover" />
          <Image src="/enterprise/tool2.png" alt="" width={100} height={100} className="rounded object-cover" />
          <Image src="/enterprise/tool3.png" alt="" width={100} height={100} className="rounded object-cover" />
        </div>

      </div>
      </div>

      {/* ═══ PART 2: Ask about a drawn area ═══ */}
      <div data-prompt-area="part-2" className="relative w-full h-[1036px] mt-16 md:mt-24 rounded-2xl overflow-hidden mx-auto max-w-[1235px]">
        {/* Part 2 — Map background */}
        <Image
          src="/enterprise/drawnAreaMap.png"
          alt=""
          fill
          className="object-cover"
        />

        {/* Part 2 — White center radial gradient (same as Part 1) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,white_60%)]" />

        {/* Part 2: left column + center-right card aligned so card bottom = bottom-left text bottom */}
        <div className="absolute left-0 right-0 top-8 md:top-[72px] z-10 flex flex-row items-end justify-between">
          <div className="w-[320px] md:w-[480px] ml-[40px]">
          <h3
            className="font-medium text-[28px] md:text-[36px] leading-[140%] tracking-[-0.02em] flex items-center whitespace-nowrap"
            style={{
              background: "linear-gradient(90deg, #06096D 0%, #318BCA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ask about a drawn area
          </h3>
          <p className="font-medium text-[26px] md:text-[32px] leading-[140%] tracking-[-0.02em] text-black mt-3 max-w-[334px]">
            Draw a specific space and ask
          </p>

          {/* Selected area card — 280px below bottom edge of "and ask" */}
          <div className="mt-[280px] w-[320px] md:w-[360px] rounded-[14px] bg-white border border-[#EDEDED] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDEDED]">
              <span className="font-semibold text-[15px] text-[#111] flex items-center gap-2">
                Selected area
                <span className="text-[#1B37CE]">✓</span>
              </span>
              <button type="button" className="text-[#888] hover:text-[#111] text-lg leading-none" aria-label="Close">×</button>
            </div>
            <p className="px-4 py-3 text-[13px] text-[#6B7280] leading-[150%]">
              Click points on the map to measure distances and research areas.
            </p>
            <div className="border-t border-[#EDEDED]">
              <details className="group border-b border-[#EDEDED]">
                <summary className="px-4 py-3 text-[13px] font-medium text-[#374151] cursor-pointer flex items-center justify-between list-none">
                  Advanced Measurements
                  <span className="text-[#9CA3AF] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-3 text-[13px] text-[#6B7280]">
                  Perimeter size — Min: 456.34 m Median: 356.23 m Max: 1345.35 m
                </div>
              </details>
              <details className="group border-b border-[#EDEDED]">
                <summary className="px-4 py-3 text-[13px] font-medium text-[#374151] cursor-pointer flex items-center justify-between list-none">
                  Listed Owners
                  <span className="text-[#9CA3AF] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-3 text-[13px] text-[#6B7280] space-y-1">
                  <p>Janet McArthy (age 45)</p>
                  <p>Tom McArthy (age 52)</p>
                </div>
              </details>
              <details className="group">
                <summary className="px-4 py-3 text-[13px] font-medium text-[#374151] cursor-pointer flex items-center justify-between list-none">
                  Property History
                  <span className="text-[#9CA3AF] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-3 text-[13px] text-[#6B7280] space-y-1">
                  <p>Bought Jan, 2023</p>
                  <p>Last listed price: $345,309</p>
                </div>
              </details>
            </div>
            <div className="px-4 py-3 border-t border-[#EDEDED]">
              <button type="button" className="text-[13px] font-medium text-[#1B37CE] hover:underline">
                More data
              </button>
            </div>
          </div>

          {/* Bottom-left CTA — 30px below selected area card */}
          <p className="mt-[30px] text-black font-medium text-[26px] md:text-[32px] leading-[140%] tracking-[-0.02em] max-w-[380px]">
            Or access full advanced data about the polygon.
          </p>
          </div>

        {/* Center-right: prompt card + tool icons; card bottom = bottom-left text bottom; icon stack spans card height */}
        <div className="flex-shrink-0 flex flex-row items-end gap-5 mr-[140px] md:mr-[200px] z-10">
          <div
            className="overflow-hidden box-border"
            style={{
              width: 503.41,
              height: 213.14,
              background: "#FDFDFD",
              border: "1px solid #EDECED",
              borderRight: "1px solid #EDECED",
              boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.2)",
              borderRadius: 19,
            }}
          >
            <div className="flex items-center gap-2 px-5 py-4" style={{ paddingLeft: 24 }}>
              {/* Icon: add public/enterprise/Screenshot_2025-12-18_at_3.30.33_PM-removebg-preview.png (21×21) for design asset */}
              <span className="w-[21px] h-[21px] flex-shrink-0 rounded bg-[#A1A6B2]/30" aria-hidden />
              <span
                className="flex items-center"
                style={{
                  fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 510,
                  fontSize: 18,
                  lineHeight: "140%",
                  color: "#A1A6B2",
                }}
              >
                Columbus is thinking...
              </span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 border-t border-[#EDEDED] bg-[#FAFAFA]" style={{ paddingLeft: 24 }}>
              <input
                type="text"
                readOnly
                value="what is the jewish demographic in this area"
                className="flex-1 min-w-0 bg-transparent text-[14px] text-[#111] outline-none"
              />
              <div className="w-8 h-8 rounded-[8px] bg-[#0E1A44] flex-shrink-0" aria-hidden />
            </div>
          </div>
          {/* Tool icons: bottom of stack = card bottom, larger icons with even spacing */}
          <div className="flex flex-col justify-end gap-3 flex-shrink-0">
            <Image src="/enterprise/tool1.png" alt="" width={100} height={100} className="rounded-full object-cover flex-shrink-0" />
            <Image src="/enterprise/tool2.png" alt="" width={100} height={100} className="rounded-full object-cover flex-shrink-0" />
            <Image src="/enterprise/tool3.png" alt="" width={100} height={100} className="rounded-full object-cover flex-shrink-0" />
            <Image src="/enterprise/tool4.png" alt="" width={100} height={100} className="rounded-full object-cover flex-shrink-0" />
          </div>
        </div>
        </div>
      </div>

      {/* More use cases CTA — below Part 2 */}
      <div className="flex justify-center pt-8 pb-4">
        <button
          type="button"
          className="px-6 py-3 rounded-[10px] bg-white border border-[#EDEDED] shadow-lg text-[15px] font-medium text-[#111] hover:bg-[#FAFAFA] transition-colors flex items-center gap-2 cursor-pointer"
        >
          More use cases
          <span className="text-[#666]">→</span>
        </button>
      </div>

    </section>
  );
}
