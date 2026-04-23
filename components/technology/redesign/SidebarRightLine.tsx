"use client";

import { useEffect, useRef, useState } from "react";

import styles from "../technology.module.css";

const BOW = 140;        // horizontal distance the curve bows to the right
const CURVE_VERT = 200; // vertical tangent length on each side of the gap
const GAP_HALF = 80;    // half-height of the open gap at the timeline crossing
const STROKE = "rgba(0, 102, 204, 0.3)";

// Section bg color — the LGM timeline section (.lgmSlide) sits behind the
// left side of the right sidebar line. At the curve opening, this color
// "bleeds" through into the gutter to the right of the line.
const SECTION_BG = "#F9F9F9";

export function SidebarRightLine({ timelineId }: { timelineId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [geometry, setGeometry] = useState<{ height: number; timelineY: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    const schedule = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const timeline = document.getElementById(timelineId);
        if (!timeline) return;
        const cRect = container.getBoundingClientRect();
        const tRect = timeline.getBoundingClientRect();
        // Use the vertical midpoint of the track element — this is the exact
        // Y of the 1px horizontal line in container-relative coords.
        const timelineY = tRect.top + tRect.height / 2 - cRect.top;
        setGeometry((prev) => {
          if (prev && Math.abs(prev.height - cRect.height) < 0.5 && Math.abs(prev.timelineY - timelineY) < 0.5) {
            return prev;
          }
          return { height: cRect.height, timelineY };
        });
      });
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(container);
    if (document.body) ro.observe(document.body);
    const timeline = document.getElementById(timelineId);
    if (timeline) ro.observe(timeline);

    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("load", schedule);
    // Catch late layout shifts (font/image load, Lenis wrapper setup).
    const timeouts = [100, 400, 1200, 3000].map((ms) => window.setTimeout(schedule, ms));

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, { capture: true } as AddEventListenerOptions);
      window.removeEventListener("load", schedule);
      timeouts.forEach((id) => window.clearTimeout(id));
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
    };
  }, [timelineId]);

  return (
    <div ref={containerRef} className={styles.sidebarPanelRight} aria-hidden>
      {geometry ? <CurveSvg height={geometry.height} timelineY={geometry.timelineY} /> : null}
    </div>
  );
}

function CurveSvg({ height, timelineY }: { height: number; timelineY: number }) {
  const y1 = Math.max(0, timelineY - CURVE_VERT);
  const y4 = timelineY - GAP_HALF;
  const y5 = timelineY + GAP_HALF;
  const y8 = Math.min(height, timelineY + CURVE_VERT);
  const topDy = y4 - y1;
  const botDy = y8 - y5;

  // Exponential-style bends: long vertical tangent, short horizontal tangent
  // at the gap end. The curves end HORIZONTAL (tangent pointing outward),
  // they do NOT return to vertical on the gap side.
  const TANGENT_V = 0.7; // vertical tangent extent (% of dy)
  const TANGENT_H = 0.3; // horizontal tangent extent (% of BOW)

  const path = [
    `M 0 0`,
    `L 0 ${y1}`,
    // Top: start vertical down at (0, y1) → ends horizontal right at (BOW, y4)
    `C 0 ${y1 + topDy * TANGENT_V} ${BOW * (1 - TANGENT_H)} ${y4} ${BOW} ${y4}`,
    // Bottom: starts horizontal left at (BOW, y5) → ends vertical down at (0, y8)
    `M ${BOW} ${y5}`,
    `C ${BOW * (1 - TANGENT_H)} ${y5} 0 ${y8 - botDy * TANGENT_V} 0 ${y8}`,
    `L 0 ${height}`,
  ].join(" ");

  // Bleed — a closed path that traces the two curve interiors (so the
  // liquid is shaped BY the structure lines), then bulges past the gap
  // tips with a quadratic arc to form a "jet" flowing into the gutter.
  // A horizontal linear gradient fades the section-bg fill from solid at
  // the section side (x=0) to fully transparent at the jet tip, so it
  // reads as liquid emanating outward and dissipating.
  const JET = 70;
  const bleedPath = [
    `M 0 ${y1}`,
    // Follows the top stroke curve exactly (same control points) from
    // the upper attachment at (0, y1) down to the upper gap tip (BOW, y4).
    `C 0 ${y1 + topDy * TANGENT_V} ${BOW * (1 - TANGENT_H)} ${y4} ${BOW} ${y4}`,
    // Jet — quadratic arc from upper gap tip → peak at (BOW+JET, timelineY) → lower gap tip.
    `Q ${BOW + JET} ${timelineY} ${BOW} ${y5}`,
    // Follows the bottom stroke curve exactly back to (0, y8).
    `C ${BOW * (1 - TANGENT_H)} ${y5} 0 ${y8 - botDy * TANGENT_V} 0 ${y8}`,
    // Close the shape along the line (x=0) — this edge sits inside the
    // section, so no visible boundary appears against section-bg-colored
    // content to the left.
    `L 0 ${y1}`,
    `Z`,
  ].join(" ");

  const gradientId = `gen-layers-bleed-${Math.round(timelineY)}`;

  return (
    <svg
      className={styles.sidebarRightLineSvg}
      width={BOW + 2}
      height={height}
      viewBox={`0 0 ${BOW + 2} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={timelineY}
          x2={BOW + JET}
          y2={timelineY}
        >
          {/* Gradient focused at the gap — invisible at the section side
              (x=0, offset 0%), peaks near the gap opening (x≈BOW, offset
              ~70%), then fades back to transparent at the jet tip. Visual
              weight concentrates where the liquid is "squeezing through"
              the narrow opening rather than flooding the whole lens. */}
          <stop offset="0%"   stopColor={SECTION_BG} stopOpacity="0"    />
          <stop offset="35%"  stopColor={SECTION_BG} stopOpacity="0.3"  />
          <stop offset="70%"  stopColor={SECTION_BG} stopOpacity="0.95" />
          <stop offset="90%"  stopColor={SECTION_BG} stopOpacity="0.6"  />
          <stop offset="100%" stopColor={SECTION_BG} stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* Bleed — rendered BEFORE the curves so the strokes land on top. */}
      <path d={bleedPath} fill={`url(#${gradientId})`} stroke="none" />

      <path d={path} fill="none" stroke={STROKE} strokeWidth="1" />
    </svg>
  );
}
