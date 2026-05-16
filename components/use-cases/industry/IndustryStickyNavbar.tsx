"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useIndustry } from "./IndustryContext";
import { INDUSTRY_CONTENT, INDUSTRY_ORDER } from "./content";
import type { IndustryId } from "./types";

type IndustryStickyNavbarProps = {
  lightTheme?: boolean;
  /**
   * Distance (px) from the viewport top where this sub-navbar pins — must
   * equal the height of the main navbar above it. Defaults to 56 (the
   * columbus-solutions compact navbar). The business page's MistxNav is
   * taller, so it passes its own value.
   */
  topOffset?: number;
  /**
   * Restrict & order the industry links. Defaults to the full
   * INDUSTRY_ORDER; the business page passes the same reduced subset
   * as its IndustrySelector so the two stay in sync.
   */
  industries?: IndustryId[];
};

/**
 * Sticky industry sub-navbar — sits flush with the bottom of the compact
 * main Navbar (top: 56px, the compact-mode height defined in navbar.md).
 * Layout: a muted "Industry" label, a vertical separator, then a horizontal
 * scroll track of industry text-links. Edge gradients fade the track to
 * black on either side when there's more to scroll, and a small "next"
 * arrow on the right advances the active industry by one.
 *
 * Visible only while the four-row block intersects the viewport (observed
 * via the `[data-use-case-rows]` marker rendered by UseCaseStickyScroll).
 */
export default function IndustryStickyNavbar({ lightTheme = false, topOffset = 56, industries }: IndustryStickyNavbarProps) {
  const order = industries ?? INDUSTRY_ORDER;
  const { industryId, setIndustryId } = useIndustry();
  const [shown, setShown] = useState(false);
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });
  const trackRef = useRef<HTMLDivElement>(null);

  // Show/hide when the four-row block is in the viewport.
  useEffect(() => {
    const target = document.querySelector<HTMLElement>("[data-use-case-rows]");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { rootMargin: `-${topOffset}px 0px 0px 0px`, threshold: 0 },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [topOffset]);

  // Track horizontal scroll position so we can show / hide the edge gradients.
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    setScrollState((prev) =>
      prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd },
    );
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  // Auto-scroll the active link into view when the industry changes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLElement>(`[data-industry-link="${industryId}"]`);
    if (active) {
      active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    // The smooth scroll itself will fire 'scroll' events, but tap an extra
    // update so atStart / atEnd reflect the post-jump position immediately
    // for keyboard / button-driven flows.
    requestAnimationFrame(updateScrollState);
  }, [industryId, updateScrollState]);

  // Scroll the carousel track. By default it scrolls forward (right) by
  // roughly one viewport's worth of chips. Once the track has reached its
  // right end, the same arrow flips direction and rewinds to the start, so
  // the user can keep cycling without dragging. Does NOT change the
  // selected industry — selection is by direct chip click.
  const handleArrowClick = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    if (scrollState.atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const delta = Math.max(track.clientWidth * 0.7, 160);
      track.scrollBy({ left: delta, behavior: "smooth" });
    }
  }, [scrollState.atEnd]);

  // Theme tokens
  const containerBg = lightTheme
    ? "bg-white border-b border-[rgba(10,19,68,0.08)]"
    : "bg-black border-b border-white/10";
  const labelTextClass = lightTheme ? "text-[rgba(29,29,31,0.55)]" : "text-white/55";
  const separatorClass = lightTheme ? "bg-[rgba(10,19,68,0.18)]" : "bg-white/15";
  const idleLinkClass = lightTheme
    ? "text-[rgba(29,29,31,0.45)] hover:text-[#1D1D1F]"
    : "text-white/45 hover:text-white";
  const activeLinkClass = lightTheme ? "text-[#1D1D1F]" : "text-white";
  const activeUnderlineColor = lightTheme ? "bg-[#1D1D1F]" : "bg-white";

  // Edge fades — solid bg colour on the outer end fading to transparent on
  // the inner side, so they sit flat over the navbar's own bg.
  const fadeFromColor = lightTheme ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)";
  const fadeToColor = lightTheme ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)";

  const handleSelect = (id: IndustryId) => setIndustryId(id);

  return (
    <div
      className={`fixed left-0 right-0 z-40 w-full ${containerBg} transition-[opacity,transform] duration-300 ease-out`}
      style={{
        top: topOffset,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(-12px)",
        pointerEvents: shown ? "auto" : "none",
      }}
      aria-hidden={!shown}
    >
      <div className="flex items-center gap-4 px-6 md:px-10 py-3 max-w-[1287px] mx-auto">
        {/* Muted "Industry" label */}
        <span className={`shrink-0 text-[14px] font-medium ${labelTextClass}`}>
          Industry
        </span>

        {/* Vertical separator */}
        <div className={`shrink-0 w-px h-5 ${separatorClass}`} aria-hidden />

        {/* Scrollable track wrapper — contains the track + edge fade overlays */}
        <div className="relative flex-1 min-w-0">
          {/* Left edge fade — visible only when scrolled away from the start */}
          <div
            className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10 transition-opacity duration-200"
            style={{
              background: `linear-gradient(to right, ${fadeFromColor} 0%, ${fadeToColor} 100%)`,
              opacity: scrollState.atStart ? 0 : 1,
            }}
            aria-hidden
          />

          {/* Right edge fade — visible only when there's more to scroll */}
          <div
            className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10 transition-opacity duration-200"
            style={{
              background: `linear-gradient(to left, ${fadeFromColor} 0%, ${fadeToColor} 100%)`,
              opacity: scrollState.atEnd ? 0 : 1,
            }}
            aria-hidden
          />

          {/* Track */}
          <div
            ref={trackRef}
            className="flex items-center gap-7 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {order.map((id) => {
              const item = INDUSTRY_CONTENT[id];
              const isActive = industryId === id;
              return (
                <button
                  key={id}
                  type="button"
                  data-industry-link={id}
                  onClick={() => handleSelect(id)}
                  className={`relative shrink-0 whitespace-nowrap py-1 text-[14px] font-medium tracking-[-0.005em] transition-colors duration-200 ${
                    isActive ? activeLinkClass : idleLinkClass
                  }`}
                  aria-pressed={isActive}
                >
                  {item.shortName ?? item.name}
                  {isActive && (
                    <span
                      className={`absolute left-0 right-0 -bottom-0.5 h-px ${activeUnderlineColor}`}
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel arrow — scrolls the track forward by default. When the
            track is at its right end, the icon flips and clicking rewinds
            the track to the start. Selection is by direct chip click; this
            arrow never changes the active industry. */}
        <button
          type="button"
          onClick={handleArrowClick}
          className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-button transition-colors duration-200 ${
            lightTheme
              ? "text-[#1D1D1F] hover:bg-[rgba(10,19,68,0.06)]"
              : "text-white hover:bg-white/10"
          }`}
          aria-label={scrollState.atEnd ? "Scroll back to start" : "Scroll industries right"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{
              transform: scrollState.atEnd ? "rotate(180deg)" : "none",
              transition: "transform 220ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
