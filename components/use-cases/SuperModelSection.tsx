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
 * "Surveying the earth with a super model" — animated demo built on the
 * same single-panel UI primitives as the Chat row: one compact white
 * rounded-2xl shadow-xl panel pinned to the bottom-left, with a
 * scrollable conversation area on top and a bordered input bar on the
 * bottom. The same blur veil + map background + "Columbus is
 * investigating" + considering pattern + cursor glyph + easing curves
 * are reused so the two rows feel like one design system.
 *
 * Loop: fade in mid-investigation (Columbus thinking, the user's prompt
 * persists in the bottom input bar with a stop icon) → popup REPLACES
 * the input bar in place asking to fill missing data (Yes / No / Ignore
 * + X) → cursor moves in and taps Yes → popup closes, input bar returns
 * → Columbus thinks more (additional considering lines stagger in) →
 * success message → 5s idle → fade out → restart.
 */
export default function SuperModelSection({
  lightTheme = false,
  embedded = false,
  content,
}: SuperModelSectionProps) {
  const { industry } = useIndustry();
  const data = content ?? industry.superModel;

  const sectionRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
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

      await wait(700);
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
      await wait(420);
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

  // Auto-scroll the conversation area as new content appears
  useEffect(() => {
    const el = conversationRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [phase, visibleFillConsidering]);

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
  const panelVisible = !isIntro && !isFadingOut;
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

      {/* Layer 2 — Chat panel. Same dimensions and positioning as the Chat row. */}
      <div
        className="absolute left-[40px] bottom-[40px] w-[460px] top-[100px] max-xl:left-[32px] max-xl:w-[400px] max-md:left-[20px] max-md:right-[20px] max-md:bottom-[20px] max-md:top-[60px] max-md:w-auto z-20 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
        style={{
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.99)",
          transition:
            "opacity 500ms ease, transform 500ms cubic-bezier(0.05, 0.7, 0.1, 1)",
        }}
      >
        {/* Top: scrollable conversation area */}
        <div
          ref={conversationRef}
          className="flex-1 overflow-y-auto px-6 pt-6 pb-4 max-md:px-4"
        >
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

          {/* Considering lines — initial line is always present */}
          <div className="mt-2 pl-7 space-y-1">
            <div className="text-[13px] text-[#a0a0a8]">{INITIAL_CONSIDERING}</div>

            {/* Fill-in considering lines (after Yes) */}
            {FILL_CONSIDERING.map((line, i) => (
              <div
                key={line}
                className="text-[13px] text-[#a0a0a8]"
                style={{
                  opacity: fillThinkingVisible && visibleFillConsidering > i ? 1 : 0,
                  transform:
                    fillThinkingVisible && visibleFillConsidering > i
                      ? "translateY(0)"
                      : "translateY(6px)",
                  transition: "opacity 220ms ease, transform 220ms ease",
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Success message */}
          <div
            className="mt-5 flex items-center gap-2.5"
            style={{
              opacity: successVisible ? 1 : 0,
              transform: successVisible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 380ms ease, transform 380ms cubic-bezier(0.05, 0.7, 0.1, 1)",
            }}
          >
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[12px] leading-none shrink-0"
              style={{ background: "#16a34a" }}
              aria-hidden
            >
              ✓
            </span>
            <span className="text-[13px] font-medium text-[#1D1D1F]">{SUCCESS_MESSAGE}</span>
          </div>
        </div>

        {/* Bottom area — input bar OR popup, grid-stacked so they crossfade
            in place. The grid cell sizes to whichever child has more
            content at any moment. */}
        <div className="grid border-t border-[rgba(0,0,0,0.06)]">
          {/* Input bar — persistent user query + stop icon */}
          <div
            className="px-5 py-4 max-md:px-3"
            style={{
              gridArea: "1 / 1",
              opacity: popupVisible ? 0 : 1,
              pointerEvents: popupVisible ? "none" : "auto",
              transition: "opacity 280ms ease",
            }}
          >
            <div className="flex items-end gap-3">
              <div className="flex-1 text-[14px] leading-[1.5] text-[#1D1D1F]">
                {USER_QUERY}
              </div>
              <div
                className="w-10 h-10 rounded-xl bg-[#e8e8ec] flex items-center justify-center shrink-0"
                aria-hidden
              >
                <div className="w-3 h-3 rounded-[2px] bg-[#0A1344]" />
              </div>
            </div>
          </div>

          {/* Popup — title + subtitle + Yes / No / Ignore + X close */}
          <div
            className="relative px-5 py-4 max-md:px-3"
            style={{
              gridArea: "1 / 1",
              opacity: popupVisible ? 1 : 0,
              pointerEvents: popupVisible ? "auto" : "none",
              transition: "opacity 320ms ease",
            }}
          >
            {/* X close */}
            <div
              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[#a0a0a8]"
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
      </div>

      {/* Cursor — animates toward the Yes button at the bottom of the panel */}
      <div
        className="absolute z-40 pointer-events-none"
        style={{
          opacity: cursorVisible ? 1 : 0,
          left: cursorVisible ? "calc(40px + 30px)" : "calc(100% - 80px)",
          bottom: cursorVisible ? "78px" : "60px",
          transform: `scale(${phase === "cursor-tap" ? 0.85 : 1})`,
          transition:
            "left 720ms cubic-bezier(0.22, 1, 0.36, 1), bottom 720ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease, transform 140ms ease",
        }}
        aria-hidden
      >
        {CURSOR_GLYPH}
      </div>

      {/* Built on Columbus Pro footer */}
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
