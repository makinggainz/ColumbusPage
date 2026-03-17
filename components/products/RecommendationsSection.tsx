"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

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

export default function RecommendationsSection() {
  const categories = [
    { label: "Spa/Wellness", icon: "🧖‍♀️" },
    { label: "Gen Z Spots", icon: "✨" },
    { label: "Fine Dining", icon: "🍷" },
  ];

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
            className="text-[#1F6F6C] font-semibold text-[clamp(32px,4vw,64px)] leading-[140%] max-w-[1400px] mx-auto"
            style={fadeIn(0)}
          >
            Or get daily recommendations from our AI.
          </h2>

          <p
            className="text-[#1F6F6C] mt-6 text-[clamp(18px,2.5vw,36px)] leading-[140%] max-w-[797px] mx-auto"
            style={fadeIn(0.1)}
          >
            We&apos;re thinking of new places for you while you sleep
          </p>
        </div>

        {/* ================= CHAT ================= */}
        <div className="flex items-center gap-6 mb-16 max-w-[560px] ml-[40px]">
          <div
            className="w-[69px] h-[69px] relative flex-shrink-0"
            style={fadeIn(0.2)}
          >
            <Image
              src="/how/ai.png"
              alt="AI"
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

        {/* ================= CARDS: 10 cards with category pill each, infinite marquee ================= */}
        <div
          className="relative overflow-hidden w-full"
          style={fadeIn(0.05, contentVisible)}
        >
          <div className="recommendations-marquee flex gap-[49px] items-start">
            {Array.from({ length: 10 }).map((_, index) => (
              <CardWithPill
                key={index}
                category={categories[index % categories.length]}
              />
            ))}
            {Array.from({ length: 10 }).map((_, index) => (
              <CardWithPill
                key={`dup-${index}`}
                category={categories[index % categories.length]}
                ariaHidden
              />
            ))}
          </div>
        </div>

        {/* ================= CTA ================= */}
        <div
          className="text-center mt-24"
          style={fadeIn(0.15, contentVisible)}
        >
          <p className="text-[20px] text-[#2C2C2C] mb-3 font-semibold">
            What&apos;re you waiting for?
          </p>

          <Link
            href="/maps-gpt"
            className="rec-glass-card inline-flex items-center justify-center transition w-full max-w-[857px] h-[74px] text-[18px] text-[#2C2C2C] no-underline cursor-pointer"
          >
            Find your own favourite spots now →
          </Link>
        </div>

      </div>
    </section>
  );
}

type Category = { label: string; icon: string };

function CardWithPill({
  category,
  ariaHidden = false,
}: {
  category: Category;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center w-[497px] shrink-0 gap-4"
      aria-hidden={ariaHidden || undefined}
    >
      <div className="rec-glass-pill flex items-center justify-center gap-2 w-[160px] h-[45px] shrink-0">
        <span className="leading-none" aria-hidden>{category.icon}</span>
        <span
          className="text-center"
          style={{
            fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
            fontStyle: "normal",
            fontWeight: 510,
            fontSize: "16px",
            lineHeight: "140%",
            color: "#000000",
          }}
        >
          {category.label}
        </span>
      </div>
      <RecommendationCard />
    </div>
  );
}

function RecommendationCard({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean } = {}) {
  const sf: React.CSSProperties = { fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" };
  return (
    <div
      className="rec-glass-card w-[497px] h-[334px] shrink-0 text-left"
      aria-hidden={ariaHidden}
    >
      {/* Image: full-width minus padding, 170px tall, 16px from top */}
      <div className="absolute left-4 top-4 w-[462px] max-w-[calc(100%-32px)] h-[170px] rounded-[11px] overflow-hidden">
        <Image
          src="/how/card.png"
          alt=""
          width={462}
          height={170}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Rating pill: overlaid top-right on the image */}
      <div
        className="absolute right-[30px] top-[24px] w-[64px] h-[28px] rounded-[14px] flex items-center justify-center gap-1"
        style={{ background: "rgba(217, 217, 217, 0.6)" }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E46962" />
        </svg>
        <span className="font-semibold text-[15px] tracking-[-0.02em] text-black" style={sf}>
          4.2
        </span>
      </div>

      {/* Text content: flex column filling space below image */}
      <div
        className="absolute left-4 right-4 flex flex-col justify-between"
        style={{ top: 196, bottom: 16 }}
      >
        <div>
          <h3
            className="text-[20px] leading-[130%] tracking-[-0.02em] text-black"
            style={{ ...sf, fontWeight: 590 }}
          >
            The Palm Hotel
          </h3>
          <p
            className="mt-1.5 text-[15px] leading-[135%] tracking-[-0.02em] text-black opacity-75"
            style={{ ...sf, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            Luxury hotel, with unique aquarium restaurant. Great food, and a great view.
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 opacity-60">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-black" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="currentColor" />
          </svg>
          <span className="text-[16px] leading-[140%] tracking-[-0.02em] text-black" style={sf}>
            Dubai, UAE
          </span>
        </div>
      </div>
    </div>
  );
}
