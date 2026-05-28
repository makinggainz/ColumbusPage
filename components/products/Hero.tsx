"use client";

/**
 * MapsGPT Hero — ported from the PolarX project's hero.
 *
 *   • Hero header — a normal-flow section over a cityscape photo;
 *     dark content stack in the upper third; extends up behind the
 *     floating navbar; scrolls up and away.
 *   • Sticky device stage — full-bleed photo backdrop per scene
 *     (city for Scene 1, beach for Scene 2); a BARE 3D phone pinned
 *     at viewport centre; Ask · Discover pill row anchored at the
 *     bottom. Two scenes: "For your city." on the left, "For your
 *     travels." on the right.
 *   • Per-scene title labels live in NORMAL DOCUMENT FLOW — they
 *     scroll up the page past the pinned phone, opacity-fading by
 *     distance from the viewport centre.
 *
 * Lives inside the site PageFrame (fills frame width).
 */

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
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
const INTRO_LEAD_VH = 0;
// Exit runway after the last Go label. Sized so the phone stays PINNED while
// the final under-phone text finishes appearing, then the whole pinned stage
// (phone + cards + pills + backdrop) releases and scrolls up and out into the
// next section. The sticky stage un-pins over the last 100vh of the hero, so
// this tail = (hold beat after the last label) and the 100vh release follows.
const TAIL_VH = 40;
// Phone peek depth in the intro (fraction of viewport pushed down).
// 0.4 sits the phone centre ~10% above the viewport bottom during the
// hero header — slightly more of the device shows than the original
// 0.5 (half-hidden) reading, so the phone reads as a fuller object
// peeking up under the hero text rather than just its top edge.
const PHONE_PEEK = 0.4;
// Trim applied to PHONE_PEEK (in px) so the phone's starting position
// lands ~15px higher than the raw fraction would put it — more of the
// mockup is visible the instant the hero loads.
const PHONE_PEEK_LIFT_PX = 15;
// Scroll-progress point by which the phone has fully risen + pinned.
// 0.25 sits the device at its centred pose a touch earlier than the
// original 0.34, so it reaches vertical focus a bit sooner without
// snapping into place.
const INTRO_END = 0.25;

// ── Three scenes — ink + pill styling per phase ──────────────────────
// Scenes 1+2 paint a 400-px photograph strip behind the title; an
// overlay dims whichever strip is NOT the active scene so only one
// reads bright at a time. Scene 3 drops the strip — clean white field
// with user-post cards scattered around the phone.
const SCENES = [
  // Scene 1 — "For your city." over the city strip (white ink + shadow).
  { ink: "#FFFFFF", pillBg: "#5FBFF1", pillText: "#FFFFFF", pillRot: "-4deg", pillRestBg: "rgba(255,255,255,0.18)", pillRestText: "#FFFFFF" },
  // Scene 2 — "For your travels." over the beach strip.
  { ink: "#FFFFFF", pillBg: "#00B1D4", pillText: "#FFFFFF", pillRot: "-4deg", pillRestBg: "rgba(255,255,255,0.18)", pillRestText: "#FFFFFF" },
  // Scene 3 — "and everything in between" on white. Navy ink, dark-on-
  // -white resting pills, cyan active pill.
  { ink: "#0B1B2B", pillBg: "#2A8FC2", pillText: "#FFFFFF", pillRot: "-5deg", pillRestBg: "rgba(11,27,43,0.06)", pillRestText: "#0B1B2B" },
] as const;

// ── Phone pose — flat across all phases ──────────────────────────────
// No intro zoom / tilt — the phone rises into view at its final scale
// and orientation, then holds the same pose across all three scenes.
function phoneStates(isLg: boolean) {
  const lift = isLg ? 0 : -150;
  const flat = `perspective(1200px) translateX(0px) translateY(${lift}px) scale(1) rotateX(0deg) rotateY(0deg)`;
  return [flat, flat, flat, flat];
}

