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
import { MessageCircle, Globe, Share2 } from "lucide-react";
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
// Pill accents stay strictly in the cyan/blue band (hue ≤210°) — high-
// saturation hues 220°+ can read as purple/indigo on Scene 2's dark navy,
// which the site explicitly forbids. Scenes 1 + 3 take the lighter endpoints
// of HowItWorks steps 1 + 3 (#5FBFF1 and #2A8FC2). Step 2's gradient is
// red→magenta — both banned — so Discover uses a pure cyan, #00B1D4.
// `pillRestBg` / `pillRestText` = resting state of an INACTIVE pill on
// each scene. Tuned per scene so the unselected icons read against
// whatever surface lives behind them: frosted-white circles on the two
// photographs, near-transparent navy-tint on Scene 3's white field.
const SCENES = [
  // Scene 1 sits on the forYourCity photograph — heading + eyebrow
  // both white; resting pills are translucent-white "glass" with white
  // icons, the active pill flips to a solid #5FBFF1.
  { ink: "#FFFFFF", eyebrow: "#FFFFFF", pillBg: "#5FBFF1", pillText: "#FFFFFF", pillRot: "-4deg", pillIdle: "rgba(255,255,255,0.65)", pillRestBg: "rgba(255,255,255,0.18)", pillRestText: "#FFFFFF" },
  // Scene 2 sits on the ElioBackground2 photograph — same treatment.
  { ink: "#FFFFFF", eyebrow: "#FFFFFF", pillBg: "#00B1D4", pillText: "#FFFFFF", pillRot: "-4deg", pillIdle: "rgba(255,255,255,0.65)", pillRestBg: "rgba(255,255,255,0.18)", pillRestText: "#FFFFFF" },
  // Scene 3 sits on a pure-white field — resting pills are a faint
  // navy-tinted gray with dark icons, the active pill is solid #2A8FC2.
  { ink: "#0B1B2B", eyebrow: "#2A8FC2", pillBg: "#2A8FC2", pillText: "#FFFFFF", pillRot: "-5deg", pillIdle: "rgba(11,27,43,0.40)", pillRestBg: "rgba(11,27,43,0.06)", pillRestText: "#0B1B2B" },
] as const;

// Scene-1 backdrop — full-bleed forYourCity photograph (replaces the old
// solid white). Applied as a CSS background shorthand so the same
// `background:` slot still works on the existing backdrop layer.
const CREAM = 'url("/forYourCity.png") center / cover no-repeat';
// Scene-2 backdrop — full-bleed ElioBackground2 photograph (replaces the
// old navy gradient).
const NAVY = 'url("/ElioBackground2.png") center / cover no-repeat';
// Scene-3 backdrop — pure white (reverted from the cityscape image so
// scene 3 lands on a clean white field, with the circular orbiting
// carousel doing the visual work around the phone).
const LIGHT = "#FFFFFF";

// Bottom pill row — three scene anchors. Labels live as aria-labels;
// the visible content is the matching Lucide glyph (Ask → chat bubble,
// Discover → globe, Share → share arrow).
const PILL_ITEMS = [
  { label: "Ask",      Icon: MessageCircle },
  { label: "Discover", Icon: Globe },
  { label: "Share",    Icon: Share2 },
] as const;
// First label index for each scene 1|2|3 — the pill row scrolls here on click.
const SCENE_FIRST_LABEL = [0, 2, 4];

// ── Phone pose — 4 discrete states (PolarX: intro / Plan / Track / Relive) ──
// All side-to-side (X) translation removed per user spec. Intro keeps a softer
// rotateX tilt (was 40°, dropped to 22°). Scenes 1+2 sit perfectly flat — the
// previous ±20° rotateY swivel between them was removed so the phone holds a
// single pose while the screen content + backdrop cross-fade.
function phoneStates(isLg: boolean) {
  const introScale = isLg ? 1.4 : 1.12;
  const goScale = isLg ? 0.7 : 0.78;
  const lift = isLg ? 0 : -150;
  const goY = isLg ? 0 : -110;
  return [
    `perspective(1200px) translateX(0px) translateY(-40px) scale(${introScale}) rotateX(22deg) rotateY(0deg)`,
    `perspective(1200px) translateX(0px) translateY(${lift}px) scale(1) rotateX(0deg) rotateY(0deg)`,
    `perspective(1200px) translateX(0px) translateY(${lift}px) scale(1) rotateX(0deg) rotateY(0deg)`,
    `perspective(1200px) translateX(0px) translateY(${goY}px) scale(${goScale}) rotateX(0deg) rotateY(0deg)`,
  ];
}

