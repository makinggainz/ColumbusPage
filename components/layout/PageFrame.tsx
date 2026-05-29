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
 * white card slides up over the fixed footer, revealing it.
 *
 * Two scroll-driven attributes get pinned on <html>:
 *   • data-footer-near    — flips on ~1.5 viewports BEFORE the reveal
 *                           range. Footer.tsx watches this and starts
 *                           the 6.5MB footer-bg.mp4 transfer here so
 *                           the video is ready to play by the time the
 *                           reveal actually begins (the video element
 *                           ships with preload="none" + no autoplay,
 *                           so nothing transfers at boot).
 *   • data-footer-reached — flips on 50% into the reveal range, with
 *                           hysteresis back to 38%. Drives the visible
 *                           "footer fully revealed" state.
 */
const FRAME_MARGIN_PX = 9;
const FRAME_RADIUS_PX = 35;

export function PageFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--frame-margin", `${FRAME_MARGIN_PX}px`);
    root.style.setProperty("--frame-radius", `${FRAME_RADIUS_PX}px`);

    // First-paint shadow animation. The CSS default `--frame-shadow`
    // is the alpha-0 (invisible) variant; the visible variant only
    // resolves once `data-page-mounted` is set. We flip the attribute
    // on a short timeout (after one rAF so the browser commits the
    // hidden state as the transition's start value, then a 250ms
    // delay so the hero content lands first and the shadow blooms in
    // as a follow-up beat). Without the rAF the two states get
    // coalesced into one paint and the transition never fires.
    let mountTimeout = 0;
    const mountRaf = window.requestAnimationFrame(() => {
      mountTimeout = window.setTimeout(() => {
        root.toggleAttribute("data-page-mounted", true);
      }, 250);
    });

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
      // Page-scrolled flag — true any time the user has moved off the
      // very top of the page. Drives globals.css's `--frame-shadow`
      // alpha → 0 override so the PageFrame drop shadow fades out
      // while scrolling and fades back in when the user returns to the
      // top. 4px slack absorbs sub-pixel browser scroll quirks (e.g.
      // momentum overshoot near zero on iOS).
      root.toggleAttribute("data-page-scrolled", scrollY > 4);

      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(0, docHeight - viewportHeight);
      const footerHeight =
        parseFloat(
          getComputedStyle(root).getPropertyValue("--footer-reveal-height"),
        ) || 0;
      if (footerHeight <= 0) return;
      const revealStart = maxScroll - footerHeight;
      // Lazy-load trigger for the footer video. Fires 1.5 viewports
      // ahead of the reveal range so the 6.5MB transfer can finish
      // before the video is visually needed. One-way: the attribute is
      // only ever added — Footer.tsx watches once via MutationObserver
      // and disconnects after the first flip, so toggling it back off
      // would do nothing useful and just generate extra mutations.
      if (scrollY >= revealStart - footerHeight * 1.5) {
        root.toggleAttribute("data-footer-near", true);
      }
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
      window.cancelAnimationFrame(mountRaf);
      if (mountTimeout) window.clearTimeout(mountTimeout);
      root.removeAttribute("data-page-mounted");
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
        // Reserve scroll room below the card. Desktop default subtracts
        // 60px from the footer's height so the card's bottom edge ends
        // 60px below the footer's top edge at max scroll — the card's
        // rounded bottom corners then sit ON the footer's video bg
        // instead of above it on the white body background. Mobile
        // (<md) overrides the var in globals.css to drop the −60px, so
        // the card scrolls fully past the viewport top and the
        // min-h-screen footer reads as a dedicated full-viewport
        // surface (its sticky navbar is dragged out with the card).
        marginBottom: "var(--frame-bottom-margin, calc(var(--footer-reveal-height, 100vh) - 60px))",
        borderRadius: "var(--frame-radius, 35px)",
        boxShadow: "var(--frame-shadow, none)",
        // Easing for the scroll-driven shadow fade + the first-load
        // bloom-in — see globals.css's `data-page-mounted` /
        // `data-page-scrolled` overrides. 1100ms with a long-tail
        // ease-out so the halo settles in gently rather than snapping.
        transition: "box-shadow 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
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
