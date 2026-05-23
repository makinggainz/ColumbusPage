"use client";

/**
 * MapsGPT Hero — ported from the PolarX project's hero.
 *
 *   • Hero header — a normal-flow section over the light pastel Elio
 *     background; dark content stack in the upper third; extends up
 *     behind the floating navbar; scrolls up and away (diagonal seam).
 *   • Sticky device stage — a coloured backdrop (warm → navy → light)
 *     revealed beneath the header; a BARE 3D phone that snaps through
 *     four discrete poses; an Ask · Discover · Go pill row that recolours
 *     per scene; floating photo-cards on the final scene.
 *   • Per-scene text labels live in NORMAL DOCUMENT FLOW — they scroll
 *     up the page past the pinned phone (PolarX's stacked-card mechanic),
 *     fading + scaling by distance from the viewport centre. The phone
 *     is the ONLY pinned thing; the text genuinely scrolls.
 *
 * Lives inside the site PageFrame (fills frame width). On-page copy is
 * MapsGPT's own. Restyled to design-system/products-page.md.
 */

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import MapsGPTGlobe from "@/components/products/MapsGPTGlobe";
import StoreBadges from "@/components/products/StoreBadges";

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

// ── Scroll-stage layout (vh) ─────────────────────────────────────────
// Each text label is a real, normal-flow block this tall; it scrolls up
// past the pinned phone. 50vh matches PolarX's device-card height exactly.
const LABEL_BLOCK_VH = 50;
const INTRO_LEAD_VH = 8;
// Exit runway after the last Go label. Sized so the phone stays PINNED while
// the final under-phone text finishes appearing, then the whole pinned stage
// (phone + cards + pills + backdrop) releases and scrolls up and out into the
// next section. The sticky stage un-pins over the last 100vh of the hero, so
// this tail = (hold beat after the last label) and the 100vh release follows.
const TAIL_VH = 40;
// Phone peek depth in the intro (fraction of viewport pushed down).
const PHONE_PEEK = 0.62;
// Scroll-progress point by which the phone has fully risen + pinned.
const INTRO_END = 0.34;

// ── Three scenes — ink + pill styling per phase ──────────────────────
const SCENES = [
  { ink: "#063140", eyebrow: "#00838F", pillBg: "#063140", pillText: "#FFFFFF", pillRot: "-4deg", pillIdle: "rgba(6,49,64,0.40)" },
  { ink: "#FFFFFF", eyebrow: "#8DF7FF", pillBg: "#00B1D4", pillText: "#04222C", pillRot: "-4deg", pillIdle: "rgba(255,255,255,0.50)" },
  { ink: "#063140", eyebrow: "#00838F", pillBg: "#0F6B6E", pillText: "#FFFFFF", pillRot: "-5deg", pillIdle: "rgba(6,49,64,0.40)" },
] as const;

const CREAM = "linear-gradient(180deg, #F7F2E4 0%, #EFE7D2 100%)";
const NAVY = "linear-gradient(180deg, #063140 0%, #03202A 100%)";
// Solid white — matches HowItWorksSection (#FFFFFF) so the hand-off has no seam.
const LIGHT = "#FFFFFF";

const PILL_WORDS = ["Ask", "Discover", "Go"] as const;
// First label index for each scene 1|2|3 — the pill row scrolls here on click.
const SCENE_FIRST_LABEL = [0, 2, 4];

// ── Phone pose — 4 discrete states (PolarX: intro / Plan / Track / Relive) ──
function phoneStates(isLg: boolean) {
  const sx = isLg ? 1 : 0.42;
  const introScale = isLg ? 1.4 : 1.12;
  const goScale = isLg ? 0.7 : 0.78;
  const lift = isLg ? 0 : -150;
  const goY = isLg ? 0 : -110;
  return [
    `perspective(1200px) translateX(0px) translateY(-40px) scale(${introScale}) rotateX(40deg) rotateY(0deg)`,
    `perspective(1200px) translateX(${-140 * sx}px) translateY(${lift}px) scale(1) rotateX(0deg) rotateY(${20 * sx}deg)`,
    `perspective(1200px) translateX(${140 * sx}px) translateY(${lift}px) scale(1) rotateX(0deg) rotateY(${-20 * sx}deg)`,
    `perspective(1200px) translateX(0px) translateY(${goY}px) scale(${goScale}) rotateX(0deg) rotateY(0deg)`,
  ];
}

