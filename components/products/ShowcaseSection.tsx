"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";

const SUBTITLE_PREFIX = "Find your next ";
const ROTATING_PHRASES = [
  "hang out.",
  "date spot.",
  "fave cafe.",
  "vacation.",
  "day trip.",
  "chill spot.",
  "thrift shop.",
  "event.",
];

const FEATURE_PILL_LABELS = [
  "Itineraries",
  "Find spots",
  "Ask AI about spots",
  "Favorite your spots",
  "Roll the dice",
  "Mobile and Web",
];

const MARQUEE_LOGOS = Array.from({ length: 12 }, (_, i) => `/MapsGPTLogos/Logo${i + 1}.png`);

export default function ShowcaseSection({ compact = false, onInteraction }: { compact?: boolean; onInteraction?: () => void }) {
  const FRAME_WIDTH = 1728;
  const FRAME_HEIGHT = 1343;

  const phoneTiltRef = useRef<HTMLDivElement>(null);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [suffix, setSuffix] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedPillIndex, setExpandedPillIndex] = useState<number | null>(null);
  const [closingPillIndex, setClosingPillIndex] = useState<number | null>(null);
  const [pillContentVisible, setPillContentVisible] = useState(false);
  const [pillIsClosing, setPillIsClosing] = useState(false);
  const [ctaShineKey, setCtaShineKey] = useState(0);
  const closePillTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => closePillTimers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (expandedPillIndex !== null) {
      setPillIsClosing(false);
      setPillContentVisible(false);
      const t = setTimeout(() => setPillContentVisible(true), 90);
      return () => clearTimeout(t);
    }
    setPillContentVisible(false);
  }, [expandedPillIndex]);

  const handleClosePill = (index: number) => {
    // Clear any pending close timers from a previous close
    closePillTimers.current.forEach(clearTimeout);
    closePillTimers.current = [];
    // 1. Fade content out (slides up + fades)
    setPillIsClosing(true);
    setPillContentVisible(false);
    // 2. After content has faded, collapse height
    const t1 = setTimeout(() => {
      setClosingPillIndex(index);
      setExpandedPillIndex(null);
    }, 130);
    // 3. Fully clean up
    const t2 = setTimeout(() => {
      setClosingPillIndex(null);
      setPillIsClosing(false);
    }, 700);
    closePillTimers.current.push(t1, t2);
  };

  useEffect(() => {
    const phrase = ROTATING_PHRASES[phraseIndex];
    const typeSpeed = 60;
    const deleteSpeed = 40;
    const pauseAtEnd = 800;
    const pauseAtEmpty = 50;

    if (!isDeleting) {
      if (suffix.length < phrase.length) {
        const t = setTimeout(() => setSuffix(phrase.slice(0, suffix.length + 1)), typeSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setIsDeleting(true), pauseAtEnd);
      return () => clearTimeout(t);
    }
    if (suffix.length > 0) {
      const t = setTimeout(() => setSuffix(suffix.slice(0, -1)), deleteSpeed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % ROTATING_PHRASES.length);
    }, pauseAtEmpty);
    return () => clearTimeout(t);
  }, [phraseIndex, suffix, isDeleting]);

  const [marqueeHovered, setMarqueeHovered] = useState(false);
  const [isLg, setIsLg] = useState(true);

  useEffect(() => {
    const check = () => setIsLg(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (compact) {
    return (
      <section className="relative overflow-hidden flex flex-col items-center py-16 bg-[#F9F9F9]">
        <p
          className="mb-6 flex h-[40px] w-[303px] items-center justify-center text-center"
          style={{
            fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: "140%",
            letterSpacing: "-0.02em",
            color: "#9F9F9F",
          }}
        >
          We work with data from the most reputable brands
        </p>
        <div
          className="relative overflow-hidden"
          style={{ width: "1440px", maxWidth: "100vw" }}
          onMouseEnter={() => setMarqueeHovered(true)}
          onMouseLeave={() => setMarqueeHovered(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24" style={{ background: "linear-gradient(to right, #F9F9F9, transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24" style={{ background: "linear-gradient(to left, #F9F9F9, transparent)" }} />
          <div
            className="trusted-marquee flex w-max items-center gap-[72px]"
            style={{ animationPlayState: marqueeHovered ? "paused" : "running" }}
          >
            {MARQUEE_LOGOS.map((src) => (
              <Image key={src} src={src} width={180} height={60} alt="" className="shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
            ))}
            {MARQUEE_LOGOS.map((src) => (
              <Image key={`dup-${src}`} src={src} width={180} height={60} alt="" className="shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" aria-hidden />
            ))}
          </div>

          {/* Blur overlay + glass CTA on hover */}
          <div
            className="absolute z-20 flex items-center justify-center transition-opacity duration-300"
            style={{
              top: -28,
              bottom: -28,
              left: 0,
              right: 0,
              opacity: marqueeHovered ? 1 : 0,
              pointerEvents: marqueeHovered ? "auto" : "none",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          >
            <Link
              href="/maps-gpt"
              className={`group flex items-center gap-3 ${glassStyles.btn}`}
              style={{
                padding: "12px 24px",
                opacity: marqueeHovered ? 1 : 0,
                transform: marqueeHovered ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.3s, transform 0.3s",
              }}
            >
              <span className="text-[14px] font-medium transition-colors duration-300" style={{ color: "#00B1D4" }}>
                Try MapsGPT
              </span>
              <svg
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                width="13" height="13" viewBox="0 0 13 13" fill="none"
                aria-hidden
              >
                <path
                  d="M2 11L11 2M11 2H4M11 2V9"
                  stroke="#00B1D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden flex justify-center h-full lg:h-auto">

      {/* Flower — top right, bounces in like a natural branch */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          right: "clamp(40px, 8vw, 180px)",
          top: -60,
          width: "clamp(140px, 18vw, 280px)",
          transformOrigin: "top right",
          animation: "flowerBounceIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) both, flowerWind 5s ease-in-out 2.4s infinite",
        }}
      >
        <Image src="/flower.png" alt="" width={280} height={350} className="w-full h-auto" />
      </div>

      {/* Fern — bottom left, behind the feature pills */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          left: "clamp(-120px, -8vw, -40px)",
          bottom: "clamp(120px, calc(-6vw + 200px), 180px)",
          width: "clamp(200px, 28vw, 450px)",
          transform: "scaleX(-1)",
          opacity: 0.75,
        }}
      >
        <Image src="/Fern.png" alt="" width={650} height={910} className="w-full h-auto" />
      </div>

      {/* Fern — bottom right, behind the desktop card */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          right: "clamp(-120px, -8vw, -40px)",
          bottom: "clamp(120px, calc(-6vw + 200px), 180px)",
          width: "clamp(200px, 28vw, 450px)",
          opacity: 0.75,
        }}
      >
        <Image src="/Fern.png" alt="" width={650} height={910} className="w-full h-auto" />
      </div>

      {/* ═══ MOBILE: Flow layout (<lg) ═══ */}
      {!isLg && (
      <div className="absolute left-0 right-0 bottom-0 flex flex-col justify-end px-6 pb-6 gap-5" style={{ top: 100 }}>
        {/* Title + Subtitle */}
        <div className="flex flex-col gap-1" style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}>
          <div className="flex items-center gap-2">
            <Image src="/MapsGPT-logo.png" alt="MapsGPT Logo" width={36} height={36} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }} />
            <span
              className="text-[27px] sm:text-[36px] font-semibold tracking-[-0.02em]"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(180,156,83,0.75) 40%, rgba(140,120,60,0.6) 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
              }}
            >MapsGPT</span>
          </div>
          <div
            className="text-[27px] sm:text-[36px] tracking-[-0.02em]"
            style={{
              fontWeight: 590,
              background: "linear-gradient(180deg, #063140 0%, rgba(6, 49, 64, 0.38) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            {SUBTITLE_PREFIX}
            <span className="inline-block min-w-[1ch]">{suffix}</span>
            <span className="animate-pulse" style={{ opacity: !isDeleting && suffix === ROTATING_PHRASES[phraseIndex] ? 0 : 1 }}>|</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/maps-gpt"
          className={`group flex items-center justify-center gap-6 w-full h-[52px] cursor-pointer no-underline ${glassStyles.btn}`}
          style={{ padding: 0 }}
        >
          <span style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 590, fontSize: "20px", letterSpacing: "-0.02em", color: "#00B1D4" }}>
            Try MapsGPT
          </span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0" aria-hidden>
            <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#00B1D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Product display — SiteSelection pattern */}
        <div className="relative w-full h-[280px] sm:h-[360px] md:h-[440px] rounded-2xl overflow-hidden">
          <div className="absolute bottom-0 rounded-t-xl overflow-hidden" style={{ left: "2%", width: "88%", height: "100%" }}>
            <Image src="/MapsGPTDesktop.png" alt="Maps UI" fill className="object-cover object-left-top" />
          </div>
          <div
            data-showcase-phone
            className="absolute bottom-0 z-[2] overflow-hidden"
            style={{ right: "3%", height: "100%", aspectRatio: "263/572" }}
          >
            <div style={{ position: "absolute", inset: -8, borderRadius: 32, background: "rgba(150, 225, 255, 0.20)", boxShadow: "0 -2px 10px rgba(0,0,0,0.15)", pointerEvents: "none" }} />
            <Image src="/MapsGPTMobile.png" fill alt="" style={{ objectFit: "cover", borderRadius: 24 }} />
          </div>
        </div>

        {/* Feature pills — carousel with expand */}
        <MobileFeatureCarousel
          expandedPillIndex={expandedPillIndex}
          setExpandedPillIndex={setExpandedPillIndex}
          pillContentVisible={pillContentVisible}
          pillIsClosing={pillIsClosing}
          handleClosePill={handleClosePill}
          onInteraction={onInteraction}
        />

      </div>
      )}

      {/* ═══ DESKTOP: Aspect Ratio Wrapper (lg+) ═══ */}
      {isLg && (
      <div
        className="relative w-full max-w-[1728px]"
        style={{
          aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}`,
        }}
      >
        {/* Scaled Content Layer */}
        <div
          className="absolute top-0"
          style={{
            left: "50%",
            marginLeft: -FRAME_WIDTH / 2,
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: "scale(min(1, 100vw / 1728))",
            transformOrigin: "top center",
          }}
        >
          <div className="relative w-[1728px] h-[1343px]">

            {/* Desktop card + phone — shared perspective wrapper */}
            <div
              className="absolute"
              style={{
                left: 474,
                top: 348,
                width: 1094,
                height: 685,
                perspective: 1200,
              }}
            >
              {/* Desktop card — overflow:hidden clips image to border-radius */}
              <div
                className="desktop-tilt-card"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 23,
                  overflow: "hidden",
                  border: "1px solid rgba(150, 200, 220, 0.35)",
                  background: "rgba(150, 225, 255, 0.10)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  transition: "transform 0.15s ease-out, box-shadow 0.3s ease-out",
                  cursor: "pointer",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  const rotateX = (0.5 - y) * 16;
                  const rotateY = (x - 0.5) * 16;
                  const tilt = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                  e.currentTarget.style.transform = tilt;
                  e.currentTarget.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 16}px 48px rgba(0, 50, 80, 0.14), 0 8px 16px rgba(0, 50, 80, 0.06)`;
                  if (phoneTiltRef.current) phoneTiltRef.current.style.transform = tilt;
                }}
                onMouseLeave={(e) => {
                  const reset = "rotateX(0deg) rotateY(0deg) translateY(0)";
                  e.currentTarget.style.transform = reset;
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)";
                  e.currentTarget.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
                  if (phoneTiltRef.current) {
                    phoneTiltRef.current.style.transform = reset;
                    phoneTiltRef.current.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
                  if (phoneTiltRef.current) phoneTiltRef.current.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
                }}
              >
                <Image
                  src="/MapsGPTDesktop.png"
                  alt="Maps UI"
                  width={1175}
                  height={685}
                  className="absolute object-fill"
                  style={{ top: -12, left: -12, width: "calc(100% + 24px)", height: "calc(100% + 24px)" }}
                />
              </div>

              {/* Phone — sibling outside preserve-3d so CSS :hover works reliably.
                  Tilt synced from card handlers via phoneTiltRef.
                  iPhone 17 ratio: 275×580 ≈ 150.9mm / 71.5mm = 2.11 */}
              <div
                ref={phoneTiltRef}
                data-showcase-phone
                style={{
                  position: "absolute",
                  left: 800,
                  top: 105,
                  width: 275,
                  height: 580,
                  borderRadius: 38,
                  cursor: "pointer",
                  boxShadow: "none",
                  transition: "box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 32px 72px rgba(0, 40, 80, 0.35), 0 12px 24px rgba(0, 40, 80, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transition = "box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.08s";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transition = "box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -12,
                    borderRadius: 50,
                    background: "rgba(150, 225, 255, 0.20)",
                    boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
                    pointerEvents: "none",
                  }}
                />
                <Image
                  src="/MapsGPTMobile.png"
                  fill
                  alt=""
                  style={{ objectFit: "fill", borderRadius: 38 }}
                />
              </div>
            </div>

            {/* CTA — stays in scaled frame, positioned near card */}
            <Link
              key={ctaShineKey}
              href="/maps-gpt"
              className={`group absolute left-[1251px] top-[269px] z-20 flex w-[317px] h-[56px] min-h-[44px] items-center justify-center gap-10 cursor-pointer border-0 no-underline touch-manipulation active:scale-[0.98] select-none ${glassStyles.btn} ${ctaShineKey > 0 ? glassStyles.borderShine : ""}`}
              style={{
                padding: 0,
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={() => setCtaShineKey((k) => k + 1)}
            >
              <span
                style={{
                  fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: 590,
                  fontSize: "20px",
                  lineHeight: "140%",
                  letterSpacing: "-0.02em",
                  color: "#00B1D4",
                }}
              >
                Try MapsGPT
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                <path
                  d="M2 11L11 2M11 2H4M11 2V9"
                  stroke="#00B1D4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

          </div>
        </div>

      {/* LEFT CONTENT — unscaled overlay, uses navbar width system */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="max-w-[1408px] mx-auto w-full h-full px-8 min-[1408px]:px-0 relative">

          {/* Title + Subtitle */}
          <div
            className="absolute pointer-events-auto flex flex-col"
            style={{
              top: "14.9%",
              fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            <div
              className="flex items-center gap-3"
              style={{
                fontWeight: 600,
                fontSize: "clamp(36px, 3.3vw, 48px)",
                lineHeight: "130%",
                letterSpacing: "-0.02em",
              }}
            >
              <Image
                src="/MapsGPT-logo.png"
                alt="MapsGPT Logo"
                width={52}
                height={52}
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
              />
              <span
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(180,156,83,0.75) 40%, rgba(140,120,60,0.6) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                }}
              >
                MapsGPT
              </span>
            </div>
            <div
              className="whitespace-nowrap"
              style={{
                fontWeight: 590,
                fontSize: "clamp(36px, 3.3vw, 48px)",
                lineHeight: "130%",
                letterSpacing: "-0.02em",
                background: "linear-gradient(180deg, #063140 0%, rgba(6, 49, 64, 0.38) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {SUBTITLE_PREFIX}
              <span className="inline-block min-w-[1ch]">{suffix}</span>
              <span
                className="animate-pulse"
                style={{
                  opacity: !isDeleting && suffix === ROTATING_PHRASES[phraseIndex] ? 0 : 1,
                }}
              >
                |
              </span>
            </div>
          </div>

          {/* Left column: 6 feature pills */}
          <div
            className="absolute pointer-events-auto flex flex-col justify-center gap-2.5"
            style={{ top: "25.9%", height: "51%" }}
          >
            {FEATURE_PILL_LABELS.map((label, index) => {
              const isExpanded = expandedPillIndex === index;
              const isClosing = closingPillIndex === index;
              const showCard = isExpanded || isClosing;
              return (
                <div
                  key={label}
                  className="overflow-hidden rounded-[28px]"
                  style={{
                    height: isExpanded ? 301 : 56,
                    width: showCard ? 313 : undefined,
                    minWidth: showCard ? 313 : 176,
                    transition: isClosing
                      ? "height 0.5s cubic-bezier(0.4, 0, 0.6, 1)"
                      : "height 0.55s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                >
                  {showCard ? (
                    <button
                      type="button"
                      onClick={() => isExpanded && handleClosePill(index)}
                      className={`flex h-full w-[313px] cursor-pointer flex-col rounded-[28px] border-0 p-6 text-left touch-manipulation ${glassStyles.featurePill}`}
                      aria-label={isExpanded ? `Close ${label}` : undefined}
                      onMouseEnter={() => setCtaShineKey((k) => k + 1)}
                    >
                      <span
                        className="text-[20px] font-semibold leading-[140%] tracking-[-0.02em]"
                        style={{
                          fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                          color: "#063140",
                          opacity: pillContentVisible ? 1 : 0,
                          transform: pillContentVisible
                            ? "translateY(0)"
                            : pillIsClosing
                            ? "translateY(-6px)"
                            : "translateY(8px)",
                          transition: pillIsClosing
                            ? "opacity 0.18s ease-in, transform 0.18s ease-in"
                            : "opacity 0.35s ease-out, transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                        }}
                      >
                        {label}
                      </span>
                      <p
                        className="mt-3 text-[20px] font-normal leading-[1.6] tracking-[-0.02em] text-[#063140]/80"
                        style={{
                          opacity: pillContentVisible ? 1 : 0,
                          transform: pillContentVisible
                            ? "translateY(0)"
                            : pillIsClosing
                            ? "translateY(-4px)"
                            : "translateY(10px)",
                          transition: pillIsClosing
                            ? "opacity 0.15s ease-in, transform 0.15s ease-in"
                            : "opacity 0.35s ease-out 0.06s, transform 0.35s cubic-bezier(0.25, 1, 0.5, 1) 0.06s",
                        }}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                      </p>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setExpandedPillIndex(index)}
                      className={`group relative flex h-[56px] min-w-[176px] w-max cursor-pointer items-center gap-3 rounded-[28px] border-0 px-4 text-left touch-manipulation overflow-hidden ${glassStyles.featurePill}`}
                      onMouseEnter={() => setCtaShineKey((k) => k + 1)}
                    >
                      <span
                        className="relative flex h-[11px] w-[11px] shrink-0 items-center justify-center"
                        aria-hidden
                      >
                        <span
                          className="absolute left-1/2 top-0 h-[11px] w-[2px] -translate-x-px rounded-[1px]"
                          style={{ background: "#063140" }}
                        />
                        <span
                          className="absolute left-0 top-1/2 h-[2px] w-[11px] -translate-y-px rounded-[1px]"
                          style={{ background: "#063140" }}
                        />
                      </span>
                      <span
                        className="relative whitespace-nowrap text-[20px] font-semibold leading-[140%] tracking-[-0.02em]"
                        style={{
                          fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                          color: "#063140",
                        }}
                      >
                        {label}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
      </div>
      )}
    </section>
  );
}

/* ─── Mobile Feature Carousel ─── */

const PILL_DESCRIPTIONS: Record<string, string> = {
  "Itineraries": "Build full day-by-day itineraries with AI — just say where you're going and how long you have.",
  "Find spots": "Discover curated spots nearby or anywhere in the world, filtered by vibe, category, and crowd favorites.",
  "Ask AI about spots": "Ask anything about a place — best time to visit, what to order, hidden tips from locals.",
  "Favorite your spots": "Save spots you love to personal collections and revisit them whenever you're ready to go.",
  "Roll the dice": "Feeling adventurous? Let us surprise you with a random spot you never knew you needed.",
  "Mobile and Web": "Use MapsGPT from your phone on the go or from your desktop when planning ahead — everything syncs.",
};

function MobileFeatureCarousel({
  expandedPillIndex,
  setExpandedPillIndex,
  pillContentVisible,
  pillIsClosing,
  handleClosePill,
  onInteraction,
}: {
  expandedPillIndex: number | null;
  setExpandedPillIndex: (i: number | null) => void;
  pillContentVisible: boolean;
  pillIsClosing: boolean;
  handleClosePill: (i: number) => void;
  onInteraction?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [measuredHeights, setMeasuredHeights] = useState<number[]>(() => FEATURE_PILL_LABELS.map(() => 0));
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const navigatingRef = useRef(false);
  const sf: React.CSSProperties = { fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" };

  // Measure content heights for smooth animation (can't transition to "auto")
  useEffect(() => {
    const heights = contentRefs.current.map(el => el ? el.scrollHeight : 0);
    setMeasuredHeights(heights);
  }, []);

  // Center the selected pill in the scroll container
  const centerPill = useCallback((index: number) => {
    const container = scrollRef.current;
    const pill = pillRefs.current[index];
    if (!container || !pill) return;
    const containerRect = container.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const offset = pillRect.left - containerRect.left + pillRect.width / 2 - containerRect.width / 2 + container.scrollLeft;
    container.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  // Center when expanded
  useEffect(() => {
    if (expandedPillIndex !== null) {
      requestAnimationFrame(() => centerPill(expandedPillIndex));
    }
  }, [expandedPillIndex, centerPill]);

  // Navigate directly: close current and open next in one fluid motion
  const navigateTo = useCallback((index: number) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    // Immediately switch — no close-then-open gap
    setExpandedPillIndex(index);
    setTimeout(() => { navigatingRef.current = false; }, 400);
  }, [setExpandedPillIndex]);

  const handlePillClick = (index: number) => {
    onInteraction?.();
    if (expandedPillIndex === index) {
      handleClosePill(index);
    } else if (expandedPillIndex !== null) {
      navigateTo(index);
    } else {
      setExpandedPillIndex(index);
    }
  };

  // Swipe left/right when expanded to navigate pills
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (expandedPillIndex === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;

    if (dx < 0 && expandedPillIndex < FEATURE_PILL_LABELS.length - 1) {
      navigateTo(expandedPillIndex + 1);
    } else if (dx > 0 && expandedPillIndex > 0) {
      navigateTo(expandedPillIndex - 1);
    }
  };

  // Tap outside to deselect
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === scrollRef.current && expandedPillIndex !== null) {
      handleClosePill(expandedPillIndex);
    }
  };

  const hasExpanded = expandedPillIndex !== null;
  // Compute the max expanded height for a stable container
  const maxExpandedHeight = Math.max(44, ...measuredHeights.map(h => 20 + 28 + 12 + (h || 80) + 20));

  return (
    <div
      className="mt-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        height: hasExpanded ? maxExpandedHeight : 44,
        transition: "height 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      <div
        ref={scrollRef}
        className="overflow-x-auto flex gap-3 -mx-6 px-6 snap-x snap-mandatory items-start"
        style={{ scrollbarWidth: "none", scrollSnapType: hasExpanded ? "none" : undefined }}
        onClick={handleBackdropClick}
      >
        {FEATURE_PILL_LABELS.map((label, index) => {
          const isActive = expandedPillIndex === index;
          const description = PILL_DESCRIPTIONS[label] ?? "";
          const expandedHeight = 20 + 28 + 12 + (measuredHeights[index] || 80) + 20;

          return (
            <button
              key={label}
              ref={(el) => { pillRefs.current[index] = el; }}
              type="button"
              onClick={() => handlePillClick(index)}
              className={`snap-start shrink-0 flex flex-col rounded-[22px] text-left relative ${glassStyles.featurePill}`}
              style={{
                width: isActive ? "calc(100vw - 48px)" : "auto",
                minWidth: isActive ? "calc(100vw - 48px)" : undefined,
                maxWidth: isActive ? undefined : "max-content",
                height: isActive ? expandedHeight : 44,
                padding: isActive ? "20px 20px" : "0 16px",
                overflow: "hidden",
                transition: "width 0.4s cubic-bezier(0.25, 1, 0.5, 1), min-width 0.4s cubic-bezier(0.25, 1, 0.5, 1), max-width 0.4s cubic-bezier(0.25, 1, 0.5, 1), height 0.4s cubic-bezier(0.25, 1, 0.5, 1), padding 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              {/* × close icon — top right when expanded */}
              <span
                aria-hidden
                className="absolute flex items-center justify-center"
                style={{
                  top: 16,
                  right: 16,
                  width: 20,
                  height: 20,
                  opacity: isActive ? 0.5 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                  transition: "opacity 0.3s ease-out",
                }}
              >
                <span className="absolute w-[14px] h-[2px] rounded-[1px]" style={{ background: "#063140", transform: "rotate(45deg)" }} />
                <span className="absolute w-[14px] h-[2px] rounded-[1px]" style={{ background: "#063140", transform: "rotate(-45deg)" }} />
              </span>
              {/* Title row */}
              <span
                className="whitespace-nowrap font-semibold tracking-[-0.02em] flex items-center gap-2"
                style={{
                  ...sf,
                  color: "#063140",
                  fontSize: isActive ? 18 : 15,
                  lineHeight: isActive ? "28px" : "44px",
                  transition: "font-size 0.3s cubic-bezier(0.25, 1, 0.5, 1), line-height 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                {/* + icon — hidden when expanded */}
                <span
                  className="relative flex shrink-0 items-center justify-center"
                  aria-hidden
                  style={{
                    width: isActive ? 0 : 11,
                    height: 11,
                    opacity: isActive ? 0 : 1,
                    overflow: "hidden",
                    transition: "width 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease-out",
                  }}
                >
                  <span className="absolute left-1/2 top-0 h-[11px] w-[2px] -translate-x-px rounded-[1px]" style={{ background: "#063140" }} />
                  <span className="absolute left-0 top-1/2 h-[2px] w-[11px] -translate-y-px rounded-[1px]" style={{ background: "#063140" }} />
                </span>
                {label}
              </span>
              {/* Description — always in DOM but absolutely positioned when collapsed so it doesn't affect button width */}
              <div
                ref={(el) => { contentRefs.current[index] = el; }}
                className="text-[15px] font-normal leading-[1.6] tracking-[-0.02em] text-[#063140]/80"
                style={{
                  ...sf,
                  whiteSpace: "normal",
                  marginTop: isActive ? 12 : 0,
                  width: isActive ? "100%" : 0,
                  height: isActive ? "auto" : 0,
                  position: isActive ? "relative" : "absolute",
                  opacity: isActive && pillContentVisible ? 1 : 0,
                  transform: isActive && pillContentVisible
                    ? "translateY(0)"
                    : pillIsClosing
                    ? "translateY(-4px)"
                    : "translateY(6px)",
                  transition: pillIsClosing
                    ? "opacity 0.15s ease-in, transform 0.15s ease-in"
                    : "opacity 0.3s ease-out 0.1s, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1) 0.1s",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                {description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}