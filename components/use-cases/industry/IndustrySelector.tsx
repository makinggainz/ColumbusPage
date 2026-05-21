"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  GraduationCap,
  Home,
  LandPlot,
  Leaf,
  MapPinned,
} from "lucide-react";
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
          /* Match the corner radius of the SuperFeatureSection panels that
             sit directly below this grid (--ent-radius-2xl, 24px). */
          borderRadius: "var(--ent-radius-2xl, 24px)",
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
                "border-r border-b border-gridline",
                "max-md:border-r-0",
                "max-md:last:border-b-0",
                "md:nth-[3n]:border-r-0",
                "md:nth-[n+4]:border-b-0",
                /* Selection signal is a low-opacity wash of the homepage
                   navy (--color-cta #0B1342). Idle ink (#0B1B2B) is kept
                   on text + icon so the active state reads as "selected"
                   without an in-your-face color shift. */
                isActive
                  ? "bg-[rgba(11,19,66,0.07)]"
                  : "hover:bg-[rgba(11,19,66,0.03)]",
              ].join(" ")}
              style={{ minHeight: 130 }}
            >
              <span
                aria-hidden
                className="shrink-0 inline-flex items-center justify-center"
                style={{ width: 48, height: 48, color: "#0B1B2B" }}
              >
                <IndustryIcon id={id} />
              </span>
              <span
                className="text-[18px] md:text-[20px] font-medium leading-[1.2] tracking-[-0.01em]"
                style={{ color: "#0B1B2B" }}
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

/* Per-industry icon. All glyphs come from lucide-react so the stroke
   weight, cap style, and visual density stay in lockstep across every
   industry. Rendered at 36px on a 48px chip; strokeWidth 1.6 keeps the
   lines hairline-thin like the rest of the business page. */
const INDUSTRY_LUCIDE_ICON: Partial<Record<IndustryId, React.ComponentType<{ size?: number; strokeWidth?: number; absoluteStrokeWidth?: boolean }>>> = {
  "residential-real-estate": Home,
  "commercial-real-estate": Building2,
  "urban-infrastructure": LandPlot,
  "geomarketing": MapPinned,
  "academic-research": GraduationCap,
  "environmental-research": Leaf,
};

function IndustryIcon({ id }: { id: IndustryId }) {
  const Icon = INDUSTRY_LUCIDE_ICON[id];
  if (!Icon) return null;
  return <Icon size={36} strokeWidth={1.6} absoluteStrokeWidth />;
}
