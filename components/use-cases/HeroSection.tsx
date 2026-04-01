"use client";

import { useEffect, useRef, useState } from "react";

const BOTTOM_TEXT = "[ We have just launched our technology in various sectors. ]";
const TYPE_INTERVAL = 28; // ms per character

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger fade-in shortly after mount (first section, no scroll needed)
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Check if video can play immediately on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // If readyState is already sufficient, mark ready immediately
    if (video.readyState >= 3) {
      setVideoReady(true);
    }
  }, []);

  // Start typing bottom text after title + subtitle have faded in
  useEffect(() => {
    if (!visible) return;
    // title delay 0s + subtitle delay 0.15s + transition 0.7s ≈ 1s total
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
    opacity:   visible ? 1 : 0,
    filter:    visible ? "blur(0px)" : "blur(8px)",
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease-out ${delay}s, filter 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
  });

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">

      {/* Background video — looped, muted, autoplay */}
      <video
        ref={videoRef}
        src="/use-cases-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        onPlaying={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay — includes blur while video is loading */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 28% 50%, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.20) 100%)",
          backdropFilter: videoReady ? "none" : "blur(20px)",
          WebkitBackdropFilter: videoReady ? "none" : "blur(20px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease-out 0s, backdrop-filter 0.8s ease-out, -webkit-backdrop-filter 0.8s ease-out",
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

      {/* Content container — lateral constraints */}
      <div className="relative z-20 w-full max-w-[1287px] mx-auto px-8 md:px-10 h-full flex flex-col">

        {/* TEXT BLOCK */}
        <div className="mt-[295px] max-md:mt-[180px]">

          {/* TITLE */}
          <h1
            className="text-white text-[61px] md:text-[78px] max-md:text-[39px] leading-[1.2]"
            style={{
              fontWeight: 300,
              letterSpacing: "-0.02em",
              ...fadeIn(0),
            }}
          >
            Why you should be excited<br /> about our LGM
          </h1>

          {/* SUBTITLE */}
          <p
            className="text-white/70 mt-4 max-w-[760px] text-[20px] font-normal leading-[1.5] max-md:text-[16px]"
            style={fadeIn(0.15)}
          >
            Our Geospatial Model — spatial reasoning at scale, without the hallucinations.
          </p>

        </div>

        {/* BOTTOM TEXT — typed in last */}
        <p
          className="mt-auto pb-[48px] text-white text-[16px] font-medium tracking-[0.04em] max-md:text-[14px]"
          style={{ minHeight: "1.4em" }}
        >
          {typedText}
        </p>

      </div>
    </section>
  );
}