// ── Per-scene labels — 2 per scene, in normal flow ───────────────────
// `anchor` = the viewport fraction the label is fully visible at: side
// labels sit beside the phone (0.5); the final "below" labels anchor low
// so they appear UNDER the phone and rise (PolarX's Relive text).
const LABELS = [
  { scene: 1, side: "right", anchor: 0.5, eyebrow: "Ask anything", heading: "Chat your way around any city." },
  { scene: 1, side: "right", anchor: 0.5, eyebrow: "Plain language", heading: "No filters, no menus — just ask." },
  { scene: 2, side: "left", anchor: 0.5, eyebrow: "Discover", heading: "Find the places worth your time." },
  { scene: 2, side: "left", anchor: 0.5, eyebrow: "Local-grade picks", heading: "Ranked by people who actually went." },
  { scene: 3, side: "right", anchor: 0.5, eyebrow: "Get going", heading: "Directions the second you decide." },
  { scene: 3, side: "right", anchor: 0.5, eyebrow: "On the move", heading: "Your route recalculated as you wander." },
] as const;

// Floating travel postcards — final (Go) scene only. The Go heading
// scrolls through the whole RIGHT column and the pill row owns the
// bottom-centre, so the cards live entirely in the clear LEFT zone —
// a four-card scrapbook scatter with varied widths + rotations.
const CARDS = [
  { img: "/blog-himalaya.jpg", w: 210, x: -356, y: -242, rot: -6, bob: 0 },
  { img: "/blog-still-lake.jpg", w: 178, x: -486, y: -34, rot: 6, bob: 1.1 },
  { img: "/blog-misty-forest.jpg", w: 184, x: -312, y: 156, rot: -5, bob: 0.7 },
  { img: "/blog-clouds-dawn.jpg", w: 200, x: -468, y: 336, rot: 6, bob: 1.4 },
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
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    const lg = isLgRef.current;
    const range = el.offsetHeight - vh;
    const progress = range > 0 ? clamp(-el.getBoundingClientRect().top / range, 0, 1) : 0;

    // ── Labels: in normal flow, scrolling 1:1 with the page. Fade + scale
    //    curve transplanted VERBATIM from PolarX's updateDevices() — flat
    //    top within `flatRange` of the label's ANCHOR, linear ramp to 0 at
    //    `fullRange`; opacity = t, scale = 0.5 + 0.5·t. Side labels anchor
    //    at the viewport centre (beside the phone); the final "below"
    //    labels anchor low, so they appear UNDER the phone and rise. ──
    // Desktop: PolarX's wide fade band. Mobile: a tight band low on the
    // screen so the centred labels sit + fade clear of the lifted phone.
    const flatRange = vh * (lg ? 0.18 : 0.05);
    const fullRange = vh * (lg ? 0.45 : 0.16);
    let nearest = 0;
    let bestAbs = Infinity;
    let firstAd = Infinity;
    let firstBelowAnchor = false;
    for (let i = 0; i < LABELS.length; i++) {
      const node = labelRefs.current[i];
      if (!node) continue;
      const r = node.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const anchorY = (lg ? LABELS[i].anchor : 0.74) * vh;
      const ad = Math.abs(c - anchorY);
      let t: number;
      if (ad <= flatRange) t = 1;
      else if (ad >= fullRange) t = 0;
      else t = 1 - (ad - flatRange) / (fullRange - flatRange);
      node.style.opacity = t.toFixed(3);
      const centred = !lg;
      node.style.transform =
        (centred ? "translate(-50%,-50%)" : "translateY(-50%)") + ` scale(${(0.5 + 0.5 * t).toFixed(3)})`;
      if (i === 0) {
        firstAd = ad;
        firstBelowAnchor = c > anchorY; // first label hasn't risen to its anchor yet
      }
      if (ad < bestAbs) {
        bestAbs = ad;
        nearest = i;
      }
    }

    // ── Phase: 0 while the first label is still well below its anchor
    //    (intro); otherwise the nearest label's scene drives the phone. ──
    let nextPhase: number;
    if (firstBelowAnchor && firstAd > vh * 0.3) nextPhase = 0;
    else nextPhase = LABELS[nearest].scene;
    if (nextPhase !== phaseRef.current) {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
      // Broadcast the scene change to the floating navbar synchronously,
      // in the same tick as setPhase — React batches both state updates so
      // the navbar's backdrop transition starts on the SAME frame as the
      // hero's, keeping the two colour cross-fades perfectly in sync.
      // MistxNav only listens when its `heroLight` prop is set, so this
      // wiring stays scoped to the MapsGPT page.
      window.dispatchEvent(
        new CustomEvent("mapsgpt-hero-phase", { detail: nextPhase }),
      );
    }

    // ── Phone rise: peeks from the bottom edge in the intro, rises to its
    //    pinned centre over the intro scroll, then holds. ──
    const rise = riseRef.current;
    if (rise) {
      const introT = smoothstep(0, INTRO_END, progress);
      const peekY = vh * (lg ? PHONE_PEEK : 0.58);
      rise.style.transform = `translateY(${lerp(peekY, 0, introT).toFixed(1)}px)`;
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
    handler(); // initial paint — deferred via rAF so setState isn't called sync in the effect
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onScroll]);

  const phoneW = isLg ? 296 : 210;
  // PolarX device geometry — aspect-ratio 0.4949, corner radius 42/277, bezel 6/277.
  const phoneH = Math.round(phoneW / 0.4949);
  const phoneRadius = Math.round(phoneW * 0.152);
  const phoneBezel = Math.max(5, Math.round(phoneW * 0.022));
  const states = phoneStates(isLg);
  const scene = SCENES[clamp(phase - 1, 0, 2)];
  const inDevice = phase >= 1;

  return (
    <div ref={outerRef} data-hero-section data-hero-outer className="relative" style={{ marginTop: -NAV_PULL }}>
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

      {/* ════ Phone · cards · pill row — pinned (the ONLY pinned content) ════ */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          {/* Floating travel postcards — Go scene only */}
          {isLg &&
            CARDS.map((c, i) => {
              const on = phase === 3;
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate(${c.x}px, ${c.y + (on ? 0 : 40)}px) rotate(${c.rot}deg)`,
                    opacity: on ? 1 : 0,
                    transition: `opacity 0.6s ease ${i * 80}ms, transform 0.8s ${APPEAR} ${i * 80}ms`,
                  }}
                >
                  <div style={{ animation: `mgHeroBob 5s ease-in-out ${c.bob}s infinite` }}>
                    <PhotoCard img={c.img} w={c.w} />
                  </div>
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
                {/* Device — PolarX geometry: 0.4949 aspect, slim dark bezel,
                    concentric corner radii. The inner screen <div> is the
                    single swap point for future content (image/video/markup). */}
                <div
                  style={{
                    width: phoneW,
                    height: phoneH,
                    boxSizing: "border-box",
                    borderRadius: phoneRadius,
                    padding: phoneBezel,
                    background: "#10212B",
                    boxShadow:
                      "0 2px 2px -0.25px rgba(0,0,0,0.08), 0 6px 6px -1px rgba(0,0,0,0.08), " +
                      "0 16px 16px -1.5px rgba(0,0,0,0.09), 0 27px 27px -1.75px rgba(0,0,0,0.10), " +
                      "0 50px 50px -2px rgba(0,40,60,0.22)",
                  }}
                >
                  {/* ▼ screen — swap point */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: phoneRadius - phoneBezel,
                      background: "linear-gradient(180deg, #FFFFFF 0%, #EAF4F5 100%)",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ASK · DISCOVER · GO pill row — clickable (PolarX's anchor labels);
              pointerEvents:auto opts back in over the pinned stage's none. */}
          <div
            className="absolute left-1/2 flex items-center"
            style={{
              bottom: "clamp(28px, 5.5vh, 64px)",
              transform: "translateX(-50%)",
              gap: 6,
              opacity: inDevice ? 1 : 0,
              transition: "opacity 0.5s ease",
              pointerEvents: "auto",
            }}
          >
            {PILL_WORDS.map((word, i) => {
              const on = phase === i + 1;
              return (
                <div key={word} className="flex items-center" style={{ gap: 6 }}>
                  <button
                    type="button"
                    aria-label={`Jump to ${word}`}
                    onClick={() => {
                      const blk = blockRefs.current[SCENE_FIRST_LABEL[i]];
                      if (!blk) return;
                      const r = blk.getBoundingClientRect();
                      window.scrollTo({
                        top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2,
                        behavior: "smooth",
                      });
                    }}
                    style={{
                      fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: isLg ? 19 : 16,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      padding: "6px 16px",
                      borderRadius: 8,
                      border: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                      cursor: "pointer",
                      backgroundColor: on ? scene.pillBg : "transparent",
                      color: on ? scene.pillText : scene.pillIdle,
                      transform: on ? `rotate(${scene.pillRot})` : "rotate(0deg)",
                      transition:
                        "background-color 0.45s ease, color 0.45s ease, transform 0.45s cubic-bezier(0.2,0.8,0.2,1)",
                    }}
                  >
                    {word}
                  </button>
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
        className="relative z-20 flex flex-col items-center justify-center"
        style={{
          height: "100dvh",
          width: "100%",
          paddingTop: "clamp(56px, 7vh, 90px)",
          // Heavier bottom pad biases the centred content upward a touch.
          paddingBottom: "clamp(150px, 19vh, 230px)",
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
        <div className="relative flex flex-col items-center text-center px-6" style={{ maxWidth: 820, gap: 32 }}>
          <Stagger show={mounted} delay={120} y={84}>
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
                  Elio
                </span>
              </div>
              <h1
                style={{
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: "clamp(32px, 5.6vw, 66px)",
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
            </div>
          </Stagger>

          <Stagger show={mounted} delay={260} y={84}>
            <div className="flex flex-wrap items-center justify-center" style={{ gap: 12 }}>
              <a
                href="https://mapsgpt.es"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 42,
                  padding: "0 20px",
                  borderRadius: 18,
                  background: "#063140",
                  color: "#FFFFFF",
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  boxShadow: "0 14px 30px -12px rgba(6,49,64,0.35)",
                  transition: "transform 0.25s cubic-bezier(0.25,1,0.5,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Try Elio in browser
              </a>
              <StoreBadges />
            </div>
          </Stagger>
        </div>

      </header>

      {/* ════ Scroll content — per-scene text in NORMAL FLOW; scrolls past the phone ════ */}
      <div className="relative z-10" style={{ width: "100%" }}>
        <div style={{ height: `${INTRO_LEAD_VH}vh` }} />
        {LABELS.map((lab, i) => {
          const sc = SCENES[lab.scene - 1];
          const centred = !isLg;
          const innerPos: React.CSSProperties = !isLg
            ? { left: "50%", width: "min(440px, 86vw)", textAlign: "center" }
            : lab.side === "right"
              ? { left: "calc(50% + 168px)", width: 360 }
              : { right: "calc(50% + 168px)", width: 360, textAlign: "right" };
          return (
            <div
              key={i}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              style={{ position: "relative", height: `${LABEL_BLOCK_VH}vh` }}
            >
              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  ...innerPos,
                  opacity: 0,
                  transform: centred ? "translate(-50%,-50%) scale(0.5)" : "translateY(-50%) scale(0.5)",
                  // PolarX device-card transition, verbatim
                  transition: "opacity 0.35s ease-out, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  willChange: "transform, opacity",
                }}
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
            </div>
          );
        })}
        <div style={{ height: `${TAIL_VH}vh` }} />
      </div>

      <style>{`
        @keyframes mgHeroBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
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

// ── Floating travel postcard — clean white-framed photo, no caption ──
function PhotoCard({ img, w }: { img: string; w: number }) {
  const h = Math.round(w / 1.46);
  return (
    <div
      style={{
        width: w,
        padding: 6,
        background: "#FFFFFF",
        borderRadius: 13,
        boxShadow: "0 26px 50px -18px rgba(0,40,60,0.45), 0 5px 14px -6px rgba(0,40,60,0.25)",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: h, borderRadius: 8, overflow: "hidden" }}>
        <Image src={img} alt="" fill sizes="240px" style={{ objectFit: "cover" }} />
      </div>
    </div>
  );
}
