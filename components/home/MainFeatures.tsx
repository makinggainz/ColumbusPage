"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { cormorant } from "@/lib/typography";
import Link from "next/link";

export const MainFeatures = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

  const proFeatures = [
    "Map Chat & Research Reports",
    "Generative Due Diligence",
    "Custom Data Surveys",
    "Team Collaboration",
  ];

  const consumerFeatures = [
    "AI-Curated Local Discovery",
    "Hidden Spots & Insider Access",
    "Neighbourhood Intelligence",
    "Available on iOS & Android",
  ];

  return (
    <section
      data-navbar-theme="dark"
      className="bg-[#070709] py-32 border-b border-white/[0.05]"
    >
      <Container>
        <div ref={ref}>

          {/* Section marker */}
          <div className="flex items-center gap-4 mb-20" style={fadeIn(0)}>
            <span className="text-[10px] tracking-[0.2em] text-white/20 uppercase font-mono">
              03 / Products
            </span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>

          {/* Heading */}
          <div className="mb-16" style={fadeIn(0.1)}>
            <h2
              className={`${cormorant.className} font-bold leading-[0.93] tracking-[-0.04em] text-[#EDEDEA]`}
              style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
            >
              Two products.<br />
              One model.
            </h2>
          </div>

          {/* Cards */}
          <div className="grid lg:grid-cols-2 gap-4">

            {/* Columbus Pro */}
            <div
              className="relative flex flex-col justify-between p-10 min-h-[520px] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0A1344 0%, #0C1859 60%, #091140 100%)",
                border: "1px solid rgba(19,150,243,0.18)",
                ...fadeIn(0.2),
              }}
            >
              {/* Decorative grid */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(19,150,243,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(19,150,243,0.04) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
                aria-hidden
              />

              <div className="relative z-10">
                <span className="text-[10px] tracking-[0.22em] text-white/25 uppercase font-mono block mb-10">
                  Enterprise · Site Selection · GIS
                </span>

                <h3
                  className={`${cormorant.className} font-semibold leading-[0.93] tracking-[-0.02em] text-white mb-6`}
                  style={{ fontSize: "clamp(48px, 5vw, 68px)" }}
                >
                  Columbus<br />
                  <em>Pro</em>
                </h3>

                <p className="text-[14px] text-white/40 leading-[1.8] max-w-sm mb-10">
                  Enterprise-grade geospatial intelligence. AI-powered site
                  selection, due diligence, and market analysis for
                  professionals who can't afford to be wrong.
                </p>

                <ul className="space-y-2.5 mb-12">
                  {proFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[13px] text-white/45">
                      <span className="w-1 h-1 rounded-full bg-[#1396F3] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <Link
                  href="/enterprise"
                  className="inline-flex items-center px-5 py-2.5 bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
                >
                  Explore Columbus Pro →
                </Link>
                <span className="text-[10px] font-mono text-white/12 tracking-wider">PRO-1</span>
              </div>
            </div>

            {/* Columbus Consumer */}
            <div
              className="relative flex flex-col justify-between p-10 min-h-[520px] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0D0E14 0%, #111318 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                ...fadeIn(0.3),
              }}
            >
              <div>
                <span className="text-[10px] tracking-[0.22em] text-white/25 uppercase font-mono block mb-10">
                  Consumer · Travel · Discovery
                </span>

                <h3
                  className={`${cormorant.className} font-semibold leading-[0.93] tracking-[-0.02em] text-white mb-6`}
                  style={{ fontSize: "clamp(48px, 5vw, 68px)" }}
                >
                  Columbus<br />
                  <em>Consumer</em>
                </h3>

                <p className="text-[14px] text-white/40 leading-[1.8] max-w-sm mb-10">
                  Travel like you know everything. AI-powered local discovery,
                  neighbourhood insights, and hidden spots curated by the same
                  model that powers Pro.
                </p>

                <ul className="space-y-2.5 mb-12">
                  {consumerFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[13px] text-white/45">
                      <span className="w-1 h-1 rounded-full bg-white/25 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/products"
                  className="inline-flex items-center px-5 py-2.5 border border-white/18 text-white text-[13px] font-semibold hover:bg-white/5 transition-colors"
                >
                  Explore Consumer →
                </Link>
                <span className="text-[10px] font-mono text-white/12 tracking-wider">CONSUMER-1</span>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};
