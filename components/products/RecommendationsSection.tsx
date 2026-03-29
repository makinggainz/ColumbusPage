"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";

// Animation stages:
//  hidden    → waiting for scroll trigger
//  header-in → title / subtitle / logo fading in
//  typing    → message typed in + content below fades in
//  done      → all settled

type Stage = "hidden" | "header-in" | "typing" | "done";

const LINE1 = "Hey you, while you were away";
const LINE2 = "I found some places you'd like.";
const FULL_MSG = LINE1 + "\n" + LINE2;

// Timing constants (ms)
const HEADER_SETTLE = 900;  // wait for header to fade in before typing starts
const TYPE_INTERVAL = 28;   // ms per character

type Place = {
  name: string;
  description: string;
  location: string;
  rating: string;
  image: string;
  category: { label: string; icon: string };
};

const PLACES: Place[] = [
  { name: "Aman Spa & Resort", description: "Secluded jungle retreat with open-air pavilions and traditional Balinese healing rituals.", location: "Ubud, Bali", rating: "4.9", image: "/see/2.png", category: { label: "Spa/Wellness", icon: "🧖‍♀️" } },
  { name: "Shibuya Sky", description: "Rooftop observation deck above Tokyo's most electric crossing — best at golden hour.", location: "Tokyo, Japan", rating: "4.7", image: "/see/3.png", category: { label: "Gen Z Spots", icon: "✨" } },
  { name: "Le Jules Verne", description: "Michelin-starred French cuisine on the second floor of the Eiffel Tower with sweeping city views.", location: "Paris, France", rating: "4.8", image: "/see/4.png", category: { label: "Fine Dining", icon: "🍷" } },
  { name: "Blue Lagoon Geothermal Spa", description: "Iconic silica-rich geothermal waters set against dramatic black lava fields.", location: "Grindavík, Iceland", rating: "4.8", image: "/see/5.png", category: { label: "Spa/Wellness", icon: "🧖‍♀️" } },
  { name: "Bondi Icebergs Club", description: "Ocean pool carved into the cliffs — swim with the surf crashing over the walls.", location: "Sydney, Australia", rating: "4.6", image: "/see/8.png", category: { label: "Gen Z Spots", icon: "✨" } },
  { name: "Noma", description: "Four-time world's best restaurant. Hyper-seasonal Nordic tasting menus that redefine what food can be.", location: "Copenhagen, Denmark", rating: "4.9", image: "/see/9.png", category: { label: "Fine Dining", icon: "🍷" } },
  { name: "The Palm Hotel & Spa", description: "Luxury beachfront hotel with a legendary underwater restaurant and panoramic sea views.", location: "Dubai, UAE", rating: "4.8", image: "/see/10.png", category: { label: "Spa/Wellness", icon: "🧖‍♀️" } },
  { name: "The High Line", description: "Elevated park threading through Chelsea's art galleries and rooftop bars — the city from above.", location: "New York, USA", rating: "4.7", image: "/see/11.png", category: { label: "Gen Z Spots", icon: "✨" } },
  { name: "Osteria Francescana", description: "Massimo Bottura's three-Michelin-star temple of Italian tradition reimagined as contemporary art.", location: "Modena, Italy", rating: "4.9", image: "/see/13.png", category: { label: "Fine Dining", icon: "🍷" } },
  { name: "Banyan Tree Spa", description: "Award-winning sanctuary blending ancient Thai therapies with tropical garden serenity.", location: "Phuket, Thailand", rating: "4.8", image: "/see/14.png", category: { label: "Spa/Wellness", icon: "🧖‍♀️" } },
];

