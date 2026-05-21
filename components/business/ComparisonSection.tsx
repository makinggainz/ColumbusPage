"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HAIRLINE = "1px solid var(--ent-border-card)";
const SOFT = "var(--ent-border-card)";

/* Each feature auto-advances after this long; the expanded item's
   horizontal progress bar is driven by the same CSS animation, so its end
   event triggers the advance — bar and timer stay in sync and pause
   together. */
const CYCLE_MS = 6000;

/* Scoped keyframes: the horizontal progress-bar fill and the cross-fade of
   the product display's body panel. Injected once per mount. */
const CMP_CSS = `
@keyframes cmpBarFill { from { width: 0%; } to { width: 100%; } }
@keyframes cmpFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
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

/* ── Small shared bits used by the body panels ── */
function Tab({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className="text-[14px] pb-2.5"
      style={{
        color: active ? "var(--ent-text-primary)" : "var(--ent-text-secondary)",
        fontWeight: active ? 600 : 400,
        borderBottom: active ? "2px solid var(--ent-text-primary)" : "none",
        marginBottom: active ? -1 : 0,
      }}
    >
      {children}
    </span>
  );
}
function Skel({ w }: { w: string }) {
  return <span className="block rounded-full" style={{ height: 8, width: w, backgroundColor: SOFT }} />;
}
function BarRow({ data, h }: { data: number[]; h: number }) {
  return (
    <div className="flex items-end gap-1.5" style={{ height: h }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-[3px]"
          style={{ height: `${v}%`, backgroundColor: "var(--ent-text-primary)", opacity: i % 2 ? 0.3 : 0.85 }}
        />
      ))}
    </div>
  );
}

/* ── The four product-display body panels (the middle panel of the mock
   app — the icon rail and map sidebar are rendered once, outside). ── */
function MapChatBody() {
  return (
    <>
      <div className="flex items-center gap-7" style={{ borderBottom: HAIRLINE }}>
        <Tab active>Chat</Tab>
        <Tab>Map Filters</Tab>
      </div>
      <p className="mt-7 text-[14px] font-semibold" style={{ color: "var(--ent-text-primary)" }}>General Chat</p>
      <p className="mt-6 text-[14px] font-semibold" style={{ color: "var(--ent-text-primary)" }}>Special Agents</p>
      <div className="mt-4 grid grid-cols-2 gap-3.5">
        {[0, 1, 2, 3].map(k => (
          <div
            key={k}
            className="relative flex items-end"
            style={{ border: HAIRLINE, borderRadius: "var(--ent-radius-card)", height: 88, padding: 14 }}
          >
            <span
              className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-full text-[10px]"
              style={{ width: 16, height: 16, border: HAIRLINE, color: "var(--ent-text-secondary)" }}
            >
              ?
            </span>
            <span className="text-[13px] font-medium" style={{ color: "var(--ent-text-primary)" }}>General Report</span>
          </div>
        ))}
      </div>
    </>
  );
}

function ReportsBody() {
  return (
    <>
      <div className="flex items-center gap-7" style={{ borderBottom: HAIRLINE }}>
        <Tab active>Report</Tab>
        <Tab>Sources</Tab>
      </div>
      <p className="mt-7 text-[15px] font-semibold" style={{ color: "var(--ent-text-primary)" }}>Q3 Market Coverage</p>
      <div className="mt-3 flex flex-col gap-2">
        <Skel w="100%" /><Skel w="92%" /><Skel w="74%" />
      </div>
      <div className="mt-5 p-4" style={{ border: HAIRLINE, borderRadius: "var(--ent-radius-card)" }}>
        <p className="text-[12px]" style={{ color: "var(--ent-text-secondary)" }}>Parcels analysed by quarter</p>
        <div className="mt-3">
          <BarRow data={[46, 72, 58, 88, 64, 78]} h={92} />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Skel w="88%" /><Skel w="63%" />
      </div>
    </>
  );
}

const DATASETS = [
  "Parcels — Hennepin County",
  "Zoning Districts",
  "Flood Risk Zones",
  "Census Blocks 2020",
  "Road Network",
];
function CatalogueBody() {
  return (
    <>
      <div className="flex items-center gap-7" style={{ borderBottom: HAIRLINE }}>
        <Tab active>Datasets</Tab>
        <Tab>Saved</Tab>
      </div>
      <div
        className="mt-5 flex items-center gap-2 px-3"
        style={{ border: HAIRLINE, borderRadius: "var(--ent-radius-card)", height: 36 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ent-text-secondary)" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
        </svg>
        <span className="text-[13px]" style={{ color: "var(--ent-text-secondary)" }}>Search 2,400 datasets</span>
      </div>
      <div className="mt-3 flex flex-col">
        {DATASETS.map((name, i) => (
          <div key={name} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < DATASETS.length - 1 ? HAIRLINE : "none" }}>
            <span
              className="flex items-center justify-center shrink-0 rounded-[7px]"
              style={{ width: 28, height: 28, border: HAIRLINE }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ent-text-secondary)" strokeWidth="1.8">
                <path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5" />
              </svg>
            </span>
            <span className="flex-1 min-w-0 truncate text-[13px] font-medium" style={{ color: "var(--ent-text-primary)" }}>{name}</span>
            <span
              className="text-[11px] px-2 py-0.5 shrink-0"
              style={{ border: HAIRLINE, borderRadius: 999, color: "var(--ent-text-secondary)" }}
            >
              GIS
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

const STATS = [
  { value: "128", label: "Active maps" },
  { value: "42", label: "Reports" },
  { value: "2.4k", label: "Datasets" },
];
function DashboardBody() {
  return (
    <>
      <div className="flex items-center gap-7" style={{ borderBottom: HAIRLINE }}>
        <Tab active>Overview</Tab>
        <Tab>Activity</Tab>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="p-3" style={{ border: HAIRLINE, borderRadius: "var(--ent-radius-card)" }}>
            <p className="text-[20px] font-semibold leading-none" style={{ color: "var(--ent-text-primary)" }}>{s.value}</p>
            <p className="mt-1.5 text-[12px]" style={{ color: "var(--ent-text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 p-4" style={{ border: HAIRLINE, borderRadius: "var(--ent-radius-card)" }}>
        <p className="text-[12px]" style={{ color: "var(--ent-text-secondary)" }}>Coverage over time</p>
        <div className="mt-3">
          <BarRow data={[38, 55, 48, 70, 62, 84, 76]} h={116} />
        </div>
      </div>
    </>
  );
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
    appLabel: "untitled chat",
    city: "Minneapolis",
    Body: MapChatBody,
  },
  {
    title: "Reports",
    desc: "Turn any analysis into a polished, shareable report. Columbus drafts the narrative, charts, and sources so you don't have to.",
    rail: 2,
    appLabel: "Q3 market coverage",
    city: "Hennepin County",
    Body: ReportsBody,
  },
  {
    title: "Data Catalogue",
    desc: "Browse thousands of ready-to-use datasets — parcels, zoning, demographics — and drop them straight onto your map.",
    rail: 3,
    appLabel: "data catalogue",
    city: "Twin Cities",
    Body: CatalogueBody,
  },
  {
    title: "Dashboard",
    desc: "Keep every map, report, and dataset in one view. Track coverage and activity across your whole team at a glance.",
    rail: 0,
    appLabel: "dashboard",
    city: "Minneapolis",
    Body: DashboardBody,
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

  const ActiveBody = FEATURES[active].Body;

  return (
    <section
      ref={sectionRef}
      className="relative w-full pb-16 lg:pb-24"
      style={{ backgroundColor: "transparent" }}
    >
      <style>{CMP_CSS}</style>
      <div
        className="ent-content-bounds px-4 md:px-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 items-center"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Left: feature accordion. Each row is clickable; the active
            row expands to reveal a description + horizontal progress bar
            (the bar drives the auto-advance). ── */}
        <ul className="flex flex-col list-none m-0 p-0">
          {FEATURES.map((f, i) => {
            const isActive = i === active;
            const Icon = RAIL[f.rail];
            return (
              <li key={f.title} className="relative">
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

                  {/* expanded body — description */}
                  <div
                    style={{
                      maxHeight: isActive ? 240 : 0,
                      opacity: isActive ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.45s ease, opacity 0.35s ease",
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

                {/* Row separator — doubles as the progress track. The
                    active row's separator fills with accent over the
                    cycle, and its animation end drives the auto-advance. */}
                <span
                  className="absolute left-0 bottom-0 w-full"
                  style={{ height: 1, backgroundColor: SOFT }}
                  aria-hidden
                />
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

        {/* ── Right: product display — a plain white card on the page ── */}
        <div
          className="w-full overflow-hidden"
          style={{
            border: HAIRLINE,
            borderRadius: "var(--ent-radius-card)",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* App top bar */}
          <div
            className="flex items-center gap-3 px-5"
            style={{ height: 52, borderBottom: HAIRLINE }}
          >
            <div className="flex flex-col gap-[3px]" aria-hidden>
              {[0, 1, 2].map(k => (
                <span key={k} className="block w-[15px] h-[1.5px]" style={{ backgroundColor: "var(--ent-text-primary)" }} />
              ))}
            </div>
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 22, height: 22, backgroundColor: "var(--ent-text-primary)" }}
              aria-hidden
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
            </span>
            <span className="text-[14px] font-semibold" style={{ color: "var(--ent-text-primary)" }}>Columbus</span>
            <span className="text-[13px]" style={{ color: "var(--ent-text-secondary)" }}>/&nbsp;&nbsp;{FEATURES[active].appLabel}</span>
            <span
              className="ml-auto flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5"
              style={{ border: HAIRLINE, borderRadius: "var(--ent-radius-card)", color: "var(--ent-text-primary)" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Report
            </span>
          </div>

          {/* App body */}
          <div className="flex" style={{ height: 420 }}>
            {/* Icon rail — clickable; each icon selects its feature. */}
            <div
              className="flex flex-col items-center py-4 gap-5 shrink-0"
              style={{ width: 52, borderRight: HAIRLINE }}
            >
              {RAIL.map((Ico, idx) => {
                const fi = FEATURES.findIndex(f => f.rail === idx);
                const isActive = idx === FEATURES[active].rail;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => select(fi)}
                    aria-label={FEATURES[fi].title}
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      backgroundColor: isActive ? "var(--ent-text-primary)" : "transparent",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <Ico size={isActive ? 15 : 17} color={isActive ? "#fff" : "var(--ent-text-secondary)"} />
                  </button>
                );
              })}
            </div>

            {/* Main panel — cross-fades on feature change. */}
            <div
              key={active}
              className="flex-1 min-w-0 px-7 py-6 overflow-hidden"
              style={{ animation: "cmpFade 0.4s ease" }}
            >
              <ActiveBody />
            </div>

            {/* Map panel — kept mounted across features (only the city
                label changes) so the image never reloads. */}
            <div
              className="relative shrink-0 hidden md:block"
              style={{ width: "36%", borderLeft: HAIRLINE }}
            >
              <Image src="/business/citymap.png" alt="" fill className="object-cover object-center" />
              <span
                className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white"
                style={{ width: 26, height: 26, border: HAIRLINE }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ent-text-primary)" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
              </span>
              <span
                className="absolute bottom-3 left-3 text-[12px] font-semibold px-2 py-1 rounded-[7px] bg-white/85"
                style={{ color: "var(--ent-text-primary)" }}
              >
                {FEATURES[active].city}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
