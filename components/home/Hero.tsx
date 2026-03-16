"use client";

import { cormorant } from "@/lib/typography";
import { Container } from "@/components/layout/Container";
import { useEffect, useState } from "react";

export const Hero = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    filter: visible ? "blur(0)" : "blur(5px)",
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s, filter 0.9s ease ${delay}s`,
  });

  return (
    <section
      data-navbar-theme="dark"
      className="min-h-screen bg-[#070709] flex flex-col border-b border-white/[0.05]"
    >
      {/* Main content */}
      <div className="flex-1 flex items-center py-28">
        <Container>
          <div className="grid lg:grid-cols-[1fr_160px] gap-12 items-start">

            {/* Left: headline block */}
            <div>

              {/* Classification tag */}
              <div className="flex items-center gap-3 mb-12" style={fadeIn(0.1)}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1396F3]" />
                <span className="text-[11px] tracking-[0.22em] text-white/30 uppercase font-medium">
                  Frontier AI Research · Washington D.C.
                </span>
              </div>

              {/* Main headline */}
              <h1
                className={`${cormorant.className} font-semibold leading-[0.92] tracking-[-0.025em] text-[#EDEDEA] mb-10`}
                style={{
                  fontSize: "clamp(64px, 10vw, 140px)",
                  ...fadeIn(0.2),
                }}
              >
                Building<br />
                the first<br />
                <em>Large</em><br />
                Geospatial<br />
                Model.
              </h1>

              {/* Body copy */}
              <p
                className="text-[15px] text-white/40 max-w-[420px] leading-[1.8] mb-10"
                style={fadeIn(0.38)}
              >
                GeoContext-1 processes satellite imagery, terrain data,
                infrastructure networks, and temporal patterns to generate
                actionable intelligence across defence, climate, and urban domains.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-5" style={fadeIn(0.48)}>
                <a
                  href="/enterprise"
                  className="inline-flex items-center px-6 py-3 bg-white text-black text-[13px] font-semibold tracking-tight hover:bg-white/88 transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="#research"
                  className="text-[13px] text-white/35 hover:text-white/60 transition-colors"
                >
                  Read Research →
                </a>
              </div>
            </div>

            {/* Right: coordinate readout */}
            <div
              className="hidden lg:flex flex-col gap-2.5 font-mono text-[11px] text-white/18 tracking-widest mt-[240px]"
              style={fadeIn(0.6)}
            >
              <span className="text-white/10 text-[9px] tracking-[0.15em] uppercase mb-1">// position</span>
              <span>38.8977° N</span>
              <span>77.0365° W</span>
              <span>+18 m</span>
              <div className="w-px h-8 bg-white/[0.07] my-3 ml-0" />
              <span className="text-white/10 text-[9px] tracking-[0.15em] uppercase mb-1">// status</span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#1396F3]" />
                ONLINE
              </span>
              <span>v1.0.0</span>
            </div>

          </div>
        </Container>
      </div>

      {/* Bottom data strip */}
      <div className="border-t border-white/[0.05] py-4" style={fadeIn(0.65)}>
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 sm:gap-10 text-[11px] font-mono text-white/18 tracking-wider">
              <span>GeoContext-1</span>
              <span className="hidden sm:inline">148M km²</span>
              <span className="hidden md:inline">2.3T Data Points</span>
              <span className="hidden lg:inline">12 Active Deployments</span>
            </div>
            <span className="text-[11px] font-mono text-white/12 tracking-wider">EST. 2024</span>
          </div>
        </Container>
      </div>

    </section>
  );
};
