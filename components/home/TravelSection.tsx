"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cambo } from "@/app/fonts";
import { GridSection, gl } from "./ContentGrid";
import glassStyles from "@/components/ui/GlassButton.module.css";

const TABS = ["Plan cool trips", "Group planning", "Find spots", "Custom maps"];
const PILL_INSET = 4;

function TravelPillToggle({ activeTab, setActiveTab, anim }: {
  activeTab: number;
  setActiveTab: (i: number) => void;
  anim: (delay?: number) => React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const [hoverIndicator, setHoverIndicator] = useState({ left: 0, width: 0 });
  const [hovered, setHovered] = useState<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);
  const [containerHovered, setContainerHovered] = useState(false);

  const measure = (idx: number) => {
    const btn = buttonRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const bRect = btn.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setIndicator({
      left: bRect.left - cRect.left + PILL_INSET,
      width: bRect.width - PILL_INSET * 2,
      ready: true,
    });
  };

  const measureHover = (idx: number) => {
    const btn = buttonRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const bRect = btn.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setHoverIndicator({
      left: bRect.left - cRect.left + PILL_INSET,
      width: bRect.width - PILL_INSET * 2,
    });
  };

  const handleClick = (i: number) => {
    if (i === activeTab) return;
    setActiveTab(i);
    measure(i);
  };

  useEffect(() => { measure(activeTab); }, []);

  return (
    <>
      {/* ── Desktop: horizontal pill bar with sliding indicator (≥684px) ── */}
      <div className="hidden min-[684px]:block" style={anim(200)}>
      <div
        ref={containerRef}
        className="inline-flex items-center relative mb-0"
        style={{
          height: 56,
          borderRadius: 28,
          overflow: "hidden",
          padding: `${PILL_INSET}px`,
          backgroundColor: "rgba(255, 255, 255, 0.20)",
          border: "1px solid rgba(0, 0, 0, 0.07)",
          transform: containerHovered ? "translateY(-3px)" : "translateY(-2px)",
          boxShadow: containerHovered
            ? "inset 0 0.125em 0.125em rgba(0,0,0,0.05), inset 0 -0.125em 0.125em rgba(255,255,255,0.5), 0 8px 20px -4px rgba(0,0,0,0.14), inset 0 0 0.1em 0.25em rgba(255,255,255,0.2)"
            : "inset 0 0.125em 0.125em rgba(0,0,0,0.05), inset 0 -0.125em 0.125em rgba(255,255,255,0.5), 0 6px 18px -4px rgba(0,0,0,0.18), inset 0 0 0.1em 0.25em rgba(255,255,255,0.2)",
          transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
        onMouseEnter={() => setContainerHovered(true)}
        onMouseLeave={() => setContainerHovered(false)}
      >
        {/* Hover highlight */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: PILL_INSET,
            left: hoverIndicator.left,
            width: hoverIndicator.width,
            height: `calc(100% - ${PILL_INSET * 2}px)`,
            borderRadius: 24,
            backgroundColor: "rgba(0,0,0,0.05)",
            opacity: hovered !== null && hovered !== activeTab ? 1 : 0,
            transition: [
              "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
              "width 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
              "opacity 0.2s ease",
            ].join(", "),
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Active sliding indicator */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: PILL_INSET,
            left: indicator.left,
            width: indicator.width,
            height: `calc(100% - ${PILL_INSET * 2}px)`,
            borderRadius: 24,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            background: "rgba(255,255,255,0.75)",
            boxShadow: "inset 2px -2px 3px rgba(255,255,255,0.55), inset -2px 2px 3px rgba(0,0,0,0.04), 0 2px 6px -2px rgba(0,0,0,0.12)",
            opacity: indicator.ready ? 1 : 0,
            transform: `translateX(${hovered !== null && hovered !== activeTab ? (hovered > activeTab ? 3 : -3) : 0}px)`,
            transition: [
              "left 0.35s cubic-bezier(0.34, 1.15, 0.64, 1)",
              "width 0.35s cubic-bezier(0.34, 1.15, 0.64, 1)",
              "opacity 0.15s ease",
              "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
            ].join(", "),
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {TABS.map((tab, i) => (
          <button
            key={tab}
            ref={el => { buttonRefs.current[i] = el; }}
            type="button"
            className="h-full flex items-center justify-center whitespace-nowrap relative cursor-pointer"
            style={{
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              padding: "0 24px",
              zIndex: 3,
              color: activeTab === i ? "#000000" : hovered === i ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.65)",
              transition: "color 0.25s ease",
            }}
            onClick={() => handleClick(i)}
            onMouseEnter={() => { setHovered(i); measureHover(i); }}
            onMouseLeave={() => { setHovered(null); setPressed(null); }}
            onMouseDown={() => { if (i !== activeTab) setPressed(i); }}
            onMouseUp={() => setPressed(null)}
          >
            {tab}
          </button>
        ))}
      </div>
      </div>

      {/* ── Mobile: 2×2 grid of pill buttons (<684px) ── */}
      <div className="min-[684px]:hidden grid grid-cols-2 gap-2 w-full max-w-100 px-4" style={anim(200)}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => handleClick(i)}
            className="flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
            style={{
              height: 44,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              backgroundColor: activeTab === i ? "rgba(165,244,236,0.25)" : "rgba(255,255,255,0.30)",
              color: activeTab === i ? "#000000" : "rgba(0,0,0,0.65)",
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </>
  );
}

export const TravelSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const beachRef = useRef<HTMLDivElement>(null);
  const travelHeadingRef = useRef<HTMLHeadingElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [plantsVisible, setPlantsVisible] = useState(false);
  const island3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll-driven expansion with lerp smoothing

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section ref={ref} className="relative">
      {/* Top bar — full width with grid lines */}
      <div style={{
        borderTop: "1px solid var(--grid-line)",
        borderBottom: "1px solid var(--grid-line)"
      }}>
        <GridSection className="bg-transparent!">
          <div className="relative flex items-center justify-between px-8 min-[1287px]:px-10 py-6">
            <span className="text-[18px] lg:text-[20px] text-[#1D1D1F] font-bold" style={{ letterSpacing: "-0.02em" }}>
              MapsGPT <span className="hidden min-[640px]:inline font-normal">– AI-powered social map</span>
            </span>
            <Link
              href="/maps-gpt"
              className="group flex items-center gap-3 min-[640px]:gap-10 text-[18px] lg:text-[20px] text-[#1D1D1F] font-semibold transition-opacity"
            >
              <span className="transition-colors duration-300 group-hover:text-[#2563EB]">
                <span className="hidden min-[640px]:inline">Try it out now</span>
                <span className="min-[640px]:hidden">Try it now</span>
              </span>
              <svg
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                width="9" height="16" viewBox="0 0 7 12" fill="none"
                stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M1 1l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </GridSection>
      </div>

      {/* Main content area with sand background */}
        <div
          ref={beachRef}
          className="relative flex flex-col h-137.5 md:h-200 lg:h-250 max-w-[1287px] mx-5 md:mx-auto overflow-hidden"
      >
        {/* Background image — blurred via ref on scroll */}
        <Image
          ref={bgImgRef}
          src="/beach.png"
          alt=""
          fill
          className="object-cover object-center"
          style={{ willChange: "filter" }}
        />

        {/* Desktop mockup — direct child of beachRef so left/right resolves against full width */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: 0,
            right: "14%",
            bottom: 0,
            height: "68%",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 -8px 60px rgba(0,0,0,0.28)",
            zIndex: 2,
            ...anim(350),
          }}
        >
          <span aria-hidden className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-br bg-black/70 text-xs font-bold text-white" style={{ zIndex: 99 }}>2</span>
          <img
            src="/MapsGPTDesktop.png"
            alt="MapsGPT desktop interface"
            className="w-full h-full object-cover object-top"
          />
          <span aria-hidden className="absolute left-7 top-0 flex h-7 w-7 items-center justify-center rounded-br bg-black/70 text-xs font-bold text-white" style={{ zIndex: 99 }}>3</span>
        </div>

        {/* Mobile mockup — direct child of beachRef */}
        <div
          className="absolute overflow-hidden right-[5%]"
          style={{
            bottom: 0,
            height: "82%",
            aspectRatio: "263 / 572",
            borderRadius: "16px 16px 0 0",
            boxShadow: "-4px 0 40px rgba(0,0,0,0.15)",
            zIndex: 3,
            ...anim(400),
          }}
        >
          <span aria-hidden className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-br bg-black/70 text-xs font-bold text-white" style={{ zIndex: 99 }}>4</span>
          <img
            src="/MapsGPTMobile.png"
            alt="MapsGPT mobile interface"
            className="w-full h-full object-cover object-top"
          />
          <span aria-hidden className="absolute left-7 top-0 flex h-7 w-7 items-center justify-center rounded-br bg-black/70 text-xs font-bold text-white" style={{ zIndex: 99 }}>5</span>
        </div>

        {/* Centered content — z-10 renders on top of both mockups */}
        <div className="relative z-10 flex flex-col flex-1 items-center pt-10 md:pt-16 lg:pt-24 px-6">
          {/* Heading */}
          <h2
            ref={travelHeadingRef}
            className="text-center text-[#1D1D1F] leading-[1.1] tracking-[-0.02em] mb-3 md:mb-4 text-[39px] md:text-[49px] lg:text-[76px]"
            style={{
              fontWeight: 500,
              letterSpacing: "-0.02em",
              ...anim(0),
            }}
          >
            Travel like a boss
          </h2>

          {/* Subtitle */}
          <p
            className="text-center mb-6 md:mb-8 lg:mb-10 text-[16px] md:text-[20px]"
            style={{ color: "rgba(29,29,31,0.45)", letterSpacing: "-0.015em", fontWeight: 400, ...anim(100) }}
          >
            <span className="hidden min-[640px]:inline">Find your next hang out spot, easier</span>
            <span className="min-[640px]:hidden">AI-powered social map</span>
          </p>

          {/* Tab bar */}
          <TravelPillToggle activeTab={activeTab} setActiveTab={setActiveTab} anim={anim} />

        </div>
      </div>
    </section>
  );
};
