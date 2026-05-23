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
// Pill accents stay strictly in the cyan/blue band (hue ≤210°) — high-
// saturation hues 220°+ can read as purple/indigo on Scene 2's dark navy,
// which the site explicitly forbids. Scenes 1 + 3 take the lighter endpoints
// of HowItWorks steps 1 + 3 (#5FBFF1 and #2A8FC2). Step 2's gradient is
// red→magenta — both banned — so Discover uses a pure cyan, #00B1D4.
const SCENES = [
  // pillText / pillIdle stay WHITE on every scene — the new bottom
  // black gradient below the pill row gives them a guaranteed
  // legibility band, regardless of scene backdrop (light blue / navy
  // / cityscape). pillBg keeps a per-scene tint so the active pill
  // still reads as a distinct chip.
  { ink: "#0B1B2B", eyebrow: "#5FBFF1", pillBg: "#5FBFF1", pillText: "#FFFFFF", pillRot: "-4deg", pillIdle: "rgba(255,255,255,0.65)" },
  { ink: "#FFFFFF", eyebrow: "#00B1D4", pillBg: "#00B1D4", pillText: "#FFFFFF", pillRot: "-4deg", pillIdle: "rgba(255,255,255,0.65)" },
  // Scene 3 sits on top of the cityscape ElioEndingBackground. The
  // dedicated scene-3 dark scrim below (see scene backdrop) renders
  // the image quite dim, so heading + eyebrow flip to WHITE here so
  // they read cleanly over the darkened photo + floating cards.
  { ink: "#FFFFFF", eyebrow: "#9FE0FF", pillBg: "#2A8FC2", pillText: "#FFFFFF", pillRot: "-5deg", pillIdle: "rgba(255,255,255,0.65)" },
] as const;

// Scene-1 backdrop — soft Elio-logo blue with a subtle white fade at the
// top edge so the backdrop reads as light blue without a hard top seam.
const CREAM = "linear-gradient(180deg, #FFFFFF 0%, #E3F2FB 18%, #C7E5F6 100%)";
// Scene-2 backdrop — Columbus navbar-logo navy (#0B1342, var --color-cta).
const NAVY = "linear-gradient(180deg, #0B1342 0%, #060A28 100%)";
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
  { scene: 1, side: "right", anchor: 0.5, eyebrow: "Just ask", heading: "Tell Elio what you’re after, in plain words." },
  { scene: 1, side: "right", anchor: 0.5, eyebrow: "Like texting a friend", heading: "Ask a follow up, get alternatives, refine the plan." },
  { scene: 2, side: "left", anchor: 0.5, eyebrow: "Knows your vibe", heading: "Remembers what you love — picks get sharper each trip." },
  { scene: 2, side: "left", anchor: 0.5, eyebrow: "Whole neighborhoods", heading: "Not just one pin — think “party zone in Madrid.”" },
  { scene: 3, side: "right", anchor: 0.5, eyebrow: "Save & share your favorites", heading: "Bookmark favorites, add to your personal map, or share with friends." },
  { scene: 3, side: "right", anchor: 0.5, eyebrow: "Local guide in your pocket", heading: "Let Elio find you the coolest place, faster." },
] as const;

// One product-shot per label, same index as LABELS. The phone screen
// renders all six stacked, opacity-toggling to whichever label is
// closest to the viewport anchor — see `activeLabel` below.
const PHONE_IMAGES = [
  // First image in the sequence intentionally matches the LAST label
  // ("Local guide in your pocket") — the phone enters the pinned
  // stage already showing the discovery-map screenshot so the user
  // sees the product's destination right away, then the labels walk
  // through how it gets there before landing on it again at the end.
  "/consumer/elio/Localguideinyourpocket.png", // 0  Just ask (also the final shot)
  "/consumer/elio/ElioFeedback.png",        // 1  Like texting a friend
  "/consumer/elio/ElioHome.png",            // 2  Knows your vibe
  "/consumer/elio/ElioZone.png",            // 3  Whole neighborhoods
  "/consumer/elio/ElioSavedPlaces.png",     // 4  Save & share your favorites
  "/consumer/elio/Localguideinyourpocket.png", // 5  Local guide in your pocket
] as const;

