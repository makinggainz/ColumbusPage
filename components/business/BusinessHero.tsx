"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { BUSINESS_HERO } from "@/lib/hero-assets";
import MapChatPlatform from "./MapChatPlatform";
import AgenticResearchMockup from "./AgenticResearchMockup";
import DataManagerMockup from "./DataManagerMockup";
import DashboardMockup from "./DashboardMockup";
import { ScaleToFit } from "../technology/redesign/ScaleToFit";

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
  // Tracks which tab the mouse is currently over so inactive tabs can
  // show a hover highlight (a darker translucent shape) without their
  // default state painting any background at all.
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
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
          src="/ColumbusBackgroundV2.png"
          alt=""
          aria-hidden
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          style={{ objectFit: "cover", objectPosition: "center 50%" }}
          // Instant low-res base: render the hero's blurDataURL as the
          // load/error surface instead of a flat grey skeleton, so the area
          // is never empty on (cross-page) navigation before the AVIF lands.
          fallbackStyle={{
            backgroundImage: `url(${BUSINESS_HERO.blurDataURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center 50%",
          }}
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

        <p
          className="mt-5"
          style={{ fontSize: "var(--ent-text-body-l)", color: "#FFFFFF", letterSpacing: "-0.01em", fontWeight: 400, maxWidth: 480 }}
        >
          Agentic GIS so easy, the janitor could be your new researcher
        </p>

        {/* CTA — the site-wide on-brand pill button (bg-cta navy fill,
            white text, dot-arrow). Same idiom used on the homepage's
            ElioFinalCTA, the /company page, /not-found, and other primary
            CTAs across the site. */}
        <Link
          href="/contact?tab=columbus-pro"
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
                  foreground tab (brighter glass + ink label). */}
              <div
                style={{
                  display: "flex",
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
                  // Selected tab paints the full Chrome silhouette
                  // (white body + matching white flares). Every other
                  // state leaves the tab body transparent — the hover
                  // highlight is a separate inset pill rendered below,
                  // shaped like a regular button (rounded all corners,
                  // confined to the tab body) so the flared base only
                  // appears for the active tab.
                  const tabBg = active ? "#FFFFFF" : "transparent";
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
                    onClick={() => setActiveTabId(tab.id)}
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
                      paddingLeft: "22px",
                      paddingRight: "14px",
                      // Top corners only — bottom is flat so the tab
                      // baseline meets the content area cleanly. Matches
                      // the Chrome tab silhouette (top-rounded, no
                      // bottom curve).
                      borderRadius: "12px 12px 0 0",
                      background: tabBg,
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
                      /* No background transition — the flared base
                         corners are conditionally-rendered divs that
                         appear instantly when a tab becomes active, so
                         transitioning the body fade-in created a visible
                         desync (flares snap in while the body still
                         interpolated). Snapping the body in instantly
                         matches the flares' arrival exactly. */
                      // Relative so each tab can host two absolute "ear"
                      // divs at its bottom-left and bottom-right that
                      // draw the Chrome-style flared base — concave
                      // wedges that connect the tab's straight side
                      // into the baseline below.
                      position: "relative",
                    }}
                  >
                    {/* Hover highlight — only inactive tabs get this.
                        An inset rounded pill (4px inset from every
                        edge, fully rounded) painted with a dark
                        translucent scrim so the hovered tab reads as
                        a darker shape against the frosted title bar.
                        Confined to the tab body — the flares stay
                        clear, so the hover effect looks like a button
                        highlight inside the tab rather than the full
                        Chrome silhouette (which is reserved for the
                        active tab). */}
                    {!active && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          // Frozen to desktop insets/radius — ScaleToFit shrinks the unit.
                          top: "4px",
                          left: "4px",
                          right: "4px",
                          bottom: "4px",
                          borderRadius: "10px",
                          background: hovered ? "rgba(255,255,255,0.12)" : "transparent",
                          transition: "background 180ms ease",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    {/* Tab flares — only the active tab gets these.
                        Two 16×16 masked squares pinned just outside the
                        bottom-left and bottom-right corners. Mask centre
                        sits at the FAR corner of each flare (away from
                        the tab AND away from the baseline — top-left of
                        the left flare, top-right of the right flare).
                        The cutout removes the far corner, leaving a
                        wedge whose right/bottom edges are flat (flush
                        against the tab edge and the baseline) and whose
                        outer edge is a smooth concave arc sweeping from
                        the baseline up-and-outward to 16px to the side
                        / 16px above the baseline. */}
                    {active && (
                      <>
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: `calc(-1 * ${flareSize})`,
                            bottom: 0,
                            width: flareSize,
                            height: flareSize,
                            background: tabBg,
                            WebkitMaskImage:
                              `radial-gradient(circle at top left, transparent ${flareSize}, black ${flareSize})`,
                            maskImage:
                              `radial-gradient(circle at top left, transparent ${flareSize}, black ${flareSize})`,
                            pointerEvents: "none",
                          }}
                        />
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            right: `calc(-1 * ${flareSize})`,
                            bottom: 0,
                            width: flareSize,
                            height: flareSize,
                            background: tabBg,
                            WebkitMaskImage:
                              `radial-gradient(circle at top right, transparent ${flareSize}, black ${flareSize})`,
                            maskImage:
                              `radial-gradient(circle at top right, transparent ${flareSize}, black ${flareSize})`,
                            pointerEvents: "none",
                          }}
                        />
                      </>
                    )}
                    {/* Feature icon — same SVG paths as the super-feature
                        section header below, scaled to the tab favicon
                        slot. Active tab uses the ink stroke; inactive
                        tabs are muted to match the secondary label color. */}
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={active ? "var(--ent-text-primary)" : "#FFFFFF"}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: "16px",
                        height: "16px",
                        flexShrink: 0,
                      }}
                    >
                      {tab.icon}
                    </svg>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        // Selected → ink (sits on the active tab's white
                        // silhouette). Inactive → pure white, full opacity
                        // on the navy dark-glass background.
                        color: active ? "var(--ent-text-primary)" : "#FFFFFF",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                        flex: 1,
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
              {activeTabId === "map-chat" && <MapChatPlatform eager />}
              {activeTabId === "research" && <AgenticResearchMockup />}
              {activeTabId === "data" && <DataManagerMockup />}
              {activeTabId === "dashboard" && <DashboardMockup />}
            </div>
            <style>{`
              .hero-product-display > div {
                max-width: 100% !important;
                border: none !important;
                /* 16px (matches the desktop mockup card), frozen — ScaleToFit
                   shrinks it so the inner mockup corner stays visually inboard
                   of the window's radius. */
                border-radius: 16px !important;
              }
            `}</style>
          </div>
        </div>
        </ScaleToFit>
      </div>
    </section>
  );
}
