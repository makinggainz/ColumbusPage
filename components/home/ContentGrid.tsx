"use client";

import { type ReactNode, type CSSProperties, forwardRef } from "react";

// Unified grid line — used as box-shadow on cells to create the mesh
const gridLine = "0 0 0 1px var(--grid-line)";

/**
 * GridSection — a 6-column CSS Grid section.
 * Each section is its own grid container with matching columns,
 * so stacked sections create a visually unified grid (like dify.ai).
 */
export function GridSection({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      className={`max-w-[1280px] mx-auto bg-white ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gridAutoRows: "min-content",
        boxShadow: gridLine,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

/**
 * GridCell — a cell within a GridSection.
 * Box-shadow creates visible grid lines between cells.
 */
export const GridCell = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
    span?: number;
  }
>(({ children, span = 6, className = "", style, ...rest }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{
      gridColumn: `span ${span}`,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
));
GridCell.displayName = "GridCell";

// Legacy exports
export const gl = "1px solid var(--grid-line)";

export function GridHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <GridCell className="py-6 px-8 md:px-10">
      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#0A1344]/30 font-mono block">
        {label}
      </span>
      {title && (
        <h2 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.1] text-[#1D1D1F] mt-3">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-[17px] leading-[1.6] text-[#6E6E73] mt-2 max-w-[600px]">
          {subtitle}
        </p>
      )}
    </GridCell>
  );
}

export { gridLine };
