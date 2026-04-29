"use client";

import { useEffect, useRef, useState } from "react";

import styles from "../technology.module.css";

const BOW = 140;        // horizontal distance the curve bows to the right
const CURVE_VERT = 200; // vertical tangent length on each side of the gap
const GAP_HALF = 80;    // half-height of the open gap at the timeline crossing
const STROKE = "rgba(0, 102, 204, 0.3)";

// The section's bg color "bleeds out" of the line through the curve opening
// — the filled shape lives in the gutter (x > 0 in SVG coords) so the
// effect visibly flows AWAY from the content area, not into it.
const BLEED_COLOR = "#F9F9F9";

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

  // Bleed — a closed path that traces the two curve interiors exactly
  // (so the shape is literally bounded BY the structure lines) and
  // bulges past the gap tips with a quadratic jet arc. Lives in the
  // gutter (x > 0), flowing OUTWARD through the opening.
  const JET = 70;
  const bleedPath = [
    `M 0 ${y1}`,
    // Follows the top stroke curve down-right to the upper gap tip (BOW, y4).
    `C 0 ${y1 + topDy * TANGENT_V} ${BOW * (1 - TANGENT_H)} ${y4} ${BOW} ${y4}`,
    // Jet — quadratic arc peaking at (BOW+JET, timelineY) → gap bottom tip.
    `Q ${BOW + JET} ${timelineY} ${BOW} ${y5}`,
    // Follows the bottom stroke curve back to (0, y8).
    `C ${BOW * (1 - TANGENT_H)} ${y5} 0 ${y8 - botDy * TANGENT_V} 0 ${y8}`,
    // Close along the line (x=0). This edge sits at the boundary between
    // the section bg (same color as the fill) and the gutter — no visible
    // seam since section bg and BLEED_COLOR match.
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
        {/* Pattern matching the .lgmSlide section background's base layers:
            #F9F9F9 base + the dot-grid plus-pattern (24×24 tile). */}
        <pattern
          id={`${gradientId}-pat`}
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <rect width="24" height="24" fill={BLEED_COLOR} />
          <path
            d="M12 11.5v1M11.5 12h1"
            stroke="rgba(0,102,204,0.12)"
            strokeWidth="1.6"
            strokeLinecap="square"
          />
        </pattern>

        {/* Halo — matches .lgmTimelineHalo's vertical linear gradient.
            Peaks at the timeline centerline (rgba(0,102,204,0.16)) and
            fades symmetrically up/down. Spans ±230px which approximates
            the actual halo's height (clamp(360–460px) timeline + 30px
            overflow on each side). This is what creates the perceptual
            grey-blue tint at the timeline's Y position. */}
        <linearGradient
          id={`${gradientId}-halo`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={timelineY - 230}
          x2={0}
          y2={timelineY + 230}
        >
          <stop offset="0%"   stopColor="#0066cc" stopOpacity="0"    />
          <stop offset="25%"  stopColor="#0066cc" stopOpacity="0.04" />
          <stop offset="50%"  stopColor="#0066cc" stopOpacity="0.16" />
          <stop offset="75%"  stopColor="#0066cc" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#0066cc" stopOpacity="0"    />
        </linearGradient>

        {/* Mask gradient — same opacity profile as before, fades both
            the base pattern and the halo overlay together at the gap
            edges and jet tip. */}
        <linearGradient
          id={`${gradientId}-mask`}
          gradientUnits="userSpaceOnUse"
          x1={BOW + JET}
          y1={timelineY}
          x2={0}
          y2={timelineY}
        >
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0"    />
          <stop offset="40%"  stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="75%"  stopColor="#ffffff" stopOpacity="1"    />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1"    />
        </linearGradient>
        <mask id={`${gradientId}-m`}>
          <rect
            x={-10}
            y={0}
            width={BOW + JET + 20}
            height={height}
            fill={`url(#${gradientId}-mask)`}
          />
        </mask>

        {/* Radial halo — emanates from the line crossing point in the
            gap and extends outward into the gutter. Mimics the timeline
            halo "leaking" through the gap. */}
        <radialGradient
          id={`${gradientId}-radial-halo`}
          gradientUnits="userSpaceOnUse"
          cx={0}
          cy={timelineY}
          r={500}
        >
          <stop offset="0%"   stopColor="#0066cc" stopOpacity="0.18" />
          <stop offset="35%"  stopColor="#0066cc" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0066cc" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* Radial halo — sits BEHIND the bleed and curves. Centered at the
          line crossing point (0, timelineY), extends rightward into the
          gutter, fading to 0 toward the screen edge. */}
      <rect
        x={0}
        y={timelineY - 500}
        width={500}
        height={1000}
        fill={`url(#${gradientId}-radial-halo)`}
      />

      {/* Bleed (#3) — rendered BEFORE the curves so strokes land on top.
          Single base-pattern path (#F9F9F9 + plus dots) matching the
          timeline section background. Faded by the shared mask. */}
      <g mask={`url(#${gradientId}-m)`}>
        <path d={bleedPath} fill={`url(#${gradientId}-pat)`} stroke="none" />
      </g>

      <path d={path} fill="none" stroke={STROKE} strokeWidth="1" />

      {/* ── Temporary numbered reference labels for design discussion. ──
          Remove these <text> elements when no longer needed. */}
      <text
        x={BOW * 0.55}
        y={y1 + (y4 - y1) * 0.5}
        fontSize="22"
        fontWeight="700"
        fontFamily="monospace"
        fill="#FF0000"
        stroke="#FFFFFF"
        strokeWidth="4"
        paintOrder="stroke"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        1
      </text>
      <text
        x={BOW * 0.55}
        y={y5 + (y8 - y5) * 0.5}
        fontSize="22"
        fontWeight="700"
        fontFamily="monospace"
        fill="#FF0000"
        stroke="#FFFFFF"
        strokeWidth="4"
        paintOrder="stroke"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        2
      </text>
      <text
        x={BOW + JET - 12}
        y={timelineY}
        fontSize="22"
        fontWeight="700"
        fontFamily="monospace"
        fill="#FF0000"
        stroke="#FFFFFF"
        strokeWidth="4"
        paintOrder="stroke"
        textAnchor="end"
        dominantBaseline="middle"
      >
        3
      </text>
    </svg>
  );
}
