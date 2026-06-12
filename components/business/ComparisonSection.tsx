"use client";

import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";
import envBg1 from "@/public/BusinessPgMedia/EnvironmentalUseCases/Bg/env-bg-1.png";
import MapChatPlatform from "./MapChatPlatform";
import DataManagerMockup from "./DataManagerMockup";
import AgenticResearchMockup from "./AgenticResearchMockup";
import DashboardMockup from "./DashboardMockup";
import { ScaleToFit } from "../technology/redesign/ScaleToFit";

const SOFT = "var(--ent-border-card)";

/* The right-side mock app is gone — we now render the real
   SuperFeatureSection demoVisuals (MapChatPlatform / DataManagerMockup /
   AgenticResearchMockup / DashboardMockup) on the active slot. Industry
   is locked to residential-real-estate to match what the industry stack
   below this section opens with. The MapChatPlatform props duplicate
   the residential entry in BusinessUseCases.tsx RESIDENTIAL_COPY.mapChat
   — kept inline here so this preview section stays decoupled from
   that copy. */
const RESIDENTIAL_INDUSTRY_ID = "residential-real-estate" as const;
const RESIDENTIAL_MAP_CHAT = {
  map: "/BusinessPgMedia/ResidentialRealEstateUseCases/MapVisuals/chat-platform-map.png",
  userQuery:
    "Show me which neighborhoods in Amsterdam have seen the largest rent increases over the past 5 years",
  responseIntro:
    "Here are the Amsterdam neighborhoods with the steepest free-sector rent growth over the past five years",
  listTitle: "Top 4 Neighborhoods by Free-Sector Rent Growth",
  listSubtitle: "Last 5 Years",
  listItems: [
    { rank: 1, name: "De Pijp-Noord", pct: "+28.4%" },
    { rank: 2, name: "Oud-West", pct: "+24.1%" },
    { rank: 3, name: "Indische Buurt", pct: "+21.6%" },
    { rank: 4, name: "Oostelijke Eilanden", pct: "+19.3%" },
  ],
  keyTakeaway:
    "Rent growth concentrates in tram-served neighborhoods with tight new-build pipelines; independent business turnover lags the price rise by 18–24 months.",
};

/* Each feature auto-advances after this long. The active item's horizontal
   progress bar and the advance are driven by the same rAF clock (see the
   component), so the bar and the timer stay in sync and pause together. */
const CYCLE_MS = 6000;

/* The active cell's gray countdown bar is painted every frame by the
   requestAnimationFrame loop in the component (see paintBar): it wipes in
   from the left over the first FILL_IN_MS, then recedes toward the right for
   the rest of CYCLE_MS. Driving it from the same clock that advances the
   carousel keeps the bar and the timer perfectly in sync and — unlike the
   old CSS-animation-end approach — means a dropped event can never strand
   the countdown. */
const FILL_IN_MS = 500;
/* Scoped CSS — `.cmp-host-visual > *` kills only the box-shadow on each
   demo's outermost wrapper (MapChatPlatform / *Mockup all set a heavy
   floating-card shadow via inline style). Per the user's pass on this
   design, the demos shouldn't sit on a shadow — they should read as if
   you're clicking through the live app rather than swapping between framed
   product screenshots. Rounded corners and the rest of each demo's chrome
   stay intact. */
const CMP_CSS = `
.cmp-host-visual > * { box-shadow: none !important; }

/* Host card layout — split between mobile (full mockup visible at
   container width, scales like a real product screenshot) and desktop
   (fixed 630px, demo absolutely positioned to peek through the
   top-left, mimicking "you're in the live app").

   Mobile: the host card sizes to the demo's natural aspect ratio. The
   demo overlay sits in normal flow at full width with 16px breathing
   room. Interior typography uses cqw, so on a narrow container the
   text scales proportionally small — the mockup reads as a miniature
   real product UI rather than a blown-up illustration.
   Desktop (lg+): the existing zoomed framing — host fixed at 630px,
   demo absolutely placed at top:58 / left:88 / width:1180 so only the
   top-left of the mockup peeks through the host's overflow-hidden
   crop. */
.cmp-host { padding: 16px; }
.cmp-host-visual { position: relative; width: 100%; }
@media (min-width: 1024px) {
  .cmp-host { padding: 0; height: 730px; }
  .cmp-host-visual {
    position: absolute;
    top: 58px;
    left: 88px;
    width: 1180px;
  }
}
`;