// ── Per-scene labels — one per scene, in normal flow ────────────────
// Scenes 1+2 have a 400-px photo strip behind the title; Scene 3 is
// the closing "everything in between" scene — no image, white bg, with
// user-post cards rendered around the pinned phone (see POSTS below).
const LABELS = [
  { scene: 1, side: "left",  anchor: 0.5, title: "for your city",                 image: "/consumer/elio/ElioEndingBackground.jpg" },
  { scene: 2, side: "right", anchor: 0.5, title: "for your travels",              image: "/consumer/forYourTravels.png" },
  { scene: 3, side: "right", anchor: 0.5, title: "and everything in between",     image: "" },
] as const;

// One product-shot per label. The phone screen renders all three
// stacked, opacity-toggling to whichever label is closest to the
// viewport anchor — see `activeLabel` below.
const PHONE_IMAGES = [
  "/consumer/elio/ElioChat.png",                // 0  For your city. (active)
  "/consumer/elio/ElioZone.png",                // 1  For your travels.
  "/consumer/elio/Localguideinyourpocket.png",  // 2  and everything in between
] as const;

// Distinct mockup shown during the hero header (phase 0) so the phone
// screen visibly swaps the moment "For your city" becomes the active
// scene. Without this, intro and active-city would both render
// PHONE_IMAGES[0] and the transition would be invisible.
const INTRO_PHONE_IMAGE = "/consumer/elio/ElioChat-v2.png";

// ── Scene-3 floating notifications ────────────────────────────────────
// Flighty-style cards that fan around the pinned phone during phase 3
// ("and everything in between"). Each card is one of:
//   • avatar  — friend pravatar (single round photo)
//   • stacked — two overlapping pravatars (group / shared trip)
//   • icon    — coloured circular badge with an emoji centred inside
// `behind: true` cards render with z-index BELOW the phone (and at
// lowered opacity) so they read as half-tucked behind the device.
// `behind: false` cards sit IN FRONT (z-index above phone) at full
// opacity for the headline moments. Coordinates are px offsets from
// viewport centre (= phone centre when pinned); `delay` staggers the
// fade-in once phase 3 activates.
type Notif = {
  title: string;
  sub: string;
  kind: "avatar" | "stacked" | "icon" | "logo";
  avatar?: string;
  avatars?: [string, string];
  emoji?: string;
  badge?: string; // hex bg for the icon badge
  x: number;
  y: number;
  rot: number;
  behind: boolean;
  delay: number;
};

const NOTIFICATIONS: Notif[] = [
  // Top-left — Sophie saved a spot (sharp, in front)
  {
    title: "Sophie saved a spot in Barcelona",
    sub: "Wants to know if you’re free Sunday · 20 min ago",
    kind: "avatar",
    avatar: "/profiles/profile2.png",
    x: -440, y: -210, rot: -3, behind: false, delay: 0,
  },
  // Top-right — Elio built your trip (sharp, in front). Uses the
  // MapsGPT globe (Elio's own brand mark) as the card icon.
  {
    title: "Elio built your Madrid weekend",
    sub: "12 spots · 3 days · Optimized route",
    kind: "logo",
    x: 440, y: -210, rot: 3, behind: false, delay: 0.10,
  },
  // Mid-left — Hidden coffee shop (faded, behind)
  {
    title: "Hidden coffee shop opened nearby",
    sub: "4 min walk · Trending today",
    kind: "icon",
    emoji: "📍",
    badge: "#0F1B2D",
    x: -320, y: 30, rot: -4, behind: true, delay: 0.22,
  },
  // Mid-right — Trending events (faded, behind)
  {
    title: "Trending in Williamsburg this weekend",
    sub: "8 events Saturday night",
    kind: "icon",
    emoji: "📅",
    badge: "#FF7A6B",
    x: 320, y: 40, rot: 5, behind: true, delay: 0.26,
  },
  // Bottom-left — Sarah & James joined (sharp, in front)
  {
    title: "Sarah & James joined your trip",
    sub: "Tokyo Gems · 14 spots saved together",
    kind: "stacked",
    avatars: ["/David.png", "/Erick.png"],
    x: -420, y: 240, rot: -2, behind: false, delay: 0.34,
  },
  // Bottom-right — Rain swap (sharp, in front)
  {
    title: "Rain Sunday — Elio swapped to indoor picks",
    sub: "3 cafés + 1 museum added",
    kind: "icon",
    emoji: "☁️",
    badge: "#9CC9E8",
    x: 420, y: 250, rot: 2, behind: false, delay: 0.42,
  },
];