export default function RecommendationsSection() {

  const sectionRef  = useRef<HTMLDivElement>(null);
  const [stage, setStage]               = useState<Stage>("hidden");
  const [typedText, setTypedText]       = useState("");
  const [contentVisible, setContentVisible] = useState(false);

  // Scroll trigger
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        setStage("header-in");

        const t1 = window.setTimeout(() => {
          setStage("typing");
        }, HEADER_SETTLE);

        return () => clearTimeout(t1);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Typing animation
  useEffect(() => {
    if (stage !== "typing") return;
    let idx = 0;
    const iv = window.setInterval(() => {
      idx++;
      setTypedText(FULL_MSG.slice(0, idx));
      if (idx >= FULL_MSG.length) {
        clearInterval(iv);
        setStage("done");
        setContentVisible(true);
      }
    }, TYPE_INTERVAL);
    return () => clearInterval(iv);
  }, [stage]);

  // Shared fade-in-blur style (matches Hero/other sections)
  const fadeIn = (delay = 0, show = stage !== "hidden"): React.CSSProperties => ({
    opacity:   show ? 1 : 0,
    filter:    show ? "blur(0px)" : "blur(8px)",
    transform: show ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

  const typedLines = typedText.split("\n");

  return (
    <section className="relative bg-[#F9F9F9] py-32 px-6 overflow-hidden" ref={sectionRef}>

      {/* Ambient AI gradient orbs — appear with the cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 1s ease-out",
          transform: "translateY(-100px)",
        }}
      >
        <div className="rec-orb-1" />
        <div className="rec-orb-2" />
        <div className="rec-orb-3" />
        <div className="rec-orb-4" />
      </div>

      <div className="relative z-10 max-w-[1730px] mx-auto">

        {/* ================= HEADLINE ================= */}
        <div className="text-center mb-20">
          <h2
            className="text-[#0F6B6E] font-semibold text-[clamp(36px,4vw,64px)] leading-[140%] max-w-[1408px] mx-auto"
            style={fadeIn(0)}
          >
            Or get daily recommendations from our AI.
          </h2>

          <p
            className="text-[#0F6B6E] mt-6 text-[clamp(20px,2.5vw,36px)] leading-[140%] max-w-[797px] mx-auto"
            style={fadeIn(0.1)}
          >
            We&apos;re thinking of new places for you while you sleep
          </p>
        </div>

        {/* ================= CHAT ================= */}
        <div className="max-w-[1408px] mx-auto w-full px-8 lg:px-12 min-[1408px]:px-0">
          <div className="flex items-center gap-6 mb-16 max-w-[560px]">
          <div
            className="w-[69px] h-[69px] relative flex-shrink-0"
            style={fadeIn(0.2)}
          >
            <Image
              src="/MapsGPT-logo.png"
              alt="MapsGPT Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Text area — fixed min-height so layout doesn't jump */}
          <div style={{ minHeight: 56, display: "flex", alignItems: "center" }}>
            {(stage === "typing" || stage === "done") && (
              <p className="text-[#0A1344] text-[20px] leading-[140%]">
                {typedLines[0] ?? ""}
                {typedLines[1] !== undefined && (
                  <><br />{typedLines[1]}</>
                )}
              </p>
            )}
          </div>
        </div>
        </div>

        {/* ================= CARDS: 10 cards with category pill each, infinite marquee ================= */}
        <MarqueeCards fadeIn={fadeIn} contentVisible={contentVisible} />

        {/* ================= CTA ================= */}
        <div
          className="flex flex-col items-center mt-24"
          style={fadeIn(0.15, contentVisible)}
        >
          <p className="text-[20px] text-[#2C2C2C] mb-3 font-semibold">
            What&apos;re you waiting for?
          </p>

          <a
            href="https://mapsgpt.es"
            className={`group flex items-center justify-center gap-4 lg:gap-10 w-full max-w-214.25 h-14 lg:h-18.5 no-underline cursor-pointer active:scale-[0.98] select-none ${glassStyles.btn}`}
            style={{ borderRadius: 14, padding: 0 }}
          >
            <span
              style={{
                fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 590,
                fontSize: "clamp(15px, 2vw, 20px)",
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#00B1D4",
                whiteSpace: "nowrap",
              }}
            >
              Find your own favourite spots now
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
          </a>
        </div>

      </div>
    </section>
  );
}

function MarqueeCards({
  fadeIn,
  contentVisible,
}: {
  fadeIn: (d: number, v?: boolean) => React.CSSProperties;
  contentVisible: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const didDrag = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const marquee = marqueeRef.current;
    if (!container || !marquee) return;

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      didDrag.current = false;
      startX.current = e.clientX;
      scrollStart.current = container.scrollLeft;
      container.setPointerCapture(e.pointerId);
      marquee.style.animationPlayState = "paused";
      // Disable pointer events on all links so drag works over cards
      marquee.style.pointerEvents = "none";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      if (Math.abs(dx) > 3) didDrag.current = true;
      container.scrollLeft = scrollStart.current - dx;
    };

    const onPointerUp = () => {
      isDragging.current = false;
      const marquee = marqueeRef.current;
      if (marquee) {
        marquee.style.animationPlayState = "";
        // Re-enable pointer events after a tick so the click prevention fires first
        requestAnimationFrame(() => {
          marquee.style.pointerEvents = "";
        });
      }
    };

    const preventClick = (e: MouseEvent) => {
      if (didDrag.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("click", preventClick, true);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("click", preventClick, true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-auto w-full cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={fadeIn(0.05, contentVisible)}
    >
      <div ref={marqueeRef} className="recommendations-marquee flex gap-[49px] items-start py-3">
        {PLACES.map((place, index) => (
          <CardWithPill key={index} place={place} />
        ))}
        {PLACES.map((place, index) => (
          <CardWithPill key={`dup-${index}`} place={place} ariaHidden />
        ))}
      </div>
    </div>
  );
}

function CardWithPill({
  place,
  ariaHidden = false,
}: {
  place: Place;
  ariaHidden?: boolean;
}) {
  const sf: React.CSSProperties = { fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" };
  return (
    <a
      href="https://mapsgpt.es"
      className="rec-glass-card-link flex flex-col items-center w-124.25 shrink-0"
      aria-hidden={ariaHidden || undefined}
      tabIndex={ariaHidden ? -1 : undefined}
    >
      {/* Category pill — centered over card with padding below */}
      <div className="rec-glass-pill flex items-center justify-center gap-2 w-40 h-11.25 shrink-0 mb-5">
        <span className="leading-none" aria-hidden>{place.category.icon}</span>
        <span
          className="text-center"
          style={{
            fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
            fontStyle: "normal",
            fontWeight: 510,
            fontSize: "15px",
            lineHeight: "140%",
            color: "#000000",
          }}
        >
          {place.category.label}
        </span>
      </div>

      {/* Card */}
      <div className="rec-glass-card w-124.25 h-83.5 shrink-0 text-left">
        {/* Image */}
        <div className="absolute left-4 top-4 w-115.5 max-w-[calc(100%-32px)] h-42.5 rounded-[11px] overflow-hidden">
          <Image
            src={place.image}
            alt={place.name}
            width={462}
            height={170}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Rating pill */}
        <div
          className="absolute right-7.5 top-6 w-16 h-7 rounded-[14px] flex items-center justify-center gap-1"
          style={{ background: "rgba(217, 217, 217, 0.6)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E46962" />
          </svg>
          <span className="font-semibold text-[15px] tracking-[-0.02em] text-black" style={sf}>
            {place.rating}
          </span>
        </div>

        {/* Text content */}
        <div
          className="absolute left-4 right-4 flex flex-col justify-between"
          style={{ top: 196, bottom: 16 }}
        >
          <div>
            <h3
              className="text-[20px] leading-[130%] tracking-[-0.02em] text-black"
              style={{ ...sf, fontWeight: 590 }}
            >
              {place.name}
            </h3>
            <p
              className="mt-1.5 text-[15px] leading-[135%] tracking-[-0.02em] text-black opacity-75"
              style={{ ...sf, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
              {place.description}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 opacity-60">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-black" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="currentColor" />
            </svg>
            <span className="text-[15px] leading-[140%] tracking-[-0.02em] text-black" style={sf}>
              {place.location}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
