"use client";

import Link from "next/link";
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
  /**
   * When true, this sub-navbar pins to the SAME top position the main
   * navbar uses (var(--frame-margin, 30px)) instead of sitting below it,
   * AND it broadcasts a window-level `industry-sticky-shown` CustomEvent
   * whenever its `shown` state flips. The main navbar listens for that
   * event and slides itself out of the way, so the industry picker
   * effectively REPLACES the navbar while it's active. Defaults to false
   * so existing callers (columbus-solutions) keep their stacked layout.
   */
  takeover?: boolean;
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
export default function IndustryStickyNavbar({ lightTheme = false, topOffset = 56, industries, takeover = false }: IndustryStickyNavbarProps) {
  const order = industries ?? INDUSTRY_ORDER;
  const { industryId, setIndustryId } = useIndustry();
  const [shown, setShown] = useState(false);
  /* Takeover-only: true while the user has scrolled UP by more than the
     coexist threshold since the last downward scroll. In this state the
     main navbar re-appears at the top slot and this sub-navbar drops
     back to its `effectiveTop` (under the navbar) position so both can
     coexist — the typical "scroll up to reveal navbar" pattern. */
  const [coexist, setCoexist] = useState(false);
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });
  const trackRef = useRef<HTMLDivElement>(null);
  // Dynamically measured bottom of the page header above this sub-navbar
  // so the two sit flush regardless of the header's actual height. Falls
  // back to the static `topOffset` prop until the measurement runs (and
  // for SSR), so the navbar still renders at a sensible position.
  const [measuredTop, setMeasuredTop] = useState<number | null>(null);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header");
    if (!header) return;
    const measure = () => {
      const rect = header.getBoundingClientRect();
      // The navbar slides itself out of the way with `transform:
      // translateY(-110%)` while the picker is in takeover mode. That
      // transform IS reflected in getBoundingClientRect, so when we
      // re-measure during takeover the bottom value is wildly negative
      // and won't represent where the navbar will land when it comes
      // back. Clamp to 0 in that case so we never anchor the picker
      // off-screen; once the navbar is back in view the next measurement
      // catches its real bottom.
      const bottom = rect.bottom > 0 ? rect.bottom : 0;
      setMeasuredTop(bottom);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    // Re-measure on scroll so the picker tracks the navbar's *current*
    // bottom when it slides back in from takeover (a CSS transform
    // change doesn't fire ResizeObserver, so without this listener the
    // measurement stays stuck at whatever bottom value was captured the
    // last time the observer fired — often the wrong value, which left
    // a visible gap between the navbar's bottom and the picker's top
    // in coexist mode).
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const effectiveTop = (measuredTop && measuredTop > 0) ? measuredTop : topOffset;

  /* Takeover-active means the sub-navbar is actively replacing the main
     navbar. While coexisting (user scrolled up past the threshold), the
     sub-navbar drops back to its under-navbar slot and the main navbar
     comes back. */
  const inTakeover = takeover && !coexist;
  /* In takeover mode this sub-navbar REPLACES the main navbar, so it
     must pin flush with the viewport top (top: 0) — same anchor the
     main navbar uses when stuck. Anchoring to `var(--frame-margin)`
     instead left a visible page-frame gutter (≈9px on the current
     frame) between the picker and the top of the screen. While
     coexisting under the main navbar, it still sits at `effectiveTop`
     (the measured navbar bottom) so the two stack flush. */
  const topPosition = inTakeover ? 0 : effectiveTop;

  /* Broadcast the effective takeover state so a takeover-capable main
     navbar hides only when this sub-navbar is actually replacing it (not
     when the two are coexisting after a scroll-up). Scoped to takeover
     mode so non-takeover pages don't fire stray events. */
  useEffect(() => {
    if (!takeover) return;
    window.dispatchEvent(
      new CustomEvent("industry-sticky-shown", { detail: shown && inTakeover }),
    );
  }, [shown, inTakeover, takeover]);

  /* Scroll-up reveal: while takeover is in play, an upward scroll of
     >100px brings the main navbar back and slides this sub-navbar down
     into its coexist position. Any downward scroll resets the threshold
     and re-engages takeover.

     Programmatic anchor jumps from the feature-index dispatch an
     `industry-index-jump` CustomEvent immediately before the browser
     starts smooth-scrolling. The jump usually moves upward, which would
     trip the coexist threshold and reveal the navbar for ~a second
     before snapping back. We use the event to clamp coexist off and
     ignore upward deltas for a short window after the jump. */
  useEffect(() => {
    if (!takeover) return;
    let lastY = window.scrollY;
    let upAccum = 0;
    let suppressUntil = 0;
    const THRESHOLD = 100;
    const SUPPRESS_MS = 1500;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      const now = performance.now();
      if (now < suppressUntil) {
        // Ignore deltas during the index-jump window; keep takeover
        // engaged and let the page settle before re-arming the
        // scroll-up reveal.
        upAccum = 0;
        lastY = y;
        return;
      }
      if (delta < 0) {
        upAccum += -delta;
        if (upAccum > THRESHOLD) setCoexist(true);
      } else if (delta > 0) {
        upAccum = 0;
        setCoexist(false);
      }
      lastY = y;
    };
    const onIndexJump = () => {
      suppressUntil = performance.now() + SUPPRESS_MS;
      upAccum = 0;
      setCoexist(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("industry-index-jump", onIndexJump);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("industry-index-jump", onIndexJump);
    };
  }, [takeover]);

  // Visibility: prefer the explicit industry sticky-zone wrapper if a
  // page provides one (e.g. business page wraps from the first super-
  // feature through the use-case rows so the navbar appears as soon as
  // the user scrolls into "Ask, Discover, Understand"). Fall back to
  // [data-use-case-rows] for pages that only render the use-case stack.
  //
  // Trigger geometry: the rootMargin shrinks the viewport into a 1px
  // strip at y=effectiveTop (the navbar's bottom edge). The picker is
  // "shown" only while the zone TARGET overlaps that strip — i.e. while
  // the zone is currently crossing the navbar line. This means the
  // picker waits until the section ABOVE the zone (the IndustrySelector
  // / "Tell us where you work") has fully scrolled past the navbar
  // before appearing, and hides again the moment the zone's bottom
  // clears the navbar on the way out.
  useEffect(() => {
    // Ensure we only run in the browser
    if (typeof window === "undefined") return;
    if (!Number.isFinite(effectiveTop)) return;

    const target =
      document.querySelector<HTMLElement>("[data-industry-sticky-zone]") ??
      document.querySelector<HTMLElement>("[data-use-case-rows]");
    if (!target) return;

    const setupObs = () => {
      const topValue = Math.max(0, Math.floor(effectiveTop));
      const bottomValue = Math.max(0, Math.floor(window.innerHeight - topValue - 1));
      const rootMarginString = `-${topValue}px 0px -${bottomValue}px 0px`;

      return new IntersectionObserver(
        ([entry]) => setShown(entry.isIntersecting),
        {
          rootMargin: rootMarginString,
          threshold: 0,
        },
      );
    };

    let obs: IntersectionObserver | null = null;
    try {
      obs = setupObs();
      obs.observe(target);
    } catch (e) {
      console.error("Failed to create IntersectionObserver:", e);
      return;
    }

    const onResize = () => {
      if (obs) {
        obs.disconnect();
      }
      try {
        obs = setupObs();
        obs.observe(target);
      } catch (e) {
        console.error("Failed to recreate IntersectionObserver on resize:", e);
      }
    };

    window.addEventListener("resize", onResize);
    return () => {
      if (obs) {
        obs.disconnect();
      }
      window.removeEventListener("resize", onResize);
    };
  }, [effectiveTop]);

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
        top: topPosition,
        /* In active takeover the picker should inherit the page frame's
           top corner curve so it visually replaces the main navbar with
           a continuous rounded card edge. While coexisting (main navbar
           visible above), the picker is a flat sub-bar — no corners. */
        borderTopLeftRadius: inTakeover ? "var(--frame-radius, 20px)" : undefined,
        borderTopRightRadius: inTakeover ? "var(--frame-radius, 20px)" : undefined,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(-12px)",
        pointerEvents: shown ? "auto" : "none",
      }}
      aria-hidden={!shown}
    >
      <div className="flex items-center gap-4 px-6 md:px-10 py-3 max-w-[1287px] mx-auto">
        {/* Columbus home logo + leading separator — visible ONLY in
            active takeover (the picker is replacing the main navbar).
            In coexist mode the main navbar above already shows its own
            logo, so this one is hidden to avoid two stacked logos. */}
        {inTakeover && (
          <>
            <Link
              href="/"
              aria-label="Home"
              className="shrink-0 inline-flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Columbus Logo"
                width={28}
                height={28}
                decoding="async"
                src="/logobueno.png"
                className="object-contain"
                style={{
                  filter: lightTheme
                    ? "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)"
                    : "brightness(0) invert(1)",
                }}
              />
            </Link>
            <div className={`shrink-0 w-px h-5 ${separatorClass}`} aria-hidden />
          </>
        )}

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
                  className={`relative shrink-0 cursor-pointer whitespace-nowrap py-1 text-[14px] font-medium tracking-[-0.005em] transition-colors duration-200 ${
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

      </div>
    </div>
  );
}
