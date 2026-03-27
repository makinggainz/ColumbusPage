"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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

export default function ShowcaseSection() {
  const FRAME_WIDTH = 1728;
  const FRAME_HEIGHT = 1343;

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [suffix, setSuffix] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedPillIndex, setExpandedPillIndex] = useState<number | null>(null);
  const [closingPillIndex, setClosingPillIndex] = useState<number | null>(null);
  const [pillContentVisible, setPillContentVisible] = useState(false);
  const [pillIsClosing, setPillIsClosing] = useState(false);

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
    // 1. Fade content out (slides up + fades)
    setPillIsClosing(true);
    setPillContentVisible(false);
    // 2. After content has faded, collapse height
    window.setTimeout(() => {
      setClosingPillIndex(index);
      setExpandedPillIndex(null);
    }, 130);
    // 3. Fully clean up
    window.setTimeout(() => {
      setClosingPillIndex(null);
      setPillIsClosing(false);
    }, 700);
  };

  useEffect(() => {
    const phrase = ROTATING_PHRASES[phraseIndex];
    const typeSpeed = 60;
    const deleteSpeed = 40;
    const pauseAtEnd = 800;
    const pauseAtEmpty = 150;

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

  return (
    <section className="relative overflow-hidden flex justify-center">

      {/* Aspect Ratio Wrapper (True Responsive Height) */}
      <div
        className="relative w-full max-w-[1728px]"
        style={{
          aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}`,
        }}
      >
        {/* Scaled Content Layer */}
        <div
          className="absolute top-0 left-0 origin-top"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: "scale(min(1, 100vw / 1728))",
            transformOrigin: "top center",
          }}
        >
          <div className="relative w-[1728px] h-[1343px]">

            {/* Desktop image card — 3D tilt on hover */}
            <div
              className="absolute"
              style={{
                left: 474,
                top: 348,
                width: 1175,
                height: 685,
                perspective: 1200,
              }}
            >
              <div
                className="desktop-tilt-card"
                style={{
                  width: "100%",
                  height: "100%",
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
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                  e.currentTarget.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 16}px 48px rgba(0, 50, 80, 0.14), 0 8px 16px rgba(0, 50, 80, 0.06)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)";
                  e.currentTarget.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transition = "transform 0.15s ease-out, box-shadow 0.3s ease-out";
                }}
              >
                <Image
                  src="/MapsGPTDesktop.png"
                  alt="Maps UI"
                  fill
                  className="object-fill"
                />
              </div>
            </div>

            {/* Title + Subtitle */}
            <div
              className="absolute left-[140px] top-[160px] flex flex-col"
              style={{
                fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "48px",
                  lineHeight: "130%",
                  letterSpacing: "-0.02em",
                  color: "#083445",
                }}
              >
                MapsGPT
              </div>
              <div
                className="whitespace-nowrap"
                style={{
                  minWidth: "900px",
                  fontWeight: 590,
                  fontSize: "48px",
                  lineHeight: "130%",
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(180deg, #063140 0%, rgba(6, 64, 58, 0.38) 100%)",
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

            {/* CTA */}
            <Link
              href="/maps-gpt"
              className={`absolute left-[1296px] top-[229px] z-20 flex w-[317px] h-[56px] min-h-[44px] items-center justify-center gap-2 cursor-pointer border-0 no-underline touch-manipulation active:scale-[0.98] select-none ${glassStyles.btn}`}
              style={{
                padding: 0,
                WebkitTapHighlightColor: "transparent",
              }}
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
                Try it out now
              </span>
              <svg
                width="15"
                height="11"
                viewBox="0 0 15 11"
                fill="none"
                className="shrink-0"
                aria-hidden
              >
                <path
                  d="M1 5.5h11M11 5.5L7 1.5M11 5.5L7 9.5"
                  stroke="#00B1D4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {/* Left column: 6 feature pills; tapped pill expands/collapses in place and pushes others down */}
            <div
              className="absolute left-[140px] flex flex-col justify-center gap-[10px]"
              style={{ top: 348, height: 685 }}
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
                      >
                        <span
                          className="text-[19px] font-semibold leading-[140%] tracking-[-0.02em]"
                          style={{
                            fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                            color: "#06403A",
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
                          className="mt-3 text-[19px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#06403A]/80"
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
                      >
                        <span
                          className="relative flex h-[11px] w-[11px] shrink-0 items-center justify-center"
                          aria-hidden
                        >
                          <span
                            className="absolute left-1/2 top-0 h-[11px] w-[2px] -translate-x-px rounded-[1px]"
                            style={{ background: "#06403A" }}
                          />
                          <span
                            className="absolute left-0 top-1/2 h-[2px] w-[11px] -translate-y-px rounded-[1px]"
                            style={{ background: "#06403A" }}
                          />
                        </span>
                        <span
                          className="relative whitespace-nowrap text-[19px] font-semibold leading-[140%] tracking-[-0.02em]"
                          style={{
                            fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                            color: "#06403A",
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

            {/* Trusted: 70px below bottom edge of rectangle layer (rectangle top 348 + height 685 + 70 = 1103) */}
            <div
              className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center"
              style={{ top: 1143 }}
            >
              <p
                className="mb-0 flex h-[40px] w-[303px] items-center justify-center text-center"
                style={{
                  fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: 500,
                  fontSize: "20px",
                  lineHeight: "110%",
                  letterSpacing: "-0.02em",
                  color: "#9F9F9F",
                }}
              >
                We work with data from the most reputable brands
              </p>

              {/* Infinite scroll marquee */}
              <div
                className="relative mt-0 overflow-hidden"
                style={{ width: "1440px", maxWidth: "100vw" }}
              >
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 shrink-0"
                  style={{
                    background: "linear-gradient(to right, #FFFFFF, transparent)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 shrink-0"
                  style={{
                    background: "linear-gradient(to left, #FFFFFF, transparent)",
                  }}
                />
                <div className="trusted-marquee flex w-max items-center gap-[72px]">
                  {MARQUEE_LOGOS.map((src) => (
                    <Image key={src} src={src} width={180} height={60} alt="" className="shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
                  ))}
                  {MARQUEE_LOGOS.map((src) => (
                    <Image key={`dup-${src}`} src={src} width={180} height={60} alt="" className="shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" aria-hidden />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}