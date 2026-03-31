"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";
import glassStyles from "@/components/ui/GlassButton.module.css";

const PILLS = ["Map Chat", "Agentic Audits", "AI Research Reports", "Data Catalogue"];
const INSET = 4;

export const SiteSelection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
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
    const overlay = overlayRef.current;
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

      // Image scale: 1.02 → 1, blur fades in with scroll (0 → 14px)
      if (img) {
        const scale = 1 + 0.14 * (1 - current);
        const blur = (current * 14).toFixed(2);
        img.style.transform = `scale(${scale})`;
        img.style.filter = `blur(${blur}px)`;
      }

      // Dark blue overlay fades in with scroll (0 → 0.35)
      // if (overlay) {
      //   overlay.style.opacity = (current * 0.35).toFixed(3);
      // }

      // backdrop-filter blur approach (kept for reference, replaced by direct image filter above)
      // if (overlay) {
      //   const blur = (current * 24).toFixed(2);
      //   overlay.style.backdropFilter = `blur(${blur}px)`;
      //   overlay.style.webkitBackdropFilter = `blur(${blur}px)`;
      // }

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
    <>
      {/* Top bar — full width with grid lines */}
      <div style={{
        borderTop: "1px solid var(--grid-line)",
        borderBottom: "1px solid var(--grid-line)"
      }}>
        <div className="grid-section relative flex items-center justify-between max-w-[1287px] mx-auto px-8 min-[1287px]:px-10 py-6" style={anim(0)}>
          <div className="flex items-center gap-3">
            <span className="text-[18px] lg:text-[20px] text-[#1D1D1F] font-bold">
              Columbus Pro
            </span>
            <div className={`hidden min-[640px]:block ${glassStyles.wrapNew}`} style={{ filter: "drop-shadow(0 0 8px rgba(37, 99, 235, 0.5)) drop-shadow(0 0 20px rgba(37, 99, 235, 0.25))" }}>
              <div className={`${glassStyles.btn} ${glassStyles.btnNew}`}>
                <span>New</span>
              </div>
            </div>
          </div>
          <Link
            href="/maps-gpt"
            className="group flex items-center gap-3 min-[640px]:gap-10 text-[18px] lg:text-[20px] text-[#1D1D1F] font-semibold transition-opacity"
          >
            <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Start Now</span>
            <svg
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              width="9" height="16" viewBox="0 0 7 12" fill="none"
              stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Rest wrapped in GridSection for left/right grid lines */}
      <GridSection>
      <div ref={ref} style={{ borderBottom: gl }}>

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
          <div className="relative flex flex-col h-137.5 md:h-200 lg:h-250">
            <Image
              ref={imgRef}
              src="/ProductBackgroundImageHome.png"
              alt=""
              fill
              className="object-cover"
              style={{
                transform: "scale(1.14)",
                willChange: "transform",
              }}
            />

            {/* Dark blue overlay — fades in with scroll expansion (commented out, re-enable in tick if needed) */}
            {/* <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none"
              style={{ background: "rgba(10,4,40,1)", opacity: 0, zIndex: 1 }}
            /> */}

            {/* Background blur overlay — fades in with scroll expansion */}
            <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none"
              style={{ backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", opacity: 1, zIndex: 1 }}
            />

            {/* Content over image */}
            <div className="relative z-10 flex flex-col flex-1 items-center pt-10 md:pt-16 lg:pt-24 px-6">
              {/* Main heading */}
              <h2
                ref={headingRef}
                className="text-[#1D1D1F] text-center leading-[1.1] tracking-[-0.02em] text-[39px] md:text-[49px] lg:text-[76px]"
                style={{ fontWeight: 500, letterSpacing: "-0.02em" }}
              >
                An Agentic GIS platform
              </h2>

              {/* Subtitle */}
              <p className="mt-3 md:mt-4 lg:mt-6 text-center text-[16px] md:text-[20px]" style={{ color: "rgba(29,29,31,0.45)", letterSpacing: "-0.015em", fontWeight: 400 }}>
                Columbus turns you into a <span style={{ fontWeight: 600, color: "rgba(29,29,31,0.65)" }}>super-explorer.</span>
              </p>

              {/* Pill toggle */}
              <PillToggle />

              {/* Desktop + Mobile UI mockups */}
              <div className="relative flex-1 w-full max-w-[1287px] mx-auto mt-6 md:mt-8 lg:mt-10">
                {/* Desktop UI */}
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
                    src="/Icon/desktop-ui.png"
                    alt="Desktop UI"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Mobile UI */}
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

      </div>
    </GridSection>
    </>
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
    <>
      {/* ── Desktop: horizontal pill bar with sliding indicator (≥684px) ── */}
      <div
        ref={containerRef}
        className="hidden min-[684px]:inline-flex items-center relative mt-8 md:mt-10 lg:mt-14"
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
            className="h-full flex items-center justify-center whitespace-nowrap relative cursor-pointer"
            style={{
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              padding: "0 24px",
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

      {/* ── Mobile: 2×2 grid of pill buttons (<684px) ── */}
      <div className="min-[684px]:hidden grid grid-cols-2 gap-2 mt-8 w-full max-w-100 px-4">
        {PILLS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => { setActive(i); measure(i); }}
            className="flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
            style={{
              height: 44,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              backgroundColor: active === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
              color: active === i ? "#1D1D1F" : "rgba(29,29,31,0.5)",
              boxShadow: active === i ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
