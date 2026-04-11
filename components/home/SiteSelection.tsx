"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";
import glassStyles from "@/components/ui/GlassButton.module.css";

const PILLS = ["Map Chat", "Agentic Audits", "Agentic Research", "Data Catalogue"];

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
            <span
              className="hidden min-[640px]:inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] uppercase"
              style={{ border: "1px solid rgba(0,102,204,0.3)", color: "#0066CC" }}
            >
              NEW
            </span>
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
              src="/probackground.png"
              alt=""
              fill
              className="object-cover"
              style={{
                transform: "scale(1.14)",
              }}
            />

            {/* Dark blue overlay — fades in with scroll expansion (commented out, re-enable in tick if needed) */}
            {/* <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none"
              style={{ background: "rgba(10,4,40,1)", opacity: 0, zIndex: 1 }}
            /> */}

            {/* Background blur overlay */}
            <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none mobile-blur-reduce"
              style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", opacity: 1, zIndex: 1 }}
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
    <div className="max-w-[1287px] mx-5 md:mx-auto" style={{ height: 1, background: "linear-gradient(to right, var(--grid-line) 0%, var(--grid-line) 60%, transparent 100%)" }} />
    </>
  );
};

/* ── Feature Tab Bar — structural, no rounding ── */
function PillToggle() {
  const [active, setActive] = useState(0);

  return (
    <div
      className="flex mt-8 md:mt-10 lg:mt-14 w-full max-w-[560px]"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      {PILLS.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => setActive(i)}
          className="flex-1 py-3.5 text-[14px] font-medium relative overflow-hidden"
          style={{
            color: active === i ? "#0A1344" : "rgba(29,29,31,0.4)",
            borderRight: i < PILLS.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
            transition: "color 0.3s ease",
          }}
        >
          {/* Active gradient — slides up from bottom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,102,204,0.12) 0%, rgba(0,102,204,0.04) 60%, transparent 100%)",
              opacity: active === i ? 1 : 0,
              transform: active === i ? "translateY(0%)" : "translateY(100%)",
              transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  );
}
