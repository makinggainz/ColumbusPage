"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GridSection } from "@/components/home/ContentGrid";

export default function MissionPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  });

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F9F9F9" }}>
      <Navbar />

      <GridSection style={{ backgroundColor: "#F9F9F9" }}>
        <div className="grid lg:grid-cols-2 gap-0 px-8 md:px-10 py-[140px] md:py-[180px]">

          {/* OUR MISSION — left */}
          <div className="pr-0 lg:pr-16 mb-20 lg:mb-0">
            <p
              className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-8"
              style={{ color: "rgba(29,29,31,0.4)", ...fade(0) }}
            >
              Our Mission
            </p>

            <h1
              className="font-light leading-[1.1] text-[28px] md:text-[34px] lg:text-[40px]"
              style={{ color: "#1D1D1F", letterSpacing: "-0.02em", ...fade(100) }}
            >
              To create intelligence to critically understand our planet better.
            </h1>

            <p
              className="mt-8 text-[16px] md:text-[18px] leading-[1.6]"
              style={{ color: "rgba(29,29,31,0.5)", letterSpacing: "-0.015em", ...fade(200) }}
            >
              Deep surveying of all earth. More informed, the better decisions.
            </p>

            <p
              className="mt-4 text-[16px] md:text-[18px] leading-[1.6]"
              style={{ color: "rgba(29,29,31,0.5)", letterSpacing: "-0.015em", ...fade(280) }}
            >
              Most powerful geospatial platform to map.
            </p>
          </div>

          {/* OUR VISION — right */}
          <div className="pl-0 lg:pl-16 lg:border-l lg:border-[rgba(29,29,31,0.08)]">
            <p
              className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-8"
              style={{ color: "rgba(29,29,31,0.4)", ...fade(200) }}
            >
              Our Vision
            </p>

            <h2
              className="font-light leading-[1.1] text-[28px] md:text-[34px] lg:text-[40px]"
              style={{ color: "#1D1D1F", letterSpacing: "-0.02em", ...fade(300) }}
            >
              Path towards a Universal Geospatial Model.
            </h2>

            <p
              className="mt-8 text-[16px] md:text-[18px] leading-[1.6]"
              style={{ color: "rgba(29,29,31,0.5)", letterSpacing: "-0.015em", ...fade(400) }}
            >
              A Thinking Earth.
            </p>

            <div className="mt-12 border-l-2 border-[#2563EB] pl-6" style={fade(500)}>
              <p
                className="text-[16px] md:text-[18px] leading-[1.7]"
                style={{ color: "rgba(29,29,31,0.6)", letterSpacing: "-0.015em" }}
              >
                In a world full of slop, we want reality. Our AI is for reality. None of our content, or coding was Artificail.
              </p>

              <p
                className="mt-6 text-[16px] md:text-[18px] font-medium"
                style={{ color: "#1D1D1F", letterSpacing: "-0.02em" }}
              >
                Nature always prevails.
              </p>
            </div>
          </div>

        </div>
      </GridSection>

      <Footer />
    </main>
  );
}
