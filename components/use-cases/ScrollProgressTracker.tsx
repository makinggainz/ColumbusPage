"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const ACCENT_BLUE = "#0066CC";

export default function ScrollProgressTracker({
  sectionRefs,
}: {
  sectionRefs: RefObject<HTMLElement | null>[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxProgressRef = useRef(0);
  const [fillHeight, setFillHeight] = useState(0);
  const [viewed, setViewed] = useState<boolean[]>(() =>
    sectionRefs.map(() => false)
  );
  const viewedRef = useRef(viewed);

  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerH = container.offsetHeight;
      const viewportH = window.innerHeight;

      const scrolled = viewportH - containerRect.top;
      const total = containerH + viewportH;
      const raw = Math.max(0, Math.min(1, scrolled / total));

      if (raw > maxProgressRef.current) {
        maxProgressRef.current = raw;
      }
      setFillHeight(maxProgressRef.current * 100);

      const newViewed = [...viewedRef.current];
      let changed = false;
      sectionRefs.forEach((ref, i) => {
        if (newViewed[i]) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const midpoint = rect.top + rect.height * 0.5;
        if (midpoint < viewportH * 0.7) {
          newViewed[i] = true;
          changed = true;
        }
      });
      if (changed) {
        viewedRef.current = newViewed;
        setViewed(newViewed);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionRefs]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Inner container matching the structure line position */}
      <div className="relative h-full max-w-[1287px] mx-auto">
        {/* Track (dim background line) */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Fill (bright progress line) */}
        <div
          className="absolute left-0 top-0"
          style={{
            width: 1,
            height: `${fillHeight}%`,
            background: "rgba(255,255,255,0.35)",
            transition: "height 100ms linear",
          }}
        />

        {/* Dots — one per section, vertically centered */}
        {sectionRefs.map((ref, i) => (
          <SectionDot
            key={i}
            sectionRef={ref}
            containerRef={containerRef}
            viewed={viewed[i]}
          />
        ))}
      </div>
    </div>
  );
}

function SectionDot({
  sectionRef,
  containerRef,
  viewed,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  viewed: boolean;
}) {
  const [top, setTop] = useState(0);
  const [animate, setAnimate] = useState(false);
  const wasViewed = useRef(false);

  // Trigger completion animation
  useEffect(() => {
    if (viewed && !wasViewed.current) {
      wasViewed.current = true;
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 800);
      return () => clearTimeout(t);
    }
  }, [viewed]);

  useEffect(() => {
    const calc = () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;
      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      // Find the h2 title inside this section and center on it
      const h2 = section.querySelector("h2");
      if (h2) {
        const h2Rect = h2.getBoundingClientRect();
        const h2Top = h2Rect.top + window.scrollY;
        const h2H = h2Rect.height;
        setTop(h2Top - containerTop + h2H / 2);
      } else {
        // Fallback: center on section
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        setTop(sectionTop - containerTop + section.offsetHeight / 2);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    const t = setTimeout(calc, 500);
    return () => {
      window.removeEventListener("resize", calc);
      clearTimeout(t);
    };
  }, [sectionRef, containerRef]);

  return (
    <>
      <div
        className="absolute"
        style={{
          left: -5,
          top,
          width: 11,
          height: 11,
          borderRadius: "50%",
          border: viewed
            ? `2px solid ${ACCENT_BLUE}`
            : "1.5px solid rgba(255,255,255,0.2)",
          background: viewed ? ACCENT_BLUE : "transparent",
          transform: `translateY(-50%) scale(${animate ? 1.6 : viewed ? 1 : 0.8})`,
          transition: animate
            ? "background 200ms ease, border 200ms ease, transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 400ms ease"
            : "background 400ms ease, border 400ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms ease",
          boxShadow: animate
            ? `0 0 16px ${ACCENT_BLUE}80, 0 0 32px ${ACCENT_BLUE}40`
            : viewed
              ? `0 0 8px ${ACCENT_BLUE}50`
              : "none",
        }}
      />
      {/* Ripple ring on completion */}
      {animate && (
        <div
          className="absolute"
          style={{
            left: -10,
            top,
            width: 21,
            height: 21,
            borderRadius: "50%",
            border: `1.5px solid ${ACCENT_BLUE}`,
            transform: "translateY(-50%)",
            animation: "progressDotRipple 700ms ease-out forwards",
          }}
        />
      )}
      <style jsx>{`
        @keyframes progressDotRipple {
          0% {
            opacity: 0.8;
            transform: translateY(-50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) scale(2.5);
          }
        }
      `}</style>
    </>
  );
}
