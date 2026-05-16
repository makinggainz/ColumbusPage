"use client";

import { useEffect, useRef, useState } from "react";
import { StructureGrid } from "./StructureGrid";

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-10 lg:py-14"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Brighter grid area */}
      <div
        className="absolute top-0 bottom-0 ent-content-bounds left-0 right-0"
        style={{ backgroundColor: "transparent" }}
      />
      <StructureGrid lineColor="#E7E7F1" />

      <div
        className="relative z-10 ent-content-bounds px-4 md:px-6 flex items-center justify-center"
      >
        {/* Video placeholder */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 12,
            background: "linear-gradient(135deg, rgba(11,27,43,0.02) 0%, rgba(11,27,43,0.04) 50%, rgba(11,27,43,0.02) 100%)",
            border: "1px solid rgba(11,27,43,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ent-dark-text-low)",
            }}
          >
            The Solution. full video demo
          </span>
        </div>
      </div>
    </section>
  );
}
