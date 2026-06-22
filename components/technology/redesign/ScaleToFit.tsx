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
 *
 * Optional `stackDesignWidth` (+ `stackFloorWidth`): a SECOND design width used
 * once the available width drops below `minScaleWidth`. Instead of passing
 * through, the wrapper renders the child at `stackDesignWidth` and uniformly
 * scales it (UP to fill wider viewports, or down) to the available width — for a
 * layout that reflows to a narrow single-column design below the breakpoint and
 * wants that design rigidly scaled (proportions locked) rather than left to
 * stretch/cramp fluidly. `stackFloorWidth` sets the lower bound: below it the
 * wrapper passes through again (scale 1) so the child's native small layout
 * governs on phones rather than being scaled. Requires `minScaleWidth`.
 */
export function ScaleToFit({
  designWidth,
  minScaleWidth,
  stackDesignWidth,
  stackFloorWidth,
  className,
  children,
}: {
  designWidth: number;
  minScaleWidth?: number;
  stackDesignWidth?: number;
  stackFloorWidth?: number;
  className?: string;
  children: ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [boxWidth, setBoxWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useIsoLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const avail = outer.clientWidth;
      const passthrough = () => {
        setScale(1);
        setBoxWidth(undefined);
        setHeight(undefined);
      };
      // transform: scale() doesn't change the element's layout box, so the
      // wrapper must reserve the scaled height to keep page flow correct.
      const scaleTo = (next: number, box: number) => {
        setScale(next);
        setBoxWidth(box);
        setHeight(inner.offsetHeight * next);
      };

      if (avail >= designWidth) {
        // Enough room — render at full size (desktop behavior, untouched).
        passthrough();
      } else if (minScaleWidth != null && avail < minScaleWidth) {
        // Below the 2-col floor.
        if (
          stackDesignWidth != null &&
          (stackFloorWidth == null || avail >= stackFloorWidth)
        ) {
          // Stacked design: render at stackDesignWidth and scale it (up to fill
          // wider viewports, or down) so the single-column layout keeps locked
          // proportions instead of stretching/cramping fluidly.
          scaleTo(avail / stackDesignWidth, stackDesignWidth);
        } else {
          // Below the stack floor — pass through so the child's native small
          // layout (e.g. the phone stack) governs instead of being scaled.
          passthrough();
        }
      } else {
        scaleTo(avail / designWidth, designWidth);
      }
    };

    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner); // catches content/font-load reflow of the inner box
    measure();
    return () => ro.disconnect();
  }, [designWidth, minScaleWidth, stackDesignWidth, stackFloorWidth]);

  const transformed = boxWidth != null;

  const outerStyle: CSSProperties | undefined = transformed
    ? { height, overflow: "hidden" }
    : undefined;

  const innerStyle: CSSProperties | undefined = transformed
    ? {
        width: boxWidth,
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
