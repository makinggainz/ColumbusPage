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
  /** Optional override for the footer background image. Defaults to the
   *  shared /emoji/Footer.png cityscape. */
  bgImage?: string;
};

// Link columns — the alexExperiments1 footer layout.
const FOOTER_COLUMNS: { title: string; links: string[] }[] = [
  { title: "PRODUCT", links: ["Columbus Pro", "Use-Cases", "MapsGPT"] },
  { title: "TECHNOLOGY", links: ["LGM vs LLM", "Data Collection", "Core Reasoning", "Research Blog"] },
  { title: "COMPANY", links: ["+ Our Mission", "+ Careers", "Legal", "Report"] },
];

const NAV_TABS = ["Our Mission", "Product", "Technology", "Use Cases"];

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false, bgImage }) => {
  const footerImage = bgImage ?? "/emoji/Footer.png";

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
      data-navbar-theme="dark"
      className={`relative w-full overflow-hidden flex flex-col text-white ${reveal ? "" : "min-h-screen"}`}
      style={
        reveal
          ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0, height: "100dvh" }
          : undefined
      }
    >
      {/* Background cityscape image + dark overlay for legibility */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${footerImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-black/55" />

      {/* Content — mission statement on top, brand + link columns on the
          bottom, spread across the footer's full height. */}
      <div className="relative z-10 flex-1 flex flex-col justify-between w-full max-w-[1730px] mx-auto px-6 sm:px-12 lg:px-[120px] py-16 lg:py-20">
        {/* Top — mission statement + quick tabs */}
        <div className="text-center max-w-[900px] mx-auto">
          <p className="text-[16px] leading-[1.7] text-white/80">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the
            geospatial intelligence systems of tomorrow.
          </p>
          <p className="mt-8 text-[16px] leading-[1.7] text-white/80">
            We&apos;re building foundation models that understand the physical world
            through geospatial reasoning. GeoContext-1 processes satellite imagery,
            terrain data, infrastructure networks, and temporal patterns to generate
            actionable intelligence across defence, climate, consumer and urban
            planning domains.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-white/70">
            {NAV_TABS.map((tab) => (
              <button key={tab} type="button" className="transition-colors hover:text-white">
                [ {tab} ]
              </button>
            ))}
          </div>
        </div>

        {/* Bottom — brand block + link columns */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          {/* Brand */}
          <div>
            <h3 className="text-[32px] font-semibold mb-3">Columbus Earth</h3>
            <p className="text-[14px] text-white/70 max-w-[420px] mb-5">
              The frontier AI lab building the first production Universal
              Geospatial Model to answer the planet&rsquo;s toughest questions.
            </p>
            <div className="flex gap-4">
              <a href="mailto:contact@columbus.earth" aria-label="Email Columbus Earth">
                <Mail size={20} className="cursor-pointer text-white hover:text-white/70 transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/company/columbusearth/about/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Columbus Earth on LinkedIn"
              >
                <Linkedin size={20} className="cursor-pointer text-white hover:text-white/70 transition-colors" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-14 gap-y-10 text-[14px] text-white/80">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-5 font-medium text-white">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link} className="cursor-pointer transition-colors hover:text-white">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
