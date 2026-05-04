"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIndustry } from "./industry/IndustryContext";
import type { SuperModelRowContent } from "./industry/types";

const USER_QUERY =
  "Generate a parcel-level smart layer estimating the probability that each single-family residential parcel in Harris County has on-site backup power (whole-home generator, portable generator, or solar + battery storage). Score 0–100 per parcel.";

const INITIAL_CONSIDERING = "Considering demographics of Miami";

const FILL_CONSIDERING = [
  "Pulling Harris County parcel registry",
  "Cross-referencing utility outage records",
  "Synthesizing missing parcels via peer-block similarity",
];

const SUCCESS_MESSAGE = "Successfully filled in missing data";

const POPUP_TITLE = "Columbus detected missing data";
const POPUP_SUBTITLE = "Some parcels are missing — should I fill them in?";

type Phase =
  | "fading-in"
  | "thinking-initial"
  | "popup-appears"
  | "cursor-moving"
  | "cursor-tap"
  | "popup-closing"
  | "thinking-fill"
  | "filling-considering"
  | "success"
  | "idle-end"
  | "fading-out";

type SuperModelSectionProps = {
  lightTheme?: boolean;
  embedded?: boolean;
  content?: SuperModelRowContent;
};

const CURSOR_GLYPH = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#1D1D1F" stroke="white" strokeWidth="1" aria-hidden>
    <path d="M5 3 L5 19 L9.5 14.5 L12 20.5 L14 19.5 L11.5 13.5 L18 13.5 Z" />
  </svg>
);

const X_GLYPH = (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <path d="M3 3 L11 11 M11 3 L3 11" />
  </svg>
);

/**
 * "Surveying the earth with a super model" — animated demo of Columbus
 * detecting missing data mid-investigation and offering to fill it in.
 *
 * Loop: fade-in to a chat already in progress (Columbus thinking) → popup
 * replaces the bottom user-query card asking to fill missing data → cursor
 * taps Yes → popup closes → Columbus thinks more, lists considering lines
 * → success message → 5s idle → fade-out → restart.
 *
 * UI primitives mirror Chat.tsx exactly (map + blur veil, white rounded
 * panels with shadow-xl, "Columbus is investigating" + considering lines,
 * cursor glyph, easing curves) so the two rows feel like one design system.
 */
