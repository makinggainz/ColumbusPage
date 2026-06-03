"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Measure before paint in the browser, but fall back to useEffect during SSR
// so React doesn't warn about useLayoutEffect on the server.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Fit-to-width wrapper. Renders its children at a fixed `designWidth` and
 * uniformly scales them down (transform: scale) to fit the available width —
 * so a layout keeps its exact desktop proportions, just smaller, fluidly,
 * with no media-query reflow. When there's enough room (available width ≥
 * designWidth) it's a pure passthrough, leaving the children at full size.
 *
 * Used by the research page's "LGM vs other foundation models" diagram, whose
 * 4-column grid is too wide to reflow gracefully on mobile/tablet.
 *
 * Optional `minScaleWidth`: when the available width drops BELOW this, the
 * wrapper becomes a pure passthrough again (scale 1) instead of shrinking
 * further — so a component that has its OWN dedicated layout below a breakpoint
 * (e.g. a mobile stack) can take over there rather than being miniaturised into
 * illegibility. Leave undefined to scale all the way down (original behavior).
 */
export function ScaleToFit({
  designWidth,
  minScaleWidth,
  className,
  children,
}: {
  designWidth: number;
  minScaleWidth?: number;
  className?: string;
  children: ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useIsoLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const avail = outer.clientWidth;
      if (avail >= designWidth) {
        // Enough room — render at full size (desktop behavior, untouched).
        setScale(1);
        setHeight(undefined);
      } else if (minScaleWidth != null && avail < minScaleWidth) {
        // Below the floor — stop shrinking and pass through so the child's own
        // smaller-screen layout (e.g. a mobile stack) governs instead.
        setScale(1);
        setHeight(undefined);
      } else {
        const next = avail / designWidth;
        setScale(next);
        // transform: scale() doesn't shrink the element's layout box, so the
        // wrapper must reserve the scaled height to keep page flow correct.
        setHeight(inner.offsetHeight * next);
      }
    };

    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner); // catches content/font-load reflow of the inner box
    measure();
    return () => ro.disconnect();
  }, [designWidth, minScaleWidth]);

  const scaling = scale < 1;

  const outerStyle: CSSProperties | undefined = scaling
    ? { height, overflow: "hidden" }
    : undefined;

  const innerStyle: CSSProperties | undefined = scaling
    ? {
        width: designWidth,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }
    : undefined;

  return (
    <div ref={outerRef} className={className} style={outerStyle}>
      <div ref={innerRef} style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
