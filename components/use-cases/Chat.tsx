"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIndustry } from "./industry/IndustryContext";
import type { ChatRowContent } from "./industry/types";

const QUERY =
  "Show me all parcels over 5,000 m² in the Madrid metro area zoned for residential, currently undeveloped, within 1km of a metro station, and owned by a single entity for over 10 years";
// Each line maps one-to-one to a "deep reasoning" step in the chat — the
// last two add map layers when they appear.
const CONSIDERING = [
  "Gathered verified sources",
  "Preparing deep reasoning",
  "Adding metro stations and 1km service radii",
  "Adding qualifying parcels",
];
const RESPONSE =
  "Found 47 qualifying parcels across the Madrid metro area. Combined area: 412,800 m². Largest single owner: Promociones Inmobiliarias Madrid SA (8 parcels, since 2011).";
const FOLLOW_UP = "Now filter to parcels above 10,000 m²";
const CONSIDERING_2 = [
  "Filtering by parcel size > 10,000 m²",
];
const RESPONSE_2 =
  "12 parcels remain after filtering. Highlighted on the map.";

// ── Map-overlay data — stylized answer to the Madrid parcel query ──
// Coordinates are percentages of the OVERLAY container. The overlay sits
// on top of the right (visible) copy of the duplicated Madrid map; both
// the right map and this overlay are translated 28% to the right so the
// Madrid label and these markers clear the chat panel on the left.
const METRO_STATIONS: { cx: number; cy: number }[] = [
  { cx: 38, cy: 31 },
  { cx: 53, cy: 28 },
  { cx: 45, cy: 39 },
  { cx: 60, cy: 36 },
  { cx: 35, cy: 49 },
  { cx: 50, cy: 47 },
  { cx: 62, cy: 53 },
  { cx: 42, cy: 58 },
];

// Parcels — small squares, each placed inside the 1km service radius of one
// of the metro stations with subtle random offsets. `largeOnly` is preserved
// through round 2's "parcels above 10,000 m²" filter.
const PARCELS: { x: number; y: number; largeOnly: boolean }[] = [
  { x: 37.4, y: 29.8, largeOnly: false },
  { x: 39.3, y: 31.7, largeOnly: true },
  { x: 52.1, y: 27.0, largeOnly: true },
  { x: 54.0, y: 28.9, largeOnly: false },
  { x: 44.2, y: 38.4, largeOnly: false },
  { x: 46.0, y: 40.1, largeOnly: false },
  { x: 59.3, y: 35.4, largeOnly: true },
  { x: 60.8, y: 37.2, largeOnly: false },
  { x: 34.2, y: 48.0, largeOnly: false },
  { x: 36.0, y: 50.0, largeOnly: true },
  { x: 49.1, y: 46.1, largeOnly: false },
  { x: 50.7, y: 48.0, largeOnly: true },
  { x: 61.4, y: 52.2, largeOnly: false },
  { x: 63.0, y: 54.0, largeOnly: false },
  { x: 41.2, y: 57.1, largeOnly: true },
  { x: 42.7, y: 58.7, largeOnly: false },
];
const STATION_RADIUS_PX = 56; // perfect circle, ~1km on the Madrid view

type Phase =
  | "idle"
  | "cursor-moving"
  | "cursor-tap"
  | "chat-open"
  | "typing-query"
  | "sending"
  | "bubble-in"
  | "clearing-blur"
  | "investigating"
  | "considering"
  | "responding"
  | "typing-followup"
  | "sending-followup"
  | "bubble-in-2"
  | "investigating-2"
  | "considering-2"
  | "responding-2"
  | "fading-out";

type ChatProps = {
  lightTheme?: boolean;
  embedded?: boolean;
  content?: ChatRowContent;
};

const CURSOR_GLYPH = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#1D1D1F" stroke="white" strokeWidth="1" aria-hidden>
    <path d="M5 3 L5 19 L9.5 14.5 L12 20.5 L14 19.5 L11.5 13.5 L18 13.5 Z" />
  </svg>
);

/**
 * Conversational map chat — animated demo for the use-case sticky-scroll
 * Chat row. Loops through: blurred satellite map → cursor taps centered
 * "+ New chat" → input-only panel → user types query → first send expands
 * the panel to full height → blur clears → Columbus thinks (4 considering
 * lines) → lorem ipsum response → user types follow-up → sends → Columbus
 * thinks/responds again → whole panel fades out → loop.
 */
