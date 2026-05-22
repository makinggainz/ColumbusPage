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

/* Scoped keyframes + chrome-strip rule:
   • cmpBarFill: the active row's progress-bar fill, end-of-animation drives auto-advance.
   • cmpFade: cross-fade when the right-side demo visual swaps.
   • .cmp-host-visual > *: kills the demo visual's OWN outer chrome
     (rounded corners, drop shadow, max-width) so it sits flush inside
     the right host card instead of looking like a floating product
     screenshot. Each demo (MapChatPlatform / *Mockup) sets those on
     its root via inline style; `!important` here beats inline. */
const CMP_CSS = `
@keyframes cmpBarFill { from { width: 0%; } to { width: 100%; } }
@keyframes cmpFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.cmp-host-visual > * { border-radius: 0 !important; box-shadow: none !important; max-width: none !important; margin: 0 !important; }
`;

/** Five-dot arrow used inside the site's CTA pills (see BusinessHero) —
   reused here so the accordion's expand cue matches the CTA buttons. */
function ArrowDots({ color }: { color: string }) {
  return (
    <svg width="10" height="14" viewBox="0 0 9 13" fill="none" aria-hidden>
      <circle cx="7.22" cy="6.589" r="1.28" fill={color} />
      <circle cx="4.658" cy="4.018" r="1.28" fill={color} />
      <circle cx="2.099" cy="1.46" r="1.28" fill={color} />
      <circle cx="4.658" cy="9.151" r="1.28" fill={color} />
      <circle cx="2.099" cy="11.718" r="1.28" fill={color} />
    </svg>
  );
}

/* ── Feature glyphs — the original four-icon set used by the left
   card before the real-visuals rewrite. Kept independent from the
   <IconChip> icons in BusinessUseCases because the left card here is
   an overview/index, not a duplicate of the section headers. ── */
type IcoProps = { size: number; color: string };
function GridIco({ size, color }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function SearchIco({ size, color }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
    </svg>
  );
}
function PenIco({ size, color }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
function DbIco({ size, color }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  );
}

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

/* The original four left-card slots — labels untouched from the
   pre-real-visuals version. The `Icon` is the chip glyph, the active
   slot drives <ActiveVisual /> on the right. */
const FEATURES = [
  {
    title: "Map Chat",
    desc: "Ask questions in plain language and watch Columbus build the map — filter, query, and explore your data through conversation.",
    Icon: SearchIco,
  },
  {
    title: "Reports",
    desc: "Turn any analysis into a polished, shareable report. Columbus drafts the narrative, charts, and sources so you don't have to.",
    Icon: PenIco,
  },
  {
    title: "Data Catalogue",
    desc: "Browse thousands of ready-to-use datasets — parcels, zoning, demographics — and drop them straight onto your map.",
    Icon: DbIco,
  },
  {
    title: "Dashboard",
    desc: "Keep every map, report, and dataset in one view. Track coverage and activity across your whole team at a glance.",
    Icon: GridIco,
  },
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
            background: "#FDFDFD",
          }}
        >
          {FEATURES.map((f, i) => {
            const isActive = i === active;
            const isLast = i === FEATURES.length - 1;
            const Icon = f.Icon;
            return (
              <li
                key={f.title}
                className={[
                  "relative lg:flex-1 lg:flex lg:flex-col transition-[background-color,opacity] duration-200",
                  isActive
                    ? "bg-[rgba(0,0,0,0.025)] opacity-100"
                    : "hover:bg-[rgba(0,0,0,0.015)] opacity-40",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-expanded={isActive}
                  className="w-full text-left cursor-pointer px-6 md:px-8"
                >
                  {/* header row */}
                  <div className="flex items-center gap-4 py-5">
                    {/* Icon chip — same dark-wash treatment as the
                        SuperFeatureSection IconChip used over "Ask,
                        Discover, Understand" (rgba(11,27,43,0.06) bg,
                        #0B1B2B stroke), but with the design system's
                        --ent-radius-card (7px) corner instead of a
                        full circle so the rounding lines up with the
                        rest of the page's card hierarchy. */}
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "var(--ent-radius-card)",
                        background: "rgba(11,27,43,0.06)",
                      }}
                    >
                      <Icon size={22} color="#0B1B2B" />
                    </span>
                    <span
                      className="flex-1 text-[21px] md:text-[22px] font-semibold leading-[1.2]"
                      style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
                    >
                      {f.title}
                    </span>
                    {/* CTA-style five-dot arrow — rotates down when active */}
                    <span
                      className="shrink-0"
                      style={{
                        transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                      aria-hidden
                    >
                      <ArrowDots color={isActive ? "var(--ent-text-primary)" : "var(--ent-text-secondary)"} />
                    </span>
                  </div>

                  {/* Expanded body — description. Uses a FIXED expanded
                      height instead of `maxHeight: 240`, so all four
                      features render the same active-row height regardless
                      of how their description wraps. Without this lock,
                      different desc lengths gave each feature a different
                      natural body height — the accordion column resized
                      between cycles and the page below shifted with it. */}
                  <div
                    style={{
                      height: isActive ? 130 : 0,
                      opacity: isActive ? 1 : 0,
                      overflow: "hidden",
                      transition: "height 0.45s ease, opacity 0.35s ease",
                    }}
                  >
                    <p
                      className="pb-6 text-[15px] leading-[1.55]"
                      style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.01em" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </button>

                {/* Row separator — skipped on the last cell (the
                    container's own border handles the bottom edge). The
                    active row's bottom doubles as the progress track and
                    its animation end drives the auto-advance. */}
                {!isLast && (
                  <span
                    className="absolute left-0 bottom-0 w-full"
                    style={{ height: 1, backgroundColor: SOFT }}
                    aria-hidden
                  />
                )}
                {isActive && (
                  <span
                    key={runId}
                    onAnimationEnd={advance}
                    className="absolute left-0 bottom-0"
                    style={{
                      height: 2,
                      backgroundColor: "var(--ent-accent)",
                      animation: `cmpBarFill ${CYCLE_MS}ms linear`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* ── Right: the host card. Outer corners (24px) match the left
            card; at lg+ the left side goes square and the left border
            drops, so the two cards share a single hairline seam and
            read as one rounded unit. overflow:hidden clips the demo's
            content to the host's rounded corners.

            The active demo visual sits inside via the .cmp-host-visual
            wrapper — its CSS rule strips the demo's OWN outer
            rounded-corner / drop-shadow / max-width chrome so the demo
            sits flush inside this host instead of floating with its
            own chrome on top. `key={active}` on the wrapper gives a
            fresh cmpFade remount each time the active slot switches. ── */}
        <div
          className="w-full min-w-0 overflow-hidden rounded-3xl lg:rounded-l-none border border-(--ent-border-card) lg:border-l-0"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div
            key={active}
            className="cmp-host-visual w-full h-full"
            style={{ animation: "cmpFade 0.4s ease" }}
          >
            <ActiveVisual active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
