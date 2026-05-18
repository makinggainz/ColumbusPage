"use client";

/**
 * MapsGPT Hero — ported from the PolarX project's hero.
 *
 *   • Hero header — a normal-flow section over the light pastel Elio
 *     background; dark content stack in the upper third; extends up
 *     behind the floating navbar; scrolls up and away (diagonal seam).
 *   • Sticky device stage — a coloured backdrop (warm → navy → light)
 *     revealed beneath the header; a BARE 3D phone device that snaps
 *     through four discrete poses; an Ask · Discover · Go pill row that
 *     recolours per scene; per-scene labels (~2 each) that RISE from the
 *     bottom of the viewport; floating photo-cards on the final scene.
 *
 * Lives inside the site PageFrame (fills frame width). On-page copy is
 * MapsGPT's own. Restyled to design-system/products-page.md.
 */

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import MapsGPTGlobe from "@/components/products/MapsGPTGlobe";

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

// PolarX phone-snap spring; PolarX appear-animation spring.
const SNAP = "transform 0.45s cubic-bezier(0.32, 1.15, 0.5, 1)";
const APPEAR = "cubic-bezier(0.22, 1.4, 0.36, 1)";

// Pull the hero up behind the floating navbar (business-hero pattern).
const NAV_PULL = 120;
// Diagonal cut at the header's bottom edge (the hero→scene seam).
const SEAM = 104;

// ── Three scenes — ink + pill styling per phase ──────────────────────
const SCENES = [
  { ink: "#063140", eyebrow: "#00838F", pillBg: "#063140", pillText: "#FFFFFF", pillRot: "-4deg", pillIdle: "rgba(6,49,64,0.40)" },
  { ink: "#FFFFFF", eyebrow: "#8DF7FF", pillBg: "#00B1D4", pillText: "#04222C", pillRot: "-4deg", pillIdle: "rgba(255,255,255,0.50)" },
  { ink: "#063140", eyebrow: "#00838F", pillBg: "#0F6B6E", pillText: "#FFFFFF", pillRot: "-5deg", pillIdle: "rgba(6,49,64,0.40)" },
] as const;

const CREAM = "linear-gradient(180deg, #F7F2E4 0%, #EFE7D2 100%)";
const NAVY = "linear-gradient(180deg, #063140 0%, #03202A 100%)";
const LIGHT = "linear-gradient(180deg, #FFFFFF 0%, #E6F4F5 100%)";

const PILL_WORDS = ["Ask", "Discover", "Go"] as const;

// ── Phone pose — 4 discrete states (PolarX: intro / Plan / Track / Relive) ──
function phoneStates(isLg: boolean) {
  const sx = isLg ? 1 : 0.42;
  const introScale = isLg ? 1.4 : 1.12;
  const goScale = isLg ? 0.7 : 0.78;
  // Mobile: lift the phone into the upper half so the rising labels
  // have a clear band below it (desktop keeps PolarX's exact values).
  const lift = isLg ? 0 : -160;
  const goY = isLg ? 50 : -110;
  return [
    `perspective(1200px) translateX(0px) translateY(-40px) scale(${introScale}) rotateX(40deg) rotateY(0deg)`,
    `perspective(1200px) translateX(${-140 * sx}px) translateY(${lift}px) scale(1) rotateX(0deg) rotateY(${20 * sx}deg)`,
    `perspective(1200px) translateX(${140 * sx}px) translateY(${lift}px) scale(1) rotateX(0deg) rotateY(${-20 * sx}deg)`,
    `perspective(1200px) translateX(0px) translateY(${goY}px) scale(${goScale}) rotateX(0deg) rotateY(0deg)`,
  ];
}

// ── Per-scene labels — 2 per scene; each rises through the viewport ──
// `win` = scroll-progress sub-window over which the label travels from
// below-centre → centre → above-centre. `scene` 1|2|3 picks SCENES ink.
const LABELS = [
  { scene: 1, side: "right", eyebrow: "Ask anything", heading: "Chat your way around any city.", win: [0.3, 0.45] },
  { scene: 1, side: "right", eyebrow: "Plain language", heading: "No filters, no menus — just ask.", win: [0.38, 0.53] },
  { scene: 2, side: "left", eyebrow: "Discover", heading: "Find the places worth your time.", win: [0.53, 0.68] },
  { scene: 2, side: "left", eyebrow: "Local-grade picks", heading: "Ranked by people who actually went.", win: [0.61, 0.76] },
  { scene: 3, side: "left", eyebrow: "Get going", heading: "Directions the second you decide.", win: [0.76, 0.9] },
  { scene: 3, side: "right", eyebrow: "On the move", heading: "Your route recalculated as you wander.", win: [0.84, 1.0] },
] as const;