/* Renders the real SuperFeatureSection demoVisual that corresponds to
   the active left-card slot. Slot→visual mapping:
     • Map Chat       → MapChatPlatform        (id=chat)
     • Reports        → AgenticResearchMockup  (id=agentic-research)
     • Data Catalogue → DataManagerMockup      (id=data-catalogue)
     • Dashboard      → DashboardMockup        (id=dashboard)
   Industry is locked to residential — this section sits ABOVE the
   page's IndustryProvider, so it can't read the selected industry from
   context yet. */
/* `preload` is threaded down to every demo's images: once the section has
   entered the viewport (or the global warm flag fires), all four mockups —
   even the display:none inactive ones — flip their next/image to
   loading="eager" + fetchPriority="low". Because every demo is pre-mounted,
   that fetches all four frame PNGs up front (low priority, no LCP cost), so
   clicking/auto-advancing through the list never reveals a half-loaded,
   chrome-less showcase. */
function ActiveVisual({ active, preload }: { active: number; preload: boolean }) {
  switch (active) {
    case 0:
      return <MapChatPlatform {...RESIDENTIAL_MAP_CHAT} preload={preload} />;
    case 1:
      return <AgenticResearchMockup industryId={RESIDENTIAL_INDUSTRY_ID} preload={preload} />;
    case 2:
      return <DataManagerMockup industryId={RESIDENTIAL_INDUSTRY_ID} preload={preload} />;
    case 3:
      return <DashboardMockup industryId={RESIDENTIAL_INDUSTRY_ID} preload={preload} />;
    default:
      return null;
  }
}

/* ── Feature glyphs — mirror the icon rail painted into the
   ConversationalMapChat / *Frame chrome PNGs (the live app's left
   sidebar). Each feature on the left card carries the same glyph
   the corresponding tab uses in the demo on the right, so the
   left list reads as a key to the icon rail.
     • Map Chat       → SearchBubbleIco (search-bubble glyph)
     • Reports        → PenSquareIco    (pencil-in-square)
     • Data Catalogue → DbIco           (stacked-cylinder database)
     • Dashboard      → GridIco         (2×2 rounded squares) ── */
type IcoProps = { size: number; color: string };
function GridIco({ size, color }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function SearchBubbleIco({ size, color }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
      {/* Filled sparkle inside the lens — matches the showcase's Map Chat
          rail glyph (scaled ~25% about its centre). */}
      <path d="M11 7.6l.85 1.85 1.85.85-1.85.85L11 13l-.85-1.9-1.85-.85 1.85-.85z" fill={color} stroke="none" transform="translate(11 10.3) scale(1.25) translate(-11 -10.3)" />
    </svg>
  );
}
function PenSquareIco({ size, color }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  );
}
function DbIco({ size, color }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  );
}

/* The four left-card slots. Each carries an `Icon` matching the
   right-side app's icon rail so the left list reads as a labeled
   key for the demo on the right. The numeric prefix that used to
   live here is gone — icons replace it. */
const FEATURES = [
  {
    title: "Map Chat",
    subtitle:
      "Chart your own expedition.\nChat with Columbus to find answers, make visuals and more.",
    Icon: SearchBubbleIco,
  },
  {
    title: "Reports",
    subtitle:
      "Send our fleet to discover.\nOur AI agents will investigate and report their findings.",
    Icon: PenSquareIco,
  },
  {
    title: "Data Catalog",
    subtitle:
      "Browse everything we've discovered.\nFind the right data for any project, all on the same platform.",
    Icon: DbIco,
  },
  {
    title: "Dashboard",
    subtitle: "Your captain's view.\nAll your projects in one place.",
    Icon: GridIco,
  },
] as const;

