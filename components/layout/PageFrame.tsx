"use client";

import { useEffect, type ReactNode } from "react";

/**
 * The rounded white "card" the entire site sits inside (experimentV6-Gdesign,
 * V2 variant).
 *
 * V2 change: the card stays at a constant 16px gutter + 24px radius
 * the whole way down — the scroll-driven "expand to full-bleed then
 * collapse back" animation from V1 was removed. `--frame-margin` and
 * `--frame-radius` are still exposed as CSS variables on <html> so
 * the sticky navbar (which reads `--frame-margin` for its sticky
 * `top` offset) keeps working, but they are now static.
 *
 * Footer reveal mechanic preserved: `app/layout.tsx` renders
 * `<Footer reveal />` fixed at z-index 0; PageFrame is z-index 1 with
 * `margin-bottom: var(--footer-reveal-height)`, so the body's scrollable
 * area extends past the page content by exactly the footer's height
 * and the card slides up over the fixed footer to reveal it.
 */
const FRAME_MARGIN = 16;
const FRAME_RADIUS = 16;

export function PageFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Static frame variables — locked at the inset+rounded state for V2.
    document.documentElement.style.setProperty(
      "--frame-margin",
      `${FRAME_MARGIN}px`,
    );
    document.documentElement.style.setProperty(
      "--frame-radius",
      `${FRAME_RADIUS}px`,
    );

    // Keep --footer-reveal-height in sync with the real footer DOM
    // height so PageFrame's marginBottom always equals the footer's
    // height (otherwise the footer can't be revealed on scroll-past).
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
    return () => {
      window.removeEventListener("resize", applyFooterHeight);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        margin: "var(--frame-margin, 16px)",
        // Reserve scroll room below the card equal to the footer's
        // height so the user can scroll past the content and reveal
        // the fixed footer that sits behind it (z-index 0).
        marginBottom: "var(--footer-reveal-height, 100vh)",
        borderRadius: "var(--frame-radius, 24px)",
        backgroundColor: "#FFFFFF",
        overflow: "clip",
        minHeight: "calc(100vh - var(--frame-margin, 16px) * 2)",
      }}
    >
      {children}
    </div>
  );
}
