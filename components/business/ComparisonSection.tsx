"use client";

import { useEffect, useRef, useState } from "react";
import MapChatPlatform from "./MapChatPlatform";
import DataManagerMockup from "./DataManagerMockup";
import AgenticResearchMockup from "./AgenticResearchMockup";
import DashboardMockup from "./DashboardMockup";

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
  map: "/ResidentialMaps/chat-platform-map.png",
  userQuery:
    "Show me which neighborhoods in Amsterdam have seen the largest rent increases over the past 5 years",
  responseIntro:
    "Here are the Amsterdam buurten with the steepest free-sector rent growth over the past five years",
  listTitle: "Top 4 Buurten by Free-Sector Rent Growth",
  listSubtitle: "Last 5 Years",
  listItems: [
    { rank: 1, name: "De Pijp-Noord", pct: "+28.4%" },
    { rank: 2, name: "Oud-West", pct: "+24.1%" },
    { rank: 3, name: "Indische Buurt", pct: "+21.6%" },
    { rank: 4, name: "Oostelijke Eilanden", pct: "+19.3%" },
  ],
  keyTakeaway:
    "Rent growth concentrates in tram-served buurten with tight new-build pipelines; independent business turnover lags the price rise by 18–24 months.",
};

/* Each feature auto-advances after this long; the expanded item's
   horizontal progress bar is driven by the same CSS animation, so its end
   event triggers the advance — bar and timer stay in sync and pause
   together. */
const CYCLE_MS = 6000;

/* Scoped CSS:
   • cmpBarFill: invisible 6s timer whose animation end advances the
     active slot. No visible progress bar on this layout.
   • .cmp-host-visual > *: kills only the box-shadow on each demo's
     outermost wrapper (MapChatPlatform / *Mockup all set a heavy
     floating-card shadow via inline style). Per the user's pass on
     this design, the demos shouldn't sit on a shadow — they should
     read as if you're clicking through the live app rather than
     swapping between framed product screenshots. Rounded corners
     and the rest of each demo's chrome stay intact. */
const CMP_CSS = `
@keyframes cmpBarFill { from { width: 0%; } to { width: 100%; } }
.cmp-host-visual > * { box-shadow: none !important; }
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
function ActiveVisual({ active }: { active: number }) {
  switch (active) {
    case 0:
      return <MapChatPlatform {...RESIDENTIAL_MAP_CHAT} />;
    case 1:
      return <AgenticResearchMockup industryId={RESIDENTIAL_INDUSTRY_ID} />;
    case 2:
      return <DataManagerMockup industryId={RESIDENTIAL_INDUSTRY_ID} />;
    case 3:
      return <DashboardMockup industryId={RESIDENTIAL_INDUSTRY_ID} />;
    default:
      return null;
  }
}

/* The four left-card slots. Layout per the user's design pass:
   numbered list (1, 2, 3, 4 — comma after each digit) with a
   short tagline below each title. Icons / arrows / expand-on-active
   descriptions from the previous design are all gone. Taglines lean
   into an expedition/captain metaphor that pairs with the new
   underwater env-bg-2 background on the right host. */
const FEATURES = [
  { title: "Map Chat", subtitle: "Chart your own expedition" },
  { title: "Reports", subtitle: "set our fleet to discover" },
  { title: "Data Catalogue", subtitle: "Browse everything we've discovered" },
  { title: "Dashboard", subtitle: "Your captain's view" },
] as const;

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  /* Bumped on every advance/click to remount the progress fill so its
     CSS animation restarts from 0. */
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setOnScreen(e.isIntersecting);
        if (e.isIntersecting) setEntered(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Cycling pauses off-screen or while the user is reading (hover). */
  const paused = !onScreen || hovered;

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setRunId(r => r + 1);
  };
  const advance = () => {
    setActive(a => (a + 1) % FEATURES.length);
    setRunId(r => r + 1);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full pb-16 lg:pb-24"
      style={{ backgroundColor: "transparent" }}
    >
      <style>{CMP_CSS}</style>
      <div
        className="ent-content-bounds px-4 md:px-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-0 lg:items-stretch"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
          className="flex flex-col list-none m-0 p-0 lg:h-full overflow-hidden rounded-3xl lg:rounded-r-none border border-(--ent-border-card)"
          style={{
            /* Inactive cells take this surface as their fill — same
               #F7F7F7 the SuperFeatureSection panels below use. The
               active cell paints white on top of this (see <li>
               styles), so the selection feels like a "lifted" card
               rising above the muted backdrop. */
            background: "#F7F7F7",
          }}
        >
          {FEATURES.map((f, i) => {
            const isActive = i === active;
            const isLast = i === FEATURES.length - 1;
            return (
              <li
                key={f.title}
                className={[
                  "relative lg:flex-1 lg:flex lg:flex-col transition-[background-color,opacity] duration-200",
                  /* Active cell paints WHITE on top of the ul's
                     #F7F7F7 surface so it reads as a lifted card.
                     Inactive cells leave the ul bg showing through
                     (so they sit at #F7F7F7) and fade to 0.4 opacity
                     so the active row is unambiguously the
                     selected one. */
                  isActive
                    ? "bg-white opacity-100"
                    : "bg-transparent opacity-40",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={isActive}
                  className="w-full text-left cursor-pointer px-6 md:px-10 py-7 md:py-8"
                >
                  {/* Two-column row: numeric prefix on the left, title +
                      tagline stacked on the right. items-start aligns the
                      number with the title's first baseline (close
                      enough at this size). The tagline always shows —
                      there's no expand-on-active animation anymore. */}
                  <div className="flex items-start gap-5">
                    <span
                      className="text-[21px] md:text-[22px] font-semibold leading-[1.2] shrink-0"
                      style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
                    >
                      {i + 1},
                    </span>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <span
                        className="text-[21px] md:text-[22px] font-semibold leading-[1.2]"
                        style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
                      >
                        {f.title}
                      </span>
                      <span
                        className="text-[14px] md:text-[15px] leading-[1.4]"
                        style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.005em" }}
                      >
                        {f.subtitle}
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
                {/* Invisible auto-advance timer — animation end fires
                    advance() so the active slot still cycles every
                    CYCLE_MS even though the visible progress bar from
                    the previous design is gone. */}
                {isActive && (
                  <span
                    key={runId}
                    onAnimationEnd={advance}
                    aria-hidden
                    style={{
                      position: "absolute",
                      width: 0,
                      height: 0,
                      opacity: 0,
                      pointerEvents: "none",
                      animation: `cmpBarFill ${CYCLE_MS}ms linear`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
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

            Background is /Environmental/env-bg-1.png — the sky +
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
          className="relative w-full min-w-0 overflow-hidden rounded-3xl lg:rounded-l-none border border-(--ent-border-card) lg:border-l-0"
          style={{
            backgroundImage: "url('/Environmental/env-bg-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: 630,
          }}
        >
          {FEATURES.map((_, i) => (
            <div
              key={i}
              className="cmp-host-visual absolute"
              style={{
                top: 58,
                left: 58,
                width: 1180,
                display: active === i ? "block" : "none",
              }}
            >
              <ActiveVisual active={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
