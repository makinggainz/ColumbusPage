"use client";

import { useEffect, type ReactNode } from "react";

/**
 * The rounded white "card" the entire site sits inside.
 *
 * The card is flush to the viewport edges (margin = 0) with a fixed
 * MAX_RADIUS corner radius, so the site backdrop (black, set in
 * globals.css) only shows through the 4 corner wedges.
 *
 * The scroll-driven `t` curve is retained because it still drives the
 * footer-reached flip below (white→black backdrop swap on
 * [data-footer-reached]) and because external elements track
 * --frame-margin / --frame-radius (sticky navbar top + top corners,
 * IndustryStickyNavbar in-takeover state). Since MAX_MARGIN = 0 the
 * margin variable is effectively static at 0; radius is held static at
 * MAX_RADIUS so the rounded corners are preserved end-to-end.
 *
 * Footer reveal mechanic: `app/layout.tsx` renders `<Footer reveal />`
 * as a fixed, z-index 0 element at the viewport bottom. PageFrame is
 * z-index 1 with `margin-bottom: var(--footer-reveal-height)`, so the
 * body's scrollable area extends past the page content by exactly the
 * footer's height — letting the card slide up over the fixed footer.
 */
const SCROLL_RANGE = 150;
const MAX_MARGIN = 2;
const MAX_RADIUS = 20;
const MIN_BORDER = 0;

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
      const radius = MAX_RADIUS;
      const borderWidth = MIN_BORDER * t;
      document.documentElement.style.setProperty("--frame-margin", `${margin}px`);
      document.documentElement.style.setProperty("--frame-radius", `${radius}px`);
      document.documentElement.style.setProperty(
        "--frame-border-width",
        `${borderWidth}px`,
      );

      // Footer-reached: flips true once the user scrolls ~halfway into the
      // footer reveal range, and false again only below ~38% (hysteresis
      // so jitter at the threshold doesn't flip it back and forth). Drives
      // the white→black backdrop + footer transition via the
      // [data-footer-reached] attribute on <html> — consumed by
      // globals.css (backdrop) and the .footer-reveal-overlay (Footer.tsx).
      if (footerHeight > 0) {
        const root = document.documentElement;
        const reached = root.hasAttribute("data-footer-reached")
          ? scrollY >= revealStart + footerHeight * 0.38
          : scrollY >= revealStart + footerHeight * 0.5;
        root.toggleAttribute("data-footer-reached", reached);
      }
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
        // Drop shadow — set globally via --frame-shadow in globals.css so
        // the white card reads as a floating panel against the white
        // site backdrop on every route. Tracks the rounded corners.
        boxShadow: "var(--frame-shadow, none)",
        // No border frames the card.
        border: "none",
        backgroundColor: "#FFFFFF",
        overflow: "clip",
        minHeight: "calc(100vh - var(--frame-margin, 30px) * 2)",
      }}
    >
      {children}
    </div>
  );
}