// Floating "map pins" + "category cards" that bloom across the Go-scene
// (phase 3) ElioEndingBackground. ALL cards live in the BOTTOM 35% of
// the pinned stage (y ≥ +200 in centre-origin coordinates) — clear of
// the phone mockup (≈ y ±300, centred) and the right-side scrolling
// text (which lives near the vertical centre). Cards spread left-to-
// right across the bottom band; `bob` seeds the gentle breathing
// animation. `kind` selects one of four card looks:
//   - "category":         thumbnail above + label pill
//   - "category-profile": circular profile-photo above + label pill
//   - "place":            ring marker + "Panaria / calm cafe" two-line
//                         pill, optionally with a category tag above
//                         and an optional profile-photo circle beside
//   - "dot":              big gradient avatar with status ring + label
//   - "dot-label":        tiny pin dot + label pill (no thumbnail)
const ENDING_CARDS = [
  { kind: "dot",              label: "Concerts",        x: -640, y: 240, bob: 0.0 },
  { kind: "place",            label: "Panaria",         sub: "calm cafe", category: "Restaraunts", profile: "/consumer/images/hidden-coffee-shop.png", x: -460, y: 360, bob: 0.6 },
  { kind: "category",         label: "activities",      thumb: "/consumer/HeroBack.png", profile: "/consumer/images/local-hiking-trail.png", x: -300, y: 240, bob: 1.0 },
  // "group trips" lives high+left to clear the centred Ask·Discover·Go
  // pill row at the bottom of the pinned stage.
  { kind: "category-profile", label: "group trips",     profile: "/consumer/images/hang-out-spot.png", x: -180, y: 250, bob: 1.4 },
  // Centre-ish Panaria pushed further right so it no longer clashes
  // with the phone and the pill row's "Ask" side.
  { kind: "place",            label: "Panaria",         sub: "calm cafe", category: null, profile: "/consumer/images/cozy-bookstore.png", x: 260, y: 290, bob: 0.4 },
  { kind: "category",         label: "events",          thumb: "/consumer/images/rooftop-sunset-bar.png", profile: "/consumer/images/late-night-taco-joint.png", x: 230, y: 380, bob: 1.8 },
  { kind: "category",         label: "trending places", thumbs: ["/consumer/images/hidden-coffee-shop.png", "/consumer/images/late-night-taco-joint.png", "/consumer/images/rooftop-sunset-bar.png"], profile: "/consumer/images/weekend-brunch-place.png", x: 460, y: 230, bob: 0.2 },
  { kind: "dot-label",        label: "spots",           x: 580, y: 380, bob: 1.1 },
  { kind: "place",            label: "Panaria",         sub: "calm cafe", category: "daily utilities", profile: "/consumer/images/quiet-study-cafe.png", x: 690, y: 230, bob: 1.6 },
  { kind: "place",            label: "Panaria",         sub: "calm cafe", category: null, x: -720, y: 380, bob: 0.9 },
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
  // Index of the typewriter phrase currently being typed. TypedPhrase
  // calls back with this every time the next phrase begins, and the
  // hero background video remounts to match (see VIDEO_BY_PHRASE).
  const [activePhrase, setActivePhrase] = useState(0);
  // Index of the LABEL currently nearest the viewport anchor (0..5).
  // Tracks one step finer than `phase` (which only resolves the 3
  // SCENES) so the phone product-shot can swap per-label, not per-
  // scene. Updated in onScroll alongside phase.
  const [activeLabel, setActiveLabel] = useState(0);

  const outerRef = useRef<HTMLDivElement>(null);
  const riseRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);
  const labelRef = useRef(0);
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
          {/* Scene 3 ("Save & share" / "Local guide") swaps the flat
              white backdrop for ElioEndingBackground — a stylised
              cityscape with rooftops, parks, and waterways the
              floating cards below pin themselves to. The image is
              `object-fit: cover` so it scales with the viewport and
              the focal centre (downtown rooftops) stays roughly
              behind the phone on every screen size. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/consumer/elio/ElioEndingBackground.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: "cover",
              opacity: phase === 3 ? 1 : 0,
              transition: "opacity 0.7s cubic-bezier(0.44,0,0.56,1)",
            }}
          />
          {/* Bottom legibility band — black opacity gradient from the
              very bottom of the pinned stage upward. Always-on (every
              scene), opaque-ish at the bottom and fully transparent
              by ~30vh up, so the white "Ask · Discover · Go" pill row
              + any caption text near the bottom has a guaranteed
              dark base regardless of the scene backdrop (light blue
              scene 1 / navy scene 2 / cityscape scene 3). */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "32vh",
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.30) 45%, rgba(0, 0, 0, 0) 100%)",
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
          {isLg &&
            ENDING_CARDS.map((c, i) => {
              const on = phase === 3;
              return (
                <div
                  key={`end-${i}`}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate(${c.x}px, ${c.y + (on ? 0 : 20)}px)`,
                    opacity: on ? 1 : 0,
                    transition: `opacity 0.6s ease ${i * 60}ms, transform 0.8s ${APPEAR} ${i * 60}ms`,
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      // Damped bob — large initial swings, decays to
                      // rest by the end of the 12s cycle. One-shot
                      // (no `infinite`) with `both` fill mode so the
                      // card holds at translateY(0) after settling
                      // instead of looping back into perpetual motion.
                      animation: `mgHeroBob 12s cubic-bezier(0.34, 1.4, 0.4, 1) ${c.bob * 0.35}s 1 both`,
                    }}
                  >
                    <EndingCard card={c} />
                  </div>
                </div>
              );
            })}

          {/* Scene-3 dark scrim — lives INSIDE the pinned stage at
              zIndex 6, above the floating ENDING_CARDS (zIndex 5)
              but BELOW the phone (zIndex 10) and pill row (zIndex
              20). The floating cards therefore sit "under" the scrim
              and read as a dimmer, more atmospheric layer of the
              cityscape, while the phone + pill row stay fully bright
              and readable. Dialed down from the earlier full scrim:
              ~0.30 at the top, ~0.20 mid, ~0.32 at the bottom — the
              cityscape still reads, and the white scene-3 heading
              has enough contrast without crushing the image. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 6,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.20) 50%, rgba(0,0,0,0.32) 100%)",
              opacity: phase === 3 ? 1 : 0,
              transition: "opacity 0.7s cubic-bezier(0.44,0,0.56,1)",
            }}
          />

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

          {/* ASK · DISCOVER · GO pill row — clickable (PolarX's anchor labels);
              pointerEvents:auto opts back in over the pinned stage's none.
              zIndex:20 keeps the pill row above every floating ENDING_CARD
              (which sit at zIndex:5 in the same pinned stage), so the
              "Ask · Discover · Go" chips are never obscured by the
              cityscape map pins on scene 3. */}
          <div
            className="absolute left-1/2 flex items-center"
            style={{
              bottom: "clamp(28px, 5.5vh, 64px)",
              transform: "translateX(-50%)",
              gap: 6,
              opacity: inDevice ? 1 : 0,
              transition: "opacity 0.5s ease",
              pointerEvents: "auto",
              zIndex: 20,
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
                      borderRadius: on ? 999 : 8,
                      border: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                      cursor: "pointer",
                      backgroundColor: on ? scene.pillBg : "transparent",
                      color: on ? scene.pillText : scene.pillIdle,
                      transform: on ? `rotate(${scene.pillRot})` : "rotate(0deg)",
                      transition:
                        "background-color 0.45s ease, color 0.45s ease, border-radius 0.45s ease, transform 0.45s cubic-bezier(0.2,0.8,0.2,1)",
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
        {/* Consumer hero background — a video that SWAPS to match the
            typed-phrase carousel below. The phrase carousel calls back
            into `activePhrase`; the video remounts via `key` so each
            new clip starts from frame 0 and the prior one is dropped.
            `HeroBack.png` is the poster, so the beach photo shows
            while the clip preloads and is the fallback for any URL
            that 404s.

            On top of the video sits a dark scrim + navbar fade so
            the white navbar contents and the centred H1 stack stay
            legible regardless of which frame is on screen. */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <video
            key={`hero-bg-${activePhrase}`}
            src={VIDEO_BY_PHRASE[activePhrase]}
            poster="/consumer/HeroBack.png"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover" }}
            aria-hidden
          />
          {/* Global readability scrim — uniform dark tint over the whole
              video so the centred "Elio" + H1 + CTA stack reads
              cleanly on any frame of any clip (varied brightness from
              tropical noon to dim café). Sits below the navbar fade so
              the navbar zone gets stacked dark coverage (scrim + fade),
              while the rest of the hero gets just this single tint. */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              pointerEvents: "none",
            }}
          />
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: 280,
              background:
                "linear-gradient(180deg, rgba(8, 22, 32, 0.42) 0%, rgba(8, 22, 32, 0.26) 40%, rgba(8, 22, 32, 0.10) 75%, rgba(8, 22, 32, 0) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Content stack — white over the beach photo, upper third. The
            "Elio" eyebrow row (Globe icon + label) and the H1 both read
            in pure white; the colour swap from the prior dark-teal was
            paired with the background image change so the type sits on
            top of the tropical scene with maximum contrast. */}
        <div className="relative flex flex-col items-center text-center px-6" style={{ maxWidth: 820, gap: 32 }}>
          <Stagger show={mounted} delay={120} y={84}>
            <div className="flex flex-col items-center" style={{ gap: 16 }}>
              <div className="flex items-center gap-2" style={{ color: "#FFFFFF" }}>
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
                  color: "#FFFFFF",
                }}
              >
                Find your next
                <br />
                <TypedPhrase onPhraseChange={setActivePhrase} />
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
                  /* White pill with black text — paired with the beach
                     hero's white headline so the primary CTA reads as
                     the bright focal point against the photo. */
                  background: "#FFFFFF",
                  color: "#000000",
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  boxShadow: "0 14px 30px -12px rgba(0,0,0,0.35)",
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
            the right-side text labels. */}
      <div className="relative z-40" style={{ width: "100%" }}>
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
                    lineHeight: 1.15,
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
        /* Damped float — amplitude decays across the cycle so each
           card enters with a strong "drop in & bounce" feel and
           gradually calms to rest. Applied with iteration-count 1 +
           fill-mode both, so the card settles at translateY(0) and
           the cityscape stops moving after the entrance. */
        @keyframes mgHeroBob {
          0%   { transform: translateY(0); }
          8%   { transform: translateY(-22px); }
          18%  { transform: translateY(3px); }
          30%  { transform: translateY(-15px); }
          42%  { transform: translateY(2px); }
          55%  { transform: translateY(-9px); }
          70%  { transform: translateY(0); }
          83%  { transform: translateY(-4px); }
          100% { transform: translateY(0); }
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

// ── Typewriter phrase — cycles through realistic search ideas, typing
//    and backspacing one character at a time with a blinking caret. ──
const TYPED_PHRASES = [
  "hang out spot",
  "romantic date night",
  "secret beach spot",
  "hidden coffee shop",
  "weekend brunch place",
  "local hiking trail",
  "cozy bookstore",
  "rooftop sunset bar",
  "late-night taco joint",
  "quiet study café",
];

// Hero background video per typed phrase — same index as TYPED_PHRASES.
// Three are self-hosted local clips (cropped + trimmed from screen
// recordings) under /public/consumer/videos/; the other seven hot-link
// off Mixkit's / Pexels' CDNs (both allow free hot-linking; ~57 MB
// total avoided in the repo). Each clip leans into the "people
// enjoying that kind of place" vibe of its phrase:
//   hang out spot         → local clip (house-party, screen-recorded
//                            + cropped + trimmed to source 1.5s–3.5s,
//                            /public/consumer/videos/hang-out-spot.mp4)
//   romantic date night   → intimate couple dinner (Mixkit 41261)
//   secret beach spot     → local clip (runner on a beach with crashing waves,
//                            screen-recorded + trimmed -ss 3,
//                            /public/consumer/videos/secret-beach-spot.mp4)
//   hidden coffee shop    → restaurant with people sitting outside at night (Pexels 17417856)
//   weekend brunch place  → bustling coffee shop with baristas (Pexels 29719125)
//   local hiking trail    → couple exploring a forest (Mixkit 43151)
//   cozy bookstore        → local clip (dim bookstore "You" opening scene,
//                            screen-recorded + cropped,
//                            /public/consumer/videos/cozy-bookstore.mp4)
//   rooftop sunset bar    → young couple having fun in a rooftop bar (Mixkit 47027)
//   late-night taco joint → fish tacos with beer (Mixkit 16411)
//   quiet study café      → woman drinking coffee in a cafe (Mixkit 223)
// The <video> falls back to /consumer/HeroBack.png (poster) if any
// URL ever 404s so the page never goes black.
const VIDEO_BY_PHRASE = [
  "/consumer/videos/hang-out-spot.mp4",
  "https://assets.mixkit.co/videos/41261/41261-720.mp4",
  "/consumer/videos/secret-beach-spot.mp4",
  "https://videos.pexels.com/video-files/17417856/17417856-hd_1280_720_30fps.mp4",
  "https://videos.pexels.com/video-files/29719125/12778465_3840_2160_24fps.mp4",
  "https://assets.mixkit.co/videos/43151/43151-720.mp4",
  "/consumer/videos/cozy-bookstore.mp4",
  "https://assets.mixkit.co/videos/47027/47027-720.mp4",
  "https://assets.mixkit.co/videos/16411/16411-720.mp4",
  "https://assets.mixkit.co/videos/223/223-720.mp4",
];

function TypedPhrase({
  onPhraseChange,
}: {
  /** Fires with the index of the phrase that is now BEING TYPED (so a
   *  callback at idx N means typing of phrase N just started; the
   *  background video should swap to N's source here). */
  onPhraseChange?: (idx: number) => void;
}) {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Tell the parent which phrase is currently being typed. Fires on
  // mount with idx 0, then every time phraseIdx advances. Captured in
  // its own effect so the typewriter timer stays minimal.
  useEffect(() => {
    onPhraseChange?.(phraseIdx);
  }, [phraseIdx, onPhraseChange]);

  useEffect(() => {
    const full = TYPED_PHRASES[phraseIdx];
    // Typing forward — fast; deleting — quicker; hold 3s at the full
    // word so the user has time to read it (and so the matching video
    // background gets a meaningful beat on screen); brief pause before
    // typing the next one when fully cleared.
    let delay: number;
    if (!deleting && text === full) {
      delay = 3000;
    } else if (deleting && text === "") {
      delay = 280;
    } else {
      delay = deleting ? 32 : 70;
    }

    const t = setTimeout(() => {
      if (!deleting && text === full) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setPhraseIdx((i) => (i + 1) % TYPED_PHRASES.length);
      } else if (deleting) {
        setText(full.slice(0, text.length - 1));
      } else {
        setText(full.slice(0, text.length + 1));
      }
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx]);

  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
      <span>{text}</span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "0.06em",
          height: "0.9em",
          marginLeft: "0.08em",
          verticalAlign: "-0.08em",
          background: "#FFFFFF",
          animation: "mgHeroCaret 1s steps(1) infinite",
        }}
      />
      <style>{`@keyframes mgHeroCaret { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }`}</style>
    </span>
  );
}

// ── Go-scene map overlay: floating "you can ask for X" cards that sit on
//    the cityscape ElioEndingBackground. Four variants:
//      - "dot":       small avatar circle + label pill (e.g. "Concerts")
//      - "dot-label": tiny pin dot + label pill (e.g. "spots")
//      - "place":     two-line "Panaria / calm cafe" pill, optionally
//                     with a category tag above (e.g. "Restaraunts")
//      - "category":  rounded thumbnail (or stack of three) + label pill
//    Styling targets a clean white-pill look that reads as cohesive
//    "map UI" against the painterly cityscape behind.
type EndingCardData = (typeof ENDING_CARDS)[number];

function EndingCard({ card }: { card: EndingCardData }) {
  const pillBase: React.CSSProperties = {
    padding: "5px 11px",
    borderRadius: 10,
    background: "#FFFFFF",
    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 12,
    fontWeight: 600,
    color: "#0B1B2B",
    letterSpacing: "-0.01em",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.08), 0 8px 24px -8px rgba(0,40,60,0.25)",
    whiteSpace: "nowrap" as const,
  };
  const categoryTag: React.CSSProperties = {
    ...pillBase,
    fontSize: 11,
    fontWeight: 500,
    opacity: 0.92,
    marginBottom: 4,
  };
  if (card.kind === "dot") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6094C1 0%, #2A5B8A 100%)",
            border: "3px solid #FFFFFF",
            boxShadow: "0 4px 14px -4px rgba(0,40,60,0.35)",
            position: "relative",
          }}
        >
          {/* Thin ring slice — mimics the green/red status arc in the screenshot */}
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "2px solid #5CC982",
              borderRightColor: "#FF5454",
              borderBottomColor: "transparent",
              transform: "rotate(35deg)",
            }}
          />
        </div>
        <div style={pillBase}>{card.label}</div>
      </div>
    );
  }
  if (card.kind === "dot-label") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#F45D8B",
            border: "2px solid #FFFFFF",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        />
        <div style={pillBase}>{card.label}</div>
      </div>
    );
  }
  if (card.kind === "place") {
    const profile = "profile" in card ? card.profile : undefined;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        {card.category && <div style={categoryTag}>{card.category}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FFFFFF",
              border: "2px solid #6094C1",
              boxShadow: "0 2px 6px rgba(0,0,0,0.20)",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              ...pillBase,
              padding: "6px 12px",
              lineHeight: 1.15,
            }}
          >
            <div style={{ fontWeight: 600 }}>{card.label}</div>
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.58 }}>{card.sub}</div>
          </div>
          {profile && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile}
              alt=""
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.22)",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>
    );
  }
  if (card.kind === "category-profile") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.profile}
          alt=""
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #FFFFFF",
            boxShadow: "0 6px 14px -4px rgba(0,40,60,0.30)",
          }}
        />
        <div style={pillBase}>{card.label}</div>
      </div>
    );
  }
  // "category"
  const thumbs = "thumbs" in card ? card.thumbs : undefined;
  const thumb = "thumb" in card ? card.thumb : undefined;
  const catProfile = "profile" in card ? card.profile : undefined;
  // Stack thumb (or thumbs) over a small profile-avatar circle that
  // overlaps the bottom-right corner — reads as an "attribution"
  // marker (who shared this place), the same visual idiom Instagram
  // / Airbnb use for user-curated content. Positioned absolute so it
  // hugs the thumbnail's bottom-right regardless of which thumb
  // shape is rendered (single / stacked).
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {(thumbs || thumb) && (
        <div style={{ position: "relative" }}>
          {thumbs ? (
            <div style={{ position: "relative", width: 92, height: 60 }}>
              {thumbs.slice(0, 3).map((t, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={t}
                  src={t}
                  alt=""
                  style={{
                    position: "absolute",
                    width: 70,
                    height: 50,
                    left: i * 11,
                    top: i * 5,
                    borderRadius: 8,
                    objectFit: "cover",
                    border: "2.5px solid #FFFFFF",
                    boxShadow: "0 4px 10px -3px rgba(0,40,60,0.30)",
                    zIndex: 3 - i,
                  }}
                />
              ))}
            </div>
          ) : thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt=""
              style={{
                width: 78,
                height: 56,
                borderRadius: 9,
                objectFit: "cover",
                border: "2.5px solid #FFFFFF",
                boxShadow: "0 6px 14px -4px rgba(0,40,60,0.30)",
              }}
            />
          ) : null}
          {catProfile && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={catProfile}
              alt=""
              style={{
                position: "absolute",
                right: -8,
                bottom: -8,
                width: 26,
                height: 26,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #FFFFFF",
                boxShadow: "0 3px 8px rgba(0,0,0,0.28)",
                zIndex: 5,
              }}
            />
          )}
        </div>
      )}
      <div style={pillBase}>{card.label}</div>
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
