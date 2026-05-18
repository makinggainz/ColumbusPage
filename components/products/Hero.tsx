"use client";

/**
 * MapsGPT Hero — ported from the PolarX project's hero.
 *
 * Faithful to PolarX's layout + scroll choreography:
 *   • Hero header — centered stack (wordmark → headline → paragraph →
 *     button + rating) over a full-bleed photo.
 *   • Sticky device section — a 3D phone PINS and SNAPS through four
 *     discrete poses while the BACKDROP cross-fades through three scenes
 *     (warm → navy → light), an ASK · DISCOVER · GO pill row recolours
 *     per scene, and a per-phase eyebrow + heading reads beside the phone.
 *   • Floating photo-cards scatter in only on the final scene.
 *
 * The hero lives inside the site PageFrame, so it fills the frame width
 * (100%, not 100vw) and lets the frame handle the inset + rounded corners.
 *
 * On-page copy is MapsGPT's own (this is the MapsGPT product page).
 * Restyled to design-system/products-page.md — teal/cyan, SF Pro, no purple.
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

const SNAP = "transform 0.5s cubic-bezier(0.32, 1.15, 0.5, 1)"; // PolarX phone spring
const APPEAR = "cubic-bezier(0.22, 1.4, 0.36, 1)"; // PolarX appear-animation spring

// ── Three scenes — backdrop, ink, and pill styling per phase ─────────
// Mirrors PolarX's cream→navy→white scene system, palette-mapped to the
// /products design system (teal/cyan).
const SCENES = [
  {
    // 1 — Ask (warm light)
    bg: "linear-gradient(180deg, #F7F2E4 0%, #EFE7D2 100%)",
    ink: "#063140",
    eyebrow: "#00838F",
    pillBg: "#063140",
    pillText: "#FFFFFF",
    pillRot: "-4deg",
    pillIdle: "rgba(6,49,64,0.40)",
  },
  {
    // 2 — Discover (navy)
    bg: "linear-gradient(180deg, #063140 0%, #03202A 100%)",
    ink: "#FFFFFF",
    eyebrow: "#8DF7FF",
    pillBg: "#00B1D4",
    pillText: "#04222C",
    pillRot: "-4deg",
    pillIdle: "rgba(255,255,255,0.50)",
  },
  {
    // 3 — Go (light)
    bg: "linear-gradient(180deg, #FFFFFF 0%, #E6F4F5 100%)",
    ink: "#063140",
    eyebrow: "#00838F",
    pillBg: "#0F6B6E",
    pillText: "#FFFFFF",
    pillRot: "-5deg",
    pillIdle: "rgba(6,49,64,0.40)",
  },
] as const;

const PILL_WORDS = ["Ask", "Discover", "Go"] as const;

// ── Phone pose — 4 discrete states (PolarX: intro / Plan / Track / Relive) ──
function phoneStates(isLg: boolean) {
  const sx = isLg ? 1 : 0.42;
  return [
    `perspective(1200px) translateY(54px) scale(${isLg ? 1.3 : 1.06}) rotateX(40deg)`,
    `perspective(1200px) translateX(${-140 * sx}px) scale(1) rotateY(${20 * sx}deg)`,
    `perspective(1200px) translateX(${140 * sx}px) scale(1) rotateY(${-20 * sx}deg)`,
    `perspective(1200px) translateY(48px) scale(${isLg ? 0.7 : 0.78})`,
  ];
}

// ── Per-phase eyebrow + heading ──────────────────────────────────────
const PANELS = [
  { eyebrow: "Ask anything", heading: "Chat your way around any city.", side: "right" },
  { eyebrow: "Discover", heading: "Find the places worth your time.", side: "left" },
  { eyebrow: "Get going", heading: "Directions the second you decide.", side: "above" },
] as const;

// ── Floating photo-cards — final (Go) scene only ─────────────────────
const CARDS = [
  { img: "/blog-himalaya.jpg", label: "Annapurna, NP", x: -452, y: -158, rot: -6, bob: 0 },
  { img: "/amazonia.jpg", label: "Amazon Basin", x: -416, y: 168, rot: 5, bob: 1.1 },
  { img: "/BoatHero.jpg", label: "Old Harbor", x: 452, y: -188, rot: 6, bob: 0.6 },
  { img: "/blog-misty-forest.jpg", label: "Cloud Forest", x: 426, y: 158, rot: -5, bob: 1.6 },
];

export default function Hero() {
  const [phase, setPhase] = useState(0); // 0 intro · 1 Ask · 2 Discover · 3 Go
  const [mounted, setMounted] = useState(false);
  const [isLg, setIsLg] = useState(true);

  const outerRef = useRef<HTMLDivElement>(null);
  const riseRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const check = () => setIsLg(window.innerWidth >= 1024);
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
    const range = el.offsetHeight - window.innerHeight;
    const progress = range > 0 ? clamp(-el.getBoundingClientRect().top / range, 0, 1) : 0;

    const next = progress < 0.3 ? 0 : progress < 0.53 ? 1 : progress < 0.76 ? 2 : 3;
    if (next !== phaseRef.current) {
      phaseRef.current = next;
      setPhase(next);
    }

    const rise = riseRef.current;
    if (rise) {
      const ty = progress < 0.3 ? lerp(236, 0, smoothstep(0, 0.3, progress)) : 0;
      rise.style.transform = `translateY(${ty}px)`;
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
  // The active scene (phases 1-3); phase 0 has no scene (photo header).
  const scene = SCENES[clamp(phase - 1, 0, 2)];
  const inDevice = phase >= 1;

  return (
    <div ref={outerRef} data-hero-outer className="relative lg:h-[440vh] h-[380vh]" style={{ marginTop: -32 }}>
      {/* ════ Backdrop stage — pinned, cross-fades photo → 3 scenes ════ */}
      <div className="absolute inset-0 z-0">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          {/* Photo (phase 0) */}
          <div className="absolute inset-0" style={{ opacity: phase === 0 ? 1 : 0, transition: "opacity 0.8s ease" }}>
            <Image src="/Gtestlast.jpeg" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.28) 40%, " +
                  "rgba(247,242,228,0.10) 66%, rgba(247,242,228,0.85) 100%)",
              }}
            />
          </div>
          {/* Three scenes */}
          {SCENES.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                background: s.bg,
                opacity: phase === i + 1 ? 1 : 0,
                transition: "opacity 0.7s cubic-bezier(0.44,0,0.56,1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ════ Phone · cards · headings · pill row — pinned ════ */}
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
                    transform: `translate(-50%, -50%) translate(${c.x}px, ${
                      c.y + (on ? 0 : 34)
                    }px) rotate(${c.rot}deg)`,
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

          {/* Per-phase eyebrow + heading */}
          {PANELS.map((panel, i) => {
            const active = phase === i + 1;
            const sc = SCENES[i];
            const pos: React.CSSProperties = !isLg
              ? { left: "50%", top: "13%", transform: "translateX(-50%)", width: "min(440px,86vw)", textAlign: "center" }
              : panel.side === "right"
                ? { left: "calc(50% + 170px)", top: "50%", transform: "translateY(-50%)", width: 356 }
                : panel.side === "left"
                  ? { right: "calc(50% + 170px)", top: "50%", transform: "translateY(-50%)", width: 356, textAlign: "right" }
                  : { left: "50%", top: "15%", transform: "translateX(-50%)", width: 460, textAlign: "center" };
            return (
              <div key={i} className="absolute" style={{ ...pos, opacity: active ? 1 : 0, transition: "opacity 0.5s ease" }}>
                <div style={{ transform: active ? "translateY(0)" : "translateY(16px)", transition: `transform 0.6s ${APPEAR}` }}>
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
                    {panel.eyebrow}
                  </div>
                  <h2
                    style={{
                      marginTop: 12,
                      fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: isLg ? 40 : 26,
                      fontWeight: 700,
                      lineHeight: 1.25,
                      letterSpacing: "-0.02em",
                      color: sc.ink,
                    }}
                  >
                    {panel.heading}
                  </h2>
                </div>
              </div>
            );
          })}

          {/* The 3D phone */}
          <div ref={riseRef} className="absolute inset-0" style={{ willChange: "transform" }}>
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) perspective(1200px) rotateX(${
                  mounted ? 0 : 30
                }deg) translateY(${mounted ? 0 : 150}px)`,
                opacity: mounted ? 1 : 0,
                transition: `transform 1.5s ${APPEAR} 0.15s, opacity 0.9s ease 0.15s`,
              }}
            >
              <div style={{ transform: states[phase], transition: SNAP, willChange: "transform" }}>
                <div style={{ position: "relative", width: phoneW, height: phoneH }}>
                  <Image
                    src="/MapsGPTMobile.png"
                    width={phoneW}
                    height={phoneH}
                    alt="MapsGPT app"
                    priority
                    style={{
                      borderRadius: 44,
                      display: "block",
                      boxShadow:
                        "0 2px 2px -0.25px rgba(0,0,0,0.08), 0 6px 6px -1px rgba(0,0,0,0.08), " +
                        "0 16px 16px -1.5px rgba(0,0,0,0.09), 0 27px 27px -1.75px rgba(0,0,0,0.10), " +
                        "0 50px 50px -2px rgba(0,40,60,0.18)",
                    }}
                  />
                  <PhoneOverlay phase={phase} />
                </div>
              </div>
            </div>
          </div>

          {/* ASK · DISCOVER · GO pill row — recolours per scene */}
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

      {/* ════ Header content — scrolls away ════ */}
      <header
        className="relative z-20 flex flex-col items-center justify-center"
        style={{ height: "100dvh", width: "100%", paddingBottom: "8vh" }}
      >
        <div className="relative flex flex-col items-center text-center px-6" style={{ maxWidth: 820, gap: 32 }}>
          <Stagger show={mounted} delay={120} y={70}>
            <div className="flex items-center gap-2" style={{ color: "#063140" }}>
              <MapsGPTGlobe size={isLg ? 32 : 28} />
              <span
                style={{
                  fontFamily: '"SF Compact", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: isLg ? 25 : 21,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                MapsGPT
              </span>
            </div>
          </Stagger>

          <Stagger show={mounted} delay={220} y={90}>
            <div className="flex flex-col items-center" style={{ gap: 16 }}>
              <h1
                style={{
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: "clamp(36px, 5.4vw, 64px)",
                  fontWeight: 700,
                  lineHeight: 1.12,
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
                  width: "84%",
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

          <Stagger show={mounted} delay={340} y={90}>
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
                  boxShadow: "0 12px 26px -10px rgba(6,49,64,0.6)",
                  transition: "transform 0.25s cubic-bezier(0.25,1,0.5,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <span style={{ fontSize: 15 }}>↓</span>
                Get the app
              </a>
              <div className="flex items-center" style={{ gap: 8 }}>
                <div className="flex items-center" style={{ gap: 2, color: "#E46962" }}>
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

        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ bottom: 24, color: "#063140", opacity: mounted && phase === 0 ? 0.5 : 0, transition: "opacity 0.5s ease" }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em" }}>SCROLL</span>
          <span style={{ animation: "mgHeroNudge 1.6s ease-in-out infinite" }}>↓</span>
        </div>
      </header>

      {/* ════ Device section — scroll length for the pinned stage ════ */}
      <section className="relative z-10 lg:h-[340vh] h-[280vh]" style={{ width: "100%" }} />

      <style>{`
        @keyframes mgHeroBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes mgHeroNudge { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
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

// ── In-phone overlay — one card per phase ────────────────────────────
function PhoneOverlay({ phase }: { phase: number }) {
  const cards = [
    null,
    <div key="ask" style={ovWrap()}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#00B1D4", letterSpacing: "0.04em" }}>YOU ASKED</div>
      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500, color: "#063140", lineHeight: 1.35 }}>
        Rooftop bars with a view, open late?
      </div>
    </div>,
    <div key="disc" style={ovWrap()}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 13 }}>📍</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#063140" }}>Le Perchoir</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#E46962", marginLeft: "auto" }}>★ 4.7</span>
      </div>
      <div style={{ marginTop: 3, fontSize: 11, fontWeight: 500, color: "#0F6B6E" }}>Rooftop bar · 4 min away</div>
    </div>,
    <div key="go" style={ovWrap()}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "#00B1D4", flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#063140" }}>12 min</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: "#0F6B6E" }}>· walking route</span>
      </div>
      <div style={{ marginTop: 4, fontSize: 11, fontWeight: 500, color: "rgba(6,49,64,0.55)" }}>
        Head out — your route is ready.
      </div>
    </div>,
  ];
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 44, overflow: "hidden", pointerEvents: "none" }}>
      {cards.map((card, i) =>
        card ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "7%",
              right: "7%",
              top: "20%",
              opacity: phase === i ? 1 : 0,
              transform: phase === i ? "translateY(0) scale(1)" : "translateY(14px) scale(0.92)",
              transition: `opacity 0.4s ease, transform 0.5s ${APPEAR}`,
            }}
          >
            {card}
          </div>
        ) : null,
      )}
    </div>
  );
}

function ovWrap(): React.CSSProperties {
  return {
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    border: "1px solid rgba(150,200,220,0.5)",
    borderRadius: 14,
    padding: "10px 12px",
    boxShadow: "0 10px 24px -8px rgba(0,40,60,0.4)",
    fontFamily: '"SF Pro", -apple-system, sans-serif',
  };
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
