"use client";

import type { FC } from "react";
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
          autoPlay + muted + loop + playsInline are the four flags required
          to make it autoplay across browsers (esp. iOS Safari). preload
          metadata so the file's header loads up front but the full 6.5 MB
          doesn't transfer until/unless the footer reveals on scroll.
          aria-hidden + tabIndex=-1 keep it out of the AT tree. */}
      {/* object-position shifts the cropped window of the video. On mobile
          the default center crop cuts the ship in the distance on the
          right edge — `85% center` slides the visible window rightward so
          the ship is in frame. Desktop reverts to centered (default). */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-[85%_center] md:object-center"
        style={{ zIndex: 0, pointerEvents: "none" }}
        src="/footer-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
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
            <p className="text-[16px] md:text-[14px] leading-relaxed mb-6 md:mb-4 max-w-[320px] md:max-w-[260px] mx-auto md:mx-0 text-white/70 md:text-white/60">
              The frontier AI lab building the first production Universal Geospatial Model.
            </p>
            <div className="flex justify-center md:justify-start gap-5 md:gap-4">
              <a href="mailto:contact@columbus.earth"><Mail size={18} className="transition-colors text-white/50 hover:text-white" /></a>
              <a href="https://www.linkedin.com/company/columbusearth/about/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} className="transition-colors text-white/50 hover:text-white" /></a>
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
        <div className="mt-auto border-t pt-4 pb-2 flex flex-col items-center text-center gap-2 md:flex-row md:items-center md:justify-between md:text-left md:gap-4 text-[13px] border-white/15 text-white/50">
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
    <ul className="space-y-2 text-[16px] md:text-[17.5px] text-white/70">
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
