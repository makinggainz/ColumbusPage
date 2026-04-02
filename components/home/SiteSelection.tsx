"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";
import glassStyles from "@/components/ui/GlassButton.module.css";

const PILLS = ["Map Chat", "Agentic Audits", "Agentic Research", "Data Catalogue"];
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
        <div className="grid-section relative flex items-center justify-between max-w-[1287px] mx-5 md:mx-auto px-8 min-[1287px]:px-10 py-6" style={anim(0)}>
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

      {/* Rest wrapped in GridSection — hide vertical lines so they don't overlay the hero image */}
      <GridSection className="[&::before]:hidden [&::after]:hidden">
      <div ref={ref} style={{ borderBottom: gl }}>

        {/* Hero card */}
        <div
          ref={heroCardRef}
          className="relative overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 100ms, transform 0.7s ease 100ms",
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
              <div className="relative flex-1 w-full max-w-[1287px] mx-5 md:mx-auto mt-6 md:mt-8 lg:mt-10">
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
                  className="absolute overflow-hidden right-[2%]"
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
  const [hovered, setHovered] = useState<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const [hoverIndicator, setHoverIndicator] = useState({ left: 0, width: 0 });
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

  const measureHover = (idx: number) => {
    const btn = buttonRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const bRect = btn.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setHoverIndicator({
      left: bRect.left - cRect.left + INSET,
      width: bRect.width - INSET * 2,
    });
  };

  const handleClick = (i: number) => {
    if (i === active) return;
    setActive(i);
    measure(i);
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
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* Hover highlight */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: INSET,
            left: hoverIndicator.left,
            width: hoverIndicator.width,
            height: `calc(100% - ${INSET * 2}px)`,
            borderRadius: 24,
            backgroundColor: pressed !== null && pressed !== active
              ? "rgba(37,99,235,0.12)"
              : "rgba(37,99,235,0.05)",
            opacity: hovered !== null && hovered !== active ? 1 : 0,
            transition: [
              "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
              "width 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
              "opacity 0.2s ease",
              "background-color 0.1s ease",
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
            top: INSET,
            left: indicator.left,
            width: indicator.width,
            height: `calc(100% - ${INSET * 2}px)`,
            borderRadius: 24,
            backgroundColor: "#0A1344",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            opacity: indicator.ready ? 1 : 0,
            transition: [
              "left 0.35s cubic-bezier(0.34, 1.15, 0.64, 1)",
              "width 0.35s cubic-bezier(0.34, 1.15, 0.64, 1)",
              "opacity 0.15s ease",
            ].join(", "),
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {PILLS.map((label, i) => (
          <button
            key={label}
            ref={el => { buttonRefs.current[i] = el; }}
            type="button"
            className="h-full flex items-center justify-center whitespace-nowrap relative cursor-pointer"
            style={{
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              padding: "0 24px",
              zIndex: 3,
              color: active === i ? "#ffffff" : hovered === i ? "#1D1D1F" : "rgba(29,29,31,0.6)",
              transition: "color 0.25s ease",
            }}
            onClick={() => handleClick(i)}
            onMouseEnter={() => { setHovered(i); measureHover(i); }}
            onMouseLeave={() => { setHovered(null); setPressed(null); }}
            onMouseDown={() => { if (i !== active) setPressed(i); }}
            onMouseUp={() => setPressed(null)}
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
