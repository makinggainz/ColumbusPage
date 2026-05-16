"use client";

import { useEffect, type ReactNode } from "react";

/**
 * The rounded white "card" the entire site sits inside (experimentV6-Gdesign).
 *
 * Two scroll-driven transitions, run as a single animation curve `t`
 * (1 = rounded + inset 16px, 0 = full-bleed):
 *
 *   • Top reveal — from scrollY 0..SCROLL_RANGE: t animates 1 → 0
 *     (card expands toward the viewport edges).
 *   • Bottom reveal — over the final SCROLL_RANGE pixels of scroll
 *     before maxScroll: t animates 0 → 1 (card collapses back to the
 *     inset+rounded state, so the bottom edge has the same 13px corners
 *     and 30px gutter as the top of the page).
 *
 * The intermediate middle of the page sits at t = 0 (full-bleed).
 *
 * The transition runs as CSS variables (--frame-margin / --frame-radius)
 * on <html> so other elements that need to track the frame — most
 * importantly the sticky navbar's `top` — can read the same value and
 * stay aligned with the card edge during the transition.
 *
 * Footer reveal mechanic: `app/layout.tsx` renders `<Footer reveal />`
 * as a fixed, z-index 0 element at the viewport bottom. PageFrame is
 * z-index 1 with `margin-bottom: var(--footer-reveal-height)`, so the
 * body's scrollable area extends past the page content by exactly the
 * footer's height. As the user scrolls into that extra range, the
 * white card slides up over the fixed footer — revealing it — while
 * the bottom-reveal animation simultaneously restores the rounded
 * corners + 16px side gutter.
 */
const SCROLL_RANGE = 150;
const MAX_MARGIN = 30;
const MAX_RADIUS = 20;

export function PageFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Keep `--footer-reveal-height` in sync with the real footer DOM
    // height. The footer uses `reveal` mode → fixed + h-screen, so the
    // height is normally 100vh, but we measure it directly so the
    // margin-bottom and reveal range stay accurate if the footer
    // changes (e.g., different variants, resize, mobile).
    const footer = document.querySelector("[data-footer]") as HTMLElement | null;
    let ro: ResizeObserver | null = null;
    const applyFooterHeight = () => {
      const h = footer ? footer.offsetHeight : window.innerHeight;
      document.documentElement.style.setProperty(
        "--footer-reveal-height",
        `${h}px`,
      );
    };
    applyFooterHeight();
    if (footer && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(applyFooterHeight);
      ro.observe(footer);
    }
    window.addEventListener("resize", applyFooterHeight);

    let raf = 0;
    const apply = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(0, docHeight - viewportHeight);

      // Top reveal: 1 → 0 over the first SCROLL_RANGE pixels.
      const topProgress = Math.min(1, Math.max(0, scrollY / SCROLL_RANGE));

      // Bottom reveal: 0 → 1 over the final SCROLL_RANGE pixels before
      // maxScroll. Triggered once the user is within (footerHeight) of
      // the end so it begins as the fixed footer starts being revealed,
      // and completes by the time the footer is ~SCROLL_RANGE px in.
      const footerHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--footer-reveal-height",
          ),
        ) || 0;
      const revealStart = maxScroll - footerHeight;
      const bottomProgress =
        footerHeight > 0
          ? Math.min(1, Math.max(0, (scrollY - revealStart) / SCROLL_RANGE))
          : 0;

      const t = Math.max(1 - topProgress, bottomProgress);
      const margin = MAX_MARGIN * t;
      const radius = MAX_RADIUS * t;
      document.documentElement.style.setProperty("--frame-margin", `${margin}px`);
      document.documentElement.style.setProperty("--frame-radius", `${radius}px`);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        apply();
        raf = 0;
      });
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", applyFooterHeight);
      if (ro) ro.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        margin: "var(--frame-margin, 30px)",
        // Reserve scroll room below the card equal to the footer's
        // height so the user can scroll past the content and reveal
        // the fixed footer that sits behind it (z-index 0).
        marginBottom: "var(--footer-reveal-height, 100vh)",
        borderRadius: "var(--frame-radius, 20px)",
        // Off by default (navy backdrop on most routes). The homepage
        // sets --frame-shadow so the white card reads as a floating
        // panel against its white backdrop. Tracks the rounded corners.
        boxShadow: "var(--frame-shadow, none)",
        // 1px hairline matching the BentoProducts card stroke (#E7E7F1).
        border: "1px solid #E7E7F1",
        backgroundColor: "#FFFFFF",
        overflow: "clip",
        minHeight: "calc(100vh - var(--frame-margin, 30px) * 2)",
      }}
    >
      {children}
    </div>
  );
}
