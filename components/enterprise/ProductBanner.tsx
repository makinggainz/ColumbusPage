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
        style={{ backgroundColor: "rgba(0, 0, 0, 0.40)", zIndex: 2 }}
      />

      {/* Generated noise grain texture — full width */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3, opacity: 0.40, mixBlendMode: "multiply" }}>
        <filter id="bannerNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bannerNoise)" />
      </svg>

      {/* Textured grid lines */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 4 }}
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
          paddingTop: 180,
          paddingBottom: 180,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <h2
          className="text-center leading-[1.1] text-[28px] md:text-[36px] lg:text-[45px]"
          style={{
            letterSpacing: "-0.025em",
            color: "transparent",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='white' /%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            textShadow: "0 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.1)",
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
          className="group mt-10 flex items-center gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300"
          style={{ fontSize: 14, fontWeight: 500, height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "#1D1D1F", color: "white" }}
        >
          <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Try Demo</span>
          <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
