"use client";

import { type ReactNode, type CSSProperties } from "react";

const gl = "1px solid var(--grid-line)";

// Horizontal fade line — fades out to the right
const fadeLine: CSSProperties = {
  height: 1,
  background: "linear-gradient(to right, var(--grid-line) 0%, var(--grid-line) 60%, transparent 100%)",
};

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
      className={`grid-section max-w-[1287px] mx-5 md:mx-auto bg-white ${className}`}
      style={style}
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
    <div className="py-6 px-6 md:px-10">
      {label && (
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#0A1344]/30 font-mono block">
          {label}
        </span>
      )}
      {title && (
        <h2 className="text-[32px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.1] text-[#1D1D1F] mt-3">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-[17px] leading-[1.6] text-[#6E6E73] mt-2 max-w-[600px]">
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
      className={`${flush ? "" : "p-6 md:p-10"} ${hoverable ? "transition-colors duration-200 hover:bg-[rgba(120,120,200,0.04)]" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export { gl, fadeLine };
