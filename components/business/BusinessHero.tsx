"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const reveal = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(14px)",
  transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
});

export default function BusinessHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  // Browser-tab mock: selectable (click to activate) and reorderable
  // (drag a tab onto another to swap its position in the order).
  const [tabs, setTabs] = useState([
    { id: "columbus", label: "Columbus" },
    { id: "site-report", label: "Site Report" },
    { id: "trade-area", label: "Trade Area" },
    { id: "new-tab", label: "New Tab" },
  ]);
  const [activeTabId, setActiveTabId] = useState("columbus");
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
        // Height is content-driven: the section is just tall enough for the
        // hero copy + product window. The background photo (below) is taller
        // than this and bleeds DOWN past the section over the next block.
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
      {/* Background image — the ColumBuzHero skyline photo. The layer has a
          fixed 2044 × 2715 box (the photo's width at 0.75 × its height), so
          `cover` + `center bottom` crops the top ~25% (plain sky) and keeps
          the skyline + snowy park. It is anchored to the hero's top edge
          (top: 0); being taller than the hero content, its lower part bleeds
          DOWN past the section and over the white background of the block
          below — no mask is needed because the photo's own bottom edge is a
          snowy park that fades to white, so it dissolves into that white
          block. */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          aspectRatio: "2044 / 2715",
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

        <Link
          href="/contact"
          className="group flex items-center gap-3 mt-8 text-[18px] lg:text-[20px] text-white font-semibold transition-opacity"
        >
          <span className="transition-colors duration-300 group-hover:text-(--ent-accent)">Talk to Founders</span>
          <svg
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            width="9" height="16" viewBox="0 0 7 12" fill="none"
            stroke="var(--ent-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M1 1l5 5-5 5" />
          </svg>
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
            maxWidth: 1100,
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
                  the right of the traffic lights. First tab reads as the
                  active/foreground tab (brighter glass + ink label). */}
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
                    <div
                      style={{
                        width: "clamp(11px, 1.2vw, 16px)",
                        aspectRatio: "1",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #74A0FE 0%, #1451E8 100%)",
                        flexShrink: 0,
                      }}
                    />
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

            {/* Product image — the Columbus bento visual from the homepage,
                inset 4px on all sides so the translucent window glass shows
                through as a gutter (including a 4px strip below the title
                bar, which keeps the rounded top corners clean). All four
                corners are rounded 20px to match the window and PageFrame;
                the image is slightly translucent so the glass reads through. */}
            <div style={{ padding: 4 }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1654 / 951",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/ColumbusHomeimg.png"
                  alt="Columbus map intelligence platform"
                  fill
                  priority
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  className="object-cover object-center"
                  style={{ opacity: 0.9 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
