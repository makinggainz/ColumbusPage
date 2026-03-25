"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cambo } from "@/app/fonts";
import { GridSection, gl } from "./ContentGrid";

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
    <div
      ref={containerRef}
      className="inline-flex items-center relative mb-0"
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
      const radius = current > 0 ? 12 * (1 - current) : 0;
      card.style.clipPath = `inset(0 ${inset}% 0 ${inset}% round ${radius}px)`;

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
      {/* Top bar — wrapped in GridSection for left/right grid lines */}
      <GridSection>
        <div
          className="flex items-center justify-between px-8 md:px-10 py-6"
          style={{ borderBottom: gl }}
        >
          <span className="text-[#1D1D1F] font-bold" style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
            MapsGPT <span className="font-normal">– AI-powered social map</span>
          </span>
          <Link
            href="/maps-gpt"
            className="flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity"
            style={{
              fontSize: 20,
              background: "linear-gradient(90deg, #111111 0%, #7B6FE8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Try it out now
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#7B6FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10L10 2M10 2H4M10 2V8" />
            </svg>
          </Link>
        </div>
      </GridSection>

      {/* Main content area with sand background — scroll-driven expansion */}
      <div
        ref={beachRef}
        className="relative"
        style={{
          minHeight: 700,
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
        <div className="relative z-10 flex flex-col items-center pt-16 md:pt-24 pb-8 px-6">
          {/* Heading */}
          <h2
            ref={travelHeadingRef}
            className="text-center text-[#1D1D1F] leading-[1.05] tracking-[-0.02em] mb-4"
            style={{
              fontSize: 78,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              ...anim(0),
            }}
          >
            Travel like a boss
          </h2>

          {/* Subtitle */}
          <p
            className="text-center mb-10"
            style={{ fontSize: 20, color: "rgba(29,29,31,0.45)", letterSpacing: "-0.015em", fontWeight: 400, ...anim(100) }}
          >
            MapsGPT is a local guide in your pocket
          </p>

          {/* Tab bar — matches SiteSelection PillToggle */}
          <TravelPillToggle activeTab={activeTab} setActiveTab={setActiveTab} anim={anim} />

          {/* Phone mockups */}
          <div
            className="relative w-full max-w-300 mx-auto"
            style={{ height: 660, marginTop: 16, ...anim(350) }}
          >
            {/* Desktop mockup */}
            <div
              className="absolute overflow-hidden"
              style={{ left: "2%", bottom: 0, width: 1080, height: 658, borderRadius: "12px 12px 0 0", boxShadow: "0 -2px 20px rgba(0,0,0,0.08)" }}
            >
              <Image
                src="/MapsGPTDesktop.png"
                alt="MapsGPT desktop interface"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Mobile mockup */}
            <div
              className="absolute overflow-hidden"
              style={{ right: "3%", bottom: 0, width: 300, height: 660, borderRadius: "16px 16px 0 0", boxShadow: "-2px 0 20px rgba(0,0,0,0.10)", zIndex: 2 }}
            >
              <Image
                src="/MapsGPTMobile.png"
                alt="MapsGPT mobile interface"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
