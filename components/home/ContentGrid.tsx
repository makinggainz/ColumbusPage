"use client";

import { type ReactNode, type CSSProperties } from "react";

const gl = "1px solid var(--grid-line)";

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
      className={`grid-section max-w-[1287px] mx-auto bg-white ${className}`}
      style={{
        borderTop: gl,
        borderLeft: gl,
        backgroundImage:
          "linear-gradient(var(--cell-grid) 1px, transparent 1px), linear-gradient(90deg, var(--cell-grid) 1px, transparent 1px)",
        backgroundSize: "var(--cell-grid-size) var(--cell-grid-size)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

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
    <div
      className="py-6 px-8 md:px-10"
      style={{ borderRight: gl, borderBottom: gl }}
    >
      <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#86868b] block">
        {label}
      </span>
      {title && (
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.08] text-[#1D1D1F] mt-3">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-[17px] leading-[1.47] text-[#86868b] mt-2 max-w-[600px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function GridCell({
  children,
  className = "",
  flush = false,
  hoverable = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
  hoverable?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`${flush ? "" : "p-8 md:p-10"} ${hoverable ? "transition-colors duration-200 hover:bg-[rgba(120,120,200,0.04)]" : ""} ${className}`}
      style={{
        borderRight: gl,
        borderBottom: gl,
        backgroundImage:
          "linear-gradient(var(--cell-grid) 1px, transparent 1px), linear-gradient(90deg, var(--cell-grid) 1px, transparent 1px)",
        backgroundSize: "var(--cell-grid-size) var(--cell-grid-size)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export { gl };
