"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cambo } from "@/app/fonts";
import { GridSection, BarDots, gl } from "./ContentGrid";

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

  useEffect(() => { measure(activeTab); }, []);

  return (
    <>
      {/* ── Desktop: horizontal pill bar with sliding indicator (≥684px) ── */}
      <div
        ref={containerRef}
        className="hidden min-[684px]:inline-flex items-center relative mb-0"
        style={{
          height: 56,
          borderRadius: 28,
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.06)",
          ...anim(200),
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: PILL_INSET,
            left: indicator.left,
            width: indicator.width,
            height: `calc(100% - ${PILL_INSET * 2}px)`,
            borderRadius: 24,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            opacity: indicator.ready ? 1 : 0,
            transition: [
              "left 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
              "width 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
              "opacity 0.2s ease",
            ].join(", "),
            pointerEvents: "none" as const,
            zIndex: 1,
          }}
        />
        {TABS.map((tab, i) => (
          <button
            key={tab}
            ref={el => { buttonRefs.current[i] = el; }}
            type="button"
            onClick={() => { setActiveTab(i); measure(i); }}
            className="h-full flex items-center justify-center whitespace-nowrap relative cursor-pointer"
            style={{
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              padding: "0 24px",
              zIndex: 2,
              color: activeTab === i ? "#1D1D1F" : "rgba(29,29,31,0.5)",
              transition: "color 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
            onMouseEnter={e => {
              if (activeTab !== i) (e.currentTarget as HTMLElement).style.color = "rgba(29,29,31,0.75)";
            }}
            onMouseLeave={e => {
              if (activeTab !== i) (e.currentTarget as HTMLElement).style.color = "rgba(29,29,31,0.5)";
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Mobile: 2×2 grid of pill buttons (<684px) ── */}
      <div className="min-[684px]:hidden grid grid-cols-2 gap-2 w-full max-w-100 px-4" style={anim(200)}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setActiveTab(i); measure(i); }}
            className="flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
            style={{
              height: 44,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              backgroundColor: activeTab === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
              color: activeTab === i ? "#1D1D1F" : "rgba(29,29,31,0.5)",
              boxShadow: activeTab === i ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
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
  useEffect(() => {
    const card = beachRef.current;
    const heading = travelHeadingRef.current;
    const bgImg = bgImgRef.current;
    if (!card || !heading) return;

    let current = 0;
    let rafId = 0;
    let lastTime = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = lastTime ? (now - lastTime) / 1000 : 0.016;
      lastTime = now;

      const rect = heading.getBoundingClientRect();
      const viewH = window.innerHeight;
      const headingCenter = rect.top + rect.height / 2;
      const offset = viewH * 0.5 - headingCenter;
      const target = Math.max(0, Math.min(1, offset / 200));

      const speed = 4.0;
      const lerp = 1 - Math.exp(-speed * dt);
      current += (target - current) * lerp;
      if (Math.abs(target - current) < 0.001) current = target;

      const vw = window.innerWidth;
      const islandWidth = Math.min(1287, vw);
      const startInsetPx = (vw - islandWidth) / 2;
      const startInsetPct = (startInsetPx / vw) * 100;

      const inset = startInsetPct * (1 - current);
      card.style.clipPath = `inset(0 ${inset}% 0 ${inset}%)`;

      // Background blur fades in with scroll (0 → 14px)
      if (bgImg) {
        bgImg.style.filter = `blur(${(current * 14).toFixed(2)}px)`;
      }

      // Trigger plants when expansion is nearly complete AND still within Island 3
      const sectionEl = ref.current;
      const island = sectionEl?.closest(".mt-16") as HTMLElement | null;
      if (current > 0.92 && island) {
        const islandRect = island.getBoundingClientRect();
        const inView = islandRect.top < window.innerHeight && islandRect.bottom > 0;
        setPlantsVisible(inView);
      } else {
        setPlantsVisible(false);
      }

      if (Math.abs(target - current) > 0.0005) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const startTick = () => {
      if (!running) {
        running = true;
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", startTick, { passive: true });
    startTick();

    return () => {
      window.removeEventListener("scroll", startTick);
      cancelAnimationFrame(rafId);
    };
  }, []);

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
        <GridSection extendTop className="bg-transparent!">
          <div className="relative flex items-center justify-between px-8 min-[1287px]:px-10 py-6">
            <BarDots top bottom />
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

      {/* Main content area with sand background — scroll-driven expansion */}
        <div
          ref={beachRef}
          className="relative flex flex-col h-137.5 md:h-200 lg:h-250"
        style={{
          clipPath: "inset(0 0 0 0 round 0px)",
          willChange: "clip-path",
        }}
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

        {/* Centered content */}
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

          {/* Tab bar — matches SiteSelection PillToggle */}
          <TravelPillToggle activeTab={activeTab} setActiveTab={setActiveTab} anim={anim} />

          {/* Phone mockups */}
          <div
            className="relative flex-1 w-full max-w-[1287px] mx-auto mt-6 md:mt-8 lg:mt-10"
            style={anim(350)}
          >
            {/* Desktop mockup */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: "2%",
                bottom: 0,
                width: "90%",
                maxWidth: 1158,
                height: "100%",
                borderRadius: "12px 12px 0 0",
                boxShadow: "0 -8px 60px rgba(0,0,0,0.28)",
              }}
            >
              <img
                src="/MapsGPTDesktop.png"
                alt="MapsGPT desktop interface"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Mobile mockup */}
            <div
              className="absolute overflow-hidden right-[5%]"
              style={{
                bottom: 0,
                height: "100%",
                aspectRatio: "263 / 572",
                borderRadius: "16px 16px 0 0",
                boxShadow: "-4px 0 40px rgba(0,0,0,0.15)",
                zIndex: 2,
              }}
            >
              <img
                src="/MapsGPTMobile.png"
                alt="MapsGPT mobile interface"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
