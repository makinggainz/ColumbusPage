"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIndustry } from "./IndustryContext";
import { INDUSTRY_CONTENT, INDUSTRY_ORDER } from "./content";
import type { IndustryId } from "./types";

type IndustrySelectorVariant = "photo" | "iconGrid";

type IndustrySelectorProps = {
  lightTheme?: boolean;
  /**
   * Restrict & order the tiles shown. Defaults to the full INDUSTRY_ORDER
   * (columbus-solutions). The business page passes a reduced subset.
   */
  industries?: IndustryId[];
  /**
   * Clip the tile grid with the PageFrame's corner radius (20px). Off by
   * default so columbus-solutions keeps square edges.
   */
  rounded?: boolean;
  /**
   * "photo" (default) → the original blurred-image grid used on
   * /columbus-solutions. "iconGrid" → the line-art icon + label grid used
   * on /products/business; clean white cells with a hairline divider grid
   * and a single rounded container.
   */
  variant?: IndustrySelectorVariant;
};

/**
 * Industry tile picker. Two render variants share the same selection
 * behaviour (writes to IndustryProvider, scrolls into the row stack
 * below):
 *  • "photo"    — 4×3 blurred-image grid bounded by section-lines.
 *                 columbus-solutions default.
 *  • "iconGrid" — single rounded container, hairline border, 2×3 cells
 *                 with line-art icons + labels. Business page only.
 */
