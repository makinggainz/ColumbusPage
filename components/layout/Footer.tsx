"use client";

import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";

export type FooterProps = {
  variant?: "default" | "compact";
  reveal?: boolean;
  theme?: "light" | "dark" | "light-blue" | "technology";
  /** Optional override for the footer's surface color. When provided,
   *  it wins over the theme-derived default (e.g., pass `#000000` to
   *  match the homepage footer background image). */
  bg?: string;
  /** Optional full-bleed background image for the footer. When set, the
   *  image is layered under a top-down gradient that fades from the
   *  solid `bg` colour at the top into the image lower down, so the
   *  footer reveals as a fade into that colour. */
  bgImage?: string;
};

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false, theme = "light", bg, bgImage }) => {
  const isLight = theme === "light" || theme === "light-blue" || theme === "technology";
  const isTech = theme === "technology";
  const bgColor =
    bg ??
    (theme === "dark"
      ? "#000000"
      : theme === "light-blue"
        ? "#F4F3EB"
        : isTech
          ? "#FFFFFF"
          : "#F9F9F9");
  const [noteOpen, setNoteOpen] = useState(false);
  // bottleOpened starts true now that the BottleScene has been removed
  // — all bottle-gated content is visible immediately. The state is
  // retained (instead of being deleted) because removing it would touch
  // every opacity/transform/transition in the JSX below; with the
  // initial value flipped to `true`, every conditional already lands on
  // its "open" branch.
  const [bottleOpened, setBottleOpened] = useState(true);
  const [previouslyOpened, setPreviouslyOpened] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Persist bottle state across pages via localStorage
  useEffect(() => {
    try {
      if (localStorage.getItem("bottle-opened") === "true") {
        setBottleOpened(true);
        setPreviouslyOpened(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setFooterVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (variant === "compact") {
    return (
      <footer data-navbar-theme="light" className="relative bg-[#F5F5F7] border-t border-[rgba(0,0,0,0.08)] py-10">
        <div className="max-w-[980px] mx-auto px-6 flex flex-col items-center text-center gap-5">
          <p className="p-s text-[#6E6E73] max-w-md leading-relaxed">
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
      ref={footerRef}
      data-footer
      data-navbar-theme={theme === "dark" ? "dark" : "light"}
      className={`overflow-hidden flex flex-col relative ${theme === "dark" ? "text-white" : isTech ? "text-[#0A1344]" : "text-[#1D1D1F]"} ${reveal ? "" : "min-h-screen"}`}
      style={{
        // With a bgImage: layer a top-down gradient (solid bgColor at the
        // top, fading to transparent ~62% down) over the photo so the
        // footer reveals as a fade into the bgColor and the image reads
        // through lower down. bgColor is also set as the base color so
        // any area the cover image doesn't reach stays on-tone.
        ...(bgImage
          ? {
              backgroundColor: bgColor,
              backgroundImage: `linear-gradient(to bottom, ${bgColor} 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0) 62%), url("${bgImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : { background: bgColor }),
        cursor: !bottleOpened ? "default" : undefined,
        ...(reveal ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 } as React.CSSProperties : {}),
      }}
      onClick={() => {
        if (!bottleOpened && !previouslyOpened) {
          setNoteOpen(true);
          setBottleOpened(true);
          try { localStorage.setItem("bottle-opened", "true"); } catch {}
        }
      }}
    >
      {/* Earth-from-space backdrop — dark theme only. The planet is
          anchored bottom-center and pushed mostly offscreen so only the
          top arc curves into view, giving a "rising from the horizon"
          effect as the page scrolls and the footer is revealed.
          Source: NASA Earth (Western Hemisphere), transparent background. */}
      {theme === "dark" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Starfield — small white dots scattered through the deep-space area */}
          <Starfield />
          {/* Soft atmospheric glow near the horizon, fading up into deep space */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 50% 110%, rgba(70,140,220,0.28) 0%, rgba(10,34,57,0) 55%)",
            }}
          />
          {/* The planet itself — transparent-bg PNG/WebP, sized so its top
              hemisphere arcs above the footer's bottom edge */}
          <div
            className="absolute left-1/2 bottom-0"
            style={{
              width: "min(1800px, 200vw)",
              aspectRatio: "1 / 1",
              transform: "translate(-50%, 58%)",
              backgroundImage: "url(/earth-from-space.webp)",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Readability scrim — darkens the planet so the mission copy and
              footer columns stay legible on top of it. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,34,57,0.82) 0%, rgba(10,34,57,0.72) 30%, rgba(10,34,57,0.62) 60%, rgba(10,34,57,0.72) 100%)",
            }}
          />
        </div>
      )}

      {/* Mission text — top center, above the bottle */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8 pt-24 pb-0 max-w-3xl mx-auto w-full"
        style={{ pointerEvents: bottleOpened ? "auto" : "none" }}
      >
        <p
          className="p-l leading-relaxed mb-6"
          style={{
            color: theme === "dark" ? "rgba(255,255,255,0.5)" : isTech ? "rgba(10,19,68,0.6)" : "rgba(29,29,31,0.6)",
            opacity: bottleOpened ? 1 : 0,
            transform: bottleOpened ? "translateY(0)" : "translateY(10px)",
            transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? "100ms" : "0ms",
          }}
        >
          We are a group of engineers, designers, and company builders developing
          foundation models and data collection innovations to power the
          geospatial intelligence systems of tomorrow.
        </p>
        <p
          className="p-l leading-relaxed mb-12"
          style={{
            color: theme === "dark" ? "rgba(255,255,255,0.5)" : isTech ? "rgba(10,19,68,0.6)" : "rgba(29,29,31,0.6)",
            opacity: bottleOpened ? 1 : 0,
            transform: bottleOpened ? "translateY(0)" : "translateY(10px)",
            transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? "250ms" : "0ms",
          }}
        >
          We&apos;re building foundation models that understand the physical world
          through geospatial reasoning. GeoContext-1 processes satellite imagery,
          terrain data, infrastructure networks, and temporal patterns to generate
          actionable intelligence across defence, climate, consumer and urban
          planning domains.
        </p>
      </div>

      {/* Note overlay — kept for backwards compatibility; never opens now
          that the bottle is gone. */}
      {noteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setNoteOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative max-w-md w-full mx-6 p-10 text-center"
            style={{
              background: "#faf5eb",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              border: "1px solid rgba(160,140,100,0.2)",
              animation: "noteAppear 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <p className="p-l text-[#8a7a5a] italic mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Dear Explorer,
            </p>
            <p className="h4 font-semibold text-[#3a3020] leading-snug mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Thank you for reaching the end.
            </p>
            <p className="p-l text-[#8a7a5a] leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
              Like Columbus, the best discoveries come to those who venture further than the rest.
            </p>
            <button
              onClick={() => setNoteOpen(false)}
              className="p-s text-[#8a7a5a] hover:text-[#3a3020] transition-colors tracking-wide"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Footer content — fades in after bottle is opened */}
      <div
        className="relative z-10 w-full mt-auto"
        style={{
          opacity: bottleOpened ? 1 : 0,
          transform: bottleOpened ? "translateY(0)" : "translateY(20px)",
          pointerEvents: bottleOpened ? "auto" : "none",
          transition: previouslyOpened ? "none" : "all 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 pb-6 pt-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-8 mb-12">
            <div
              style={{
                opacity: bottleOpened ? 1 : 0,
                transform: bottleOpened ? "translateY(0)" : "translateY(12px)",
                transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? "400ms" : "0ms",
              }}
            >
              <h3
                className="h1 font-semibold mb-3"
                style={{ color: theme === "dark" ? "#FFFFFF" : "#091344" }}
              >
                Columbus Earth
              </h3>
              <p className={`p-l leading-snug mb-4 max-w-[400px] ${theme === "dark" ? "text-white/50" : isTech ? "text-[#0A1344]/50" : "text-[#1D1D1F]/50"}`}>
                The frontier AI lab building the first production Universal Geospatial Model.
              </p>
              <div className="flex gap-4">
                <a href="mailto:contact@columbus.earth"><Mail size={18} className={`transition-colors ${theme === "dark" ? "text-white/40 hover:text-white" : isTech ? "text-[#0A1344]/40 hover:text-[#0066CC]" : "text-[#1D1D1F]/40 hover:text-[#1D1D1F]"}`} /></a>
                <a href="https://www.linkedin.com/company/columbusearth/about/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} className={`transition-colors ${theme === "dark" ? "text-white/40 hover:text-white" : isTech ? "text-[#0A1344]/40 hover:text-[#0066CC]" : "text-[#1D1D1F]/40 hover:text-[#1D1D1F]"}`} /></a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:mt-[30px]">
              {[
                <FooterColumn key="product" theme={theme} title="Product" links={[
                  { label: "Columbus Pro", href: "/products/business" },
                  { label: "Elio", href: "/" },
                  { label: "Use Cases", href: "/columbus-solutions" },
                ]} />,
                <FooterColumn key="technology" theme={theme} title="Research" links={[
                  { label: "Foundation Model", href: "/research" },
                  { label: "Timeline", href: "/research" },
                  { label: "Research", href: "/research" },
                  { label: "Results", href: "/research" },
                  { label: "Blog", href: "/blog" },
                ]} />,
                <FooterColumn key="company" theme={theme} title="Company" links={[
                  { label: "Our mission", href: "/mission" },
                  { label: "Our vision", href: "/mission" },
                  { label: "Blog", href: "/blog" },
                ]} />,
              ].map((col, i) => (
                <div
                  key={i}
                  style={{
                    opacity: bottleOpened ? 1 : 0,
                    transform: bottleOpened ? "translateY(0)" : "translateY(12px)",
                    transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                    transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? `${520 + i * 120}ms` : "0ms",
                  }}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
          <div
            className={`pt-4 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 p-s ${theme === "dark" ? "text-white/30" : isTech ? "text-[#0A1344]/40" : "text-[#1D1D1F]/40"}`}
            style={{
              opacity: bottleOpened ? 1 : 0,
              transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? "900ms" : "0ms",
            }}
          >
            <span>Columbus Earth &copy; 2026</span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <span>Website made by hand, no AI.</span>
              <span>www.columbus.earth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reveal cover — only on the fixed `reveal` footer. Opaque white
          while the user scrolls the page (the footer reads as white,
          matching the site backdrop); fades out when the footer is
          reached — driven by [data-footer-reached] on <html>, set by
          PageFrame. z-index 30 sits above the earth backdrop (z-0) and
          footer content (z-10) so it hides the whole dark design. */}
      {reveal && <div aria-hidden className="footer-reveal-overlay" />}

    </footer>
  );
};

// Deterministic pseudo-random so the star layout is stable across renders
// (and identical between server and client — avoids hydration mismatches).
const STARS = (() => {
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: 70 }, (_, i) => {
    const x = rand() * 100;
    // Bias y toward the top half — the planet occupies the bottom area
    const y = rand() * 70;
    const size = rand() < 0.15 ? 2.5 : rand() < 0.5 ? 1.5 : 1;
    const opacity = 0.35 + rand() * 0.55;
    return { i, x, y, size, opacity };
  });
})();

const Starfield: FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    {STARS.map(({ i, x, y, size, opacity }) => (
      <span
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          background: "white",
          opacity,
          boxShadow: size >= 2 ? "0 0 4px rgba(255,255,255,0.6)" : undefined,
        }}
      />
    ))}
  </div>
);

const FooterColumn = ({
  title,
  links,
  theme = "light",
}: {
  title: string;
  links: { label: string; href: string }[];
  theme?: "light" | "dark" | "light-blue" | "technology";
}) => {
  const isTech = theme === "technology";
  return (
    <div>
      <p className={`mb-4 font-medium p-l tracking-wide ${theme === "dark" ? "text-white" : isTech ? "text-[#0A1344]" : "text-[#1D1D1F]"}`}>
        {title}
      </p>
      <ul className={`space-y-2 p-l ${theme === "dark" ? "text-white/60" : isTech ? "text-[#0A1344]/60" : "text-[#1D1D1F]/60"}`}>
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className={`cursor-pointer transition-colors ${theme === "dark" ? "hover:text-white" : isTech ? "hover:text-[#0066CC]" : "hover:text-[#0A1344]"}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
