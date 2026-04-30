"use client";

import { useEffect, useRef, useState } from "react";

const BOTTOM_TEXT = "Find your use case";
const TYPE_INTERVAL = 28; // ms per character

interface HeroSectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  videoSrc?: string;
}

export default function HeroSection({
  title = (<>Why you should be excited<br /> about our LGM</>),
  subtitle = "Our Geospatial Model — spatial reasoning at scale, without the hallucinations.",
  videoSrc = "/use-cases-video.mp4",
}: HeroSectionProps = {}) {
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const [middleBlurGone, setMiddleBlurGone] = useState(false);
  const [sideBlursGone, setSideBlursGone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger fade-in shortly after mount (first section, no scroll needed)
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Sequential blur reveal — middle panel collapses first, then the two
  // exterior panels follow. Same staging + collapse animation as the V2 hero.
  useEffect(() => {
    const t1 = window.setTimeout(() => setMiddleBlurGone(true), 700);
    const t2 = window.setTimeout(() => setSideBlursGone(true), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Check if video can play immediately on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 3) {
      setVideoReady(true);
    }
  }, []);

  // Start typing bottom text after title + subtitle have faded in
  useEffect(() => {
    if (!visible) return;
    const start = window.setTimeout(() => {
      let idx = 0;
      const iv = window.setInterval(() => {
        idx++;
        setTypedText(BOTTOM_TEXT.slice(0, idx));
        if (idx >= BOTTOM_TEXT.length) clearInterval(iv);
      }, TYPE_INTERVAL);
      return () => clearInterval(iv);
    }, 1000);
    return () => clearTimeout(start);
  }, [visible]);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : "blur(8px)",
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease-out ${delay}s, filter 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
  });

  // Frosted-glass overlay panels — same look + feel as the navbar background
  // (transparent + matching backdrop-filter), collapsed via scaleY(0) anchored
  // at the bottom using the navbar dropdown's close bezier. Middle panel goes
  // first, then the two exterior panels.
  const blurPanelStyle = (gone: boolean): React.CSSProperties => ({
    background: "transparent",
    backdropFilter: "blur(20px) saturate(1.2)",
    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
    transform: gone ? "scaleY(0)" : "scaleY(1)",
    transformOrigin: "bottom",
    transition: "transform 400ms cubic-bezier(0.3, 0, 0.8, 0.15)",
  });

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video — looped, muted, autoplay */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        onPlaying={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay — radial vignette + blur while video loads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 28% 50%, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.20) 100%)",
          backdropFilter: videoReady ? "none" : "blur(20px)",
          WebkitBackdropFilter: videoReady ? "none" : "blur(20px)",
          opacity: visible ? 1 : 0,
          transition:
            "opacity 1.2s ease-out 0s, backdrop-filter 0.8s ease-out, -webkit-backdrop-filter 0.8s ease-out",
        }}
      />

      {/* Bottom black gradient */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none z-10"
        style={{
          height: 180,
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease-out 0s",
        }}
        aria-hidden
      />

      {/* Three frosted-glass panels — initially obscure the bg, then
          sequentially collapse downward to reveal it. Middle panel spans the
          bounded grid (matching the vertical structure lines); side panels
          fill the exterior regions. */}
      <div
        className="absolute inset-0 grid pointer-events-none"
        style={{
          zIndex: 12,
          gridTemplateColumns: "1fr min(calc(100% - 10px), 1287px) 1fr",
        }}
        aria-hidden
      >
        <div style={blurPanelStyle(sideBlursGone)} />
        <div style={blurPanelStyle(middleBlurGone)} />
        <div style={blurPanelStyle(sideBlursGone)} />
      </div>

      {/* Vertical structure lines — extend the page grid up through the hero. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 15 }}
        aria-hidden
      >
        <div className="max-w-[1287px] mx-5 md:mx-auto relative h-full">
          <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
        </div>
      </div>

      {/* Content container — lateral constraints */}
      <div className="relative z-20 w-full max-w-[1287px] mx-auto px-8 md:px-10 h-full flex flex-col">
        {/* TEXT BLOCK */}
        <div className="mt-[295px] max-md:mt-[180px] text-center">
          {/* TITLE */}
          <h1
            className="text-white text-[61px] md:text-[78px] max-md:text-[39px] leading-[1.2]"
            style={{
              fontFamily: "var(--font-hero)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              ...fadeIn(0),
            }}
          >
            {title}
          </h1>

          {/* SUBTITLE */}
          <p
            className="text-white/70 mt-6 mx-auto max-w-[760px] text-[20px] font-normal leading-[1.5] max-md:text-[16px]"
            style={fadeIn(0.15)}
          >
            {subtitle}
          </p>
        </div>

        {/* BOTTOM CTA — typed text doubles as a button: click to scroll past the hero */}
        <div
          className="mt-auto pb-[48px] flex items-center justify-center"
          style={{ minHeight: "1.4em" }}
        >
          <button
            type="button"
            onClick={(e) => {
              const hero = (e.currentTarget as HTMLButtonElement).closest("section");
              if (hero) window.scrollTo({ top: hero.offsetHeight, behavior: "smooth" });
            }}
            className="group flex items-center gap-2 text-white text-[16px] font-medium tracking-[0.04em] max-md:text-[14px] cursor-pointer"
          >
            <span>{typedText}</span>
            {typedText.length >= BOTTOM_TEXT.length && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-[#0066CC]"
                style={{
                  opacity: 0,
                  animation: "fadeInArrow 0.4s ease-out forwards",
                }}
              >
                <path
                  d="M8 3v8.5M4 8.5l4 4.5 4-4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <style>{`@keyframes fadeInArrow { to { opacity: 1 } }`}</style>
          </button>
        </div>
      </div>
    </section>
  );
}
