"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";
import glassStyles from "@/components/ui/GlassButton.module.css";

const PILLS = ["Map Chat", "Agentic Audits", "Agentic Research Reports", "Data Catalogue"];
const INSET = 4;

export const SiteSelection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll-driven expansion with lerp smoothing (like GSAP scrub: 0.8)
  useEffect(() => {
    const card = heroCardRef.current;
    const heading = headingRef.current;
    const img = imgRef.current;
    if (!card || !heading) return;

    let current = 0;          // lerped progress
    let rafId = 0;
    let lastTime = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = lastTime ? (now - lastTime) / 1000 : 0.016;
      lastTime = now;

      // Target: 0 when heading center is at viewport center, 1 after 200px more scroll
      const rect = heading.getBoundingClientRect();
      const viewH = window.innerHeight;
      const headingCenter = rect.top + rect.height / 2;
      const offset = viewH * 0.5 - headingCenter; // positive = scrolled past center
      const target = Math.max(0, Math.min(1, offset / 200));

      // Smooth lerp — frame-rate independent, ~0.6s to catch up
      const speed = 4.0;
      const lerp = 1 - Math.exp(-speed * dt);
      current += (target - current) * lerp;

      // Snap to target when very close (avoid infinite micro-updates)
      if (Math.abs(target - current) < 0.001) current = target;

      // Calculate inset so progress=0 fits exactly within the island (1287px max-width)
      // The card is 100vw wide; we need to clip it to match the island container
      const vw = window.innerWidth;
      const islandWidth = Math.min(1287, vw); // island can't exceed viewport
      const startInsetPx = (vw - islandWidth) / 2;
      const startInsetPct = (startInsetPx / vw) * 100;

      // Interpolate: startInsetPct → 0%
      const inset = startInsetPct * (1 - current);
      card.style.clipPath = `inset(0 ${inset}% 0 ${inset}%)`;

      // Image scale: 1.02 → 1
      if (img) {
        const scale = 1 + 0.02 * (1 - current);
        img.style.transform = `scale(${scale})`;
      }

      // Keep ticking if not settled
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
    // Run once on mount
    startTick();

    return () => {
      window.removeEventListener("scroll", startTick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <GridSection>
      <div ref={ref} style={{ borderBottom: gl }}>
        {/* Top bar: Columbus Pro + New | Start Now */}
        <div className="flex items-center justify-between px-8 md:px-10 py-6" style={anim(0)}>
          <div className="flex items-center gap-3">
            <span className="text-[#1D1D1F] font-bold" style={{ fontSize: 40 }}>
              Columbus Pro
            </span>
            <div className={glassStyles.wrapNew}>
              <div className={`${glassStyles.btn} ${glassStyles.btnNew}`}>
                <span>New</span>
              </div>
            </div>
          </div>
          <Link
            href="/maps-gpt"
            className="flex items-center gap-2 text-[#1D1D1F] font-semibold hover:opacity-70 transition-opacity"
            style={{ fontSize: 20 }}
          >
            Start Now
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Hero card — clip-path expansion from compact to full-screen on scroll */}
        <div
          ref={heroCardRef}
          className="relative overflow-hidden"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            clipPath: "inset(0 0 0 0 round 0px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 100ms, transform 0.7s ease 100ms",
            willChange: "clip-path",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="relative" style={{ minHeight: 800 }}>
            <Image
              ref={imgRef}
              src="/ProductBackgroundImageHome.png"
              alt=""
              fill
              className="object-cover"
              style={{
                transform: "scale(1.03)",
                willChange: "transform",
              }}
            />

            {/* Content over image */}
            <div className="relative z-10 flex flex-col items-center pt-16 md:pt-24 px-6">
              {/* Main heading */}
              <h2
                ref={headingRef}
                className="text-[#1D1D1F] text-center leading-[1.05] tracking-[-0.02em]"
                style={{ fontSize: 96, fontWeight: 400 }}
              >
                An Agentic GIS platform
              </h2>

              {/* Subtitle */}
              <p className="text-[17px] text-[#1D1D1F]/70 mt-8 text-center">
                Columbus turns you into a <span className="font-bold text-[#1D1D1F]">super-explorer.</span>
              </p>

              {/* Pill toggle */}
              <PillToggle />

              {/* Desktop + Mobile UI mockups */}
              <div className="relative w-full max-w-[1100px] mx-auto mt-12" style={{ height: 480 }}>
                {/* Desktop UI */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    left: "2%",
                    bottom: 0,
                    width: "68%",
                    height: "100%",
                    borderRadius: "12px 12px 0 0",
                    boxShadow: "0 -4px 40px rgba(0,0,0,0.12)",
                  }}
                >
                  <Image
                    src="/Icon/desktop-ui.png"
                    alt="Desktop UI"
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Mobile UI */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    right: "5%",
                    bottom: 0,
                    width: 220,
                    height: "95%",
                    borderRadius: "16px 16px 0 0",
                    boxShadow: "-4px 0 40px rgba(0,0,0,0.15)",
                    zIndex: 2,
                  }}
                >
                  <Image
                    src="/Icon/mobile-ui.png"
                    alt="Mobile UI"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Check it out CTA */}
        <div
          className="flex items-center justify-center py-6"
        >
          <Link
            href="/maps-gpt"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-none border border-[#1D1D1F] text-[#1D1D1F] text-[20px] font-semibold hover:bg-[#1D1D1F] hover:text-white transition-colors"
          >
            Check it out
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </GridSection>
  );
};

/* ── Pill Toggle ── */
function PillToggle() {
  const [active, setActive] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const measure = (idx: number) => {
    const btn = buttonRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const bRect = btn.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setIndicator({
      left: bRect.left - cRect.left + INSET,
      width: bRect.width - INSET * 2,
      ready: true,
    });
  };

  useEffect(() => { measure(0); }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center relative mt-8 w-full max-w-[893px]"
      style={{
        height: 56,
        borderRadius: 28,
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Sliding indicator */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: INSET,
          left: indicator.left,
          width: indicator.width,
          height: `calc(100% - ${INSET * 2}px)`,
          borderRadius: 24,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          opacity: indicator.ready ? 1 : 0,
          transition: [
            "left 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            "width 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            "opacity 0.2s ease",
          ].join(", "),
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {PILLS.map((label, i) => (
        <button
          key={label}
          ref={el => { buttonRefs.current[i] = el; }}
          type="button"
          onClick={() => { setActive(i); measure(i); }}
          className="h-full flex items-center justify-center whitespace-nowrap relative"
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            zIndex: 2,
            color: active === i ? "#1D1D1F" : "rgba(29,29,31,0.5)",
            transition: "color 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
          onMouseEnter={e => {
            if (active !== i) (e.currentTarget as HTMLElement).style.color = "rgba(29,29,31,0.75)";
          }}
          onMouseLeave={e => {
            if (active !== i) (e.currentTarget as HTMLElement).style.color = "rgba(29,29,31,0.5)";
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
