"use client";

import { useEffect, type ReactNode } from "react";
import { Mail, Linkedin } from "lucide-react";

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

      {/* Bottom-middle cut-out — email + LinkedIn icons. Mirrors the
          BentoProducts audience notch: black panel matching the body
          backdrop, radial-gradient fillets rounding each convex corner
          into a smooth 13px arc. Reads as a piece bitten out of the
          white card's bottom edge. */}
      <div className="pf-cutout pf-cutout--bm">
        <a
          href="mailto:contact@columbus.earth"
          aria-label="Email Columbus Earth"
          className="pf-cutout-icon"
        >
          <Mail size={18} strokeWidth={1.6} />
        </a>
        <a
          href="https://www.linkedin.com/company/columbusearth/about/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Columbus Earth on LinkedIn"
          className="pf-cutout-icon"
        >
          <Linkedin size={18} strokeWidth={1.6} />
        </a>
      </div>

      {/* Bottom-right cut-out — "Columbus Earth" wordmark. Shares the
          frame's bottom-right rounded corner (20px); the top-left is the
          concave bite (13px). */}
      <div className="pf-cutout pf-cutout--br">
        <span className="pf-cutout-label">Columbus Earth</span>
      </div>

      <style>{`
        /* PageFrame bottom cut-outs — same mechanic as the BentoProducts
           audience notch (corner panel + radial-gradient fillets on the
           convex corners), mirrored to the bottom edge of the site card.
           Notch surface is painted #000000 to match the body backdrop set
           in globals.css, so each cut-out reads as a piece cut out of the
           white card exposing the dark surface behind it. */
        .pf-cutout {
          position: absolute;
          z-index: 4;
          box-sizing: border-box;
          height: 43px;
          background-color: #000000;
          display: flex;
          align-items: center;
          color: #FFFFFF;
        }

        /* Bottom-right: TL TR BR BL — TL is the concave bite, BR matches
           the frame's own bottom-right radius; TR + BL are squared and
           rounded by the fillets below. */
        .pf-cutout--br {
          bottom: 0;
          right: 0;
          padding: 0 28px;
          border-radius: 13px 0 var(--frame-radius, 20px) 0;
          justify-content: flex-end;
        }

        /* Bottom-middle: both top corners are concave (the bite); bottom
           corners are squared, rounded by fillets on either side. */
        .pf-cutout--bm {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          padding: 0 26px;
          border-radius: 13px 13px 0 0;
          gap: 22px;
          justify-content: center;
        }

        /* Corner fillets — 13×13 boxes painted black (extending the
           cut-out) everywhere except a transparent quarter-disc near the
           frame-interior corner, which lets the white card surface come
           through. Smooths each convex corner of the cut-out into a 13px
           arc instead of a hard 90° join. */
        .pf-cutout--br::before,
        .pf-cutout--br::after {
          content: "";
          position: absolute;
          width: 13px;
          height: 13px;
          background: radial-gradient(
            circle at left top,
            rgba(0, 0, 0, 0) 11.5px,
            #000000 13.5px
          );
        }
        .pf-cutout--br::before { top: -13px; right: 0; }
        .pf-cutout--br::after { bottom: 0; left: -13px; }

        .pf-cutout--bm::before,
        .pf-cutout--bm::after {
          content: "";
          position: absolute;
          width: 13px;
          height: 13px;
          bottom: 0;
        }
        .pf-cutout--bm::before {
          left: -13px;
          background: radial-gradient(
            circle at left top,
            rgba(0, 0, 0, 0) 11.5px,
            #000000 13.5px
          );
        }
        .pf-cutout--bm::after {
          right: -13px;
          background: radial-gradient(
            circle at right top,
            rgba(0, 0, 0, 0) 11.5px,
            #000000 13.5px
          );
        }

        /* Wordmark — Axiforma, same face the navbar's "Columbus Earth"
           wordmark uses (see globals.css --font-hero). */
        .pf-cutout-label {
          font-family: "Axiforma", "SF Pro", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1;
          color: #FFFFFF;
          white-space: nowrap;
        }

        .pf-cutout-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.85);
          transition: color 150ms ease;
        }
        .pf-cutout-icon:hover { color: #FFFFFF; }

        /* Notch height scales with breakpoint — mirrors BentoProducts. */
        @media (min-width: 640px) {
          .pf-cutout { height: 46px; }
          .pf-cutout--br { padding: 0 32px; }
          .pf-cutout--bm { padding: 0 30px; gap: 24px; }
        }
        @media (min-width: 1024px) {
          .pf-cutout { height: 53px; }
          .pf-cutout--br { padding: 0 40px; }
          .pf-cutout--bm { padding: 0 36px; gap: 28px; }
          .pf-cutout-label { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