export default function Hero() {
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isLg, setIsLg] = useState(true);
  // Tracks the LABEL currently nearest the viewport anchor (0 or 1),
  // so the phone product-shot swaps per-label. Updated in onScroll
  // alongside phase.
  const [activeLabel, setActiveLabel] = useState(0);

  const outerRef = useRef<HTMLDivElement>(null);
  const riseRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);
  const labelRef = useRef(0);
  const isLgRef = useRef(true);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  // True once the scene-3 label block has fully scrolled above the
  // viewport top — i.e., the user is past the hero into the next
  // section. `phase` alone stays at 3 (the nearest label is still the
  // last one) so we need a separate flag to know it's time to hide the
  // pinned phone + scene-3 notification cards.
  const [pastHero, setPastHero] = useState(false);
  const pastHeroRef = useRef(false);

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

    // ── Track which label block is nearest the viewport anchor so the
    //    pinned phone can swap its mockup. No opacity fade — titles
    //    are always at full opacity inside their own scroll block. ──
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
    // Gate phase 3 (the white scene): the navbar flips its contents to
    // dark on phase 3, and the scene-3 notification cards mount around
    // the pinned phone. Both should hold until scene 3 is fully covering
    // the viewport top — otherwise the cards float over the bottom of
    // scene 2's photo strip, and the navbar reads black against scene
    // 2's dark image. We require the scene-3 block's top edge to have
    // reached the viewport top (rect.top <= 0), which by layout means
    // scene 2's 400px block has fully scrolled past above.
    if (nextPhase === 3) {
      const scene3Block = blockRefs.current[2];
      // Lead: trigger phase 3 a bit before the scene-3 block fully
      // reaches the viewport top, so the notification cards (and the
      // navbar swap) read as "almost there" rather than waiting for a
      // perfect zero-crossing. Larger lead = earlier reveal.
      const PHASE_3_LEAD = 140;
      if (scene3Block && scene3Block.getBoundingClientRect().top > PHASE_3_LEAD) {
        nextPhase = 2;
      }
    }
    // The product-shot the phone displays follows the nearest LABEL
    // (one of two). During the intro, before any label has reached its
    // anchor, freeze on label 0.
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
    //    its pinned centre over the intro scroll, then holds. ─────────
    const rise = riseRef.current;
    if (rise) {
      const introT = smoothstep(0, INTRO_END, progress);
      const peekY = vh * (lg ? PHONE_PEEK : 0.55) - PHONE_PEEK_LIFT_PX;
      rise.style.transform = `translateY(${lerp(peekY, 0, introT).toFixed(1)}px)`;
    }

    // ── Past-hero detection: once the last label block has scrolled
    //    fully above the viewport, the user is in the next section.
    //    `phase` doesn't naturally drop (the nearest label is still the
    //    last one), so we keep a separate flag for hiding the scene-3
    //    notification cards. ───────────────────────────────────────────
    const lastBlock = blockRefs.current[blockRefs.current.length - 1];
    let nextPastHero = false;
    if (lastBlock) {
      const r = lastBlock.getBoundingClientRect();
      nextPastHero = r.bottom < 0;
    }
    if (nextPastHero !== pastHeroRef.current) {
      pastHeroRef.current = nextPastHero;
      setPastHero(nextPastHero);
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

  const phoneW = isLg ? 360 : 240;
  // PolarX device geometry — aspect-ratio 0.4949, corner radius 42/277, bezel 6/277.
  const phoneH = Math.round(phoneW / 0.4949);
  const phoneRadius = Math.round(phoneW * 0.152);
  const phoneBezel = Math.max(5, Math.round(phoneW * 0.022));
  const states = phoneStates(isLg);
  const scene = SCENES[clamp(phase - 1, 0, 2)];
  const inDevice = phase >= 1;

  return (
    <div ref={outerRef} data-hero-section data-hero-outer className="relative" style={{ marginTop: -NAV_PULL }}>
      {/* ════ Sticky scene backdrop — clean white field ════ */}
      <div className="absolute inset-0 z-0">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          <div className="absolute inset-0" style={{ background: "#FFFFFF" }} />
        </div>
      </div>

      {/* ════ Phone · pill row — pinned (the ONLY pinned content) ════ */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          {/* Scene-3 notification cards — kept in the pinned stage (not
              in the scrolling label block) so they stay perfectly
              vertically centred on the phone's landed position for the
              full duration of scene 3. Visibility is still tied to
              `phase === 3`, so they fade in only when the phone enters
              that scene and out the moment it leaves. Desktop only. */}
          {isLg && NOTIFICATIONS.map((n, i) => {
            const visible = phase === 3 && !pastHero;
            return (
              <div
                key={i}
                aria-hidden
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 320,
                  transform: `translate(-50%, -50%) translate(${n.x}px, ${visible ? n.y : n.y + 24}px) rotate(${n.rot}deg)`,
                  // `behind` still drives the opacity (faded background
                  // cards vs. crisp foreground ones); z-ordering vs. the
                  // phone is decided by the wrapping z-30 layer.
                  opacity: visible ? (n.behind ? 0.4 : 1) : 0,
                  transition: visible
                    ? `opacity 0.7s ease ${n.delay}s, transform 0.9s ${APPEAR} ${n.delay}s`
                    : "opacity 0.22s ease, transform 0.22s ease",
                  pointerEvents: "none",
                }}
              >
                <NotifCard n={n} />
              </div>
            );
          })}

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
                    {/* Intro mockup — shown only during phase 0 (hero
                        header). Crossfades out the moment "For your
                        city" activates and PHONE_IMAGES[0] takes over. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={INTRO_PHONE_IMAGE}
                      alt=""
                      aria-hidden
                      fetchPriority="high"
                      decoding="async"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        opacity: phase === 0 ? 1 : 0,
                        transition: "opacity 500ms ease",
                      }}
                    />
                    {PHONE_IMAGES.map((src, i) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        key={src}
                        src={src}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
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
                          // Only paint when we're out of the intro AND
                          // this is the active label, so the intro layer
                          // owns phase 0 cleanly.
                          opacity: phase > 0 && i === activeLabel ? 1 : 0,
                          transition: "opacity 500ms ease",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ════ Hero header — normal flow over the flipped earth; scrolls away ════ */}
      <header
        className="relative z-20 flex flex-col items-center"
        style={{
          // Header height = 100dvh + NAV_PULL so the background image
          // fills the full visible viewport at scrollY 0. The outer
          // wrapper has margin-top: -NAV_PULL, which would otherwise
          // leave a NAV_PULL-tall gap below the hero (next section
          // peeking through at the bottom of the screen). Extending the
          // header by NAV_PULL closes that gap so the image reaches the
          // bottom edge of the user's screen at rest.
          height: `calc(100dvh + ${NAV_PULL}px)`,
          width: "100%",
          background: "#FFFFFF",
          // Top-aligned stack: the hero is pulled up behind the navbar
          // by NAV_PULL (120 px), so paddingTop = NAV_PULL + navbar
          // clearance (≈ 60 px navbar height + 30 px gap) keeps the
          // Elio logo + heading comfortably below the navbar. Bottom
          // padding is small because the phone now occupies the lower
          // portion of the hero (PHONE_PEEK = 0.25).
          justifyContent: "flex-start",
          paddingTop: "clamp(180px, 22vh, 230px)",
          paddingBottom: 0,
        }}
      >
        {/* Consumer hero background — full-bleed photograph behind the
            typed-phrase H1 + CTA. */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {/* LCP for /products/consumer — `priority` emits a preload tag
              so the optimizer's AVIF/WebP variant starts fetching before
              the bundle hydrates. */}
          <ImageWithFallback
            src="/consumer/heroBackground.png"
            alt=""
            aria-hidden
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={80}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
          {/* Inactive-scene dim — fades in once the sticky scroll takes
              over (phase >= 1) so the hero matches the same 0.55 black
              treatment that "For your travels" wears when "For your
              city" is active. Keeps the brightness ranking consistent:
              only the currently-active scene reads bright. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              opacity: phase >= 1 ? 1 : 0,
              transition: "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              pointerEvents: "none",
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
                  src="/consumer/elioNameHero.png"
                  alt="Elio"
                  width={260}
                  height={110}
                  style={{
                    height: "auto",
                    width: isLg ? 80 : 56,
                    marginLeft: isLg ? 4 : 3,
                    marginTop: 1,
                    // Soft white halo + tight contact shadow so the
                    // wordmark reads cleanly against the dark photo
                    // backdrop without the previous cyan recolour.
                    filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.25))",
                  }}
                />
                <Image
                  src="/consumer/elioTagline.png"
                  alt="making maps feel alive"
                  width={877}
                  height={285}
                  style={{
                    height: "auto",
                    width: isLg ? 200 : 138,
                    marginLeft: isLg ? 10 : 7,
                    marginTop: 3,
                    // Keep the tagline white (its native colour) and add
                    // a soft drop-shadow so the faint script reads on
                    // the dark photo backdrop.
                    filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.25))",
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
                    fontSize: "76px",
                    fontWeight: 590,
                    color: "#FFFFFF",
                    textAlign: "center",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    textShadow:
                      "0 1px 2px rgba(0, 0, 0, 0.45), 0 4px 14px rgba(0, 0, 0, 0.55), 0 0 40px rgba(0, 0, 0, 0.35)",
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
                    // Mirror the heading's text-shadow stack as a chained
                    // drop-shadow filter so the star reads with the same
                    // soft lift off the photo backdrop as the wordmark.
                    filter:
                      "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45)) drop-shadow(0 4px 14px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 40px rgba(0, 0, 0, 0.35))",
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
                className="group"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  height: 46,
                  padding: "0 22px",
                  borderRadius: 18,
                  /* White pill with dark label + arrow. */
                  background: "#FFFFFF",
                  color: "#0B1342",
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  transition: "transform 0.25s cubic-bezier(0.25,1,0.5,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Try Elio in browser
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
                  <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#0B1342" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <StoreBadges />
            </div>
          </Stagger>
        </div>

      </header>

      {/* ════ Scroll content — per-scene title in NORMAL FLOW; scrolls past the phone ════
            z-10 sits BELOW the pinned phone/pill row (z-30) so the
            phone stays visible in front of each 400-px-tall photo
            strip as it scrolls past. Title text sits inside each block
            on top of the photo strip.

            pointer-events-none keeps clicks falling through to the
            pinned z-30 pill row underneath. */}
      <div className="relative z-10 pointer-events-none" style={{ width: "100%" }}>
        <div style={{ height: `${INTRO_LEAD_VH}vh` }} />
        {LABELS.map((lab, i) => {
          const sc = SCENES[lab.scene - 1];
          const centred = !isLg;
          const onLeft = lab.side === "left";
          const isActive = phase === lab.scene;
          const hasImage = !!lab.image;
          // Scenes 1+2 are 400-px photo strips behind the title. Scene 3
          // is a 70vh white block (no image) that gives the floating user-
          // post cards around the phone room to read. The dim overlay
          // above each photo strip darkens whichever scene is NOT the
          // active phase, so only one strip ever reads bright at a time.
          return (
            <div
              key={i}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              style={{
                position: "relative",
                height: hasImage ? 400 : "70vh",
              }}
            >
              {hasImage && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lab.image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Dim overlay — fades to 0 when this is the active
                      scene, settles at ~0.55 black otherwise. */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.55)",
                      opacity: isActive ? 0 : 1,
                      transition: "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                      pointerEvents: "none",
                    }}
                  />
                </>
              )}

              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  ...(isLg
                    ? { left: 0, right: 0 }
                    : { left: "50%", width: "min(440px, 86vw)", textAlign: "center" as const }),
                  transform: isLg
                    ? "translateY(-50%)"
                    : centred
                      ? "translate(-50%,-50%)"
                      : "translateY(-50%)",
                }}
              >
                {lab.scene === 3 ? (
                  // Scene-3 title lives as a fixed footer inside the
                  // pinned-phone container (see the closing <h2> above);
                  // this block only carries scroll runway + activeLabel
                  // tracking — nothing rendered inline here.
                  null
                ) : isLg ? (
                  // Three-column flex row [left zone | phone spacer | right zone]
                  // — the centre spacer matches the pinned phone's width so the
                  // two side zones are mirror images. Each side carries the same
                  // inner padding (LABEL_PHONE_GAP), which guarantees the title's
                  // edge facing the phone sits the same distance from the phone
                  // on both scenes, regardless of text width.
                  (() => {
                    const LABEL_PHONE_GAP = 60;
                    const OUTER_PAD = 60;
                    const titleStyle = {
                      fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: "clamp(48px, 7vw, 66px)",
                      fontWeight: 590,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      color: sc.ink,
                      margin: 0,
                      maxWidth: "min(520px, 40vw)",
                      // Stacked shadow over the photo strip — a tight 1px
                      // contact shadow for letter definition, a tighter
                      // halo for body legibility, then a wide diffuse halo
                      // that lifts the text off the busy backdrop.
                      // Mirrors the Elio H1 lockup's treatment so the
                      // labels read against any image content underneath.
                      textShadow: hasImage
                        ? "0 1px 2px rgba(0,0,0,0.5), 0 3px 12px rgba(0,0,0,0.55), 0 0 36px rgba(0,0,0,0.45)"
                        : undefined,
                    } as const;
                    return (
                      <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            paddingLeft: OUTER_PAD,
                            paddingRight: LABEL_PHONE_GAP,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {onLeft && (
                            <h2 style={{ ...titleStyle, textAlign: "right" }}>{lab.title}</h2>
                          )}
                        </div>
                        <div style={{ width: phoneW, flexShrink: 0 }} aria-hidden />
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            paddingLeft: LABEL_PHONE_GAP,
                            paddingRight: OUTER_PAD,
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          {!onLeft && (
                            <h2 style={{ ...titleStyle, textAlign: "left" }}>{lab.title}</h2>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <h2
                    style={{
                      fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: 32,
                      fontWeight: 590,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      color: sc.ink,
                      margin: 0,
                      // Stacked shadow over the photo strip (mobile
                      // variant — slightly tighter blur radii than the
                      // desktop labels above since the type is smaller).
                      textShadow: hasImage
                        ? "0 1px 2px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.55), 0 0 28px rgba(0,0,0,0.45)"
                        : undefined,
                    }}
                  >
                    {lab.title}
                  </h2>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ height: `${TAIL_VH}vh` }} />
      </div>

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

// ─────────────────────────────────────────────────────────────────────
//  NotifCard — Flighty-style floating notification card used in
//  scene 3. White rounded panel with a soft drop shadow, a 40px round
//  avatar / stacked-avatars / icon-badge on the left, then a tight
//  title + sub stack on the right.
// ─────────────────────────────────────────────────────────────────────
function NotifCard({ n }: { n: Notif }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: "12px 14px",
        boxShadow:
          "0 14px 36px -12px rgba(11,27,43,0.22), 0 2px 6px rgba(11,27,43,0.05)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Left visual — avatar, stacked avatars, or coloured icon badge. */}
      {n.kind === "avatar" && n.avatar && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={n.avatar}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            objectFit: "cover",
            flexShrink: 0,
            background: "#EAF2F7",
          }}
        />
      )}
      {n.kind === "stacked" && n.avatars && (
        <div style={{ position: "relative", width: 56, height: 40, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={n.avatars[0]}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 40,
              height: 40,
              borderRadius: 999,
              objectFit: "cover",
              border: "2px solid #FFFFFF",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={n.avatars[1]}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              left: 16,
              top: 0,
              width: 40,
              height: 40,
              borderRadius: 999,
              objectFit: "cover",
              border: "2px solid #FFFFFF",
            }}
          />
        </div>
      )}
      {n.kind === "icon" && (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: n.badge ?? "#00A3FF",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          <span aria-hidden>{n.emoji}</span>
        </div>
      )}
      {n.kind === "logo" && (
        /* Elio's own brand mark — the rotating MapsGPT globe. */
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MapsGPTGlobe size={36} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: "#0F1B2D",
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {n.title}
        </p>
        <p
          style={{
            fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: 12,
            fontWeight: 400,
            color: "#6B7B8C",
            margin: "2px 0 0 0",
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {n.sub}
        </p>
      </div>
    </div>
  );
}

