"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FULL_TEXT =
  "generate the fastest route for next tuesday 10am. It'll be a multi-stop route through Philadelphia. I've attached a file with vehicle type and each location.";

const fadeIn = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  filter: visible ? "blur(0px)" : "blur(8px)",
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
});

const loadingTextStyle: React.CSSProperties = {
  backgroundImage: "linear-gradient(90deg, var(--ent-text-navy) 0%, var(--ent-text-navy) 30%, var(--ent-blue-shimmer) 50%, var(--ent-text-navy) 70%, var(--ent-text-navy) 100%)",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  animation: "comparison-shimmer 1.6s ease-in-out infinite",
};

export default function DifferenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [columbusLoaded, setColumbusLoaded] = useState(false);
  const [basicLoaded, setBasicLoaded] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setTypedText(FULL_TEXT.slice(0, i));
        if (i >= FULL_TEXT.length) { clearInterval(interval); setTypingDone(true); }
      }, 8);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(startDelay);
  }, [visible]);

  useEffect(() => {
    if (!typingDone) return;
    const t = setTimeout(() => setColumbusLoaded(true), 200);
    return () => clearTimeout(t);
  }, [typingDone]);

  useEffect(() => {
    if (!columbusLoaded) return;
    const t = setTimeout(() => setBasicLoaded(true), 400);
    return () => clearTimeout(t);
  }, [columbusLoaded]);

  return (
    <section ref={sectionRef} className="w-full py-28 lg:py-[180px]" style={{ backgroundColor: "var(--ent-bg-white)" }}>
      <style>{`
        @keyframes comparison-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      <div className="ent-content-bounds px-4 md:px-10 flex flex-col items-center">

        {/* Title */}
        <h2
          className="font-light leading-[1.05] text-center text-[28px] md:text-[39px] lg:text-[64px]"
          style={{ letterSpacing: "-0.03em", color: "var(--ent-text-primary)", ...fadeIn(visible, 0) }}
        >
          See How We&apos;re Different
        </h2>

        {/* Prompt Box */}
        <div
          style={{
            ...fadeIn(visible, 0.15),
            boxShadow: "var(--ent-shadow-prompt-glow)",
          }}
          className="mt-8 w-full max-w-[759px] bg-white border-[1.5px] border-[#1B37CE]/25 rounded-[14px] px-4 md:px-6 py-5 flex items-center justify-between gap-4 md:gap-6"
        >
          <p className="text-[15px] md:text-[20px] font-medium leading-[1.5] tracking-[-0.01em] text-left line-clamp-3 min-h-[4.2em]">
            {typedText}
            {typedText.length > 0 && typedText.length < FULL_TEXT.length && (
              <span className="inline-block w-[2px] h-[1.1em] bg-current align-middle ml-0.5 animate-pulse" />
            )}
          </p>

          <button className="flex-shrink-0 w-[44px] h-[44px] md:w-[54px] md:h-[55px] rounded-[11px] flex items-center justify-center text-white" style={{ backgroundColor: "var(--ent-btn-navy)" }}>
            →
          </button>
        </div>

        {/* Comparison */}
        <div className="mt-12 md:mt-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 relative">

          {/* Divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#DADADA] opacity-50" />

          {/* Columbus LGM */}
          <div style={fadeIn(visible, 0.3)} className="flex flex-col items-center lg:items-end text-center lg:pr-20">
            <div className="w-full max-w-[467px]">

              <h3 className="text-[28px] md:text-[39px] lg:text-[49px] font-light leading-[1.1] mb-3 flex items-center justify-center gap-3" style={{ letterSpacing: "-0.02em", color: "var(--ent-text-primary)" }}>
                <Image src="/enterprise/logo.png" alt="columbus" width={42} height={42} />
                <span style={columbusLoaded ? {} : loadingTextStyle}>Columbus</span>
              </h3>

              <div style={fadeIn(columbusLoaded, 0)}>
                <div className="relative w-full aspect-[467/319] rounded-[10px] overflow-hidden shadow-md">
                  <Image src="/enterprise/lgm.png" alt="lgm" fill className="object-cover scale-[1.15]" />
                </div>
                <ul className="mt-8 space-y-4 text-left w-full list-none pl-0 text-[15px] md:text-[16px] font-normal leading-[1.5] tracking-[-0.01em] text-black">
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
          <div style={fadeIn(visible, 0.45)} className="flex flex-col items-center lg:items-start text-center lg:pl-20">
            <div className="w-full max-w-[467px]">

              <h3 className="text-[28px] md:text-[39px] lg:text-[49px] font-light leading-[1.1] mb-3 text-center" style={{ letterSpacing: "-0.02em", color: "var(--ent-text-primary)" }}>
                <span style={basicLoaded ? {} : loadingTextStyle}>Basic AI</span>
              </h3>

              <div style={fadeIn(basicLoaded, 0)}>
                <div className="relative w-full aspect-[467/319] rounded-[10px] overflow-hidden">
                  <Image src="/enterprise/basic.png" alt="basic" fill className="object-cover opacity-90" />
                </div>
                <ul className="mt-8 space-y-4 text-left w-full list-none pl-0 text-[15px] md:text-[16px] font-normal leading-[1.5] tracking-[-0.01em] text-black">
                  <li className="flex items-center gap-2"><span className="text-black">✖</span> Regurgitates old articles about areas</li>
                  <li className="flex items-center gap-2">
                    <span className="text-black">✖</span> Hallucinates Coordinates 60% of time{" "}
                    <span className="text-blue-400">Source</span>
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
