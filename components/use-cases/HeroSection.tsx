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
  const [middleBlurGone, setMiddleBlurGone] = useState(false);
  const [sideBlursGone, setSideBlursGone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger fade-in shortly after mount (first section, no scroll needed)
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Sequential blur reveal — middle slides down + shrinks first, then the
  // two exterior blurs follow once the middle is gone.
  useEffect(() => {
    const t1 = window.setTimeout(() => setMiddleBlurGone(true), 700);
    const t2 = window.setTimeout(() => setSideBlursGone(true), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
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

  // Frosted-glass overlay panels that reveal the video as they collapse —
  // matches the navbar dropdown's close animation (max-height → 0 via the
  // same bezier). transform-origin: bottom so the panel folds downward, top
  // edge meeting the bottom.
  const blurPanelStyle = (gone: boolean): React.CSSProperties => ({
    backdropFilter: "blur(40px) saturate(1.4)",
    WebkitBackdropFilter: "blur(40px) saturate(1.4)",
    background: "rgba(249, 249, 249, 0.35)",
    transform: gone ? "scaleY(0)" : "scaleY(1)",
    transformOrigin: "bottom",
    transition: "transform 400ms cubic-bezier(0.3, 0, 0.8, 0.15)",
  });

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#F9F9F9" }}
    >
      {/* Top-of-hero blue accent gradient — mission-page style */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{
          height: 500,
          background:
            "linear-gradient(to bottom, rgba(0, 102, 204, 0.18) 0%, rgba(0, 102, 204, 0.08) 50%, transparent 100%)",
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Video stripe — fills only the bottom 40% of the hero */}
      <div
        className="absolute left-0 right-0 bottom-0 overflow-hidden"
        style={{ height: "40%", zIndex: 2 }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Three frosted-glass panels — initially obscure the video, then
            sequentially slide down and shrink to reveal it. The middle panel
            spans the bounded grid (matching the vertical structure lines);
            the side panels fill the exterior regions. */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: "1fr min(calc(100% - 10px), 1287px) 1fr",
          }}
          aria-hidden
        >
          <div style={blurPanelStyle(sideBlursGone)} />
          <div style={blurPanelStyle(middleBlurGone)} />
          <div style={blurPanelStyle(sideBlursGone)} />
        </div>
      </div>

      {/* Vertical structure lines — extend the page grid up through the hero. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 15 }}
        aria-hidden
      >
        <div className="max-w-[1287px] mx-5 md:mx-auto relative h-full">
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1,
              height: "100%",
              background: "var(--grid-line)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 1,
              height: "100%",
              background: "var(--grid-line)",
            }}
          />
        </div>
      </div>

      {/* Content container — lateral constraints */}
      <div className="relative z-20 w-full max-w-[1287px] mx-auto px-8 md:px-10 h-full flex flex-col">
        {/* TEXT BLOCK — sits in the upper white area */}
        <div className="mt-[200px] max-md:mt-[140px] text-center">
          {/* TITLE */}
          <h1
            className="text-[#0A1344] text-[61px] md:text-[78px] max-md:text-[39px] leading-[1.2]"
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
            className="mt-6 mx-auto max-w-[760px] text-[20px] font-normal leading-[1.5] max-md:text-[16px]"
            style={{
              color: "rgba(10, 19, 68, 0.55)",
              ...fadeIn(0.15),
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* BOTTOM CTA — sits over the video stripe; click scrolls past hero */}
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
            className="group flex items-center gap-2 text-white text-[16px] font-medium tracking-[0.04em] max-md:text-[14px] cursor-pointer transition-colors duration-300 hover:text-[#0066CC]"
          >
            <span>{typedText}</span>
            {typedText.length >= BOTTOM_TEXT.length && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-y-0.5"
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