// ── Per-scene labels — 2 per scene, in normal flow ───────────────────
// `anchor` = the viewport fraction the label is fully visible at: side
// labels sit beside the phone (0.5); the final "below" labels anchor low
// so they appear UNDER the phone and rise (PolarX's Relive text).
// `side` = the side that holds the TITLE; the EXPLANATION renders on
// the OPPOSITE side in a split-column layout. Scene 3 collapses to a
// single label rendered centred BELOW the phone (no explanation, no
// eyebrow — just the final "and everything in between" text).
// All explanation copy is reused VERBATIM from newConsumerPg's
// original LABELS[0..3].heading strings — no new text is invented.
const LABELS = [
  { scene: 1, side: "left",  anchor: 0.5, title: "For your city.",    explanation: "Tell Elio what you’re after, in plain words." },
  { scene: 1, side: "left",  anchor: 0.5, title: "For your city.",    explanation: "Ask a follow up, get alternatives, refine the plan." },
  { scene: 2, side: "right", anchor: 0.5, title: "For your travels.", explanation: "Remembers what you love — picks get sharper each trip." },
  { scene: 2, side: "right", anchor: 0.5, title: "For your travels.", explanation: "Not just one pin — think “party zone in Madrid.”" },
  { scene: 3, side: "right", anchor: 0.5, title: "and everything in between" },
] as const;

// One product-shot per label, same index as LABELS. The phone screen
// renders all six stacked, opacity-toggling to whichever label is
// closest to the viewport anchor — see `activeLabel` below.
const PHONE_IMAGES = [
  // LABELS[0]'s starting mockup is TwerkPage's elioHome1.png — every
  // other slot keeps its newConsumerPg screenshot.
  "/consumer/elioHome1.png",                   // 0  For your city. (starting mockup)
  "/consumer/elio/ElioFeedback.png",           // 1  For your city. (label 2)
  "/consumer/elio/ElioHome.png",               // 2  For your travels. (label 1)
  "/consumer/elio/ElioZone.png",               // 3  For your travels. (label 2)
  "/consumer/elio/Localguideinyourpocket.png", // 4  and everything in between
] as const;

