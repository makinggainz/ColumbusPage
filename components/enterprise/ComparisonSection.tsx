"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { StructureGrid } from "./StructureGrid";

const FULL_TEXT =
  "generate the fastest route for next tuesday 10am. It'll be a multi-stop route through Philadelphia. I've attached a file with vehicle type and each location.";

const fadeIn = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  filter: visible ? "blur(0px)" : "blur(8px)",
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
});

const loadingTextStyle: React.CSSProperties = {
  backgroundImage: "linear-gradient(90deg, #0A1344 0%, #0A1344 30%, #8A9BD4 50%, #0A1344 70%, #0A1344 100%)",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  animation: "comparison-shimmer 1.6s ease-in-out infinite",
};

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [columbusLoaded, setColumbusLoaded] = useState(false);
  const [basicLoaded, setBasicLoaded] = useState(false);

  // Intersection observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Typewriter — starts after prompt box finishes fading in (~0.75s)
  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setTypedText(FULL_TEXT.slice(0, i));
        if (i >= FULL_TEXT.length) {
          clearInterval(interval);
          setTypingDone(true);
        }
      }, 18);
      return () => clearInterval(interval);
    }, 750);
    return () => clearTimeout(startDelay);
  }, [visible]);

  // Columbus loads 0.5s after typing finishes
  useEffect(() => {
    if (!typingDone) return;
    const t = setTimeout(() => setColumbusLoaded(true), 500);
    return () => clearTimeout(t);
  }, [typingDone]);

  // Basic AI loads 1s after Columbus
  useEffect(() => {
    if (!columbusLoaded) return;
    const t = setTimeout(() => setBasicLoaded(true), 1000);
    return () => clearTimeout(t);
  }, [columbusLoaded]);

  return (
    <section ref={sectionRef} className="relative w-full pt-8 pb-28 lg:pt-10 lg:pb-[180px]">
      <StructureGrid />
      <style>{`
        @keyframes comparison-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      <div className="relative z-10 max-w-[1287px] mx-auto px-8 md:px-10 flex flex-col items-center">

        {/* Title — Headline Medium */}
        <h2
          className="font-light leading-[1.05] text-center whitespace-nowrap text-[28px] lg:text-[44px]"
          style={{ letterSpacing: "-0.03em", ...fadeIn(visible, 0) }}
        >
          See How We&apos;re Different
        </h2>

        {/* For Any Query label */}
        <p
          className="mt-6 text-center"
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
            color: "rgba(10,19,68,0.35)",
            ...fadeIn(visible, 0.08),
          }}
        >
          For Any Query:
        </p>

        {/* Prompt Box */}
        <div
          style={{
            ...fadeIn(visible, 0.15),
            boxShadow: "0px 0px 20px 3px rgba(191, 197, 235, 0.20)",
          }}
          className="mt-4 w-full max-w-[600px] bg-white border border-[#1B37CE]/20 rounded-[10px] px-5 py-4 flex items-center justify-between gap-4"
        >
          <p className="text-[13px] md:text-[15px] font-medium leading-[1.6] tracking-[-0.01em] text-left line-clamp-3 min-h-[3.6em]">
            {typedText}
            {typedText.length > 0 && typedText.length < FULL_TEXT.length && (
              <span className="inline-block w-[2px] h-[1.1em] bg-current align-middle ml-0.5 animate-pulse" />
            )}
          </p>

          <button className="flex-shrink-0 w-[42px] h-[42px] rounded-[8px] bg-[#0A1344] flex items-center justify-center text-white text-sm">
            →
          </button>
        </div>

        {/* Comparison */}
        <div className="mt-14 w-full grid lg:grid-cols-2 gap-0 relative">

          {/* Divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#DADADA] opacity-50" />

          {/* Columbus LGM */}
          <div style={fadeIn(visible, 0.3)} className="flex flex-col items-end text-center pr-14">
            <div className="w-full max-w-[380px]">

              <h3 className="text-[32px] font-light leading-[1.05] mb-2 flex items-center justify-center gap-2" style={{ letterSpacing: "-0.03em" }}>
                <Image src="/enterprise/logo.png" alt="columbus" width={28} height={28} />
                <span style={columbusLoaded ? {} : loadingTextStyle}>Columbus LGM</span>
              </h3>

              <div style={fadeIn(columbusLoaded, 0)}>
                <div className="relative w-full aspect-[467/319] rounded-[8px] overflow-hidden shadow-md">
                  <Image src="/enterprise/lgm.png" alt="lgm" fill className="object-cover scale-[1.15]" />
                </div>
                <ul className="mt-5 space-y-3 text-left w-full list-none pl-0 text-[13px] md:text-[14px] font-normal leading-[1.6] tracking-[0em] text-black">
                  <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Highest fidelity and fresh data</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Understands space and coordinates</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Spatial and contextual reasoning</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Thinks with human-like intuition</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Produces maps and visuals</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Built for physical world, enterprises</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Basic AI */}
          <div style={fadeIn(visible, 0.45)} className="flex flex-col items-start text-center pl-14">
            <div className="w-full max-w-[380px]">

              <h3 className="text-[32px] font-light leading-[1.05] mb-2 text-center" style={{ letterSpacing: "-0.03em" }}>
                <span style={basicLoaded ? {} : loadingTextStyle}>Basic AI</span>
              </h3>

              <div style={fadeIn(basicLoaded, 0)}>
                <div className="relative w-full aspect-[467/319] rounded-[8px] overflow-hidden">
                  <Image src="/enterprise/basic.png" alt="basic" fill className="object-cover opacity-90" />
                </div>
                <ul className="mt-5 space-y-3 text-left w-full list-none pl-0 text-[13px] md:text-[14px] font-normal leading-[1.6] tracking-[0em] text-black">
                  <li className="flex items-center gap-2"><span className="text-black">✖</span> Regurgitates old articles about areas</li>
                  <li className="flex items-center gap-2">
                    <span className="text-black">✖</span> Hallucinates Coordinates 60% of time{" "}
                    <span className="text-blue-600 text-[12px]">Source</span>
                  </li>
                  <li className="flex items-center gap-2"><span className="text-black">✖</span> Limited data reach</li>
                  <li className="flex items-center gap-2"><span className="text-black">✖</span> Text outputs, no map or GIS</li>
                  <li className="flex items-center gap-2"><span className="text-black">✖</span> Built for text, consumers</li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
