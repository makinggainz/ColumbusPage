"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { spaceGrotesk } from "@/lib/typography";

export const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    filter: mounted ? "blur(0px)" : "blur(8px)",
    transform: mounted ? "translateY(0px)" : "translateY(18px)",
    transition: `opacity 1000ms ease, filter 1000ms ease, transform 1000ms ease`,
    transitionDelay: `${delay}ms`,
  });

  return (
    <section
      className="relative bg-[#FFFFFF] min-h-screen overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: `28px 28px`,
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Center subtle blue radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          width: 900,
          height: 700,
          background: "radial-gradient(ellipse at center, rgba(20,60,180,0.04) 0%, transparent 65%)",
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-44 pb-52 w-full max-w-5xl mx-auto">

        {/* Eyebrow */}
        <p
          className="text-[11px] font-medium tracking-[0.15em] text-[#A1A1AA] uppercase mb-12"
          style={fadeIn(0)}
        >
          Columbus Earth — Frontier AI Research
        </p>

        {/* Main Heading */}
        <h1
          className={`${spaceGrotesk.className} font-bold text-[#09090B] tracking-tight`}
          style={{
            fontSize: "clamp(50px, 7vw, 96px)",
            lineHeight: 1.01,
            ...fadeIn(80),
          }}
        >
          <span className="block text-[#A1A1AA] font-normal">The frontier AI Lab</span>
          building the first in&#8209;production
          <br />
          Large Geospatial Model.
        </h1>

        {/* Model tag */}
        <div
          className="mt-10 flex items-center gap-4"
          style={fadeIn(220)}
        >
          <div style={{ width: 32, height: 1, background: "#E4E4E7" }} />
          <p className="text-[11px] font-medium tracking-[0.15em] text-[#A1A1AA] uppercase">
            Columbus Pro-1
          </p>
          <div style={{ width: 32, height: 1, background: "#E4E4E7" }} />
        </div>

        {/* CTAs */}
        <div
          className="mt-14 flex items-center gap-3 flex-wrap justify-center"
          style={fadeIn(340)}
        >
          <Link
            href="/platform"
            className="inline-flex items-center justify-center h-11 px-6 bg-[#09090B] text-white text-sm font-medium hover:bg-[#09090B]/90 transition-colors"
          >
            Start Now
          </Link>
          <Link
            href="/technology"
            className="inline-flex items-center justify-center h-11 px-6 border border-[#E4E4E7] text-[#3F3F46] text-sm font-medium hover:bg-[#FAFAFA] transition-all"
          >
            Learn More →
          </Link>
        </div>

      </div>
    </section>
  );
};
