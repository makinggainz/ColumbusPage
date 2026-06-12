"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import MapChatPlatform from "./MapChatPlatform";
import AgenticResearchMockup from "./AgenticResearchMockup";
import DataManagerMockup from "./DataManagerMockup";
import DashboardMockup from "./DashboardMockup";
import { ScaleToFit } from "../technology/redesign/ScaleToFit";
import { track } from "@/lib/analytics";

const reveal = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(14px)",
  transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
});

/* Dot-arrow glyph used inside the primary CTA — five filled circles in a
   chevron shape. Mirrors the `ArrowDots` defined in ElioFinalCTA so all
   bg-cta buttons across the site share the same trailing glyph. */
function ArrowDots({ className = "" }: { className?: string }) {
  return (
    <svg
      className={"size-3 shrink-0 " + className}
      width="24"
      viewBox="0 0 9 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

/* Short labels for the mobile circular picker — full labels
   ("Ask the Map", "Research Reports", "Data Catalogue") wrap onto two
   lines under a 56-px circle on phones, which reads as cluttered. The
   compact form keeps each chip to one line at 11-px type. Order /
   identity must stay in sync with the `tabs` state below. */
const MOBILE_PICKER_SHORT_LABEL: Record<string, string> = {
  "map-chat": "Map",
  "research": "Research",
  "data": "Data",
  "dashboard": "Dashboard",
};

// Duration of the selected-tab shape swap. The incoming tab rises up over
// SHAPE_SWAP_MS; the outgoing tab sinks/fades out faster (SHAPE_EXIT_MS) so
// it clears quickly and the new selection reads as the focus. SHAPE_SWAP_MS
// (the longer of the two) also drives the timeout that retires the outgoing
// shape node.
const SHAPE_SWAP_MS = 340;
const SHAPE_EXIT_MS = 160;

// The Chrome tab silhouette — white top-rounded body + two masked base
// flares — drawn as one absolutely-positioned layer at z0 (behind the
// tab's icon + label). Shared by all three tab states so they read as the
// SAME shape: the selected tab (opacity 1, swap animation), the hovered
// inactive tab (opacity 0.12), and the auto-advance loading fill (opacity
// 0.12, left→right clip-path reveal). `opacity` on the wrapper applies to
// body + flares as a group, so the low-opacity states tint uniformly.
//
// The wrapper is widened by one flareSize on each side (body inset back to
// the real tab, flares pinned at the wrapper's bottom corners). That keeps
// the flares INSIDE the wrapper's box, so the loading fill can reveal the
// whole shape with a `clip-path` wipe — which, unlike a scaleX transform,
// never distorts the body's corner radius or the flare wedges.
function TabSilhouette({
  flareSize,
  opacity = 1,
  animation,
  transition,
  willChange,
  fill = false,
  shape = false,
  onAnimationEnd,
}: {
  flareSize: string;
  opacity?: number;
  animation?: string;
  transition?: string;
  willChange?: string;
  fill?: boolean;
  shape?: boolean;
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      aria-hidden
      data-bh-tab-fill={fill ? "" : undefined}
      data-bh-tab-shape={shape ? "" : undefined}
      onAnimationEnd={onAnimationEnd}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: `calc(-1 * ${flareSize})`,
        right: `calc(-1 * ${flareSize})`,
        opacity,
        zIndex: 0,
        pointerEvents: "none",
        animation,
        transition,
        willChange,
      }}
    >
      {/* Body — the white top-rounded tab face, inset by flareSize so it
          lands exactly on the real tab. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: flareSize,
          right: flareSize,
          background: "#FFFFFF",
          borderRadius: "12px 12px 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: flareSize,
          height: flareSize,
          background: "#FFFFFF",
          WebkitMaskImage: `radial-gradient(circle at top left, transparent ${flareSize}, black ${flareSize})`,
          maskImage: `radial-gradient(circle at top left, transparent ${flareSize}, black ${flareSize})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: flareSize,
          height: flareSize,
          background: "#FFFFFF",
          WebkitMaskImage: `radial-gradient(circle at top right, transparent ${flareSize}, black ${flareSize})`,
          maskImage: `radial-gradient(circle at top right, transparent ${flareSize}, black ${flareSize})`,
        }}
      />
    </div>
  );
}

export default function BusinessHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  // Browser-tab mock: each tab maps to one of the four product-display
  // mockup components (MapChat / Agentic Research / Data Manager /
  // Dashboard). Clicking a tab swaps which mockup is rendered. The
  // per-tab `icon` is the same SVG used by the super-feature header for
  // that feature (see IconChip in BusinessUseCases) — magnifier for
  // chat, document for research, database for data catalogue, 4-up grid
  // for dashboard — so the tab favicon and the section icon below match.
  // Tabs remain reorderable (drag a tab onto another to swap its position).
  type HeroTab = { id: string; label: string; icon: React.ReactNode };
  const [tabs, setTabs] = useState<HeroTab[]>([
    {
      id: "map-chat",
      label: "Ask the Map",
      icon: (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </>
      ),
    },
    {
      id: "research",
      label: "Research Reports",
      icon: (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="m11 13 4 4" />
          <path d="M15 11h3v3" />
        </>
      ),
    },
    {
      id: "data",
      label: "Data Catalog",
      icon: (
        <>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </>
      ),
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </>
      ),
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("map-chat");
  // Tracks which tab the mouse is currently over so inactive tabs can
  // show a hover highlight (a darker translucent shape) without their
  // default state painting any background at all.
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  // Desktop auto-advance: a fill bar charges up the NEXT tab over 5s and,
  // on completion, promotes it to the active tab — a self-running demo
  // that signals the tab strip is interactive. `runId` remounts the fill
  // <span> so its CSS animation restarts on every advance / manual click
  // (same trick ComparisonSection uses). `onScreen` is a *continuous*
  // in-view flag (distinct from the one-shot `visible` reveal below) so
  // the cycle pauses while the hero is scrolled out of view.
  const [runId, setRunId] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  // Tracks browser-tab / window visibility so the auto-advance also pauses
  // when the page isn't the active tab (not just when scrolled out of view).
  const [pageVisible, setPageVisible] = useState(true);
  // Gates the auto-advance so it only begins once the page's critical
  // media has loaded (hero background photo + active product mockup,
  // both already high-priority/eager — see the LCP <ImageWithFallback>
  // and the `eager` MapChat demo below). We wait for window `load`, then
  // yield one idle tick, so the animation never competes with that work
  // for the main thread / network. Until then the fill stays unrendered.
  const [animReady, setAnimReady] = useState(false);
  // The tab the selection just left. Set synchronously by the select /
  // advance handlers (so the outgoing sink-down and incoming rise-up start
  // on the same frame) and kept for one SHAPE_SWAP_MS beat, then retired.
  // Doubles as the "a swap is in progress" flag — when null, the active
  // tab's silhouette is static (no entrance on initial load).
  const [prevActiveTabId, setPrevActiveTabId] = useState<string | null>(null);
  const dragTabIndex = useRef<number | null>(null);

  const moveTab = (from: number, to: number) => {
    if (from === to) return;
    setTabs(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  // Intersection observer — reveal the hero when it enters view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Continuous in-view observer — drives `onScreen` both ways so the
  // tab auto-advance pauses when the hero scrolls out of view (in either
  // direction — `isIntersecting` is false once the section is fully
  // above OR below the viewport) and resumes when it returns. Kept
  // separate from the one-shot reveal above, which disconnects after
  // first intersection.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Page Visibility — pause the auto-advance whenever the tab/window isn't
  // the active view (switched browser tab, minimized, etc.), complementing
  // the scroll-based `onScreen` flag so "not actively on screen" fully halts
  // the showcase's state switching.
  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  // Deferred start — hold the auto-advance until everything else has
  // loaded. Wait for window `load` (all images incl. the hero photo +
  // product mockups are in by then), then a requestIdleCallback tick so
  // first paint / image decode win the main thread before any fill runs.
  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const ric = (window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    const start = () => {
      if (ric) idleId = ric(() => setAnimReady(true), { timeout: 2000 });
      else timeoutId = setTimeout(() => setAnimReady(true), 500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      const cic = (window as typeof window & {
        cancelIdleCallback?: (id: number) => void;
      }).cancelIdleCallback;
      if (idleId !== undefined && cic) cic(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Auto-advance bookkeeping. `activeIndex` / `nextTabId` are derived
  // from the live (drag-reorderable) `tabs` order each render. The fill
  // pauses while the hero is off-screen or the user is hovering any tab.
  const activeIndex = tabs.findIndex(t => t.id === activeTabId);
  const nextTabId = tabs[(activeIndex + 1) % tabs.length]?.id;
  const paused = !onScreen || !pageVisible || hoveredTabId !== null;
  // Promote the next tab to active and restart the fill on the one after
  // it. Closes over the current `activeIndex` (the fill <span> is keyed by
  // runId, so this handler is re-created with a fresh index each cycle).
  const advance = () => {
    setPrevActiveTabId(activeTabId);
    setActiveTabId(tabs[(activeIndex + 1) % tabs.length].id);
    setRunId(r => r + 1);
  };

  // Retire the leaving tab's silhouette once its exit animation finishes
  // (one swap-beat after `prevActiveTabId` is set). Clearing it back to
  // null also returns the now-settled active tab to its static state.
  useEffect(() => {
    if (prevActiveTabId === null) return;
    const t = setTimeout(() => setPrevActiveTabId(null), SHAPE_SWAP_MS);
    return () => clearTimeout(t);
  }, [prevActiveTabId]);

  return (
    <section
      ref={sectionRef}
      data-hero-section
      className="relative w-full"
      style={{
        backgroundColor: "var(--ent-bg-light)",
        // Section height is content-driven (no aspect-ratio lock). The
        // ColumBuzHero photo fills the section as a background; with
        // `cover` + `center bottom` the photo's bottom edge (snowy park
        // fading to white) stays flush with the section's bottom edge —
        // preserving the natural fade into the white block below — while
        // the photo's top (plain sky) is the part that gets cropped to
        // whatever's left over after the text + glass window stack. This
        // is what eliminates the dead snowy-park strip that used to show
        // below the glass window when the section was locked to the
        // photo's full 2044×2833 aspect ratio.
        // The navbar is sticky and stays in document flow (~83–90px tall
        // depending on breakpoint). Pulling the hero up lets its sky
        // background extend to the very top of the page, behind the
        // navbar; the matching padding-top keeps the hero content clear
        // of the navbar overlay so nothing shifts. The pull is set to
        // 120px — comfortably more than the navbar's height — so no white
        // PageFrame card peeks through above it at any breakpoint; the
        // extra overshoot is harmlessly clipped by the card.
        marginTop: -120,
        paddingTop: 120,
      }}
    >
      {/* Background image — ColumbusBackgroundV2 fills the section
          (inset:0) edge-to-edge, including behind the sticky navbar area
          covered by the section's marginTop:-120 / paddingTop:120 trick.
          `cover` + `center 50%` keeps the focal point of the artwork
          centred around the frame. */}
      {/* LCP for /products/business — next/image with `priority` ships
          an AVIF/WebP variant of the 1.7 MB source PNG and emits a
          preload tag so the photo is on screen before the bundle
          hydrates. */}
      <div
        className="absolute pointer-events-none"
        style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
      >
        <ImageWithFallback
          src="/ColumbusBackgroundV2Enhanced.png"
          alt=""
          aria-hidden
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          draggable={false}
          style={{ objectFit: "cover", objectPosition: "center 50%" }}
          // Loading/error surface — a top-to-bottom gradient of the cityscape's
          // two dominant sky-blues, so a slow or failed hero reads as a believable
          // continuation of the background rather than a flat grey skeleton. A CSS
          // gradient adds no network/decode cost and can't itself fail to paint.
          fallbackStyle={{ background: "linear-gradient(180deg, #1C99E8 0%, #0371CB 100%)" }}
        />
      </div>
      {/* Dark overlay — a black scrim over the cityscape for text contrast.
          It fades to transparent before the section's bottom edge so the
          bled-out lower part of the photo meets the white sections with no
          hard darkening seam. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.12) 62%, rgba(0,0,0,0) 86%)",
          zIndex: 0,
        }}
      />
      {/* Desktop-only bottom fade — sits on top of the background photo
          (z-index 0, painted after the dark scrim above so it stacks on
          top of it). The top edge of this gradient sits 20px above the
          bottom edge of the showcase image; on desktop the showcase is the
          last visible child of the section, so anchoring the overlay 20px
          from the section's bottom matches. Black at the bottom edge,
          fading to fully transparent at the top edge. Hidden on mobile. */}
      <div className="hero-bg-bottom-fade absolute left-0 right-0 bottom-0 pointer-events-none">
        {/* Tagline centred over the gradient — vertically centred in the
            overlay's box and horizontally centred on the viewport. White
            ink; the browser handles wrap. */}
        <p className="hero-bg-bottom-fade-text">
          {"Columbus Pro is a new kind of mapping platform built for site selection, due diligence, and location research. We make exploration and discovery easier and cheaper."}
        </p>
      </div>
      {/* ── Text block ── */}
      {/* pt-50 (200px) restores the vertical breathing room previously
          provided by the removed ConsumerBusinessToggle wrapper
          (pt-32 + pill height ~43px + pb-10 ≈ 211px). */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-50" style={{ ...reveal(visible, 0.1), marginTop: "-55px" }}>
        {/* Columbus logo and name lockup — both children are explicit
            48-tall flex boxes that centre their own content, so the
            wordmark's optical centre lines up with the logo's centre
            regardless of font metrics (lineHeight: 1 alone clips the
            line box to font-size and was leaving the text reading
            slightly low next to the 48px square logo). */}
        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ display: "flex", width: 48, height: 48, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Image
              alt="Columbus Logo"
              width={48}
              height={48}
              src="/logobueno.png"
              style={{
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              height: 48,
              fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "clamp(18px, 3vw, 28px)",
              fontWeight: 605,
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              // Axiforma's capital glyphs sit slightly high in the em
              // box, so geometric centring left the wordmark reading a
              // few px above the logo's optical centre. Nudge the text
              // down to match.
              transform: "translateY(4px)",
            }}
          >
            Columbus Pro
          </span>
        </div>

        <h1
          className="text-white leading-[1.1] text-[39px] md:text-[49px] lg:text-[76px]"
          style={{ fontFamily: "var(--font-hero)", fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 900 }}
        >
          Earth for business
        </h1>

        {/* Tagline: cap to 480px on phones / tablets so the line wraps
            sensibly, but on lg+ desktops (≥1024px) lift the cap and pin
            the text to a single line — the full 60-char string renders
            at ~600px wide here, comfortably inside a 1024px viewport
            even with the section's 24px gutters. `lg:max-w-none`
            cancels the mobile cap; `lg:whitespace-nowrap` is what
            actually prevents the wrap. The inline style intentionally
            no longer sets maxWidth (inline > className specificity,
            so the cap had to move into Tailwind utilities to make
            the lg override land). */}
        <p
          className="mt-5 max-w-120 lg:max-w-none lg:whitespace-nowrap"
          style={{ fontSize: "var(--ent-text-body-l)", color: "#FFFFFF", letterSpacing: "-0.01em", fontWeight: 400 }}
        >
          Agentic GIS so easy, the janitor could be your new researcher
        </p>

        {/* CTA — the site-wide on-brand pill button (bg-cta navy fill,
            white text, dot-arrow). Same idiom used on the homepage's
            ElioFinalCTA, the /company page, /not-found, and other primary
            CTAs across the site. */}
        <Link
          href="/contact?tab=columbus-pro"
          onClick={() => track.demoRequested("business")}
          className="group mt-8 rounded-full px-7 py-3.5 text-sm leading-none flex items-center gap-2.5 transition-colors bg-cta text-white hover:text-accent"
        >
          Start Now
          <span className="inline-block transition-transform group-hover:translate-x-0.5">
            <ArrowDots className="text-accent" />
          </span>
        </Link>
      </div>

      {/* ── Product display — glass browser window ── */}
      {/* `flex-col items-center` (was `justify-center`) lets the new
          mobile circular picker sit BELOW the glass window as a sibling
          rather than next to it. Desktop is unaffected — the window is
          still centred and the picker is `lg:hidden` so it never
          renders, leaving the column with a single child that lays out
          identically to the old row. */}
      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{
          marginTop: "clamp(48px, 6vw, 80px)",
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: "clamp(120px, 14vw, 220px)",
          ...reveal(visible, 0.22),
        }}
      >
        {/* ScaleToFit renders the whole glass window at a fixed 1287px design
            width and uniformly transform:scale()s it down on narrower screens,
            so the chrome + mockup miniaturize together as one rigid unit (same
            mechanism as the research page's LGM-comparison diagram). At ≥1287
            it's a passthrough, so desktop is untouched. The maxWidth/centering
            cap lives on the wrapper (.biz-hero-scale) so outer.clientWidth and
            the design width agree. */}
        <ScaleToFit designWidth={1287} className="biz-hero-scale">
        {/* Glass frame — a 1.5px gradient ring forms the "dynamic" edge:
            the white translucent border brightens and fades around the
            window so it catches light like a pane of glass. All chrome
            dimensions below are frozen to their desktop values (no clamp)
            because ScaleToFit handles the shrink for the entire unit. */}
        <div
          className="biz-product-display"
          style={{
            width: "100%",
            // Concentric with the window: 20px window radius + 1.5px ring.
            borderRadius: "21.5px",
            padding: "1.5px",
            background:
              "linear-gradient(145deg, rgba(11,19,66,0.85) 0%, rgba(11,19,66,0.28) 38%, rgba(11,19,66,0.04) 62%, rgba(11,19,66,0.55) 100%)",
            boxShadow: "0 30px 70px rgba(11,27,43,0.28), 0 2px 10px rgba(11,27,43,0.12)",
          }}
        >
          {/* Window (back div) — one continuous translucent glass surface.
              Its 4px of inset padding shows around the product image as a
              glass gutter; the title bar sits on this same glass (no border,
              no separate fill) so the strip above the image and the gutter
              around it read as one seamless pane. 20px radius = PageFrame. */}
          <div
            className="biz-product-display"
            style={{
              position: "relative",
              width: "100%",
              // 20px (= PageFrame card). ScaleToFit shrinks it proportionally.
              borderRadius: "20px",
              overflow: "hidden",
              background: "rgba(11,19,66,0.5)",
              border: "1px solid rgba(11,19,66,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Title bar — carries the traffic lights + tabs on a black
                navy strip so the unselected tab labels (now white) read
                with full contrast. The active tab still paints its own
                white silhouette over this strip, so it pops as the
                foreground surface. */}
            <div
              className="biz-hero-title-bar"
              style={{
                display: "flex",
                alignItems: "center",
                // Frozen to desktop values — ScaleToFit miniaturizes the
                // whole bar as one unit.
                gap: "10px",
                height: "46px",
                paddingLeft: "24px",
                paddingRight: "20px",
                // Small top inset so the tabs sit INSIDE the title bar
                // instead of touching the window's top edge — a few pixels
                // of glass shows above the tab caps.
                paddingTop: "6px",
                /* Title bar paints no background of its own — it inherits
                   the window's single dark-glass surface, so the strip
                   above the product image and the gutter around it read
                   as one continuous color. */
              }}
            >
              {(["var(--ent-chrome-red)", "var(--ent-chrome-yellow)", "var(--ent-chrome-green)"] as const).map(c => (
                <div
                  key={c}
                  style={{
                    width: "13px",
                    aspectRatio: "1",
                    borderRadius: "50%",
                    backgroundColor: c,
                    boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
                    opacity: 0.25,
                  }}
                />
              ))}

              {/* Browser tabs — frosted-glass strips filling the space to
                  the right of the traffic lights. Active tab reads as the
                  foreground tab (brighter glass + ink label).
                  `hidden lg:flex` (replacing the inline `display: flex`)
                  drops the tab row on `<lg` viewports — at ~390px the
                  ScaleToFit-shrunk row renders the 15px labels at ~4.5px,
                  illegible. Mobile gets the circular picker below the
                  window instead (see further down). */}
              <div
                className="hidden lg:flex"
                style={{
                  // Tabs sit on the bottom of the title bar so their flat
                  // edge meets the content area cleanly — same baseline
                  // as a Chrome window's tab strip.
                  alignItems: "flex-end",
                  // Visible gap between adjacent tabs — Chrome separates
                  // its tabs with a clear sliver so each reads as its own
                  // surface; also gives the active tab's flares clearance
                  // so they don't crowd the next tab.
                  gap: "10px",
                  marginLeft: "22px",
                  height: "100%",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {tabs.map((tab, i) => {
                  const active = tab.id === activeTabId;
                  const hovered = tab.id === hoveredTabId;
                  // The white Chrome silhouette (body + flares) is drawn as
                  // one absolutely-positioned overlay so it can animate as a
                  // single unit: rising UP/in when a tab is selected and
                  // sinking DOWN/out when it's deselected. It's mounted for
                  // the active tab (`entering`) AND for the tab the selection
                  // just left (mid-exit). Inactive tabs keep a transparent
                  // body + the separate hover / fill pills below.
                  const shapeActive = active || tab.id === prevActiveTabId;
                  const entering = active;
                  // Flare size — clamps the active tab's Chrome-style
                  // bottom-corner flares from 16px (desktop) down to 8px
                  // at phone widths so they stay proportional to the
                  // shrunken bar. The same value is interpolated into
                  // both the div geometry AND the radial-gradient mask
                  // so the cutout always matches the div size.
                  const flareSize = "16px";
                  return (
                  <div
                    key={tab.id}
                    draggable
                    onClick={() => {
                      if (tab.id === activeTabId) return;
                      setPrevActiveTabId(activeTabId);
                      setActiveTabId(tab.id);
                      setRunId(r => r + 1);
                    }}
                    onMouseEnter={() => setHoveredTabId(tab.id)}
                    onMouseLeave={() => setHoveredTabId(prev => (prev === tab.id ? null : prev))}
                    onDragStart={() => { dragTabIndex.current = i; }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      if (dragTabIndex.current !== null) moveTab(dragTabIndex.current, i);
                      dragTabIndex.current = null;
                    }}
                    onDragEnd={() => { dragTabIndex.current = null; }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      // Tabs fill the title bar's full height so their
                      // flat bottom edge sits on the same baseline as the
                      // content area below — Chrome-style.
                      height: "100%",
                      // 22px − 7px to shift each tab's icon + label left by 7px.
                      paddingLeft: "15px",
                      paddingRight: "14px",
                      // Top corners only — bottom is flat so the tab
                      // baseline meets the content area cleanly. Matches
                      // the Chrome tab silhouette (top-rounded, no
                      // bottom curve).
                      borderRadius: "12px 12px 0 0",
                      // Body is transparent — the white silhouette is the
                      // animated overlay below, not the tab div's own fill.
                      background: "transparent",
                      // No border on any tab — the fill + the flared
                      // base define each tab's silhouette.
                      border: "none",
                      // Equal share of the tab row, capped at the midpoint
                      // between the compact (150) and full-stretch (220)
                      // sizes so the four tabs sit comfortably in the bar.
                      flex: "1 1 0",
                      minWidth: 0,
                      maxWidth: 185,
                      cursor: "pointer",
                      userSelect: "none",
                      /* The white silhouette now lives in a single overlay
                         layer (body + flares together), so the old body/flare
                         desync can't happen — they animate as one unit. */
                      // Relative so each tab can host two absolute "ear"
                      // divs at its bottom-left and bottom-right that
                      // draw the Chrome-style flared base — concave
                      // wedges that connect the tab's straight side
                      // into the baseline below.
                      position: "relative",
                    }}
                  >
                    {/* Hover highlight — EVERY inactive tab gets the full
                        Chrome silhouette (same body + flares as the selected
                        state) at the low 0.12 opacity, fading in/out on hover
                        so hovering always reads as "selectable". On the
                        charging (next) tab this rides on top of the fill,
                        which drops to opacity 0 while hovered (below) so the
                        two 0.12 layers never stack — the fill stays mounted +
                        paused underneath and resumes on leave. */}
                    {!active && (
                      <TabSilhouette
                        flareSize={flareSize}
                        opacity={hovered ? 0.12 : 0}
                        transition="opacity 180ms ease"
                      />
                    )}
                    {/* Auto-advance loading fill — the upcoming (next) tab.
                        Same silhouette shape at 0.12, revealed left→right via
                        a clip-path wipe over 5s. Stays mounted even while
                        hovered so hovering only PAUSES it (via `paused` →
                        animation-play-state) and it resumes from the same
                        point on mouse-out — never restarts. On completion it
                        promotes itself to the active tab (advance) and
                        remounts (key=runId) on the new next tab. Lives inside
                        `hidden lg:flex`, so it never renders/animates on
                        mobile → no auto-advance there. `animReady` holds it
                        back until the page's critical media has loaded. */}
                    {animReady && !active && tab.id === nextTabId && (
                      <TabSilhouette
                        key={runId}
                        flareSize={flareSize}
                        fill
                        // Hidden while THIS tab is hovered (the full hover
                        // silhouette above takes over the visual), but kept
                        // mounted + paused so its clip progress is preserved
                        // and resumes on leave. Eased so it crossfades with
                        // the hover highlight.
                        opacity={hovered ? 0 : 0.12}
                        transition="opacity 180ms ease"
                        animation={`bhTabFill 5000ms linear forwards ${paused ? "paused" : "running"}`}
                        willChange={paused ? "auto" : "clip-path"}
                        onAnimationEnd={(e) => {
                          if (e.animationName === "bhTabFill") advance();
                        }}
                      />
                    )}
                    {/* Selected silhouette — the white tab body + its two
                        Chrome base flares as ONE layer (so they animate
                        together) at full opacity. Rendered for the active
                        tab (rises up / fades in) and the tab the selection
                        just left (sinks down / fades out), making selection
                        visibly swap from one tab to the next. Sits at z0,
                        behind the icon + label (z1). */}
                    {shapeActive && (
                      <TabSilhouette
                        flareSize={flareSize}
                        shape
                        opacity={1}
                        willChange="transform, opacity"
                        // Outgoing tab → always sink down/out. Incoming tab →
                        // rise up/in only during an actual swap (prevActiveTabId
                        // set); on first load it's static so the selected tab
                        // doesn't animate in unprompted.
                        animation={
                          !entering
                            ? `bhTabShapeOut ${SHAPE_EXIT_MS}ms cubic-bezier(0.4,0,1,1) forwards`
                            : prevActiveTabId !== null
                              ? `bhTabShapeIn ${SHAPE_SWAP_MS}ms cubic-bezier(0.22,1,0.36,1) forwards`
                              : "none"
                        }
                      />
                    )}
                    {/* Feature icon — same SVG paths as the super-feature
                        section header below, scaled to the tab favicon
                        slot. Active tab uses the ink stroke; inactive
                        tabs are muted to match the secondary label color. */}
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: "16px",
                        height: "16px",
                        flexShrink: 0,
                        // Above the white silhouette overlay (z0).
                        position: "relative",
                        zIndex: 1,
                        // Ink on the white silhouette, white on dark glass;
                        // eased so it crossfades with the shape swap.
                        stroke: active ? "var(--ent-text-primary)" : "#FFFFFF",
                        transition: "stroke 200ms ease",
                      }}
                    >
                      {tab.icon}
                    </svg>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        // Above the white silhouette overlay (z0).
                        position: "relative",
                        zIndex: 1,
                        // Selected → ink (sits on the active tab's white
                        // silhouette). Inactive → pure white, full opacity
                        // on the navy dark-glass background. Eased so it
                        // crossfades with the shape swap.
                        color: active ? "var(--ent-text-primary)" : "#FFFFFF",
                        transition: "color 200ms ease",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                        flex: 1,
                        // The label's caps sit high in its line box; nudge down
                        // ~1px so the text optically centres with the icon.
                        lineHeight: 1,
                        transform: "translateY(1px)",
                      }}
                    >
                      {tab.label}
                    </span>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Product display — one of four mockup components composes
                the frame PNG with overlaid coded UI (map tiles, cards,
                chat panel) for the active tab. All four corners are
                rounded at 16px so the mockup reads as its own card
                inside the window's 20px rounded clip — the active tab
                no longer merges into the mockup surface. */}
            <div
              // Glass gutter around the mockup. Top stays 0 so the active
              // tab's flat bottom edge meets the mockup's top with no
              // glass strip showing. Frozen to the 4px desktop gutter —
              // ScaleToFit shrinks it with the rest of the chrome.
              style={{ padding: "0 4px 4px" }}
              className="hero-product-display"
            >
              {/* All four mockups are PRE-MOUNTED — the pre-mount strategy is
                  preserved. All four load their frame chrome up-front (MapChat
                  at high priority as the above-the-fold LCP demo, the other
                  three at low priority via the preload prop). Visibility is now
                  controlled by opacity + pointer-events instead of display:none
                  so the active tab can cross-fade in rather than snapping in
                  instantly. A CSS grid wrapper stacks all four children into the
                  same cell; the active pane fades to opacity:1 in 220ms. */}
              <div style={{ display: "grid" }}>
                {(
                  [
                    { id: "map-chat",   node: <MapChatPlatform eager /> },
                    { id: "research",   node: <AgenticResearchMockup preload /> },
                    { id: "data",       node: <DataManagerMockup preload /> },
                    { id: "dashboard",  node: <DashboardMockup preload /> },
                  ] as const
                ).map(({ id, node }) => (
                  <div
                    key={id}
                    style={{
                      gridArea: "1 / 1",
                      opacity: activeTabId === id ? 1 : 0,
                      transition: "opacity 220ms ease-out",
                      pointerEvents: activeTabId === id ? "auto" : "none",
                    }}
                  >
                    {node}
                  </div>
                ))}
              </div>
            </div>
            <style>{`
              .hero-product-display .biz-mockup-frame {
                max-width: 100% !important;
                border: none !important;
                /* 16px (matches the desktop mockup card), frozen — ScaleToFit
                   shrinks it so the inner mockup corner stays visually inboard
                   of the window's radius. */
                border-radius: 16px !important;
              }
              /* Desktop-only black bottom-fade overlay on the background
                 photo. The flex column wrapping the showcase carries
                 paddingBottom: clamp(120px, 14vw, 220px) below the
                 showcase image — adding 20px puts the top of this overlay
                 exactly 20px above the showcase's bottom edge across every
                 viewport in this band. z-index 0 keeps it beneath the
                 text/showcase (z-10) and lets it paint above the dark scrim
                 above by DOM order. */
              .hero-bg-bottom-fade {
                display: none;
              }
              @media (min-width: 1024px) {
                .hero-bg-bottom-fade {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: calc(clamp(120px, 14vw, 220px) + 20px);
                  background: linear-gradient(
                    to bottom,
                    rgba(0, 0, 0, 0) 0%,
                    rgba(0, 0, 0, 1) 100%
                  );
                  z-index: 0;
                }
                /* Tagline copy — Axiforma (matches the rest of the hero
                   chrome), white, centred. max-width set wide enough
                   (~1180px) so the ~245-char paragraph fits on 2 lines
                   with text-wrap: balance redistributing evenly — keeps
                   "See it in practice." on the second line instead of
                   orphaning it to a third. */
                .hero-bg-bottom-fade-text {
                  margin: 0;
                  max-width: 1180px;
                  padding: 0 24px;
                  color: #FFFFFF;
                  text-align: center;
                  text-wrap: balance;
                  font-family: var(--ent-font-sans);
                  font-size: clamp(16px, 1.4vw, 20px);
                  line-height: 1.45;
                  letter-spacing: -0.01em;
                  font-weight: 500;
                  /* The parent .hero-bg-bottom-fade has pointer-events: none
                     so the gradient surface stays passthrough; without
                     re-enabling here, the text would inherit the none and
                     wouldn't be selectable. */
                  pointer-events: auto;
                }
              }
              /* Desktop tab auto-advance fill — reveals the next tab's
                 silhouette left→right over its 5s cycle. A clip-path wipe
                 (not a scaleX transform) so the body's corner radius + the
                 flare wedges stay undistorted at every point of the fill. */
              @keyframes bhTabFill {
                from { -webkit-clip-path: inset(0 100% 0 0); clip-path: inset(0 100% 0 0); }
                to   { -webkit-clip-path: inset(0 0 0 0);    clip-path: inset(0 0 0 0); }
              }
              /* Selected-tab silhouette swap — the new tab's white shape
                 rises UP into existence; the leaving tab's shape sinks
                 DOWN out of view. */
              @keyframes bhTabShapeIn {
                from { transform: translateY(40%); opacity: 0; }
                to   { transform: translateY(0);   opacity: 1; }
              }
              @keyframes bhTabShapeOut {
                from { transform: translateY(0);   opacity: 1; }
                to   { transform: translateY(40%); opacity: 0; }
              }
              /* Respect reduced-motion: no animated fill, no auto-advance
                 (the keyed span never reaches animationEnd, so the strip
                 stays purely click-to-select), and no sliding shape swap. */
              @media (prefers-reduced-motion: reduce) {
                [data-bh-tab-fill] { animation: none !important; }
                [data-bh-tab-shape] { animation: none !important; }
              }
            `}</style>
          </div>
        </div>
        </ScaleToFit>

        {/* Mobile-only circular picker — replaces the illegible
            in-window tab row at `<lg`. Visual language rhymes with the
            site's IconChip (BusinessUseCases) and the Start Now CTA:
              • Solid white disc on every chip (same fill token the
                desktop active-tab silhouette uses + the PageFrame card)
              • Navy ink icon (--ent-text-primary, 1.8px stroke — same
                recipe as the desktop tabs and the ComparisonSection
                rail icons)
              • Active state grafts the Start Now CTA navy on as a 2px
                ring via box-shadow (no layout shift between states)
                and lifts the chip 2px with a stronger elevation
                shadow — same "lifted disc" cue used elsewhere
              • White label below carries the three-stop dark text-shadow
                proven on the consumer hero (works across cloud / grass /
                building portions of the photo backdrop) */}
        <div
          className="lg:hidden flex items-start justify-center gap-4 mt-7 px-4"
          role="tablist"
          aria-label="Demo view"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTabId(tab.id)}
                className="touch-target flex flex-col items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
              >
                <span
                  className="inline-flex items-center justify-center rounded-full transition-[box-shadow,transform] duration-150 ease-out"
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#FFFFFF",
                    // box-shadow keeps chip footprint stable between
                    // states (a border-swap would shift layout by 2px)
                    // and carries both the active ring and the
                    // elevation halo in one declaration.
                    boxShadow: isActive
                      ? "0 0 0 2px var(--color-cta), 0 8px 20px rgba(11,19,66,0.22)"
                      : "0 2px 6px rgba(11,19,66,0.08)",
                    transform: isActive ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  <svg
                    aria-hidden
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ent-text-primary)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: isActive ? 1 : 0.55 }}
                  >
                    {tab.icon}
                  </svg>
                </span>
                <span
                  className="text-[11px] font-medium leading-[1.2] tracking-[-0.005em]"
                  style={{
                    color: "#FFFFFF",
                    opacity: isActive ? 1 : 0.82,
                    /* Three-stop dark shadow lifted from
                       components/products/Hero.tsx mobile scene title —
                       punches the white label out of any photo region. */
                    textShadow:
                      "0 1px 2px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.55), 0 0 28px rgba(0,0,0,0.45)",
                  }}
                >
                  {MOBILE_PICKER_SHORT_LABEL[tab.id] ?? tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
