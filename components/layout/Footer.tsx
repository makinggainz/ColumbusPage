"use client";

import type { FC } from "react";
import { Mail, Linkedin } from "lucide-react";

export type FooterProps = {
  variant?: "default" | "compact";
  /** When true the footer is rendered as the fixed, scroll-revealed footer
   *  (see PageFrame). It is pinned to the viewport bottom at z-index 0 and
   *  uncovered as the page card scrolls up. */
  reveal?: boolean;
  /** Kept for call-site compatibility. The image-based design below is
   *  always dark, so `theme` no longer changes the rendering. */
  theme?: "light" | "dark" | "light-blue" | "technology";
  /** Kept for call-site compatibility — unused by the image-based design. */
  bg?: string;
  /** Optional override for the footer background image. Used by the
   *  compact variant; defaults to the shared /emoji/Footer.png. */
  bgImage?: string;
  /** Optional override for the default-variant background video.
   *  Defaults to /emoji/Footer.mp4 — the first 9 seconds of
   *  happyhorse-1.0_b_animate_the_clouds_i played back at 0.5×
   *  (~18 seconds of output) so the clouds drift slowly behind
   *  the footer text. */
  bgVideo?: string;
};

// Index-style nav columns — sit on the LEFT of the center divider line,
// right-aligned so each list ends flush against the divider.
const FOOTER_COLUMNS: { title: string; links: string[] }[] = [
  { title: "PRODUCT", links: ["Columbus Pro", "Use-Cases", "MapsGPT"] },
  { title: "TECHNOLOGY", links: ["LGM vs LLM", "Data Collection", "Core Reasoning", "Research Blog"] },
  { title: "COMPANY", links: ["+ Our Mission", "+ Careers", "Legal", "Report"] },
];

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false, bgImage, bgVideo }) => {
  const footerImage = bgImage ?? "/emoji/Footer.png";
  const footerVideo = bgVideo ?? "/emoji/Footer.mp4";

  if (variant === "compact") {
    return (
      <footer
        data-navbar-theme="dark"
        className="relative w-full min-h-[280px] overflow-hidden text-white"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${footerImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center text-center">
          <p className="text-sm text-white/80 max-w-xl mb-6">
            The frontier AI lab building the first production Universal Geospatial Model.
          </p>
          <div className="flex gap-4">
            <a href="mailto:contact@columbus.earth" aria-label="Email Columbus Earth">
              <Mail size={18} className="cursor-pointer text-white hover:text-white/70 transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/company/columbusearth/about/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Columbus Earth on LinkedIn"
            >
              <Linkedin size={18} className="cursor-pointer text-white hover:text-white/70 transition-colors" />
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      data-footer
      data-navbar-theme="light"
      className={`relative w-full overflow-hidden flex flex-col text-black ${reveal ? "" : "min-h-screen"}`}
      style={
        reveal
          ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0, height: "100dvh" }
          : undefined
      }
    >
      {/* Background cityscape video — first 9s of
          happyhorse-1.0_b_animate_the_clouds_i, slowed to 0.5× and
          re-encoded to /emoji/Footer.mp4 (so the actual file runs
          ~18 seconds at the slowed cadence). Clouds drift slowly
          behind the footer text and loop seamlessly. autoPlay +
          muted + playsInline are required for autoplay across
          browsers. The original /emoji/Footer.png stays as the
          poster so the first frame paints instantly while the video
          buffers, and as a graceful fallback if the video fails. */}
      <video
        aria-hidden
        src={footerVideo}
        poster={footerImage}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Index layout — nav columns on the LEFT of a center divider line,
          mission/tagline/logo on the RIGHT. The bottom-middle email +
          LinkedIn cut-out and bottom-right "Columbus Earth" cut-out live
          on the PageFrame and overlay the footer's top edge once the
          card scrolls up to reveal it. Bottom padding leaves room for
          those cut-outs without overlapping the right column's text. */}
      <div className="relative z-10 flex-1 flex items-center w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-[80px] py-20 lg:py-24 pb-32 lg:pb-40">
        <div className="grid w-full grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-y-14 gap-x-10 lg:gap-x-16 items-stretch">
          {/* LEFT — nav columns, right-aligned against the divider. */}
          <div className="flex flex-col items-end gap-10 text-right text-[14px] text-black/75">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-[12px] font-medium tracking-[0.22em] text-black">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li
                      key={link}
                      className="cursor-pointer transition-colors hover:text-black"
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CENTER — full-height vertical divider hairline. */}
          <div aria-hidden className="hidden lg:block w-px bg-black/25 self-stretch" />

          {/* RIGHT — Columbus logo (top), mission paragraph, tagline. */}
          <div className="flex flex-col gap-7 max-w-[460px]">
            <div className="flex items-center gap-3">
              <img
                src="/logobueno.png"
                alt="Columbus Earth"
                width={36}
                height={36}
                style={{ filter: "brightness(0)", objectFit: "contain" }}
              />
            </div>
            <p className="text-[16px] leading-[1.7] text-black/85">
              We are a group of engineers, designers, and company builders
              developing foundation models and data collection innovations to
              power the geospatial intelligence systems of tomorrow.
            </p>
            <p className="text-[14px] leading-[1.6] text-black/65">
              The frontier AI lab building the first production Universal
              Geospatial Model to answer the planet&rsquo;s toughest questions.
            </p>
          </div>
        </div>
      </div>

      {/* Reveal cover — keeps the fixed reveal footer blended into the white
          page until it is scrolled to, then fades out via [data-footer-reached]
          (set by PageFrame). */}
      {reveal && <div aria-hidden className="footer-reveal-overlay" />}
    </footer>
  );
};