export default function ComparisonSection() {
  const warm = useMediaWarm();
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  /* ── Auto-advance is driven by a single requestAnimationFrame loop that
     owns the cycle clock, instead of a CSS animation whose `animationend`
     event triggered the advance. The old approach could freeze for good: a
     missed `animationend` (dropped when the play-state was toggled while the
     cursor moved over the section) left nothing to fire the next advance,
     and the hover-pause covered the whole section — including the large
     demo — so any mouse movement read as a "random freeze."

     The loop writes the progress bar's transform straight to the DOM via
     `barRef` (no per-frame React re-render, so the four heavy mockups aren't
     reconciled 60×/sec) and only calls setActive when a cell's cycle
     completes. Pausing just stops accumulating time, so it can never get
     stuck — when the pause condition clears, the loop simply resumes. ── */
  const FILL_FRAC = FILL_IN_MS / CYCLE_MS;
  const barRef = useRef<HTMLSpanElement | null>(null);
  const onScreenRef = useRef(false);
  const autoRef = useRef(false);        // auto-advance only at lg+ (desktop)
  const activeRef = useRef(0);
  const progressRef = useRef(0);        // 0‒1 within the active cell's cycle
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => { activeRef.current = active; }, [active]);

  /* Auto-advance is a desktop-only behaviour (mobile is a tap-to-select
     stack). matchMedia keeps `autoRef` in sync across resizes. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => { autoRef.current = mq.matches; };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        onScreenRef.current = e.isIntersecting;
        if (e.isIntersecting) setEntered(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Paint the active cell's fill bar for a given cycle progress (0‒1): it
     wipes in from the left over the first FILL_FRAC of the cycle, then
     recedes toward the right for the remainder — the same two-stage visual
     the CSS keyframes used to produce, now sampled every frame. */
  const paintBar = (p: number) => {
    const bar = barRef.current;
    if (!bar) return;
    if (p < FILL_FRAC) {
      bar.style.transformOrigin = "left center";
      bar.style.transform = `scaleX(${p / FILL_FRAC})`;
    } else {
      bar.style.transformOrigin = "right center";
      bar.style.transform = `scaleX(${1 - (p - FILL_FRAC) / (1 - FILL_FRAC)})`;
    }
  };

  useEffect(() => {
    let raf = requestAnimationFrame(function tick(ts: number) {
      raf = requestAnimationFrame(tick);
      const paused = !onScreenRef.current || !autoRef.current;
      if (paused) {
        lastTsRef.current = ts;   // swallow the gap so we resume smoothly
        return;
      }
      if (lastTsRef.current == null) {
        lastTsRef.current = ts;
        return;
      }
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      let p = progressRef.current + dt / CYCLE_MS;
      if (p >= 1) {
        p = 0;
        const next = (activeRef.current + 1) % FEATURES.length;
        activeRef.current = next;
        setActive(next);
      }
      progressRef.current = p;
      paintBar(p);
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* When a new cell becomes active (auto-advance OR click) restart its cycle
     from 0 and immediately paint the fresh bar node. lastTs is nulled so the
     next frame doesn't count the gap since the previous one. */
  useEffect(() => {
    progressRef.current = 0;
    lastTsRef.current = null;
    paintBar(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const select = (i: number) => {
    if (i === active) return;
    activeRef.current = i;
    setActive(i);
  };

  return (
    <section
      ref={sectionRef}
      /* `zIndex: 1` lifts ComparisonSection's stacking context above
         SolutionShowcase's `isolate` so the picker card sits over the
         decorative line-art overflow. Section bg stays transparent so
         the harbour-town image is still visible in the empty space
         around the card — only the card itself (the `<ul>` below) gets
         an opaque white fill to mask the image where the picker UI is. */
      className="relative w-full pb-16 lg:pb-24"
      style={{ backgroundColor: "transparent", zIndex: 1 }}
    >
      <style>{CMP_CSS}</style>
      <div
        className="ent-content-bounds grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10 lg:gap-0 lg:items-stretch"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* ── Left: feature accordion. 24px corner, hairline #E7E7F1
            border, #FDFDFD off-white fill, overflow:hidden. At lg+ the
            right corners go square and the card merges flush into the
            host card on its right (which now wraps the real demo
            visual). Hairlines between cells, light gray-wash active
            state, hover wash on inactive cells. Inactive cells fade to
            opacity 0.4 so the active row reads loudest. The
            auto-advance progress bar is preserved on the active cell's
            bottom edge. ── */}
        <ul
          className="flex flex-col list-none m-0 p-0 lg:h-full overflow-hidden rounded-3xl lg:rounded-r-none border-2 border-(--ent-border-card)"
          style={{
            /* Opaque white fill so the SolutionShowcase harbour-town
               line-art that overflows down past its section can't show
               through the picker card. The page background is also
               #FFFFFF, so the card still reads as a hairline-bordered
               rectangle on the page — only the bleed-through is hidden.
               The active cell's own horizontal fill bar (see <li>
               styles) paints #F2F2F2 from left to right on top of this
               so the selection still feels like a "lifted" card. */
            background: "#FFFFFF",
          }}
        >
          {FEATURES.map((f, i) => {
            const isActive = i === active;
            const isLast = i === FEATURES.length - 1;
            return (
              <li
                key={f.title}
                /* Mobile selection-state: a static #F2F2F2 fill on the
                   active cell (matches the desktop fill-bar colour) so
                   tapping a row gives an obvious visual response — the
                   prior opacity-100 vs opacity-70 contrast alone was
                   nearly imperceptible on text. Desktop keeps the
                   animated fill-bar span below (lg:bg-transparent
                   reverts the <li> here so the bar paints on a clean
                   canvas without the static colour bleeding through).
                   `transition-[opacity,background-color]` smooths both
                   the opacity dip on inactive rows AND the bg swap when
                   the user selects a new row. */
                className={[
                  "relative lg:flex-1 lg:flex lg:flex-col transition-[opacity,background-color] duration-200",
                  isActive ? "opacity-100 bg-[#F2F2F2] lg:bg-transparent" : hoveredCard === i ? "opacity-100" : "opacity-70",
                ].join(" ")}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Countdown fill — when the cell becomes active the gray
                    fill wipes in from the LEFT over FILL_IN_MS, then recedes
                    anchored to the RIGHT for the rest of the cycle (left edge
                    slides rightward, fill thins). Both stages are painted
                    frame-by-frame by the component's rAF loop (paintBar) and
                    the cycle's completion there advances to the next slot —
                    the visible countdown IS the auto-advance timer. */}
                {isActive && (
                  /* `hidden lg:block` — the gray countdown bar is desktop
                     only. On mobile the section is a tap-to-select list (no
                     auto-advance); active-state feedback there comes from the
                     opacity-100 vs opacity-70 contrast on the parent <li>.
                     The bar's transform is written every frame by the rAF
                     loop via barRef — see paintBar in the component. */
                  <span
                    ref={barRef}
                    aria-hidden
                    className="absolute inset-0 hidden lg:block"
                    style={{
                      backgroundColor: "#F2F2F2",
                      transform: "scaleX(0)",
                      transformOrigin: "left center",
                      willChange: "transform",
                      zIndex: 0,
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={isActive}
                  className="relative z-10 w-full lg:h-full flex items-center text-left cursor-pointer px-6 md:px-10 py-7 md:py-8"
                >
                  {/* Two-column row: icon on the left, title +
                      tagline stacked on the right. items-center
                      vertically centers the icon against the
                      title+tagline block. The tagline always shows —
                      there's no expand-on-active animation anymore. */}
                  <div className="flex items-center gap-5">
                    {/* Feature icon — same glyph the demo on the
                        right shows in its icon rail for the
                        corresponding tab. Sized at 24px to align
                        with the title's cap-height; aria-hidden
                        since the title carries the label. */}
                    <span
                      aria-hidden
                      className="shrink-0 inline-flex items-center justify-center"
                      style={{ width: 24, height: 24, color: "#0B1B2B" }}
                    >
                      <f.Icon size={24} color="#0B1B2B" />
                    </span>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <span
                        className="text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                        style={{ color: "#0E173C", letterSpacing: "-0.01em" }}
                      >
                        {f.title}
                      </span>
                      <span
                        className="text-[14px] md:text-[15px] leading-[1.4]"
                        style={{
                          color: "var(--ent-text-secondary)",
                          letterSpacing: "-0.005em",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {(() => {
                          /* First line is rendered in the title colour (navy
                             #0E173C) and bumped up one weight level (default
                             400 → 500). The remaining lines keep the muted
                             secondary-text styling on the outer <span>. */
                          const [tagline, ...rest] = f.subtitle.split("\n");
                          const description = rest.join("\n");
                          return (
                            <>
                              <span
                                style={{
                                  display: "block",
                                  color: "#0E173C",
                                  fontWeight: 500,
                                  /* 5px gap between the tagline and the
                                     subdescription below it. */
                                  marginBottom: description ? 5 : 0,
                                }}
                              >
                                {tagline}
                              </span>
                              {description || null}
                            </>
                          );
                        })()}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Row separator — skipped on the last cell (the
                    container's own border handles the bottom edge). */}
                {!isLast && (
                  <span
                    className="absolute left-0 bottom-0 w-full"
                    style={{ height: 1, backgroundColor: SOFT }}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* ── Right: the host card. Outer corners (24px) match the
            left card; at lg+ the left side goes square and the left
            border drops, so the two cards share a single hairline
            seam and read as one rounded unit. overflow:hidden clips
            the demos to the host's rounded corners.

            Background is /BusinessPgMedia/EnvironmentalUseCases/Bg/env-bg-1.png — the sky +
            clouds + palm-tree hero photo from the user's design
            reference. Host fixed at 630px tall.

            ALL FOUR demos are pre-mounted inside the host (they all
            paint to the same top-left/width slot, sized wider than
            the host so the overflow clip reveals only the top-left
            portion). Only the active slot is `display:block`; the
            others are `display:none`. This makes the initial mount
            load every demo's images up-front, so clicking through
            the left feature list reads as flipping between live
            screens of the same app rather than as cross-fading
            between separate product screenshots. cmpFade is gone
            entirely — the swap is instant. ── */}
        <div
          className="cmp-host relative w-full min-w-0 overflow-hidden rounded-3xl lg:rounded-l-none border-2 border-(--ent-border-card) lg:border-l-0"
        >
          {/* Env-bg-1 sky/cityscape backdrop — fills the full card behind
              the swap-in mockup children (no inset; the overflow-hidden
              + rounded corners on the host still clip cleanly). */}
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{ inset: 0, zIndex: 0 }}
          >
            <ImageWithFallback
              src={envBg1}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 60vw"
              quality={80}
              placeholder="blur"
              loading={warm || entered ? "eager" : "lazy"}
              fetchPriority={warm || entered ? "low" : undefined}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          {FEATURES.map((_, i) => (
            /* Positioning is split between mobile (relative, full width,
               sits inside the host's 16px padding) and desktop (absolute,
               top:58 / left:88 / width:1180 — only top-left of the mockup
               peeks through the host's overflow-hidden crop). See .cmp-host
               and .cmp-host-visual media queries in CMP_CSS above. */
            <div
              key={i}
              className="cmp-host-visual"
              style={{ display: active === i ? "block" : "none" }}
            >
              {/* ScaleToFit is a passthrough on desktop (the .cmp-host-visual
                  is a fixed 1180px there, so the peek-crop is preserved) and a
                  faithful uniform-shrink on mobile (where it's width:100%). */}
              <ScaleToFit designWidth={1180} className="biz-scale-visual">
                <ActiveVisual active={i} preload={entered || warm} />
              </ScaleToFit>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
