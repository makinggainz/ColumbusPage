"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MapChatPlatform from "./MapChatPlatform";
import DashboardListMockup from "./superFeatureRows/DashboardListMockup";

/* Each feature auto-advances after this long; the expanded item's
   horizontal progress bar is driven by the same CSS animation, so its end
   event triggers the advance — bar and timer stay in sync and pause
   together. */
const CYCLE_MS = 6000;

/* Scoped keyframes + chrome-strip rule:
   • cmpBarFill drives the active row's invisible auto-advance timer.
   • cmpFade cross-fades the right-side demo visual when the active
     feature switches.
   • .cmp-host-visual > * kills each demo's own outer rounded corners,
     drop shadow, max-width, and mx-auto margin so the demo sits flush
     inside the right host. V2 bumps the right host to the 24px
     --ent-radius-2xl corner (was 7px on append-simplifiedB) to match
     the active left cell now that the outer panel is gone — overflow:
     hidden on the host clips the demo to that 24px corner.
     `!important` beats each demo's inline style on the wrapping root. */
const CMP_CSS = `
@keyframes cmpBarFill { from { width: 0%; } to { width: 100%; } }
@keyframes cmpFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.cmp-host-visual > * { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; max-width: none !important; margin: 0 !important; }
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

/* ── Shared feature glyphs. Each feature renders the same glyph in the
   left accordion and in the mock app's icon rail. ── */
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
/* Glyph order, top→bottom in the rail. A feature's `rail` index points
   into this — and the accordion reads the same glyph from it. */
const RAIL = [GridIco, SearchIco, PenIco, DbIco];

/* Residential dashboard rows — pulled verbatim from the residential
   entry in this branch's BusinessUseCases.tsx (RESIDENTIAL_COPY.rows
   .dashboard). Inlined so the right-side Dashboard preview shows the
   same Madrid-area history list the user will see in the live
   industry section below, instead of DashboardListMockup's default
   Minneapolis rows. */
const RESIDENTIAL_DASHBOARD_ROWS = [
  {
    title: "Madrid metro parcels over 5,000 m² zoned for residential",
    body: "In this chat we filtered undeveloped parcels within 1km of a metro station and owned by a single entity for 10+ years.",
    age: "20 hours ago",
  },
  {
    title: "Alcobendas — 12,000 m² parcel acquisition due diligence",
    body: "In this chat we evaluated a 60-unit residential project against zoning, absorption rate, and competitor pipeline.",
    age: "1 day ago",
  },
  {
    title: "Madrid neighborhoods forecasted for highest single-family price growth",
    body: "In this chat we ranked districts by demographic trajectory, lot-price recency, and planned infrastructure.",
    age: "2 days ago",
  },
  {
    title: "Family-friendliness density layer across central Madrid",
    body: "In this chat we built a custom smart layer combining schools, parks, pediatric clinics, and grocery access.",
    age: "3 days ago",
  },
  {
    title: "Valencia province mid-rise residential site shortlist",
    body: "In this chat Columbus ranked 15 development sites against your 8,000–20,000 m² envelope and 30-min city-center radius.",
    age: "4 days ago",
  },
  {
    title: "East Austin maximum buildable envelope audit",
    body: "In this chat we audited the legal cap on residential square footage under SF-3 zoning + HOME Initiative Phase 2 amendments.",
    age: "5 days ago",
  },
];

/* Renders the real SuperFeatureSection demoVisual for the active slot.
   Slot → visual mapping mirrors the four SuperFeatureSection blocks in
   this branch's BusinessUseCases.tsx (note this differs from
   experimentV6-Gdesign — that branch has dedicated *Mockup components
   for each section, while here Data Catalogue uses a static image and
   Agentic Research reuses MapChatPlatform):
     • Map Chat       → MapChatPlatform w/ Madrid map     (id=chat)
     • Reports        → MapChatPlatform w/ Madrid map     (id=agentic-research)
     • Data Catalogue → /dataCataSm.png in a 16:9 frame   (id=data-catalogue)
     • Dashboard      → DashboardListMockup (Madrid rows) (id=dashboard)

   Slots 0 and 1 are deliberately identical — this branch's
   BusinessUseCases reuses MapChatPlatform for both the chat section
   and the agentic-research section, so the preview mirrors that. */
function ActiveVisual({ active }: { active: number }) {
  switch (active) {
    case 0:
    case 1:
      return <MapChatPlatform map="/MadridMap.png" />;
    case 2:
      return (
        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          <Image
            src="/dataCataSm.png"
            alt="Columbus data manager"
            fill
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover object-center"
          />
        </div>
      );
    case 3:
      return <DashboardListMockup rows={RESIDENTIAL_DASHBOARD_ROWS} />;
    default:
      return null;
  }
}

/* The left accordion's items. Each carries the expanded description and
   the product display it drives: the `rail` index picks the shared glyph
   (used by both the accordion and the mock app's rail), plus the app
   label, the map city, and the body panel. */
const FEATURES = [
  {
    title: "Map Chat",
    desc: "Ask questions in plain language and watch Columbus build the map — filter, query, and explore your data through conversation.",
    rail: 1,
  },
  {
    title: "Reports",
    desc: "Turn any analysis into a polished, shareable report. Columbus drafts the narrative, charts, and sources so you don't have to.",
    rail: 2,
  },
  {
    title: "Data Catalogue",
    desc: "Browse thousands of ready-to-use datasets — parcels, zoning, demographics — and drop them straight onto your map.",
    rail: 3,
  },
  {
    title: "Dashboard",
    desc: "Keep every map, report, and dataset in one view. Track coverage and activity across your whole team at a glance.",
    rail: 0,
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
      {/* Structural wrapper only — the previous version was a visible
          panel card (bg-card + hairline + 24px radius) that wrapped
          both columns. V2 drops that visible container so the left
          feature stack and the right product card each float alone
          against the page background. The wrapper still carries the
          entry animation + hover-pause hooks; its chrome styles are
          gone. The active feature row picks up the old panel's
          --ent-bg-card surface as its own fill (see <li> below) so the
          design-system tint isn't lost — it just moves from the
          encompassing box to the single selected cell. */}
      <div
        className="ent-content-bounds"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
      <div
        className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 lg:items-stretch"
        style={{
          paddingTop: "var(--ent-space-12)",
          paddingBottom: "var(--ent-space-12)",
          paddingLeft: "clamp(20px, 3vw, 40px)",
          paddingRight: "clamp(20px, 3vw, 40px)",
        }}
      >
        {/* ── Left: feature accordion. Each row is clickable; the active
            row expands to reveal a description + horizontal progress bar
            (the bar drives the auto-advance). The ul stretches to the row
            height (matching the product display on the right at lg+); each
            <li> uses `flex-1` so the four feature rows share that height
            equally instead of stacking compactly at the top. ── */}
        <ul className="flex flex-col list-none m-0 p-0 lg:h-full">
          {FEATURES.map((f, i) => {
            const isActive = i === active;
            const Icon = RAIL[f.rail];
            return (
              <li
                key={f.title}
                className="relative lg:flex-1 lg:flex lg:flex-col"
                style={{
                  /* V2: only the actively-selected cell carries a
                     fill. No hairline border on any cell — the active
                     state is signalled by the wash + opacity:1
                     (inactive cells stay transparent and fade to 0.4).
                     Fill is #F7F7F7 to match the panel surface
                     SuperFeatureSection uses for the super sections
                     further down the page (see SuperFeatureSection.tsx
                     line 157), so the selected feature reads as a
                     preview tile of the same surface family. */
                  backgroundColor: isActive ? "#F7F7F7" : "transparent",
                  borderRadius: "var(--ent-radius-2xl)",
                  opacity: isActive ? 1 : 0.4,
                  paddingLeft: 16,
                  paddingRight: 16,
                  transition:
                    "opacity 0.35s ease, background-color 0.35s ease",
                }}
              >
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-expanded={isActive}
                  className="w-full text-left cursor-pointer"
                >
                  {/* header row */}
                  <div className="flex items-center gap-4 py-5">
                    <Icon size={25} color={isActive ? "var(--ent-text-primary)" : "var(--ent-text-secondary)"} />
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

                {/* Invisible timing element — drives the auto-advance via
                    its CSS animation end. The visible row separator and
                    progress fill were removed to match the cleaner card
                    treatment; the animation itself still runs so each
                    feature still cycles after CYCLE_MS. */}
                {isActive && (
                  <span
                    key={runId}
                    onAnimationEnd={advance}
                    style={{
                      position: "absolute",
                      width: 0,
                      height: 0,
                      opacity: 0,
                      pointerEvents: "none",
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

        {/* ── Right: host card. V2 tweaks: corner radius bumped to
            24px (--ent-radius-2xl) to match the active left cell now
            that both cards float against the page background. The
            inner left-cell borders are still dropped, but the product
            display itself carries a subtle 1px --ent-border-dark-grid
            hairline (same border the SuperFeatureSection panels below
            use) so it reads as a defined surface against the page.
            overflow:hidden still clips the demo to the host's 24px
            corners. Inside, the .cmp-host-visual wrapper renders the
            active <ActiveVisual /> with the demo's own outer chrome
            (radius / shadow / max-width / border) stripped via the
            CSS rule above. `key={active}` gives a fresh cmpFade
            remount each time the active slot switches. ── */}
        <div
          className="w-full overflow-hidden"
          style={{
            border: "1px solid var(--ent-border-dark-grid)",
            borderRadius: "var(--ent-radius-2xl)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            key={active}
            className="cmp-host-visual w-full"
            style={{ animation: "cmpFade 0.4s ease" }}
          >
            <ActiveVisual active={active} />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
