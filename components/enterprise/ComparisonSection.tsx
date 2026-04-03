"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Use-case data ──────────────────────────────────────────────────────────

interface UseCase {
  number: string;
  title: string;
  prompt: string;
  thinkingSteps: string[];
  resultLines: string[];
  legacyLine: string;
}

const USE_CASES: UseCase[] = [
  {
    number: "01",
    title: "Reason through uploaded data",
    prompt: "I've uploaded our 200 franchise locations. Show me coverage gaps and the 5 best cities for expansion.",
    thinkingSteps: ["Analyzing spatial distribution", "Identifying underserved regions", "Cross-referencing demographics"],
    resultLines: ["3 major coverage gaps identified in the Southeast", "Top expansion cities: Nashville, Raleigh, Tampa, Austin, Denver", "Population density vs. store proximity mapped"],
    legacyLine: "With legacy GIS this takes 2+ weeks of manual layer stacking",
  },
  {
    number: "02",
    title: "Ask questions, get maps",
    prompt: "Where should I open a new pizzeria? Consider demographics, lot prices, and competition.",
    thinkingSteps: ["Considering demographics", "Considering lot prices", "Considering trade area competition"],
    resultLines: ["7 high-potential zones ranked by composite score", "Avg. household income $78K+ within 1-mile radius", "Nearest competitor distance: 2.3 mi minimum"],
    legacyLine: "With legacy GIS this requires a trained analyst and 3 separate data vendors",
  },
  {
    number: "03",
    title: "Complex operations in plain English",
    prompt: "Generate the fastest route for next Tuesday 10am. Multi-stop through Philadelphia with my vehicle file attached.",
    thinkingSteps: ["Parsing vehicle constraints", "Optimizing stop sequence", "Calculating ETA per segment"],
    resultLines: ["12-stop route optimized: 47 min faster than manual", "Avoids 3 construction zones active on Tuesdays", "Total distance: 38.2 mi | Est. fuel: 2.4 gal"],
    legacyLine: "With legacy GIS this needs separate routing software and manual data entry",
  },
  {
    number: "04",
    title: "Draw an area, know everything",
    prompt: "What's the property history, ownership, and displacement risk for this selected zone?",
    thinkingSteps: ["Querying parcel records", "Pulling ownership history", "Running displacement model"],
    resultLines: ["142 parcels analyzed | 23 changed hands in last 2 years", "Displacement risk: Moderate (rising 12% YoY)", "Top 3 listed owners with contact info returned"],
    legacyLine: "With legacy GIS this means county records offices and weeks of due diligence",
  },
  {
    number: "05",
    title: "Coordinates you can trust",
    prompt: "Plot all vacant lots within 500m of the SEPTA Broad Street Line in Philadelphia.",
    thinkingSteps: ["Geocoding transit line", "Buffering 500m corridor", "Filtering vacant parcels"],
    resultLines: ["87 vacant lots plotted with verified coordinates", "Spatial accuracy: 99.7% — basic AI hallucinates 60% of the time", "Each lot linked to parcel ID, zoning, and assessed value"],
    legacyLine: "With legacy GIS this requires manual digitization and unverified geocoding",
  },
];

const SLIDE_DURATION = 8000;
const TYPING_SPEED = 26;
const THINKING_DELAY = 600;
const RESULT_DELAY = 400;

