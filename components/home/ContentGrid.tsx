"use client";

import { type ReactNode, type CSSProperties } from "react";

export function GridSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`grid-section max-w-[1287px] mx-auto bg-white ${className}`}>
      {children}
    </section>
  );
}

export function GridHeader({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  if (!title && !subtitle) return null;
  return (
    <div className="py-6 px-8 md:px-10">
      {title && (
        <h2 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.1] text-[#1D1D1F]">
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
      className={`${flush ? "" : "p-8 md:p-10"} ${hoverable ? "transition-colors duration-200 hover:bg-[rgba(120,120,200,0.04)]" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
