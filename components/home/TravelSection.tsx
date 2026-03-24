"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";

const TABS = ["Plan cool trips", "Group planning", "Find spots", "Custom maps"];

export const TravelSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Full-width top border */}
      <div style={{ borderTop: gl }} />

      {/* Top bar — wrapped in GridSection for left/right grid lines */}
      <GridSection style={{ borderTop: "none" }}>
        <div
          className="flex items-center justify-between px-8 md:px-10 py-8"
          style={{ borderRight: gl, borderBottom: gl }}
        >
          <span className="text-[#1D1D1F] font-semibold" style={{ fontSize: 36 }}>
            MapsGPT <span className="font-normal">– AI-powered social map</span>
          </span>
          <Link
            href="/maps-gpt"
            className="flex items-center gap-2 text-[#1D1D1F] font-semibold hover:opacity-70 transition-opacity"
            style={{ fontSize: 17 }}
          >
            Learn more
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </GridSection>

      {/* Main content area with sand background */}
      <div
        className="relative"
        style={{
          backgroundImage: "url('/beach.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 700,
        }}
      >
        {/* Flower — top right */}
        <div className="absolute top-[-40px] right-[-20px] z-20 pointer-events-none" style={anim(100)}>
          <Image
            src="/flower.png"
            alt=""
            width={280}
            height={280}
            className="object-contain"
            style={{ transform: "rotate(0deg)" }}
          />
        </div>

        {/* Fern 1 — left side */}
        <div className="absolute bottom-[10%] left-[-60px] z-20 pointer-events-none" style={anim(200)}>
          <Image
            src="/fern1.png"
            alt=""
            width={240}
            height={480}
            className="object-contain"
          />
        </div>

        {/* Fern 2 — bottom right */}
        <div className="absolute bottom-[-20px] right-[-30px] z-20 pointer-events-none" style={anim(300)}>
          <Image
            src="/fern2.png"
            alt=""
            width={200}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Centered content */}
        <div className="relative z-10 flex flex-col items-center pt-16 md:pt-24 pb-8 px-6">
          {/* Heading */}
          <h2
            className="text-center text-[#1D1D1F] mb-4"
            style={{
              fontSize: "clamp(48px, 7vw, 80px)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              ...anim(0),
            }}
          >
            Travel like a boss
          </h2>

          {/* Subtitle */}
          <p
            className="text-center text-[#86868b] text-[19px] md:text-[21px] mb-10"
            style={anim(100)}
          >
            MapsGPT is a local guide in your pocket
          </p>

          {/* Tab bar */}
          <div
            className="inline-flex items-center rounded-full px-2 py-1.5 mb-12"
            style={{
              backgroundColor: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              ...anim(200),
            }}
          >
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="relative px-5 md:px-7 py-2.5 text-[15px] md:text-[15px] font-semibold rounded-full transition-all duration-200"
                style={{
                  color: activeTab === i ? "#1D1D1F" : "#6E6E73",
                  backgroundColor: activeTab === i ? "rgba(255,255,255,0.85)" : "transparent",
                  boxShadow: activeTab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Phone mockups */}
          <div
            className="relative flex items-end justify-center gap-4 md:gap-8 w-full"
            style={{ maxWidth: 1320, ...anim(350) }}
          >
            {/* Desktop/browser mockup */}
            <div
              className="relative rounded-xl overflow-hidden shadow-2xl"
              style={{ width: 995, maxWidth: "70%", height: 570 }}
            >
              <Image
                src="/emoji/desk.png"
                alt="MapsGPT desktop interface"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Mobile mockup */}
            <div
              className="relative rounded-xl overflow-hidden shadow-2xl"
              style={{ width: 293, maxWidth: "25%", height: 570 }}
            >
              <Image
                src="/emoji/mob.png"
                alt="MapsGPT mobile interface"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