export default function SuperModelSection({
  lightTheme = false,
  embedded = false,
  content,
}: SuperModelSectionProps) {
  const { industry } = useIndustry();
  const data = content ?? industry.superModel;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("fading-in");
  const [visibleFillConsidering, setVisibleFillConsidering] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    const run = async () => {
      setPhase("fading-in");
      setVisibleFillConsidering(0);

      if (reducedMotion) {
        setPhase("success");
        await wait(5000);
        if (cancelled) return;
        run();
        return;
      }

      await wait(800);
      if (cancelled) return;
      setPhase("thinking-initial");
      await wait(1200);
      if (cancelled) return;

      setPhase("popup-appears");
      await wait(900);
      if (cancelled) return;

      setPhase("cursor-moving");
      await wait(900);
      if (cancelled) return;
      setPhase("cursor-tap");
      await wait(220);
      if (cancelled) return;

      setPhase("popup-closing");
      await wait(360);
      if (cancelled) return;

      setPhase("thinking-fill");
      await wait(450);
      if (cancelled) return;

      setPhase("filling-considering");
      for (let i = 1; i <= FILL_CONSIDERING.length; i++) {
        if (cancelled) return;
        await wait(420);
        setVisibleFillConsidering(i);
      }
      await wait(400);
      if (cancelled) return;

      setPhase("success");
      await wait(500);
      if (cancelled) return;

      setPhase("idle-end");
      await wait(5000);
      if (cancelled) return;

      setPhase("fading-out");
      await wait(700);
      if (cancelled) return;

      run();
    };

    run();
    return () => { cancelled = true; };
  }, [visible, reducedMotion]);

  // Phase predicates
  const isIntro = phase === "fading-in";
  const isFadingOut = phase === "fading-out";
  const popupVisible = ["popup-appears", "cursor-moving", "cursor-tap"].includes(phase);
  const cursorVisible = ["cursor-moving", "cursor-tap"].includes(phase);
  const fillThinkingVisible = [
    "thinking-fill",
    "filling-considering",
    "success",
    "idle-end",
  ].includes(phase);
  const successVisible = ["success", "idle-end"].includes(phase);
  const userQueryCardVisible = !popupVisible && !isIntro && !isFadingOut;
  const panelsVisible = !isIntro && !isFadingOut;
  const blurActive = isIntro || isFadingOut;

  const visualBlock = (
    <div
      ref={sectionRef}
      className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* Layer 0 — satellite map background */}
      <Image
        src={data.mapImageSrc}
        alt="Geospatial map"
        fill
        className="object-cover"
      />
      {!lightTheme && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(18, 8, 52, 0.18)" }}
        />
      )}

      {/* Layer 1 — strong blur veil for the in/out transitions */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backdropFilter: blurActive ? "blur(24px)" : "blur(0px)",
          WebkitBackdropFilter: blurActive ? "blur(24px)" : "blur(0px)",
          background: blurActive ? "rgba(245, 245, 247, 0.55)" : "rgba(245, 245, 247, 0)",
          transition:
            "backdrop-filter 520ms cubic-bezier(0.05, 0.7, 0.1, 1), -webkit-backdrop-filter 520ms cubic-bezier(0.05, 0.7, 0.1, 1), background 520ms cubic-bezier(0.05, 0.7, 0.1, 1)",
        }}
        aria-hidden
      />

      {/* TOP CARD — thinking / conversation */}
      <div
        className="absolute top-[40px] left-[40px] right-[40px] bottom-[200px] max-md:left-[20px] max-md:right-[20px] max-md:top-[20px] max-md:bottom-[160px] z-20 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
        style={{
          opacity: panelsVisible ? 1 : 0,
          transform: panelsVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.05, 0.7, 0.1, 1)",
        }}
      >
        <div className="px-6 pt-6 pb-5 max-md:px-4 max-md:pt-4 max-md:pb-3 flex flex-col gap-3 overflow-y-auto">
          {/* Columbus is investigating */}
          <div className="flex items-center gap-2.5 text-[#a0a0a8]">
            <Image
              src="/logobueno.png"
              alt="Columbus"
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="text-[14px]">Columbus is investigating</span>
          </div>

          {/* Initial considering line — visible the whole loop */}
          <div className="pl-7 text-[13px] text-[#a0a0a8]">{INITIAL_CONSIDERING}</div>

          {/* Fill-in considering lines (after Yes) */}
          <div
            className="pl-7 mt-1 flex flex-col gap-1"
            style={{
              opacity: fillThinkingVisible ? 1 : 0,
              transform: fillThinkingVisible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 320ms ease, transform 320ms ease",
            }}
          >
            {FILL_CONSIDERING.map((line, i) => (
              <div
                key={line}
                className="text-[13px] text-[#a0a0a8]"
                style={{
                  opacity: visibleFillConsidering > i ? 1 : 0,
                  transform: visibleFillConsidering > i ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 220ms ease, transform 220ms ease",
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Success message */}
          <div
            className="mt-2 flex items-center gap-2.5 text-[#1D1D1F]"
            style={{
              opacity: successVisible ? 1 : 0,
              transform: successVisible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 380ms ease, transform 380ms cubic-bezier(0.05, 0.7, 0.1, 1)",
            }}
          >
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[12px] leading-none"
              style={{ background: "#16a34a" }}
            >
              ✓
            </span>
            <span className="text-[14px] font-medium">{SUCCESS_MESSAGE}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM CARD — user query + stop button (visible when popup hidden) */}
      <div
        className="absolute bottom-[40px] left-[40px] right-[40px] max-md:left-[20px] max-md:right-[20px] max-md:bottom-[20px] z-20 bg-white rounded-2xl shadow-xl flex items-center justify-between gap-4 px-5 py-4 max-md:px-4 max-md:py-3"
        style={{
          opacity: userQueryCardVisible ? 1 : 0,
          pointerEvents: userQueryCardVisible ? "auto" : "none",
          transition: "opacity 280ms ease",
        }}
      >
        <p className="flex-1 text-[14px] leading-[1.5] text-[#1D1D1F]">{USER_QUERY}</p>
        <div
          className="w-10 h-10 rounded-xl bg-[#e8e8ec] flex items-center justify-center shrink-0"
          aria-hidden
        >
          <div className="w-3 h-3 rounded-[2px] bg-[#0A1344]" />
        </div>
      </div>

      {/* POPUP — replaces bottom card when popupVisible. Yes / No / Ignore + X */}
      <div
        className="absolute bottom-[40px] left-[40px] right-[40px] max-md:left-[20px] max-md:right-[20px] max-md:bottom-[20px] z-20 bg-white rounded-2xl shadow-xl"
        style={{
          opacity: popupVisible ? 1 : 0,
          transform: popupVisible ? "translateY(0) scale(1)" : "translateY(6px) scale(0.99)",
          pointerEvents: popupVisible ? "auto" : "none",
          transition:
            "opacity 320ms ease, transform 320ms cubic-bezier(0.05, 0.7, 0.1, 1)",
        }}
      >
        <div className="relative px-5 py-4 max-md:px-4 max-md:py-3">
          {/* X close button */}
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-[#a0a0a8]"
            aria-hidden
          >
            {X_GLYPH}
          </div>

          <p className="text-[14px] font-medium text-[#1D1D1F] pr-8">{POPUP_TITLE}</p>
          <p className="text-[13px] text-[#6E6E73] mt-1 pr-8">{POPUP_SUBTITLE}</p>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              data-yes-button
              className="px-4 h-9 rounded-lg bg-[#0A1344] text-white text-[13px] font-medium"
              style={{
                transform: phase === "cursor-tap" ? "scale(0.96)" : "scale(1)",
                transition: "transform 140ms ease",
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="px-4 h-9 rounded-lg bg-[#e8e8ec] text-[#1D1D1F] text-[13px] font-medium"
            >
              No
            </button>
            <button
              type="button"
              className="ml-auto h-9 px-3 rounded-lg text-[13px] font-medium text-[#6E6E73]"
            >
              Ignore
            </button>
          </div>
        </div>
      </div>

      {/* Animated cursor — moves to roughly the Yes button position */}
      <div
        className="absolute z-40 pointer-events-none"
        style={{
          opacity: cursorVisible ? 1 : 0,
          left: cursorVisible ? "calc(40px + 30px)" : "calc(100% - 80px)",
          bottom: cursorVisible ? "82px" : "60px",
          transform: `scale(${phase === "cursor-tap" ? 0.85 : 1})`,
          transition:
            "left 720ms cubic-bezier(0.22, 1, 0.36, 1), bottom 720ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease, transform 140ms ease",
        }}
        aria-hidden
      >
        {CURSOR_GLYPH}
      </div>

      {/* Built on Columbus Pro footer (kept from prior visual) */}
      <div className="absolute bottom-[8px] right-[12px] text-white text-[12px] opacity-70 z-10">
        Built on Columbus Pro
      </div>
    </div>
  );

  if (embedded) return visualBlock;

  const sectionBgClass = lightTheme ? "bg-white" : "bg-black";
  return (
    <section className={`w-full ${sectionBgClass} flex justify-center`}>
      <div className="w-full max-w-[1287px] mx-auto px-8 md:px-10 py-30">
        {visualBlock}
      </div>
    </section>
  );
}