export default function Chat({ lightTheme = false, embedded = false, content }: ChatProps) {
  const { industry } = useIndustry();
  const data = content ?? industry.chat;

  const sectionRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [typedQuery, setTypedQuery] = useState("");
  const [typedFollowUp, setTypedFollowUp] = useState("");
  const [visibleConsidering, setVisibleConsidering] = useState(0);
  const [visibleConsidering2, setVisibleConsidering2] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
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
      setPhase("idle");
      setTypedQuery("");
      setTypedFollowUp("");
      setVisibleConsidering(0);
      setVisibleConsidering2(0);

      if (reducedMotion) {
        setPhase("responding-2");
        await wait(5000);
        if (cancelled) return;
        run();
        return;
      }

      await wait(700);
      if (cancelled) return;
      setPhase("cursor-moving");
      await wait(900);
      if (cancelled) return;
      setPhase("cursor-tap");
      await wait(180);
      if (cancelled) return;
      setPhase("chat-open");
      await wait(400);
      if (cancelled) return;
      setPhase("typing-query");

      for (let i = 1; i <= QUERY.length; i++) {
        if (cancelled) return;
        await wait(15);
        setTypedQuery(QUERY.slice(0, i));
      }
      await wait(280);
      if (cancelled) return;

      setPhase("sending");
      await wait(220);
      if (cancelled) return;

      setPhase("bubble-in");
      await wait(520);
      if (cancelled) return;

      setPhase("clearing-blur");
      await wait(520);
      if (cancelled) return;

      setPhase("investigating");
      await wait(360);
      if (cancelled) return;

      setPhase("considering");
      for (let i = 1; i <= CONSIDERING.length; i++) {
        if (cancelled) return;
        await wait(420);
        setVisibleConsidering(i);
      }
      await wait(500);
      if (cancelled) return;

      setPhase("responding");
      await wait(1400);
      if (cancelled) return;

      setPhase("typing-followup");
      for (let i = 1; i <= FOLLOW_UP.length; i++) {
        if (cancelled) return;
        await wait(28);
        setTypedFollowUp(FOLLOW_UP.slice(0, i));
      }
      await wait(280);
      if (cancelled) return;

      setPhase("sending-followup");
      await wait(220);
      if (cancelled) return;

      setPhase("bubble-in-2");
      await wait(420);
      if (cancelled) return;

      setPhase("investigating-2");
      await wait(360);
      if (cancelled) return;

      setPhase("considering-2");
      for (let i = 1; i <= CONSIDERING_2.length; i++) {
        if (cancelled) return;
        await wait(420);
        setVisibleConsidering2(i);
      }
      await wait(400);
      if (cancelled) return;

      setPhase("responding-2");
      await wait(1100);
      if (cancelled) return;

      setPhase("fading-out");
      await wait(900);
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
  }, [phase, visibleConsidering, visibleConsidering2]);

  // Phase predicates
  const blurActive = ["idle", "cursor-moving", "cursor-tap", "chat-open", "typing-query", "sending", "bubble-in", "fading-out"].includes(phase);
  const cursorVisible = ["cursor-moving", "cursor-tap"].includes(phase);
  const chatOpen = ![
    "idle", "cursor-moving", "cursor-tap", "fading-out",
  ].includes(phase);
  const newChatVisible = ["idle", "cursor-moving", "cursor-tap"].includes(phase);
  // Panel is small (input-only) until the first send fires
  const panelExpanded = ![
    "idle", "cursor-moving", "cursor-tap", "chat-open", "typing-query", "sending", "fading-out",
  ].includes(phase);
  const querySent = ["bubble-in", "clearing-blur", "investigating", "considering", "responding", "typing-followup", "sending-followup", "bubble-in-2", "investigating-2", "considering-2", "responding-2"].includes(phase);
  const investigatingVisible = ["investigating", "considering", "responding", "typing-followup", "sending-followup", "bubble-in-2", "investigating-2", "considering-2", "responding-2"].includes(phase);
  const responseVisible = ["responding", "typing-followup", "sending-followup", "bubble-in-2", "investigating-2", "considering-2", "responding-2"].includes(phase);
  const followUpBubbleVisible = ["bubble-in-2", "investigating-2", "considering-2", "responding-2"].includes(phase);
  const investigating2Visible = ["investigating-2", "considering-2", "responding-2"].includes(phase);
  const response2Visible = phase === "responding-2";

  // Map-overlay reveal predicates — each layer reveals when its matching
  // "deep reasoning" line appears in the chat.
  const inResponseFlow = [
    "considering",
    "responding",
    "typing-followup",
    "sending-followup",
    "bubble-in-2",
    "investigating-2",
    "considering-2",
    "responding-2",
  ].includes(phase);
  // Layer 1 (line index 3): metro stations + 1km service radii
  const stationsVisible = inResponseFlow && visibleConsidering >= 3;
  // Layer 2 (line index 4): qualifying parcels
  const parcelsVisible = inResponseFlow && visibleConsidering >= 4;
  // Round 2 filter: only the largeOnly parcels remain after the filter line appears
  const parcelsLargeOnly = visibleConsidering2 >= 1;


  const visualBlock = (
    <div
      ref={sectionRef}
      className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* Layer 0 — Madrid base map */}
      <Image
        src="/MadridMap.png"
        alt="Madrid metro area map"
        fill
        className="object-cover"
        priority
      />

      {/* Layer 0.5 — Madrid query answer overlay. Layers reveal one-by-one
          as each "deep reasoning" line appears in the chat. */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        aria-hidden
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Layer 1 — 1km service radius circles around each metro station */}
          {METRO_STATIONS.map((s, i) => (
            <circle
              key={`r-${i}`}
              cx={s.cx}
              cy={s.cy}
              r={STATION_RADIUS}
              fill="rgba(0, 102, 204, 0.14)"
              stroke="#0066CC"
              strokeWidth="0.18"
              strokeOpacity="0.55"
              style={{
                opacity: stationsVisible ? 1 : 0,
                transition: `opacity 360ms cubic-bezier(0.05, 0.7, 0.1, 1) ${i * 60}ms`,
              }}
            />
          ))}
        </svg>

        {/* Layer 1 — Metro station markers (DOM elements so they stay crisp) */}
        {METRO_STATIONS.map((s, i) => (
          <div
            key={`s-${i}`}
            className="absolute"
            style={{
              left: `${s.cx}%`,
              top: `${s.cy}%`,
              opacity: stationsVisible ? 1 : 0,
              transform: stationsVisible
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.6)",
              transition: `opacity 280ms cubic-bezier(0.05, 0.7, 0.1, 1) ${i * 60 + 120}ms, transform 320ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 60 + 120}ms`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full bg-white flex items-center justify-center"
              style={{
                border: "1.5px solid #DC2626",
                boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
              }}
            >
              <div className="w-[4px] h-[4px] rounded-full" style={{ background: "#DC2626" }} />
            </div>
          </div>
        ))}

        {/* Layer 2 — Qualifying parcels (small green squares inside the radii) */}
        {PARCELS.map((p, i) => {
          const visible = parcelsVisible && (!parcelsLargeOnly || p.largeOnly);
          return (
            <div
              key={`p-${i}`}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translate(-50%, -50%) scale(1)"
                  : "translate(-50%, -50%) scale(0.4)",
                transition: `opacity 280ms cubic-bezier(0.05, 0.7, 0.1, 1) ${i * 50}ms, transform 320ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 50}ms`,
              }}
            >
              <div
                className="w-2 h-2 rounded-[1px]"
                style={{
                  background: "#16a34a",
                  border: "1px solid white",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
                }}
              />
            </div>
          );
        })}

        {/* Legend pill — bottom-right corner of the visual */}
        <div
          className="absolute bottom-4 right-4 hidden md:inline-flex items-center gap-3 bg-white/95 shadow-md rounded-full px-3.5 py-1.5 text-[11px] font-medium text-[#0A1344]"
          style={{
            opacity: stationsVisible ? 1 : 0,
            transform: stationsVisible ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 320ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "white", border: "1.5px solid #DC2626" }}
            />
            Metro station
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: "rgba(0, 102, 204, 0.32)" }} />
            1km radius
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[1px]" style={{ background: "#16a34a" }} />
            Parcel
          </span>
        </div>
      </div>

      {/* Layer 1 — strong blur veil that clears once Columbus has answered */}
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

      {/* Layer 2 — Chat panel. Morphs through three states:
            1. idle:        centered narrow pill with "+ New chat" text
            2. pill input:  centered wide pill with "Ask Columbus" + send
            3. full panel:  bottom-left, conversation area + input
          Position, width, height, and content all transition between states. */}
      <div
        className="absolute z-20 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-md:left-[20px] max-md:right-[20px] max-md:w-auto"
        style={{
          left: panelExpanded
            ? "40px"
            : newChatVisible
              ? "calc(50% - 100px)"
              : "calc(50% - 230px)",
          top: panelExpanded ? "100px" : "calc(50% - 28px)",
          width: newChatVisible ? "200px" : "460px",
          height: panelExpanded ? "calc(100% - 140px)" : "56px",
          opacity: phase === "fading-out" ? 0 : 1,
          transform: `scale(${phase === "cursor-tap" ? 0.96 : 1})`,
          transition:
            "left 520ms cubic-bezier(0.05, 0.7, 0.1, 1), top 520ms cubic-bezier(0.05, 0.7, 0.1, 1), width 520ms cubic-bezier(0.05, 0.7, 0.1, 1), height 520ms cubic-bezier(0.05, 0.7, 0.1, 1), opacity 500ms ease, transform 180ms ease",
        }}
      >
        {/* Conversation area — visible only when expanded. */}
        <div
          ref={conversationRef}
          className="flex-1 overflow-y-auto px-5 pt-5 pb-3 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            opacity: panelExpanded ? 1 : 0,
            transition: "opacity 280ms ease 200ms",
          }}
        >
          {/* User message bubble */}
          <div
            className="flex justify-end"
            style={{
              opacity: querySent ? 1 : 0,
              transform: querySent ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 320ms ease, transform 320ms cubic-bezier(0.05, 0.7, 0.1, 1)",
            }}
          >
            <div className="max-w-[92%] bg-[#f0f0f3] text-[#1D1D1F] rounded-2xl px-4 py-3 text-[13px] leading-[1.5]">
              &ldquo;{QUERY}&rdquo;
            </div>
          </div>

          {/* Columbus deep reasoning header */}
          <div
            className="mt-4 flex items-center gap-2.5 text-[#5a5a63]"
            style={{
              opacity: investigatingVisible ? 1 : 0,
              transform: investigatingVisible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 250ms ease, transform 250ms ease",
            }}
          >
            <Image src="/logobueno.png" alt="" width={22} height={22} className="object-contain shrink-0" />
            <span className="text-[14px] font-medium">Columbus deep reasoning</span>
          </div>

          {/* Deep reasoning steps with green check when complete */}
          <div className="mt-3 pl-[32px] space-y-3">
            {CONSIDERING.map((line, i) => (
              <div
                key={line}
                className="flex items-center justify-between gap-3"
                style={{
                  opacity: visibleConsidering > i ? 1 : 0,
                  transform: visibleConsidering > i ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 260ms ease, transform 260ms ease",
                }}
              >
                <span className="text-[13px] text-[#6b6b73] leading-[1.4]">{line}</span>
                <svg viewBox="0 0 16 16" width="14" height="14" className="shrink-0" aria-hidden>
                  <circle cx="8" cy="8" r="7" fill="#16a34a" />
                  <path d="M5 8.2 L7.1 10.3 L11 6.4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>

          {/* Response */}
          <div
            className="mt-4 text-[13px] leading-[1.55] text-[#1D1D1F]"
            style={{
              opacity: responseVisible ? 1 : 0,
              transform: responseVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 380ms ease, transform 380ms cubic-bezier(0.05, 0.7, 0.1, 1)",
            }}
          >
            {RESPONSE}
          </div>

          {/* Follow-up user bubble */}
          <div
            className="mt-4 flex justify-end"
            style={{
              opacity: followUpBubbleVisible ? 1 : 0,
              transform: followUpBubbleVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 320ms ease, transform 320ms cubic-bezier(0.05, 0.7, 0.1, 1)",
            }}
          >
            <div className="max-w-[92%] bg-[#f0f0f3] text-[#1D1D1F] rounded-2xl px-4 py-3 text-[13px] leading-[1.5]">
              {FOLLOW_UP}
            </div>
          </div>

          {/* Columbus deep reasoning — round 2 */}
          <div
            className="mt-4 flex items-center gap-2.5 text-[#5a5a63]"
            style={{
              opacity: investigating2Visible ? 1 : 0,
              transform: investigating2Visible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 250ms ease, transform 250ms ease",
            }}
          >
            <Image src="/logobueno.png" alt="" width={22} height={22} className="object-contain shrink-0" />
            <span className="text-[14px] font-medium">Columbus deep reasoning</span>
          </div>

          {/* Deep reasoning steps with green check — round 2 */}
          <div className="mt-3 pl-[32px] space-y-3">
            {CONSIDERING_2.map((line, i) => (
              <div
                key={line}
                className="flex items-center justify-between gap-3"
                style={{
                  opacity: visibleConsidering2 > i ? 1 : 0,
                  transform: visibleConsidering2 > i ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 260ms ease, transform 260ms ease",
                }}
              >
                <span className="text-[13px] text-[#6b6b73] leading-[1.4]">{line}</span>
                <svg viewBox="0 0 16 16" width="14" height="14" className="shrink-0" aria-hidden>
                  <circle cx="8" cy="8" r="7" fill="#16a34a" />
                  <path d="M5 8.2 L7.1 10.3 L11 6.4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>

          {/* Response — round 2 */}
          <div
            className="mt-4 text-[13px] leading-[1.55] text-[#1D1D1F]"
            style={{
              opacity: response2Visible ? 1 : 0,
              transform: response2Visible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 380ms ease, transform 380ms cubic-bezier(0.05, 0.7, 0.1, 1)",
            }}
          >
            {RESPONSE_2}
          </div>
        </div>

        {/* Input bar — morphs from "+ New chat" (idle pill) to a chat input
            with "Ask Columbus" placeholder + send button (pill input / panel). */}
        <div className="absolute bottom-0 left-0 right-0 h-14 flex items-center px-5">
          {/* "+ New chat" text — visible during idle, fades on tap */}
          <div
            className="absolute inset-0 flex items-center justify-center text-[15px] font-medium text-[#1D1D1F]"
            style={{
              opacity: newChatVisible ? 1 : 0,
              transition: "opacity 220ms ease",
              pointerEvents: "none",
            }}
            aria-hidden
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-[#0A1344] text-white text-[12px] leading-4 text-center">+</span>
              New chat
            </span>
          </div>

          {/* Chat input + send button — visible after the pill morphs */}
          <div
            className="flex items-center gap-3 w-full"
            style={{
              opacity: newChatVisible ? 0 : 1,
              transition: "opacity 220ms ease 160ms",
            }}
          >
            <div className="flex-1 text-[14px] leading-[1.4] text-[#1D1D1F] min-h-[32px] flex items-center overflow-hidden">
              {phase === "typing-query" || phase === "sending" ? (
                <span className="text-[#1D1D1F] truncate">
                  {typedQuery}
                  <span className="inline-block w-0.5 h-4 bg-[#1D1D1F] ml-0.5 align-middle animate-pulse" />
                </span>
              ) : phase === "typing-followup" || phase === "sending-followup" ? (
                <span className="text-[#1D1D1F] truncate">
                  {typedFollowUp}
                  {phase === "typing-followup" && (
                    <span className="inline-block w-0.5 h-4 bg-[#1D1D1F] ml-0.5 align-middle animate-pulse" />
                  )}
                </span>
              ) : (
                <span className="text-[#a0a0a8]">Ask Columbus…</span>
              )}
            </div>
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-[#e8e8ec]"
              aria-hidden
            >
              <div className="w-3 h-3 rounded-[2px] bg-[#0A1344]" />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer — top-right, always visible across all phases */}
      <div
        className="absolute top-3 right-3 z-30 text-[11px] font-medium text-white/80 italic pointer-events-none"
        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.45)" }}
      >
        Not real results, simplified
      </div>

      {/* Layer 3 — animated cursor (moves toward the centered "+ New chat" pill) */}
      <div
        className="absolute z-40 pointer-events-none"
        style={{
          opacity: cursorVisible ? 1 : 0,
          left: cursorVisible ? "calc(50% - 8px)" : "calc(100% - 80px)",
          top: cursorVisible ? "calc(50% - 4px)" : "calc(100% - 80px)",
          transform: `scale(${phase === "cursor-tap" ? 0.85 : 1})`,
          transition:
            "left 760ms cubic-bezier(0.22, 1, 0.36, 1), top 760ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease, transform 140ms ease",
        }}
        aria-hidden
      >
        {CURSOR_GLYPH}
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
