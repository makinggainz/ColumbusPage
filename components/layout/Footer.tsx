"use client";

import type { FC } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";

export type FooterProps = {
  variant?: "default" | "compact";
  reveal?: boolean;
  theme?: "light" | "dark" | "light-blue";
  /** Optional override for the footer background color. Currently
   *  accepted but not rendered — kept for forward-compat with callers
   *  (e.g. RootShell) that already pass a value. */
  bg?: string;
  /** Optional decorative background image path. Currently accepted but
   *  not rendered — kept for forward-compat with callers. */
  bgImage?: string;
};

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false, theme = "light" }) => {
  const bgColor = theme === "dark" ? "#000000" : theme === "light-blue" ? "#F4F3EB" : "#F9F9F9";

  // Two-stage gating for the reveal-variant background video — boot
  // ships with preload="none" + no autoplay so the 6.5MB footer-bg.mp4
  // never transfers at first paint.
  //
  //   STAGE 1 — load (data-footer-near, ~1.5 viewports above reveal):
  //     flip `preload` to "auto" and call `load()` so the browser starts
  //     transferring bytes. NO playback yet — the video stays paused at
  //     frame 0 behind the white .footer-reveal-overlay (rendered below),
  //     so it's neither visible nor consuming decode CPU.
  //   STAGE 2 — play (data-footer-reached, ~50% into reveal range):
  //     start the loop. The overlay fades to opacity 0 in parallel (the
  //     transition is owned by globals.css's .footer-reveal-overlay
  //     rule), so the first frame the user sees is already playing.
  //   STAGE 2′ — pause (data-footer-reached removed via hysteresis at
  //     ~38%): scroll-back stops playback so the video is never running
  //     while invisible. Bytes are kept in cache via the load() in
  //     stage 1 — re-entering the range just hits play() again.
  //
  // Initial sync covers back/forward-cache restores and hash-anchor
  // landings where one or both attributes may already be set when the
  // effect runs. The MutationObserver watches BOTH attributes and runs
  // the same paired sync on every change.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!reveal) return;
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const root = document.documentElement;

    let loaded = false;
    const tryLoad = () => {
      if (loaded) return;
      if (!root.hasAttribute("data-footer-near")) return;
      // MediaPrefetcher may have already promoted this element to
      // preload="auto" + load() during page idle (eager prefetch-all).
      // If so, leave it buffering — calling load() again would restart
      // the fetch from scratch.
      if (videoEl.preload !== "auto") {
        videoEl.preload = "auto";
        // Without an explicit load(), some browsers don't re-evaluate
        // the preload hint after the attribute change — they treat the
        // element as a stable "preload=none" instance for the page life.
        videoEl.load();
      }
      loaded = true;
    };
    const syncPlayback = () => {
      if (root.hasAttribute("data-footer-reached")) {
        // .catch swallows the rejection some browsers throw if play()
        // is interrupted (e.g. tab backgrounded mid-fetch).
        void videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
    };

    tryLoad();
    syncPlayback();

    const observer = new MutationObserver(() => {
      tryLoad();
      syncPlayback();
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-footer-near", "data-footer-reached"],
    });
    return () => observer.disconnect();
  }, [reveal]);

  if (variant === "compact") {
    return (
      <footer data-navbar-theme="light" className="relative bg-[#F5F5F7] border-t border-[rgba(0,0,0,0.08)] py-10">
        <div className="max-w-[980px] mx-auto px-6 flex flex-col items-center text-center gap-5">
          <p className="text-[12px] text-[#6E6E73] max-w-md leading-relaxed">
            The frontier AI lab building the first production Universal Geospatial Model.
          </p>
          <div className="flex gap-4">
            <Mail size={16} className="cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] transition-colors" />
            <Linkedin size={16} className="cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] transition-colors" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      data-footer
      data-navbar-theme={theme === "dark" ? "dark" : "light"}
      className="overflow-hidden flex flex-col relative text-white"
      style={{
        // bgColor is the fallback paint shown while the <video> below
        // is loading (or if it errors / a browser blocks autoplay) and
        // stays visible through the scrim so the footer keeps its
        // current theme cast.
        background: bgColor,
        ...(reveal ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 } as React.CSSProperties : {}),
      }}
    >
      {/* Background video — cinematic clip living at /public/footer-bg.mp4.
          preload="none" + no autoPlay so the browser doesn't fetch any
          video bytes at first paint; scroll-driven trigger calls .play()
          on the videoRef once visible. muted + playsInline keep iOS
          Safari willing to honor programmatic play(); loop seams the
          clip. object-position 75% on mobile clips the Kling wordmark
          baked into the source's right edge; desktop reverts to center. */}
      <video
        ref={videoRef}
        data-footer-video
        className="absolute inset-0 w-full h-full object-cover object-[75%_center] md:object-center"
        style={{ zIndex: 0, pointerEvents: "none" }}
        src="/footer-bg.mp4"
        // Still frame of the clip — paints during buffering so the footer
        // never shows a blank/black box while the 6.5 MB mp4 loads on a
        // slow link (MediaPrefetcher pre-buffers it on idle for the fast path).
        poster="/footer-bg-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
      />
      {/* Black scrim — 25% opacity. Darker than the previous 10% pass
          so the video reads as more cinematic / muted and the white
          text picks up a stronger contrast against the underlying
          imagery. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, background: "#000000", opacity: 0.25 }}
      />
      {/* Reveal-mode white cover — opaque (opacity:1, z:30) while the
          user is scrolling above the reveal range, so the entire footer
          (video + scrim + content) reads as a flat white sheet that
          matches the PageFrame card sitting in front of it. Fades to
          opacity:0 in 500ms once <html data-footer-reached> flips,
          exposing the full footer design at once. The opacity logic
          and pointer-events:none live in globals.css's
          .footer-reveal-overlay rule — see app/globals.css.
          Gated on `reveal` because the default non-reveal footer is a
          normal in-flow block that doesn't need masking — an always-on
          opaque overlay there would just hide the footer permanently. */}
      {reveal && <div aria-hidden className="footer-reveal-overlay" />}
      {/* Reveal-mode wrapper:
           • Bounds match the navbar's canonical pattern
             (`max-w-[1287px] w-[calc(100%-2.5rem)] mx-auto`, see
             MistxNav). The calc trick gives a fixed 20px gutter on each
             side at every viewport width, and the 1287px cap lines the
             footer's brand block / link columns / legal row up
             vertically with the navbar logo and "Try Elio" CTA above.
             Was max-w-[1200px] + px-8 (32px gutter), which sat 87px
             narrower than the navbar at wide viewports.
           • Mobile (≤md): `min-h-screen` + `flex flex-col` so the footer
             reads as a dedicated full-viewport end-of-page surface, with
             the brand block (Columbus Earth + tagline) as the dominant
             visual element at the top.
           • Desktop (md+): `min-h-0` reverts to content-driven height —
             the original behavior.
         PageFrame measures `footer.offsetHeight` on mount + resize and
         reserves `footer_height − 60px` of scroll below the card, so
         making the footer taller automatically extends the reveal
         range — no PageFrame change required. pt-32 (128px) clears
         the 60px card-corner overlap with 68px of visible breathing
         room. */}
      <div className="relative z-10 max-w-[1287px] w-[calc(100%-2.5rem)] mx-auto pt-32 pb-6 min-h-screen md:min-h-0 flex flex-col">
        {/* Content section — mobile stacks (brand → link columns → legal),
            desktop keeps the original 2/4-col grid. The link-column
            wrapper uses `md:contents` to vanish from layout at md+, so
            its three children become direct grid items of the outer grid
            (restoring Brand|Product|Technology|Company in one row at lg+).
            On mobile the wrapper renders as a 3-col grid so all three
            link cols fit side-by-side instead of stacking — keeps content
            compact enough to fit within the reveal range on small phones. */}
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 md:items-start mb-10 text-center md:text-left">
          {/* Brand block — Columbus Earth + tagline are visually the
              priority on mobile: text-[36px] heading vs the desktop 24px,
              wider tagline (text-[16px]), and centered alignment so the
              eye lands here first. Desktop reverts to the original
              sizes/left-alignment. */}
          <div>
            <h3
              className="text-[36px] md:text-[24px] font-semibold mb-4 md:mb-3 text-white"
              style={{ fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "-0.02em" }}
            >
              Columbus Earth
            </h3>
            <p className="text-[16px] md:text-[14px] leading-relaxed mb-6 md:mb-4 max-w-[320px] md:max-w-[260px] mx-auto md:mx-0 text-white/80 md:text-white/70">
              The frontier AI lab building the first production Universal Geospatial Model.
            </p>
            <div className="flex justify-center md:justify-start gap-5 md:gap-4">
              <a href="mailto:contact@columbus.earth"><Mail size={18} className="transition-colors text-white/80 md:text-white/70 hover:text-white" /></a>
              <a href="https://www.linkedin.com/company/columbusearth/about/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} className="transition-colors text-white/80 md:text-white/70 hover:text-white" /></a>
            </div>
          </div>
          {/* Link columns — mobile uses a 2+1 layout (Product + Technology
              on row 1, Company centered on row 2) so each cell is ~136px
              wide on a 360-px viewport, big enough for text-[16px] labels
              without ugly wrap on "Data Collection". The outer wrapper +
              the Company sub-wrapper both carry `md:contents` so they
              vanish from layout at md+, restoring the Brand | Product |
              Technology | Company row of the outer grid at lg+. */}
          <div className="grid grid-cols-2 gap-6 w-full md:contents">
            <FooterColumn theme={theme} title="Product" links={[
              { label: "Columbus Pro", href: "/products/business" },
              { label: "Elio", href: "/products/consumer" },
            ]} />
            <FooterColumn theme={theme} title="Technology" links={[
              { label: "LGM vs LLM", href: "/research#lgm-vs-llm" },
              { label: "Data Collection", href: "/research#data-collection" },
              { label: "Core Reasoning", href: "/research#core-reasoning" },
            ]} />
            <div className="col-span-2 flex justify-center md:contents">
              <FooterColumn theme={theme} title="Company" links={[
                { label: "Our Mission", href: "/company" },
                { label: "Contact", href: "/contact" },
              ]} />
            </div>
          </div>
        </div>

        {/* Legal row — `mt-auto` pushes it to the footer's bottom edge on
            mobile (where min-h-screen creates extra space below the
            content section). Desktop is a no-op since the wrapper is
            content-sized. Mobile stacks the 4 spans vertically because a
            360-px viewport can't fit them in a row; desktop keeps the
            original horizontal row. */}
        <div className="mt-auto border-t pt-4 pb-2 flex flex-col items-center text-center gap-2 md:flex-row md:items-center md:justify-between md:text-left md:gap-4 text-[13px] border-white/15 text-white/80 md:text-white/70">
          <span>Columbus Earth &copy; 2026</span>
          <span className="italic text-[12px]">Website made by hand, no AI.</span>
          <span className="italic text-[12px]">Nature always prevails</span>
          <span>www.columbus.earth</span>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
  /** Accepted for backward compat with callers, no longer styles the
   *  text — footer copy is locked to white over the video background. */
  theme?: "light" | "dark" | "light-blue";
}) => (
  <div>
    <p className="mb-3 md:mb-4 font-medium text-[16px] md:text-[17.5px] tracking-wide text-white">
      {title}
    </p>
    <ul className="space-y-2 text-[16px] md:text-[17.5px] text-white/80 md:text-white/70">
      {links.map((link, i) => (
        <li key={i}>
          <Link
            href={link.href}
            className="cursor-pointer transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
