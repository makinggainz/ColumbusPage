"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { baumans } from "@/lib/typography";

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
      data-navbar-theme="dark"
      className="relative bg-black min-h-screen overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: `28px 28px`,
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Center blue radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          width: 900,
          height: 700,
          background: "radial-gradient(ellipse at center, rgba(20,60,180,0.14) 0%, transparent 65%)",
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Bottom fade into mesh */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #000000)",
          zIndex: 1,
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-44 pb-52 w-full max-w-5xl mx-auto">

        {/* Eyebrow */}
        <p
          className="text-[10px] font-medium tracking-[0.28em] text-white/25 uppercase mb-12"
          style={fadeIn(0)}
        >
          Columbus Earth — Frontier AI Research
        </p>

        {/* Main Heading */}
        <h1
          className={`${baumans.className} font-semibold text-white`}
          style={{
            fontSize: "clamp(50px, 7vw, 96px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.01,
            ...fadeIn(80),
          }}
        >
          <span className="block text-white/40 font-normal">The frontier AI Lab</span>
          building the first in&#8209;production
          <br />
          Large Geospatial Model.
        </h1>

        {/* Model tag */}
        <div
          className="mt-10 flex items-center gap-4"
          style={fadeIn(220)}
        >
          <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.18)" }} />
          <p className="text-[10px] font-medium tracking-[0.28em] text-white/22 uppercase">
            Columbus Pro-1
          </p>
          <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.18)" }} />
        </div>

        {/* CTAs */}
        <div
          className="mt-14 flex items-center gap-3 flex-wrap justify-center"
          style={fadeIn(340)}
        >
          <Link
            href="/platform"
            className="inline-flex items-center justify-center h-12 px-8 bg-white text-black text-[13px] font-semibold tracking-tight hover:bg-white/90 transition-colors"
          >
            Start Now
          </Link>
          <Link
            href="/technology"
            className="inline-flex items-center justify-center h-12 px-8 border border-white/15 text-white/55 text-[13px] font-medium tracking-tight hover:border-white/30 hover:text-white/90 transition-all"
          >
            Learn More →
          </Link>
        </div>

      </div>
    </section>
  );
};
