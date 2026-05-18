"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Full-bleed page container (experimentV6-Gdesign-noFrame).
 *
 * The earlier "frame" treatment — a rounded white card inset by a 30px
 * gutter that expanded to full-bleed on scroll — has been removed. The
 * page now renders edge-to-edge at all times, like a normal page. The
 * frame CSS variables (--frame-margin / --frame-radius /
 * --frame-border-width) are pinned to 0 in globals.css so consumers that
 * still read them (e.g. the sticky navbar's `top`) stay aligned with the
 * viewport edge.
 *
 * Footer reveal mechanic (unchanged): `app/layout.tsx` renders
 * `<Footer reveal />` as a fixed, z-index 0 element at the viewport
 * bottom. This container is z-index 1 with `margin-bottom:
 * var(--footer-reveal-height)`, so the body's scrollable area extends
 * past the page content by exactly the footer's height. As the user
 * scrolls into that extra range, the white page slides up over the
 * fixed footer — revealing it.
 */
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

      // Footer-reached: flips true once the user scrolls ~halfway into the
      // footer reveal range, and false again only below ~38% (hysteresis
      // so jitter at the threshold doesn't flip it back and forth). Drives
      // the white→black backdrop + footer transition via the
      // [data-footer-reached] attribute on <html> — consumed by
      // globals.css (backdrop) and the .footer-reveal-overlay (Footer.tsx).
      const footerHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--footer-reveal-height",
          ),
        ) || 0;
      if (footerHeight > 0) {
        const revealStart = maxScroll - footerHeight;
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
        // Full-bleed: no gutter, no rounded corners, no border, no shadow.
        margin: 0,
        // Reserve scroll room below the page equal to the footer's
        // height so the user can scroll past the content and reveal
        // the fixed footer that sits behind it (z-index 0).
        marginBottom: "var(--footer-reveal-height, 100vh)",
        borderRadius: 0,
        border: "none",
        backgroundColor: "#FFFFFF",
        overflow: "clip",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
