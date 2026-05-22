"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MapChatPlatform from "./MapChatPlatform";
import AgenticResearchMockup from "./AgenticResearchMockup";
import DataManagerMockup from "./DataManagerMockup";
import DashboardMockup from "./DashboardMockup";

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
      label: "Data Catalogue",
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

  return (
    <section
      ref={sectionRef}
      data-hero-section
      className="relative w-full"
      style={{
        backgroundColor: "var(--ent-bg-light)",
        // The section box is aspect-matched to the ColumBuzHero crop
        // (2044 × 2833 — the photo's width at the displayed-crop height),
        // so the section is exactly tall enough to contain the full crop:
        // the photo fills it edge-to-edge and does NOT bleed past it. The
        // ratio is ~80px taller than a straight top-25% crop would be, so
        // the crop frame sits ~80px higher up the photo (more sky shown).
        aspectRatio: "2044 / 2833",
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
      {/* Background image — the ColumBuzHero skyline photo. The layer fills
          the section (inset 0); the section box is aspect-matched to the
          crop (see above), so `cover` + `center bottom` trims the top of the
          plain sky and keeps the skyline + snowy park, with the photo
          contained entirely within the hero (no bleed past it). No mask is
          needed — the photo's own bottom edge is a snowy park that fades to
          white, dissolving into the white block below. */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/ColumBuzHero.png)",
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />
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
      {/* ── Text block ── */}
      {/* pt-[200px] restores the vertical breathing room previously
          provided by the removed ConsumerBusinessToggle wrapper
          (pt-32 + pill height ~43px + pb-10 ≈ 211px). */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[200px]" style={reveal(visible, 0.1)}>
        <h1
          className="text-white leading-[1.1] text-[39px] md:text-[49px] lg:text-[76px]"
          style={{ fontFamily: "var(--font-hero)", fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 900 }}
        >
          An Agentic GIS platform
        </h1>

        <p
          className="mt-5"
          style={{ fontSize: "var(--ent-text-body-l)", color: "#FFFFFF", letterSpacing: "-0.01em", fontWeight: 400, maxWidth: 480 }}
        >
          GIS so easy, the janitor could be your new researcher
        </p>

        {/* CTA — the site-wide on-brand pill button (bg-cta navy fill,
            white text, dot-arrow). Same idiom used on the homepage's
            ElioFinalCTA, the /company page, /not-found, and other primary
            CTAs across the site. */}
        <Link
          href="/maps-gpt"
          className="group mt-8 rounded-full px-7 py-3.5 text-sm leading-none flex items-center gap-2.5 transition-colors bg-cta text-white hover:text-[#154ACC]"
        >
          Start Now
          <span className="inline-block transition-transform group-hover:translate-x-0.5">
            <ArrowDots className="text-[#154ACC]" />
          </span>
        </Link>
      </div>

      {/* ── Product display — glass browser window ── */}
      <div
        className="relative z-10 flex justify-center w-full"
        style={{
          marginTop: "clamp(48px, 6vw, 80px)",
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: "clamp(64px, 9vw, 130px)",
          ...reveal(visible, 0.22),
        }}
      >
        {/* Glass frame — a 1.5px gradient ring forms the "dynamic" edge:
            the white translucent border brightens and fades around the
            window so it catches light like a pane of glass. */}
        <div
          style={{
            width: "100%",
            // Matches the site content bounds (.ent-content-bounds → 1287px),
            // the same width used by CapabilitiesGrid and other ent-scope
            // sections below. The 20px gutters on the wrapper above keep the
            // window from kissing the viewport edge on narrower screens.
            maxWidth: 1287,
            // Concentric with the window: 20px window radius + 1.5px ring.
            borderRadius: 21.5,
            padding: 1.5,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.28) 38%, rgba(255,255,255,0.04) 62%, rgba(255,255,255,0.55) 100%)",
            boxShadow: "0 30px 70px rgba(11,27,43,0.28), 0 2px 10px rgba(11,27,43,0.12)",
          }}
        >
          {/* Window (back div) — one continuous translucent glass surface.
              Its 4px of inset padding shows around the product image as a
              glass gutter; the title bar sits on this same glass (no border,
              no separate fill) so the strip above the image and the gutter
              around it read as one seamless pane. 20px radius = PageFrame. */}
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 20,
              overflow: "hidden",
              background: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Title bar — carries the traffic lights + tabs directly on
                the window glass: no own background and no bottom divider,
                so it flows seamlessly into the gutter around the image. */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(7px, 0.8vw, 10px)",
                height: "clamp(34px, 3.4vw, 46px)",
                paddingLeft: "clamp(15px, 1.7vw, 24px)",
                paddingRight: "clamp(12px, 1.5vw, 20px)",
              }}
            >
              {(["var(--ent-chrome-red)", "var(--ent-chrome-yellow)", "var(--ent-chrome-green)"] as const).map(c => (
                <div
                  key={c}
                  style={{
                    width: "clamp(10px, 1vw, 13px)",
                    aspectRatio: "1",
                    borderRadius: "50%",
                    backgroundColor: c,
                    boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
                  }}
                />
              ))}

              {/* Browser tabs — frosted-glass strips filling the space to
                  the right of the traffic lights. Active tab reads as the
                  foreground tab (brighter glass + ink label). */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(7px, 0.9vw, 12px)",
                  marginLeft: "clamp(12px, 1.5vw, 22px)",
                  height: "100%",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {tabs.map((tab, i) => {
                  const active = tab.id === activeTabId;
                  return (
                  <div
                    key={tab.id}
                    draggable
                    onClick={() => setActiveTabId(tab.id)}
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
                      gap: "clamp(4px, 0.5vw, 7px)",
                      height: "70%",
                      paddingLeft: "clamp(8px, 0.9vw, 13px)",
                      paddingRight: "clamp(6px, 0.7vw, 10px)",
                      // Subtle corner rounding — softer than the navbar-CTA
                      // ratio, which read as over-rounded at this tab height.
                      borderRadius: "clamp(6px, 0.6vw, 9px)",
                      background: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
                      border: `1px solid ${active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.22)"}`,
                      // Equal share of the tab row, capped at the midpoint
                      // between the compact (150) and full-stretch (220)
                      // sizes so the four tabs sit comfortably in the bar.
                      flex: "1 1 0",
                      minWidth: 0,
                      maxWidth: 185,
                      cursor: "pointer",
                      userSelect: "none",
                      transition: "background 200ms ease, border-color 200ms ease",
                    }}
                  >
                    {/* Feature icon — same SVG paths as the super-feature
                        section header below, scaled to the tab favicon
                        slot. Active tab uses the ink stroke; inactive
                        tabs are muted to match the secondary label color. */}
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={active ? "var(--ent-text-primary)" : "var(--ent-text-secondary)"}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: "clamp(11px, 1.2vw, 16px)",
                        height: "clamp(11px, 1.2vw, 16px)",
                        flexShrink: 0,
                      }}
                    >
                      {tab.icon}
                    </svg>
                    <span
                      style={{
                        fontSize: "clamp(8px, 0.85vw, 12px)",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        color: active ? "var(--ent-text-primary)" : "var(--ent-text-secondary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {tab.label}
                    </span>
                    <span
                      aria-hidden
                      style={{
                        fontSize: "clamp(9px, 1vw, 13px)",
                        lineHeight: 1,
                        color: "var(--ent-text-muted)",
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </span>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Product display — one of four mockup components composes
                the frame PNG with overlaid coded UI (map tiles, cards,
                chat panel) for the active tab. Each mockup ships with
                its own aspect-ratio + maxWidth + hairline border; we
                drop the aspect-locked image wrapper so the mockup
                renders at its native dimensions. A 4px gutter remains
                so the glass window shows around the mockup, and an
                override drops the mockup's own border so only the glass
                window chrome reads at the outer edge. */}
            <div
              style={{ padding: 4 }}
              className="hero-product-display"
            >
              {activeTabId === "map-chat" && <MapChatPlatform />}
              {activeTabId === "research" && <AgenticResearchMockup />}
              {activeTabId === "data" && <DataManagerMockup />}
              {activeTabId === "dashboard" && <DashboardMockup />}
            </div>
            <style>{`
              .hero-product-display > div {
                max-width: 100% !important;
                border: none !important;
                border-radius: 16px !important;
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
}