export default function IndustrySelector({
  lightTheme = false,
  industries,
  rounded = false,
  variant = "photo",
}: IndustrySelectorProps) {
  const order = industries ?? INDUSTRY_ORDER;
  const { industryId, setIndustryId } = useIndustry();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  const handleSelect = (id: typeof industryId) => {
    setIndustryId(id);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>("[data-use-case-rows]");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Theme tokens.
  const sectionBg = lightTheme ? "bg-white" : "bg-black";
  const sectionLinesClass = lightTheme ? "section-lines-light" : "section-lines-dark";
  const headingTextClass = lightTheme ? "text-[#1D1D1F]" : "text-white";

  const isIconGrid = variant === "iconGrid";
  const headingText = isIconGrid ? "Use cases in your industry" : "Use Cases by Industry";

  return (
    <section className={`w-full ${sectionBg} flex justify-center`}>
      <div
        ref={sectionRef}
        className={`${sectionLinesClass} w-full max-w-[1287px] mx-auto pt-30 pb-15 max-md:pt-18 max-md:pb-10`}
      >
        {/* Header */}
        <div className="text-center px-8 md:px-10 mb-[48px] max-md:mb-[36px]" style={anim(0)}>
          <h2
            className={`text-[39px] md:text-[49px] font-medium leading-[1.15] tracking-[-0.02em] ${headingTextClass}`}
          >
            {headingText}
          </h2>
        </div>

        {isIconGrid ? (
          <IconGrid
            order={order}
            activeId={industryId}
            onSelect={handleSelect}
            animStyle={anim(120)}
          />
        ) : (
          /* Tile grid — bounded inside the section-lines container. Short
             (16:9) tiles, edge-to-edge within the bounds. */
          <div
            className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-0"
            style={{
              ...anim(120),
              // Match the PageFrame card corner radius (MAX_RADIUS = 20px in
              // components/layout/PageFrame.tsx); overflow clips the tiles.
              ...(rounded ? { borderRadius: 20, overflow: "hidden" } : {}),
            }}
          >
            {order.map((id) => {
              const item = INDUSTRY_CONTENT[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id)}
                  className="group relative block aspect-16/5 overflow-hidden cursor-pointer"
                  aria-pressed={industryId === id}
                >
                  {/* Blurred image background */}
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    className="object-cover scale-110 transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: "blur(6px) brightness(0.55)" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Idle scrim — slight dim to keep label legible */}
                  <div className="absolute inset-0 bg-black/20 pointer-events-none" aria-hidden />

                  {/* Label */}
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-8 text-center">
                    <span className="relative inline-flex items-baseline gap-3 text-white text-[20px] md:text-[20px] lg:text-[25px] font-medium leading-[1.15] tracking-[-0.01em]">
                      <span>{item.name}</span>
                      {/* Hover-only down arrow */}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center"
                        aria-hidden
                      >
                        <path d="M9 3v12M4 10l5 5 5-5" />
                      </svg>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Icon-grid variant — used by /products/business.

   Layout: a single rounded container (7px corner, hairline #E7E7F1
   border) with internal hairline dividers between rows/cols. Each cell
   shows a line-art icon (stroke 1.5, ink #0B1B2B) followed by the
   industry name. Active state underlines the label (matches the
   reference screenshot's "Urban Planning & Infrastructure" treatment).

   Icons are inline SVGs declared below so the stroke style stays in
   lockstep across every industry. Each is drawn into a 48-unit viewBox
   and rendered at 40px. */
function IconGrid({
  order,
  activeId,
  onSelect,
  animStyle,
}: {
  order: IndustryId[];
  activeId: IndustryId;
  onSelect: (id: IndustryId) => void;
  animStyle: React.CSSProperties;
}) {
  return (
    <div className="px-6 md:px-10" style={animStyle}>
      <div
        className="mx-auto grid grid-cols-3 max-md:grid-cols-1"
        style={{
          maxWidth: 1100,
          /* Strict homepage parity: 7px card corner (--ent-radius-card). */
          borderRadius: 7,
          /* Hairline = homepage --color-gridline (#E7E7F1) to match every
             other card on the business page. */
          border: "1px solid #E7E7F1",
          overflow: "hidden",
          /* Subtle off-white card fill (--ent-bg-card). Gives the grid the
             same soft tint as other content cards on the page rather than
             reading as a transparent void. */
          background: "#FDFDFD",
        }}
      >
        {order.map((id) => {
          const item = INDUSTRY_CONTENT[id];
          const isActive = activeId === id;
          // Hairline grid borders are driven by Tailwind arbitrary
          // variants so the rightmost-column / last-row stripping adapts
          // to the breakpoint:
          //   • Every cell has right + bottom border.
          //   • Mobile (1-col): strip right always, strip bottom only on
          //     the very last item.
          //   • md+ (3-col): strip right on every 3rd item, strip bottom
          //     on items 4+ (business page only renders 6 items, so this
          //     maps to the bottom row).
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={isActive}
              className={[
                "group relative flex items-center gap-5",
                "px-6 md:px-8 py-8 md:py-10",
                "text-left cursor-pointer transition-colors duration-200",
                /* Hover lifts text/icon to the homepage accent (#0081AC),
                   matching CapabilitiesGrid hover behaviour. Active state
                   uses the same accent persistently. */
                "border-r border-b border-gridline",
                "max-md:border-r-0",
                "max-md:last:border-b-0",
                "md:nth-[3n]:border-r-0",
                "md:nth-[n+4]:border-b-0",
                isActive
                  ? "bg-[rgba(0,129,172,0.05)]"
                  : "hover:bg-[rgba(11,27,43,0.025)]",
              ].join(" ")}
              style={{ minHeight: 130 }}
            >
              <span
                aria-hidden
                className="shrink-0 inline-flex items-center justify-center transition-colors duration-200"
                style={{
                  width: 48,
                  height: 48,
                  color: isActive ? "var(--ent-accent, #0081AC)" : "#0B1B2B",
                }}
              >
                <IndustryIcon id={id} />
              </span>
              <span
                className="text-[18px] md:text-[20px] font-medium leading-[1.2] tracking-[-0.01em] transition-colors duration-200 group-hover:text-(--ent-accent,#0081AC)"
                style={{
                  color: isActive ? "var(--ent-accent, #0081AC)" : "#0B1B2B",
                }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Per-industry icon. Every glyph is hand-tuned to live inside a 48-unit
   viewBox, stroke 1.6, round caps/joins, fill: none. The Residential
   icon carries a small green "David" map-pin badge as a flourish (only
   colour accent in the grid). All other icons are pure ink line art. */
function IndustryIcon({ id }: { id: IndustryId }) {
  switch (id) {
    case "residential-real-estate":
      return (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Chimney */}
          <path d="M32 11 V18" />
          {/* Roof */}
          <path d="M6 24 L24 8 L42 24" />
          {/* Walls */}
          <path d="M10 22 V42 H38 V22" />
          {/* Door */}
          <path d="M20 42 V31 H28 V42" />
          {/* Window (left) */}
          <rect x="14" y="27" width="4" height="4" />
          {/* Window (right) */}
          <rect x="30" y="27" width="4" height="4" />
        </svg>
      );

    case "commercial-real-estate":
      return (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left tower (tall) */}
          <path d="M8 41 V14 H22 V41" />
          {/* Right tower (shorter, offset right) */}
          <path d="M22 41 V20 H40 V41" />
          {/* Ground line */}
          <path d="M6 41 H42" />
          {/* Left tower windows — 3 rows x 2 cols */}
          <path d="M12 19 H14 M17 19 H19" />
          <path d="M12 25 H14 M17 25 H19" />
          <path d="M12 31 H14 M17 31 H19" />
          {/* Right tower windows — 2 rows x 3 cols */}
          <path d="M26 26 H28 M31 26 H33 M36 26 H38" />
          <path d="M26 33 H28 M31 33 H33 M36 33 H38" />
        </svg>
      );

    case "urban-infrastructure":
      return (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Lantern cap (peak + finial) */}
          <path d="M24 6 V8" />
          <path d="M19 10 L24 6 L29 10" />
          {/* Lantern body */}
          <path d="M19 10 H29 V20 H19 Z" />
          {/* Light vent inside lantern */}
          <path d="M22 13 H26" />
          {/* Decorative collar below lantern */}
          <path d="M21 20 H27 L26 23 H22 Z" />
          {/* Post */}
          <path d="M24 23 V40" />
          {/* Decorative arm joint */}
          <circle cx="24" cy="28" r="1.2" />
          {/* Base */}
          <path d="M20 40 H28" />
          <path d="M18 42 H30" />
        </svg>
      );

    case "geomarketing":
      return (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Billboard frame */}
          <rect x="7" y="9" width="34" height="20" rx="1.5" />
          {/* Inside content lines (chart-like) */}
          <path d="M12 24 L18 19 L23 22 L30 15 L36 18" />
          {/* Legs */}
          <path d="M16 29 L14 41" />
          <path d="M32 29 L34 41" />
          {/* Ground */}
          <path d="M10 41 H38" />
        </svg>
      );

    case "academic-research":
      return (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Mortarboard top (diamond) */}
          <path d="M24 10 L42 19 L24 28 L6 19 Z" />
          {/* Cap body under the board */}
          <path d="M13 22 V29 C13 31 18 33 24 33 C30 33 35 31 35 29 V22" />
          {/* Tassel — string + knot */}
          <path d="M38 20 V32" />
          <circle cx="38" cy="34" r="1.4" />
        </svg>
      );

    case "environmental-research":
      return (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Globe */}
          <circle cx="24" cy="24" r="13" />
          {/* Equator */}
          <path d="M11 24 H37" />
          {/* Meridian (ellipse) */}
          <ellipse cx="24" cy="24" rx="6" ry="13" />
          {/* Right leaf */}
          <path d="M37 24 C41 22 44 24 44 28 C40 28 37 26 37 24 Z" />
          {/* Left leaf */}
          <path d="M11 24 C7 22 4 24 4 28 C8 28 11 26 11 24 Z" />
        </svg>
      );

    default:
      // Fallback dot — should never render for the business page subset
      // but keeps the type exhaustive without crashing the route.
      return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="24" cy="24" r="4" />
        </svg>
      );
  }
}