// Scene-3 scroll-driven orbiting ring — offmenu.design-style.
// 8 round place-thumbnails appear one-by-one at the TOP-RIGHT of the
// ring as the user scrolls through scene 3, joining a circle that
// rotates clockwise around the pinned phone. Rotation is purely a
// function of scroll position (no continuous CSS animation); the
// existing 8 %/frame lerp on `scene3Progress` (see the rAF effect
// below) carries the ring smoothly past the user's scroll target
// when they stop and lags slightly when they fling — that's the
// physics-like inertial drift the user is after.
const CAROUSEL_IMAGES = [
  "/consumer/images/hidden-coffee-shop.png",
  "/consumer/images/hang-out-spot.png",
  "/consumer/images/cozy-bookstore.png",
  "/consumer/images/rooftop-sunset-bar.png",
  "/consumer/images/late-night-taco-joint.png",
  "/consumer/images/weekend-brunch-place.png",
  "/consumer/images/local-hiking-trail.png",
  "/consumer/images/quiet-study-cafe.png",
];
// Ring geometry — radius in px around the pinned-phone centre, plus
// a small upward offset so the bottom of the ring clears the fixed
// "and everything in between" footer text.
const RING_RADIUS = 290;
const RING_CENTER_Y = -30;
// Angle (in degrees, screen coords: 0°=right, −90°=up) at which a new
// image materialises. −45° lands at the upper-right of the ring.
const ENTRY_ANGLE_DEG = -45;
// Full ring rotations driven across the 150vh scene-3 block. The first
// `1 / ROTATIONS_OVER_SCENE` worth of scroll places all 8 images on the
// ring (one image per 360°/8 of rotation), leaving the remaining scroll
// to spin the completed ring once more before the pinned stage releases.
const ROTATIONS_OVER_SCENE = 2;
const TOTAL_RING_ROTATION_DEG = ROTATIONS_OVER_SCENE * 360;
// Scene3Progress span used to place all 8 images (0 → 0.5 with the
// defaults above). After this span the ring is full and just spins.
const ENTRY_SPAN = 1 / ROTATIONS_OVER_SCENE;
// Quick smoothstep fade-in window per image, in scene3Progress units.
const ENTRY_FADE = 0.04;

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
  // Index of the LABEL currently nearest the viewport anchor (0..5).
  // Tracks one step finer than `phase` (which only resolves the 3
  // SCENES) so the phone product-shot can swap per-label, not per-
  // scene. Updated in onScroll alongside phase.
  const [activeLabel, setActiveLabel] = useState(0);
  // Scroll progress through scene 3's 150vh block: 0 = block top at
  // viewport top, 1 = block bottom at viewport top. Drives the
  // carousel choreography (emerge → orbit → spiral).
  const [scene3Progress, setScene3Progress] = useState(0);
  // Scene-1 forYourCity photo crossfade: 0 while the hero header still
  // fully covers the viewport (so the user sees the header alone), 1
  // once the header has scrolled fully off and the photo backdrop is
  // exposed. Linear with header scroll.
  const [scene1ImageOpacity, setScene1ImageOpacity] = useState(0);

  const outerRef = useRef<HTMLDivElement>(null);
  const riseRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);
  const labelRef = useRef(0);
  const scene3ProgressRef = useRef(0);
  const scene1ImageOpacityRef = useRef(0);
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
      // Labels fade only — the prior scale(0.5 → 1) approach motion was removed
      // so the title + explanation stay at full size and just opacity in/out.
      node.style.transform = centred ? "translate(-50%,-50%)" : "translateY(-50%)";
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
    // The product-shot the phone displays follows the nearest LABEL
    // (one of six), not the scene (one of three). During the intro,
    // before any label has reached its anchor, freeze on label 0.
    const nextLabel = nextPhase === 0 ? 0 : nearest;
    if (nextLabel !== labelRef.current) {
      labelRef.current = nextLabel;
      setActiveLabel(nextLabel);
    }
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

    // ── Phone rise: peeks from the bottom edge in the intro, rises to
    //    its pinned centre over the intro scroll, then holds. (Side-to-
    //    side X translation is the only thing removed from the phone's
    //    motion per user spec; the rise + scene poses are unchanged.) ──
    const rise = riseRef.current;
    if (rise) {
      const introT = smoothstep(0, INTRO_END, progress);
      const peekY = vh * (lg ? PHONE_PEEK : 0.58);
      rise.style.transform = `translateY(${lerp(peekY, 0, introT).toFixed(1)}px)`;
    }

    // Scene 3 scroll progress — drives the carousel choreography.
    // The scene-3 block (LABELS[4]) is 150vh tall; we want progress 0
    // when its top reaches the viewport top, and progress 1 when its
    // bottom reaches the viewport top (i.e. as it scrolls past). Below
    // 0 or above 1 means scene 3 isn't on screen.
    const scene3Block = blockRefs.current[4];
    let s3 = 0;
    if (scene3Block) {
      const r = scene3Block.getBoundingClientRect();
      const elapsed = -r.top; // pixels scrolled past the block's top edge
      s3 = clamp(elapsed / r.height, 0, 1);
    }
    // Update the rAF lerp's TARGET only — a separate effect (below)
    // continuously eases `scene3Progress` (state, what the carousel
    // actually renders from) toward this target each frame, giving
    // the choreography an inertial, glide-into-place feel rather
    // than snapping per scroll tick (matches offmenu.design's vibe).
    scene3ProgressRef.current = s3;

    // Scene-1 forYourCity photo fades in linearly with how far the hero
    // header has scrolled off. The header sits in normal flow at the top
    // of the hero outer, height 100dvh, so headerScroll ≈ how many px
    // it's been pushed up. Map 0 → vh to opacity 0 → 1.
    const headerScroll = -el.getBoundingClientRect().top;
    const nextS1 = clamp(headerScroll / vh, 0, 1);
    if (Math.abs(nextS1 - scene1ImageOpacityRef.current) > 0.005) {
      scene1ImageOpacityRef.current = nextS1;
      setScene1ImageOpacity(nextS1);
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

  // ── Lerp-based scroll smoothing for the scene-3 carousel ────────
  // Each frame, ease `scene3Progress` (the value the carousel renders
  // from) toward `scene3ProgressRef.current` (the raw scroll-derived
  // target) by 8%. ~12 frames (~200 ms) to fully catch up — fast
  // enough to feel responsive, slow enough to read as fluid. The
  // setter early-outs on micro-deltas so it stops churning at rest.
  useEffect(() => {
    let raf = 0;
    let displayed = scene3ProgressRef.current;
    const tick = () => {
      const target = scene3ProgressRef.current;
      const delta = target - displayed;
      displayed = Math.abs(delta) < 0.0005 ? target : displayed + delta * 0.08;
      setScene3Progress((prev) =>
        Math.abs(prev - displayed) < 0.0005 ? prev : displayed,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
          {/* Base layer — solid white. The scene-1 forYourCity photo
              fades in on top of this as the hero header scrolls off,
              so the backdrop reads as clean white while the user is
              still in the hero. */}
          <div className="absolute inset-0" style={{ background: "#FFFFFF" }} />
          <div className="absolute inset-0" style={{ background: CREAM, opacity: scene1ImageOpacity }} />
          <div
            className="absolute inset-0"
            style={{ background: NAVY, opacity: phase === 2 ? 1 : 0, transition: "opacity 0.7s cubic-bezier(0.44,0,0.56,1)" }}
          />
          {/* Scene-3 backdrop — solid white. Replaced the prior
              ElioEndingBackground cityscape (user wants scene 3 back
              on a clean white field, with a circular orbiting carousel
              doing the visual work around the phone). */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: LIGHT,
              opacity: phase === 3 ? 1 : 0,
              transition: "opacity 0.7s cubic-bezier(0.44,0,0.56,1)",
            }}
          />
          {/* Bottom legibility band — black opacity gradient from the
              very bottom of the pinned stage upward. SCOPED to scenes
              1 and 2 (the forYourCity / ElioBackground2 photographs),
              where the white pill row needs a dark contrast band.
              Scene 3 runs on a clean white field with dark pill colors,
              so the band stays hidden there. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "32vh",
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.30) 45%, rgba(0, 0, 0, 0) 100%)",
              opacity: phase === 1 || phase === 2 ? 1 : 0,
              transition: "opacity 0.7s cubic-bezier(0.44,0,0.56,1)",
            }}
          />
        </div>
      </div>

      {/* ════ Phone · cards · pill row — pinned (the ONLY pinned content) ════ */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          {/* Floating map-pin / category cards — Go scene only.
              Replaces the prior travel-postcard scatter; matches the
              "Concerts / Restaraunts / activities / Panaria calm
              cafe / trending places / spots / events / daily
              utilities" overlay shown in the design ref. Each card
              fades + lifts in on a per-index stagger and bobs
              gently while on screen. */}
          {/* Scene-3 scroll-driven orbiting ring — offmenu.design-style.
              Each thumbnail materialises at ENTRY_ANGLE_DEG (upper-right
              of the ring) when scene3Progress crosses its per-image
              entry stagger, then rides the ring as it rotates clockwise.
              Each image's current angle =
                ENTRY_ANGLE_DEG + (scene3Progress − entryTime_i) · TOTAL_RING_ROTATION_DEG
              The rAF lerp on scene3Progress (8 %/frame catch-up) is what
              gives the ring its inertial drift when the user scrolls or
              stops — no continuous CSS animation, the spin is purely a
              function of scroll position. */}
          {isLg && (
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2"
              style={{
                width: 0,
                height: 0,
                zIndex: 5,
                pointerEvents: "none",
              }}
            >
              {CAROUSEL_IMAGES.map((src, i) => {
                const N = CAROUSEL_IMAGES.length;
                const entryTime = (i / N) * ENTRY_SPAN;
                const entryT = smoothstep(
                  entryTime,
                  entryTime + ENTRY_FADE,
                  scene3Progress,
                );
                // Elapsed scroll since this image entered the ring; clamped
                // so images sit at the entry point (invisible) until their
                // stagger fires.
                const elapsed = Math.max(0, scene3Progress - entryTime);
                const angleDeg = ENTRY_ANGLE_DEG + elapsed * TOTAL_RING_ROTATION_DEG;
                const angleRad = (angleDeg * Math.PI) / 180;
                const x = Math.cos(angleRad) * RING_RADIUS;
                const y = Math.sin(angleRad) * RING_RADIUS + RING_CENTER_Y;
                const opacity = phase === 3 ? entryT : 0;
                return (
                  <div
                    key={src}
                    style={{
                      position: "absolute",
                      left: x,
                      top: y,
                      transform: "translate(-50%, -50%)",
                      opacity,
                      willChange: "left, top, opacity",
                    }}
                  >
                    <div
                      style={{
                        width: 112,
                        height: 112,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "#FFFFFF",
                        border: "4px solid #FFFFFF",
                        boxShadow:
                          "0 10px 28px -6px rgba(0,40,60,0.30), 0 2px 6px rgba(0,0,0,0.10)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Scene-3 fixed footer text — "and everything in between"
              anchored at the bottom of the pinned stage, in the exact
              slot the Ask · Discover · Share pill row occupied. Stays
              put while the orbiting ring spins above it; visible only
              during phase 3. */}
          <div
            aria-hidden
            className="absolute left-1/2"
            style={{
              bottom: "clamp(28px, 5.5vh, 64px)",
              transform: "translateX(-50%)",
              zIndex: 20,
              opacity: phase === 3 ? 1 : 0,
              transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: "none",
              textAlign: "center",
              paddingInline: 24,
            }}
          >
            <h2
              style={{
                fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#0B1B2B",
                margin: 0,
              }}
            >
              and everything in between
            </h2>
          </div>

          {/* Scene-3 dark scrim was removed when scene 3's backdrop
              reverted to solid white — the scrim would only mute the
              white. The circular orbiting carousel below provides
              scene 3's visual interest now. */}

          {/* The bare 3D phone */}
          <div ref={riseRef} className="absolute inset-0" style={{ willChange: "transform", zIndex: 10 }}>
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
                  {/* ▼ screen — six product shots stacked, one per
                      label. The opacity of the layer whose index
                      matches `activeLabel` rises to 1 while the rest
                      stay at 0, so the swap reads as a clean
                      crossfade. All six images mount on first paint
                      and stay mounted, so subsequent label changes
                      are zero-cost (no fetch, no remount). */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: phoneRadius - phoneBezel,
                      background: "linear-gradient(180deg, #FFFFFF 0%, #EAF4F5 100%)",
                      overflow: "hidden",
                    }}
                  >
                    {PHONE_IMAGES.map((src, i) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        key={src}
                        src={src}
                        alt=""
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          // Anchor the TOP of the source screenshot to
                          // the top of the phone screen — any overflow
                          // (status bar / footer / extra UI below) gets
                          // cropped off the bottom rather than the top.
                          objectPosition: "top center",
                          opacity: i === activeLabel ? 1 : 0,
                          transition: "opacity 500ms ease",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ask · Discover · Share scene anchors — circular icon buttons
              with a light-gray resting fill and the per-scene `pillBg`
              when active (the tab-bar pattern from the reference). The
              text label appears on hover/focus as a chip below the
              circle. pointerEvents:auto opts back in over the pinned
              stage's none; zIndex:20 keeps the row above ENDING_CARDS. */}
          <div
            className="absolute left-1/2 flex items-center"
            style={{
              bottom: "clamp(28px, 5.5vh, 64px)",
              transform: "translateX(-50%)",
              gap: isLg ? 14 : 10,
              // Hidden in scene 3 (phase 3) — that scene runs the
              // orbiting-carousel choreography under the phone and the
              // user spec calls for the bottom nav buttons to disappear.
              opacity: inDevice && phase !== 3 ? 1 : 0,
              transition: "opacity 0.5s ease",
              pointerEvents: inDevice && phase !== 3 ? "auto" : "none",
              zIndex: 20,
            }}
          >
            {PILL_ITEMS.map((item, i) => {
              const on = phase === i + 1;
              const Icon = item.Icon;
              const circleSize = isLg ? 52 : 44;
              const iconSize = isLg ? 22 : 18;
              return (
                <div
                  key={item.label}
                  className="mg-pill-wrap"
                  style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  <button
                    type="button"
                    aria-label={`Jump to ${item.label}`}
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
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: circleSize,
                      height: circleSize,
                      borderRadius: 999,
                      border: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                      cursor: "pointer",
                      // Resting bg/text + backdrop-blur come from the
                      // current scene, so each unselected pill blends with
                      // its scene's photo/white field (translucent white
                      // glass on scenes 1+2, faint navy-tint on scene 3).
                      backgroundColor: on ? scene.pillBg : scene.pillRestBg,
                      color: on ? scene.pillText : scene.pillRestText,
                      backdropFilter: on ? "none" : "blur(10px)",
                      WebkitBackdropFilter: on ? "none" : "blur(10px)",
                      transform: on ? `rotate(${scene.pillRot})` : "rotate(0deg)",
                      transition:
                        "background-color 0.45s ease, color 0.45s ease, backdrop-filter 0.45s ease, transform 0.45s cubic-bezier(0.2,0.8,0.2,1)",
                    }}
                  >
                    <Icon size={iconSize} strokeWidth={2.2} aria-hidden />
                  </button>
                  {/* Hover/focus tooltip — text label below the circle.
                      .mg-pill-wrap:hover / :focus-within toggles opacity. */}
                  <span className="mg-pill-tip">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════ Hero header — normal flow over the flipped earth; scrolls away ════ */}
      <header
        className="relative z-20 flex flex-col items-center justify-center"
        style={{
          height: "100dvh",
          width: "100%",
          background: "#FFFFFF",
          // Bottom-biased padding nudges the centred stack just above
          // the vertical midline (justify-center alone sits at exact
          // middle).
          paddingTop: "clamp(56px, 7vh, 90px)",
          paddingBottom: "clamp(160px, 22vh, 280px)",
        }}
      >
        {/* Consumer hero background — TwerkPage's ElioEndingBackground
            cityscape, full-bleed and un-flipped. Sets the visual tone
            for the entire hero header beneath the typed-phrase H1 +
            CTA. */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/consumer/heroBackground.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
        </div>

        {/* Content stack — navy ink on the white sky band, matching the
            FinalCTA section: cyan→teal gradient "Elio" eyebrow, navy
            #0B1342 H1, and a navy bg-cta primary pill with white label
            + arrow (same palette + treatment as the navbar CTA). */}
        <div className="relative flex flex-col items-center text-center px-6" style={{ maxWidth: 820, gap: 32 }}>
          <Stagger show={mounted} delay={120} y={84}>
            <div className="flex flex-col items-center" style={{ gap: 16 }}>
              {/* Elio lockup — globe + elioName.png wordmark, ported from
                  the TwerkPage hero. Wrapper drop-shadow lifts the
                  composite off the photo background. */}
              <div
                className="flex items-center"
                style={{
                  gap: 0,
                  filter: "drop-shadow(0px 0px 51px rgba(0, 0, 0, 0.25))",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ width: isLg ? 64 : 46, height: isLg ? 64 : 46 }}
                >
                  <MapsGPTGlobe size={isLg ? 46 : 34} />
                </div>
                <Image
                  src="/consumer/elioName.png"
                  alt="Elio"
                  width={260}
                  height={110}
                  style={{
                    height: "auto",
                    width: isLg ? 300 : 210,
                    marginLeft: isLg ? -11 : -8,
                  }}
                />
              </div>
              {/* Main heading with magic star — matches TwerkPage's
                  Axiforma 590 white treatment, with the star absolute-
                  positioned off the top-right of the heading box. */}
              <div style={{ position: "relative", display: "inline-block" }}>
                <h1
                  style={{
                    fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "clamp(48px, 8vw, 66px)",
                    fontWeight: 590,
                    color: "#FFFFFF",
                    textAlign: "center",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    textShadow: "0px 0px 30px rgba(0, 0, 0, 0.25)",
                    maxWidth: 800,
                    margin: 0,
                  }}
                >
                  the social super map
                </h1>
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -20,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Image
                    src="/consumer/star.png"
                    alt=""
                    width={32}
                    height={32}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          </Stagger>

          <Stagger show={mounted} delay={260} y={84}>
            <div className="flex flex-wrap items-center justify-center" style={{ gap: 12 }}>
              <a
                href="https://mapsgpt.es"
                target="_blank"
                rel="noreferrer"
                className="group bg-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  height: 46,
                  padding: "0 22px",
                  borderRadius: 18,
                  /* Navy primary pill, matches the FinalCTA + navbar CTA. */
                  color: "#FFFFFF",
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  boxShadow: "0 14px 30px -12px rgba(11,19,66,0.35)",
                  transition: "transform 0.25s cubic-bezier(0.25,1,0.5,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Try Elio in browser
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
                  <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <StoreBadges />
            </div>
          </Stagger>
        </div>

        {/* Faux rounded bottom corners — small boxes anchored flush in
            the bottom-left + bottom-right of the hero. Each box is
            mostly white with a quarter-circle BITE taken out of its
            inner corner (the corner facing into the hero), so the
            visible white wedge has straight outer corners against the
            page edges and a concave arc against the hero image. The
            hero's bottom-corner curve created by that arc visually
            matches the PageFrame's rounded top corners. The radial-
            gradient + box size both read from var(--frame-radius), so
            the corners shrink to zero in lockstep with the PageFrame's
            own corners as the user scrolls into full-bleed mode. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0"
          style={{
            width: "var(--frame-radius, 20px)",
            height: "var(--frame-radius, 20px)",
            background:
              "radial-gradient(circle at top right, transparent calc(var(--frame-radius, 20px) - 0.5px), #FFFFFF var(--frame-radius, 20px))",
            zIndex: 2,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0"
          style={{
            width: "var(--frame-radius, 20px)",
            height: "var(--frame-radius, 20px)",
            background:
              "radial-gradient(circle at top left, transparent calc(var(--frame-radius, 20px) - 0.5px), #FFFFFF var(--frame-radius, 20px))",
            zIndex: 2,
          }}
        />

      </header>

      {/* ════ Scroll content — per-scene text in NORMAL FLOW; scrolls past the phone ════
            z-40 sits ABOVE the pinned phone/cards/pill row (z-30), so
            the eyebrow + heading always render on top of whatever
            floating UI the active scene paints — important for Scene
            3, where the cityscape ENDING_CARDS would otherwise crowd
            the right-side text labels.

            pointer-events-none is critical: this container is a tall
            scroll-flow block (LABEL_BLOCK_VH per label) that overlaps
            the pinned Ask · Discover · Share pill row at the bottom of
            the viewport. Without this rule, the z-40 container would
            swallow every click + hover meant for the pills. Labels are
            display-only text with no interactive children, so passing
            pointer events through to the pinned z-30 layer is safe. */}
      <div className="relative z-40 pointer-events-none" style={{ width: "100%" }}>
        <div style={{ height: `${INTRO_LEAD_VH}vh` }} />
        {LABELS.map((lab, i) => {
          const sc = SCENES[lab.scene - 1];
          const centred = !isLg;
          const isScene3 = lab.scene === 3;
          // Three layout modes:
          //   • Scenes 1 + 2 on desktop  → SPLIT row across the viewport.
          //     The TITLE (lab.eyebrow rendered big) anchors on lab.side
          //     and the EXPLANATION (lab.heading rendered as a paragraph)
          //     anchors on the OPPOSITE side, with a ~380px phone gap.
          //   • Scene 3 on desktop       → centred BELOW the phone, with
          //     the existing eyebrow + heading stacked vertically. The
          //     `top: 75%` anchor drops the label clear of the phone.
          //   • Mobile (all scenes)      → centred 86vw column at viewport
          //     centre (unchanged from newConsumerPg).
          const isSplit = !isScene3 && isLg;
          const isBelow = isScene3 && isLg;
          const titleLeft = lab.side === "left";
          return (
            <div
              key={i}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              // Scene 3 owns a longer (150vh) block so its carousel
              // choreography has scroll runway to emerge → orbit → spiral.
              style={{ position: "relative", height: `${lab.scene === 3 ? 150 : LABEL_BLOCK_VH}vh` }}
            >
              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  top: isBelow ? "75%" : "50%",
                  // Split + below layouts both span the viewport so the
                  // grid / centred wrap can do its own internal alignment.
                  // The mobile branch keeps the single-column anchor.
                  ...(isSplit || isBelow
                    ? { left: 0, right: 0 }
                    : { left: "50%", width: "min(440px, 86vw)", textAlign: "center" as const }),
                  opacity: 0,
                  // Labels fade only — no scale-up approach motion. The
                  // initial transform matches what onScroll will set so the
                  // label starts at full size and merely opacity-fades in.
                  transform:
                    isSplit || isBelow
                      ? "translateY(-50%)"
                      : centred
                        ? "translate(-50%,-50%)"
                        : "translateY(-50%)",
                  transition: "opacity 0.35s ease-out",
                  willChange: "opacity",
                }}
              >
                {isSplit ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      // Middle gap = phone (~296px) + breathing room — keeps
                      // both columns clear of the centred mockup.
                      columnGap: 380,
                      paddingInline: 60,
                      maxWidth: 1400,
                      marginInline: "auto",
                      alignItems: "center",
                    }}
                  >
                    {/* Title column — big H2 anchored to its outer edge.
                        No small uppercase eyebrow above. */}
                    <div
                      style={{
                        gridColumn: titleLeft ? "1 / 2" : "2 / 3",
                        textAlign: titleLeft ? "left" : "right",
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
                          // Matches the hero H1 ("the social super map") so the
                          // per-scene title reads at the same scale + weight.
                          fontSize: "clamp(48px, 8vw, 66px)",
                          fontWeight: 590,
                          lineHeight: 1.2,
                          letterSpacing: "-0.02em",
                          color: sc.ink,
                          margin: 0,
                          textShadow: "0px 0px 30px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {lab.title}
                      </h2>
                    </div>
                    {/* Explanation column — newConsumerPg's original
                        heading copy, reused verbatim. */}
                    <div
                      style={{
                        gridColumn: titleLeft ? "2 / 3" : "1 / 2",
                        textAlign: titleLeft ? "left" : "right",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                          // Scaled up to sit closer to the new H1-size title.
                          fontSize: "clamp(22px, 2.4vw, 30px)",
                          fontWeight: 500,
                          lineHeight: 1.4,
                          letterSpacing: "-0.01em",
                          color: sc.ink,
                          margin: 0,
                          maxWidth: 560,
                          marginLeft: titleLeft ? 0 : "auto",
                          textShadow: "0 2px 10px rgba(0,0,0,0.25)",
                        }}
                      >
                        {"explanation" in lab ? lab.explanation : ""}
                      </p>
                    </div>
                  </div>
                ) : isBelow ? (
                  // Scene-3 label block stays in normal flow as a 150vh
                  // scroll-runway (drives `scene3Progress`), but the
                  // visible "and everything in between" text now lives
                  // as a FIXED footer inside the pinned stage above —
                  // see the dedicated <div> with the bottom: clamp()
                  // anchor. So this branch renders nothing.
                  null
                ) : (
                  <>
                    {/* Mobile fallback — title + explanation stacked centred,
                        no small uppercase eyebrow. */}
                    <h2
                      style={{
                        fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: 28,
                        fontWeight: 700,
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                        color: sc.ink,
                        margin: 0,
                      }}
                    >
                      {lab.title}
                    </h2>
                    {"explanation" in lab && (
                      <p
                        style={{
                          marginTop: 10,
                          fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                          fontSize: 16,
                          fontWeight: 500,
                          lineHeight: 1.5,
                          letterSpacing: "-0.01em",
                          color: sc.ink,
                          margin: 0,
                        }}
                      >
                        {lab.explanation}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ height: `${TAIL_VH}vh` }} />
      </div>

      <style>{`
        /* Hover/focus tooltip under each Ask · Discover · Share button.
           The label sits beneath the circle and fades in when the user
           hovers the wrapper (or tabs the inner button into focus). */
        .mg-pill-tip {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translate(-50%, -4px);
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.92);
          color: #FFFFFF;
          font-family: "SF Pro", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: -0.01em;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .mg-pill-wrap:hover .mg-pill-tip,
        .mg-pill-wrap:focus-within .mg-pill-tip {
          opacity: 1;
          transform: translate(-50%, 0);
        }
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


