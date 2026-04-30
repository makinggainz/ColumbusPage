"use client";

import { useEffect, useRef, useState } from "react";

const STROKE = "rgba(0, 0, 0, 0.22)";

export default function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
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
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "#FFFFFF", minHeight: "min(900px, 100vh)" }}
    >
      {/* ── Corner framing pieces ────────────────────────────────────────
          Each SVG is anchored to a section corner with a step path that
          starts just past the viewport edge (so the line visually reaches
          the screen edge) and reaches well into the section before
          terminating. Sized to leave a comfortable centre gap for the
          title at every breakpoint ≥ md. Top-left and bottom-right also
          carry a registration mark (small circle + crosshair) for visual
          balance. Hidden on mobile where the title fills most of the row.
      */}

      {/* Top-left */}
      <svg
        className="absolute pointer-events-none max-md:hidden"
        style={{ top: 0, left: 0, width: "min(560px, 32vw)", height: 300, overflow: "visible" }}
        viewBox="0 0 560 300"
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
        aria-hidden
      >
        <path d="M -30 90 L 230 90 A 50 50 0 0 1 280 140 L 280 230 A 50 50 0 0 0 330 280 L 500 280" />
        <circle cx="395" cy="170" r="14" />
        <line x1="430" y1="146" x2="430" y2="194" />
        <line x1="424" y1="170" x2="464" y2="170" />
      </svg>

      {/* Top-right */}
      <svg
        className="absolute pointer-events-none max-md:hidden"
        style={{ top: 0, right: 0, width: "min(560px, 32vw)", height: 300, overflow: "visible" }}
        viewBox="0 0 560 300"
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
        aria-hidden
      >
        <path d="M 590 90 L 330 90 A 50 50 0 0 0 280 140 L 280 230 A 50 50 0 0 1 230 280 L 60 280" />
      </svg>

      {/* Bottom-left */}
      <svg
        className="absolute pointer-events-none max-md:hidden"
        style={{ bottom: 0, left: 0, width: "min(560px, 32vw)", height: 300, overflow: "visible" }}
        viewBox="0 0 560 300"
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
        aria-hidden
      >
        <path d="M -30 210 L 230 210 A 50 50 0 0 0 280 160 L 280 70 A 50 50 0 0 1 330 20 L 500 20" />
      </svg>

      {/* Bottom-right */}
      <svg
        className="absolute pointer-events-none max-md:hidden"
        style={{ bottom: 0, right: 0, width: "min(560px, 32vw)", height: 300, overflow: "visible" }}
        viewBox="0 0 560 300"
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
        aria-hidden
      >
        <path d="M 590 210 L 330 210 A 50 50 0 0 1 280 160 L 280 70 A 50 50 0 0 0 230 20 L 60 20" />
        <circle cx="165" cy="130" r="14" />
        <line x1="130" y1="106" x2="130" y2="154" />
        <line x1="96" y1="130" x2="136" y2="130" />
      </svg>

      {/* ── Centered text — Geist scale tokens (fonts-typescale.md):
          Title scaled up one step from Section to Hero heading scale —
          39/49/61px @ 500, tracking -0.02em — so a single-word title
          carries the same visual weight as the multi-line Results heading.
          Subtitle steps up to Subheadings scale (20/20/25) and stays Muted.
      */}
      <div className="relative z-10 text-center px-8">
        <h2
          className="m-0 text-[39px] md:text-[49px] lg:text-[61px] leading-[1.1] tracking-[-0.02em]"
          style={{
            fontWeight: 500,
            background: "linear-gradient(90deg, #1D1D1F 0%, #1D1D1F 18%, #6E6E73 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            ...anim(0),
          }}
        >
          Capabilities
        </h2>
        <p
          className="mt-3 text-[20px] md:text-[20px] lg:text-[25px] leading-[1.47] tracking-[-0.01em]"
          style={{
            fontWeight: 400,
            color: "rgba(29, 29, 31, 0.45)",
            ...anim(120),
          }}
        >
          What we&apos;ve explored so far
        </p>
      </div>
    </section>
  );
}