const CARDS = [
  { img: "/blog-himalaya.jpg", label: "Annapurna, NP", x: -452, y: -158, rot: -6, bob: 0 },
  { img: "/amazonia.jpg", label: "Amazon Basin", x: -416, y: 168, rot: 5, bob: 1.1 },
  { img: "/BoatHero.jpg", label: "Old Harbor", x: 452, y: -188, rot: 6, bob: 0.6 },
  { img: "/blog-misty-forest.jpg", label: "Cloud Forest", x: 426, y: 158, rot: -5, bob: 1.6 },
];

export default function Hero() {
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isLg, setIsLg] = useState(true);

  const outerRef = useRef<HTMLDivElement>(null);
  const riseRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);
  const isLgRef = useRef(true);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const check = () => {
      const lg = window.innerWidth >= 1024;
      isLgRef.current = lg;
      setIsLg(lg);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 90);
    return () => clearTimeout(t);
  }, []);

  const onScroll = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    const vh = window.innerHeight;
    const range = el.offsetHeight - vh;
    const progress = range > 0 ? clamp(-el.getBoundingClientRect().top / range, 0, 1) : 0;

    const next = progress < 0.3 ? 0 : progress < 0.53 ? 1 : progress < 0.76 ? 2 : 3;
    if (next !== phaseRef.current) {
      phaseRef.current = next;
      setPhase(next);
    }

    // Intro: phone rises into frame from below.
    const rise = riseRef.current;
    if (rise) {
      const ty = progress < 0.3 ? lerp(540, 0, smoothstep(0, 0.3, progress)) : 0;
      rise.style.transform = `translateY(${ty}px)`;
    }

    // Labels: each rises below-centre → centre → above-centre over its
    // window, fading + scaling by distance from centre (PolarX feel).
    const lg = isLgRef.current;
    const RISE = vh * (lg ? 0.42 : 0.15);
    const base = lg ? "translate(0,-50%)" : "translate(-50%,-50%)";
    for (let i = 0; i < LABELS.length; i++) {
      const node = labelRefs.current[i];
      if (!node) continue;
      const [s, e] = LABELS[i].win;
      const p = clamp((progress - s) / (e - s), 0, 1);
      const d = (p - 0.5) * 2; // −1 below · 0 centre · +1 above
      const f = 1 - smoothstep(0.4, 1, Math.abs(d));
      node.style.transform = `${base} translateY(${(-d * RISE).toFixed(1)}px) scale(${(0.5 + 0.5 * f).toFixed(3)})`;
      node.style.opacity = f.toFixed(3);
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        onScroll();
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onScroll]);

  const phoneW = isLg ? 296 : 210;
  const phoneH = Math.round(phoneW * 1.926);
  const states = phoneStates(isLg);
  const scene = SCENES[clamp(phase - 1, 0, 2)];
  const inDevice = phase >= 1;

  return (
    <div
      ref={outerRef}
      data-hero-section
      data-hero-outer
      className="relative lg:h-[440vh] h-[380vh]"
      style={{ marginTop: -NAV_PULL }}
    >
      {/* ════ Coloured scene backdrop — pinned, revealed as the header scrolls off ════ */}
      <div className="absolute inset-0 z-0">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          <div className="absolute inset-0" style={{ background: CREAM }} />
          <div
            className="absolute inset-0"
            style={{ background: NAVY, opacity: phase === 2 ? 1 : 0, transition: "opacity 0.7s cubic-bezier(0.44,0,0.56,1)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: LIGHT, opacity: phase === 3 ? 1 : 0, transition: "opacity 0.7s cubic-bezier(0.44,0,0.56,1)" }}
          />
        </div>
      </div>

      {/* ════ Phone · labels · cards · pill row — pinned ════ */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          {/* Floating photo-cards — Go scene only */}
          {isLg &&
            CARDS.map((c, i) => {
              const on = phase === 3;
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate(${c.x}px, ${c.y + (on ? 0 : 34)}px) rotate(${c.rot}deg)`,
                    opacity: on ? 1 : 0,
                    transition: `opacity 0.55s ease ${i * 70}ms, transform 0.7s ${APPEAR} ${i * 70}ms`,
                  }}
                >
                  <div style={{ animation: `mgHeroBob 5s ease-in-out ${c.bob}s infinite` }}>
                    <PhotoCard img={c.img} label={c.label} />
                  </div>
                </div>
              );
            })}

          {/* Per-scene labels — rise from the bottom (transform/opacity set in onScroll) */}
          {LABELS.map((lab, i) => {
            const sc = SCENES[lab.scene - 1];
            const pos: React.CSSProperties = isLg
              ? lab.side === "right"
                ? { top: "50%", left: "calc(50% + 170px)", width: 356 }
                : { top: "50%", right: "calc(50% + 170px)", width: 356, textAlign: "right" }
              : { top: "75%", left: "50%", width: "min(440px, 86vw)", textAlign: "center" };
            return (
              <div
                key={i}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="absolute"
                style={{ ...pos, opacity: 0, willChange: "transform, opacity" }}
              >
                <div
                  style={{
                    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: sc.eyebrow,
                  }}
                >
                  {lab.eyebrow}
                </div>
                <h2
                  style={{
                    marginTop: 12,
                    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: isLg ? 40 : 25,
                    fontWeight: 700,
                    lineHeight: 1.22,
                    letterSpacing: "-0.02em",
                    color: sc.ink,
                  }}
                >
                  {lab.heading}
                </h2>
              </div>
            );
          })}

          {/* The bare 3D phone */}
          <div ref={riseRef} className="absolute inset-0" style={{ willChange: "transform" }}>
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) perspective(1200px) rotateX(${mounted ? 0 : 30}deg) translateY(${
                  mounted ? 0 : 150
                }px)`,
                opacity: mounted ? 1 : 0,
                transition: `transform 1.5s ${APPEAR} 0.15s, opacity 0.9s ease 0.15s`,
              }}
            >
              <div style={{ transform: states[phase], transition: SNAP, willChange: "transform" }}>
                {/* Bare device — cyan glass bezel + neutral screen.
                    The inner screen <div> is the single swap point for
                    future screen content (image / video / markup). */}
                <div
                  style={{
                    width: phoneW,
                    height: phoneH,
                    boxSizing: "border-box",
                    borderRadius: 44,
                    padding: 8,
                    background: "rgba(150,225,255,0.20)",
                    border: "1px solid rgba(150,200,220,0.35)",
                    boxShadow:
                      "0 2px 2px -0.25px rgba(0,0,0,0.08), 0 6px 6px -1px rgba(0,0,0,0.08), " +
                      "0 16px 16px -1.5px rgba(0,0,0,0.09), 0 27px 27px -1.75px rgba(0,0,0,0.10), " +
                      "0 50px 50px -2px rgba(0,40,60,0.18)",
                  }}
                >
                  {/* ▼ screen — swap point */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 36,
                      background: "linear-gradient(180deg, #FFFFFF 0%, #EAF4F5 100%)",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ASK · DISCOVER · GO pill row */}
          <div
            className="absolute left-1/2 flex items-center"
            style={{
              bottom: "clamp(28px, 5.5vh, 64px)",
              transform: "translateX(-50%)",
              gap: 6,
              opacity: inDevice ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            {PILL_WORDS.map((word, i) => {
              const on = phase === i + 1;
              return (
                <div key={word} className="flex items-center" style={{ gap: 6 }}>
                  <span
                    style={{
                      fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: isLg ? 19 : 16,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      padding: "6px 16px",
                      borderRadius: 8,
                      backgroundColor: on ? scene.pillBg : "transparent",
                      color: on ? scene.pillText : scene.pillIdle,
                      transform: on ? `rotate(${scene.pillRot})` : "rotate(0deg)",
                      transition:
                        "background-color 0.45s ease, color 0.45s ease, transform 0.45s cubic-bezier(0.2,0.8,0.2,1)",
                    }}
                  >
                    {word}
                  </span>
                  {i < PILL_WORDS.length - 1 && (
                    <span style={{ color: scene.pillIdle, fontWeight: 600, transition: "color 0.45s ease" }}>·</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════ Hero header — normal flow over the Elio image; scrolls away ════ */}
      <header
        className="relative z-20 flex flex-col items-center"
        style={{
          height: "100dvh",
          width: "100%",
          paddingTop: "clamp(150px, 18vh, 210px)",
          clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${SEAM}px), 0 100%)`,
        }}
      >
        {/* Light pastel Elio background + soft legibility wash */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <Image src="/eliocardbackground.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.28) 30%, " +
                "rgba(255,255,255,0.06) 58%, rgba(255,255,255,0) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(247,242,228,0.6) 0%, rgba(247,242,228,0) 22%)" }}
          />
        </div>

        {/* Content stack — dark teal, upper third */}
        <div className="relative flex flex-col items-center text-center px-6" style={{ maxWidth: 820, gap: 30 }}>
          <Stagger show={mounted} delay={100} y={56}>
            <div
              className="flex items-center"
              style={{ flexDirection: isLg ? "row" : "column", gap: isLg ? 26 : 8, color: "rgba(6,49,64,0.80)" }}
            >
              <Badge>Powered by Columbus‑01</Badge>
              <Badge>Your AI travel guide</Badge>
            </div>
          </Stagger>

          <Stagger show={mounted} delay={210} y={84}>
            <div className="flex flex-col items-center" style={{ gap: 16 }}>
              <div className="flex items-center gap-2" style={{ color: "#063140" }}>
                <MapsGPTGlobe size={isLg ? 30 : 26} />
                <span
                  style={{
                    fontFamily: '"SF Compact", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: isLg ? 23 : 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  MapsGPT
                </span>
              </div>
              <h1
                style={{
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: "clamp(38px, 5.6vw, 66px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#063140",
                }}
              >
                One travel app for
                <br />
                everywhere you go
              </h1>
              <p
                style={{
                  width: "86%",
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: isLg ? 20 : 16,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  letterSpacing: "-0.01em",
                  color: "rgba(6,49,64,0.78)",
                }}
              >
                Join the travelers who <Mark>ask</Mark>, <Mark>discover</Mark> and{" "}
                <Mark>go</Mark> with an AI guide that knows every street on Earth.
              </p>
            </div>
          </Stagger>

          <Stagger show={mounted} delay={330} y={84}>
            <div className="flex flex-wrap items-center justify-center" style={{ gap: 16 }}>
              <a
                href="#section-see-what-people"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  height: 54,
                  padding: "0 26px",
                  borderRadius: 999,
                  background: "#063140",
                  color: "#FFFFFF",
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  textDecoration: "none",
                  boxShadow: "0 14px 30px -12px rgba(6,49,64,0.35)",
                  transition: "transform 0.25s cubic-bezier(0.25,1,0.5,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <span style={{ fontSize: 15 }}>↓</span>
                Get the app
              </a>
              <div className="flex items-center" style={{ gap: 8 }}>
                <div className="flex items-center" style={{ gap: 2, color: "#FFC53D" }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} style={{ fontSize: 16 }}>
                      ★
                    </span>
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "rgba(6,49,64,0.62)",
                  }}
                >
                  4.8 · 12K RATINGS
                </span>
              </div>
            </div>
          </Stagger>
        </div>

        {/* Explore cue */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{
            bottom: SEAM + 22,
            color: "rgba(6,49,64,0.66)",
            opacity: mounted && phase === 0 ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <span style={{ animation: "mgHeroNudge 1.6s ease-in-out infinite", fontSize: 15 }}>↓</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em" }}>EXPLORE THE APP</span>
        </div>
      </header>

      {/* ════ Device section — scroll length for the pinned stage ════ */}
      <section className="relative z-10 lg:h-[340vh] h-[280vh]" style={{ width: "100%" }} />

      <style>{`
        @keyframes mgHeroBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes mgHeroNudge { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
      `}</style>
    </div>
  );
}

// ── Staged spring entrance ───────────────────────────────────────────
function Stagger({ show, delay, y, children }: { show: boolean; delay: number; y: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : `translateY(${y}px)`,
        transition: `transform 1.1s ${APPEAR} ${delay}ms, opacity 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Laurel-flanked badge ─────────────────────────────────────────────
function Laurel({ flip }: { flip?: boolean }) {
  return (
    <svg width="16" height="32" viewBox="0 0 16 32" style={{ transform: flip ? "scaleX(-1)" : undefined, flexShrink: 0 }}>
      <path d="M12 3 C 6 10, 5 22, 8 30" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <g fill="currentColor">
        <ellipse cx="9" cy="8" rx="3.2" ry="1.6" transform="rotate(-32 9 8)" />
        <ellipse cx="6.6" cy="14" rx="3.4" ry="1.7" transform="rotate(-12 6.6 14)" />
        <ellipse cx="6.2" cy="20" rx="3.4" ry="1.7" transform="rotate(8 6.2 20)" />
        <ellipse cx="7.6" cy="25.5" rx="3" ry="1.5" transform="rotate(26 7.6 25.5)" />
      </g>
    </svg>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 4 }}>
      <Laurel />
      <span
        style={{
          fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <Laurel flip />
    </div>
  );
}

// ── Inline highlight ─────────────────────────────────────────────────
function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: "#063140",
        color: "#FFFFFF",
        borderRadius: 6,
        padding: "1px 8px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// ── Floating photo-card ──────────────────────────────────────────────
function PhotoCard({ img, label }: { img: string; label: string }) {
  return (
    <div
      style={{
        width: 168,
        borderRadius: 18,
        overflow: "hidden",
        background: "#FFFFFF",
        border: "1px solid rgba(150,200,220,0.4)",
        boxShadow: "0 22px 44px -16px rgba(0,40,60,0.4)",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 196 }}>
        <Image src={img} alt={label} fill sizes="168px" style={{ objectFit: "cover" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 11px 11px" }}>
        <span style={{ fontSize: 11 }}>📍</span>
        <span
          style={{
            fontFamily: '"SF Pro", -apple-system, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#063140",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
