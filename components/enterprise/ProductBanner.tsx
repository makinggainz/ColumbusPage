"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const materialText: React.CSSProperties = {
    backgroundImage: "url(/ProductBackgroundImageHome.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    filter: "brightness(2.0) saturate(0.6) contrast(1.3)",
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#000" }}
    >
      {/* Landscape image — full width, full opacity as base */}
      <Image
        src="/ProductBackgroundImageHome.png"
        alt=""
        fill
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.40)", zIndex: 1 }}
      />

      {/* Generated noise grain texture — full width */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2, opacity: 0.40, mixBlendMode: "multiply" }}>
        <filter id="bannerNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bannerNoise)" />
      </svg>

      {/* Textured grid lines */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 3 }}
        aria-hidden
      >
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "100%",
            maxWidth: 1287,
            borderLeft: "1px solid rgba(255,255,255,0.10)",
            borderRight: "1px solid rgba(255,255,255,0.10)",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), " +
              "linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "80px 80px, 80px 80px",
            backgroundPosition: "center top, center top",
          }}
        />
      </div>

      <div
        className="relative z-10 flex flex-col items-center justify-center px-6 md:px-10"
        style={{
          paddingTop: 120,
          paddingBottom: 120,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <h2
          className="text-center leading-[1.15] text-[24px] md:text-[32px] lg:text-[40px]"
          style={{
            letterSpacing: "-0.025em",
            ...materialText,
          }}
        >
          <strong>Columbus Pro</strong>
          {" — "}
          GIS made effortless
        </h2>
        {/* Inner shadow overlay on text area */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -70%)",
            width: 700,
            height: 80,
            borderRadius: 40,
            boxShadow: "inset 0 4px 20px rgba(0,0,0,0.15), inset 0 -2px 10px rgba(0,0,0,0.08)",
            mixBlendMode: "multiply",
          }}
        />

        <Link
          href="/contact"
          className="group relative mt-10 flex items-center justify-center gap-3 whitespace-nowrap transition-all duration-200 hover:brightness-110 overflow-hidden"
          style={{
            height: 48,
            paddingLeft: 48,
            paddingRight: 44,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            borderRadius: 0,
            backgroundColor: "#0A1344",
            color: "white",
            boxShadow: "none",
          }}
        >
          {/* Button noise texture */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.45, mixBlendMode: "overlay" }}>
            <filter id="btnNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#btnNoise)" />
          </svg>
          <span className="relative z-10">Try Demo</span>
          <svg
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
            width="9" height="16" viewBox="0 0 7 12" fill="none"
            stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
