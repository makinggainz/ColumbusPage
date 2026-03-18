"use client";

import Image from "next/image";
import { instrumentSerif } from "@/app/fonts";
import { useEffect, useState } from "react";

const BOTTOM_TEXT = "[ We have just launched our technology in various sectors. ]";
const TYPE_INTERVAL = 28; // ms per character

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");

  // Trigger fade-in shortly after mount (first section, no scroll needed)
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
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

      {/* Background image — always visible, no animation */}
      <Image
        src="/use-cases/hero.png"
        alt="city"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay — fades in with blur */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 28% 50%, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.20) 100%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease-out 0s",
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

      {/* 1728 container */}
      <div className="relative z-20 max-w-screen-2xl mx-auto h-full">

        {/* TEXT BLOCK */}
        <div className="absolute top-[295px]" style={{ left: "var(--page-padding)", right: "var(--page-padding)" }}>

          {/* TITLE */}
          <h1
            className="text-white text-[96px] whitespace-nowrap"
            style={{
              fontFamily: instrumentSerif.style.fontFamily,
              fontWeight: 400,
              letterSpacing: "0%",
              lineHeight: "140%",
              ...fadeIn(0),
            }}
          >
            Why you should be excited about our LGM
          </h1>

          {/* SUBTITLE */}
          <p
            className="
            text-white/90
            mt-[5px]
            max-w-[1198px]
            text-[30px]
            font-medium
            leading-[140%]
            max-lg:text-[22px]
            max-md:text-[18px]
            "
            style={fadeIn(0.15)}
          >
            ChatGPT, Gemini and Claude do not comprehend coordinates nor are
            trained on earth data. Don&apos;t use hallucinatory chat bots for your
            critical work.
          </p>

        </div>

        {/* BOTTOM TEXT — typed in last */}
        <p
          className="
          absolute
          bottom-[48px]
          text-white
          text-[25px]
          font-bold
          tracking-[0.04em]
          max-md:text-[18px]
          "
          style={{ left: "var(--page-padding)", minHeight: "1.4em" }}
        >
          {typedText}
        </p>

      </div>
    </section>
  );
}