// ── Component ──────────────────────────────────────────────────────────────

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [typed, setTyped] = useState("");
  const [thinkingStep, setThinkingStep] = useState(-1);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const resetSlide = useCallback(() => {
    setTyped("");
    setThinkingStep(-1);
    setShowResult(false);
  }, []);

  useEffect(() => {
    if (!visible || paused) return;
    const id = setInterval(() => setActiveIndex(i => (i + 1) % USE_CASES.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [visible, paused]);

  useEffect(() => { resetSlide(); }, [activeIndex, resetSlide]);

  useEffect(() => {
    if (!visible) return;
    const prompt = USE_CASES[activeIndex].prompt;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(prompt.slice(0, i));
      if (i >= prompt.length) clearInterval(id);
    }, TYPING_SPEED);
    return () => clearInterval(id);
  }, [activeIndex, visible]);

  useEffect(() => {
    if (typed.length < USE_CASES[activeIndex].prompt.length) return;
    const steps = USE_CASES[activeIndex].thinkingSteps;
    let step = 0;
    setThinkingStep(0);
    const id = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(id);
        setTimeout(() => setShowResult(true), RESULT_DELAY);
      } else {
        setThinkingStep(step);
      }
    }, THINKING_DELAY);
    return () => clearInterval(id);
  }, [typed, activeIndex]);

  const current = USE_CASES[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ backgroundColor: "#060810" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Top divider */}
      <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

      <div className="max-w-[1287px] mx-auto px-6 md:px-10">

        {/* Header — generous spacing, editorial hierarchy */}
        <div
          className="pt-32 pb-20 lg:pt-40 lg:pb-28"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p
            className="text-[12px] font-medium tracking-[0.15em] uppercase"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            What Columbus does differently
          </p>
          <h2
            className="mt-5 text-white leading-[1.08] text-[32px] md:text-[42px] lg:text-[52px]"
            style={{ fontWeight: 500, letterSpacing: "-0.025em", maxWidth: 640 }}
          >
            The queries that legacy GIS can&apos;t answer
          </h2>
        </div>

        {/* Slide number navigation */}
        <div
          className="flex gap-0 mb-16"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {USE_CASES.map((uc, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="cursor-pointer group relative"
              style={{
                flex: 1,
                paddingTop: 20,
                paddingBottom: 20,
                borderRight: i < USE_CASES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                backgroundColor: "transparent",
                border: "none",
                borderTop: "none",
                textAlign: "left",
                paddingLeft: 0,
                paddingRight: 16,
              }}
            >
              {/* Top progress bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  width: i === activeIndex ? "100%" : "0%",
                  transition: i === activeIndex ? `width ${SLIDE_DURATION}ms linear` : "width 0.15s ease",
                }}
              />
              <span
                className="block text-[28px] md:text-[36px] font-light"
                style={{
                  color: i === activeIndex ? "white" : "rgba(255,255,255,0.12)",
                  letterSpacing: "-0.02em",
                  transition: "color 0.3s",
                }}
              >
                {uc.number}
              </span>
            </button>
          ))}
        </div>

        {/* Active slide content */}
        <div className="pb-32 lg:pb-40">
          <div key={activeIndex} style={{ animation: "compFadeIn 0.5s ease-out both" }}>

            {/* Slide title — large, editorial */}
            <h3
              className="text-white leading-[1.12] text-[26px] md:text-[34px] lg:text-[40px]"
              style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 550 }}
            >
              {current.title}
            </h3>

            {/* Two-column content below title */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 mt-12">

              {/* Left: prompt + thinking */}
              <div>
                {/* Prompt */}
                <p
                  className="text-[16px] md:text-[18px] leading-[1.65] text-white/50"
                  style={{ letterSpacing: "-0.01em", minHeight: "3.2em" }}
                >
                  &ldquo;{typed}
                  {typed.length > 0 && typed.length < current.prompt.length && (
                    <span className="inline-block w-[1.5px] h-[1em] bg-white/40 align-middle ml-0.5 animate-pulse" />
                  )}
                  {typed.length >= current.prompt.length && "&rdquo;"}
                </p>

                {/* Thinking steps */}
                <div className="mt-8 space-y-3">
                  {current.thinkingSteps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3"
                      style={{
                        opacity: thinkingStep >= i ? 1 : 0,
                        transform: thinkingStep >= i ? "translateX(0)" : "translateX(-4px)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          backgroundColor: thinkingStep === i && !showResult ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.12)",
                          transition: "background-color 0.3s",
                          flexShrink: 0,
                        }}
                      />
                      <span className="text-[13px] text-white/25">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: results */}
              <div
                style={{
                  opacity: showResult ? 1 : 0,
                  transform: showResult ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.45s ease, transform 0.45s ease",
                }}
              >
                <div className="space-y-5">
                  {current.resultLines.map((line, i) => (
                    <p
                      key={i}
                      className="text-[15px] md:text-[16px] leading-[1.6] text-white/70"
                      style={{
                        opacity: showResult ? 1 : 0,
                        transition: `opacity 0.4s ease ${i * 0.12}s`,
                        paddingLeft: 16,
                        borderLeft: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Legacy comparison */}
                <p
                  className="mt-10 text-[13px] text-white/15"
                  style={{ letterSpacing: "-0.005em" }}
                >
                  {current.legacyLine}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

      <style>{`
        @keyframes compFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
