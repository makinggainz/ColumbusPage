"use client";

import { useEffect, type ReactNode } from "react";

/**
 * The rounded white "card" the entire site sits inside. The card is
 * STATIC — 9px top gutter, 35px corner radius, flush left/right — and
 * does not change shape with scroll.
 *
 * Two CSS vars are pinned on <html> so other elements that need to
 * track the frame (notably the sticky navbar's `top` and the products
 * Hero's corner cut-outs) read the same values:
 *   • --frame-margin   → 9px   (top gutter)
 *   • --frame-radius   → 35px  (top + bottom corner radius)
 *
 * Footer reveal mechanic: `app/layout.tsx` renders `<Footer reveal />`
 * as a fixed, z-index 0 element at the viewport bottom. PageFrame is
 * z-index 1 with `margin-bottom: var(--footer-reveal-height)`, so the
 * body's scrollable area extends past the page content by exactly the
 * footer's height. As the user scrolls into that extra range, the
 * white card slides up over the fixed footer, revealing it. Once the
 * user is far enough into that reveal range, `data-footer-reached` is
 * set on <html>, which globals.css uses to fade the white
 * `.footer-reveal-overlay` off the footer.
 */
const FRAME_MARGIN_PX = 9;
const FRAME_RADIUS_PX = 35;

export function PageFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--frame-margin", `${FRAME_MARGIN_PX}px`);
    root.style.setProperty("--frame-radius", `${FRAME_RADIUS_PX}px`);

    // Keep `--footer-reveal-height` in sync with the real footer DOM
    // height so margin-bottom + reveal-range computations stay accurate
    // across variants and viewport resizes.
    const footer = document.querySelector("[data-footer]") as HTMLElement | null;
    let ro: ResizeObserver | null = null;
    const applyFooterHeight = () => {
      const h = footer ? footer.offsetHeight : window.innerHeight;
      root.style.setProperty("--footer-reveal-height", `${h}px`);
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
      const footerHeight =
        parseFloat(
          getComputedStyle(root).getPropertyValue("--footer-reveal-height"),
        ) || 0;
      if (footerHeight <= 0) return;
      const revealStart = maxScroll - footerHeight;
      // Hysteresis: flip true at 50% into the reveal range, flip back
      // only below 38% — keeps jitter at the threshold from toggling.
      const reached = root.hasAttribute("data-footer-reached")
        ? scrollY >= revealStart + footerHeight * 0.38
        : scrollY >= revealStart + footerHeight * 0.5;
      root.toggleAttribute("data-footer-reached", reached);
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
        // Top-only gutter. No left/right gutter — the card sits flush
        // against the viewport sides.
        marginTop: "var(--frame-margin, 9px)",
        marginLeft: 0,
        marginRight: 0,
        // Reserve scroll room below the card equal to the footer's
        // height so the user can scroll past the content and reveal
        // the fixed footer that sits behind it (z-index 0).
        marginBottom: "var(--footer-reveal-height, 100vh)",
        // Top corners only — bottom corners squared off so the card
        // sits flush against the footer it slides over (no rounded
        // gap between the white page bottom and the footer top edge).
        borderTopLeftRadius: "var(--frame-radius, 35px)",
        borderTopRightRadius: "var(--frame-radius, 35px)",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: "var(--frame-shadow, none)",
        border: "none",
        backgroundColor: "#FFFFFF",
        overflow: "clip",
        minHeight: "calc(100vh - var(--frame-margin, 9px))",
      }}
    >
      {children}
    </div>
  );
}
