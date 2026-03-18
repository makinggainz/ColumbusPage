"use client";

import { useState, useRef, useEffect } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";

const PILLS = ["Map Chat", "Agentic Audits", "Agentic Research Reports", "Data Catalogue"];
const INSET = 4; // gap between outer pill edge and inner indicator (all sides)

export function EnterprisePillsToggle() {
  const [active, setActive] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const measure = (idx: number) => {
    const btn = buttonRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const bRect = btn.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setIndicator({
      left: bRect.left - cRect.left + INSET,
      width: bRect.width - INSET * 2,
      ready: true,
    });
  };

  useEffect(() => { measure(0); }, []);

  const handleClick = (idx: number) => {
    setActive(idx);
    measure(idx);
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center relative"
      style={{
        marginTop: "24px",
        width: "893px",
        height: "56px",
        borderRadius: "28px",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        boxShadow: "inset 0 .125em .125em #0000000d, 0 .25em .125em -.125em #0003",
      }}
    >
      {/* Sliding glass indicator */}
      <div
        className={glassStyles.btn}
        aria-hidden
        style={{
          position: "absolute",
          top: `${INSET}px`,
          left: indicator.left,
          width: indicator.width,
          height: `calc(100% - ${INSET * 2}px)`,
          padding: 0,
          opacity: indicator.ready ? 1 : 0,
          transition: [
            "left 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            "width 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            "opacity 0.2s ease",
          ].join(", "),
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {PILLS.map((label, i) => (
        <button
          key={label}
          ref={el => { buttonRefs.current[i] = el; }}
          type="button"
          onClick={() => handleClick(i)}
          className="h-full flex items-center justify-center whitespace-nowrap relative"
          style={{
            flex: 1,
            fontSize: "19px",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            zIndex: 2,
            color: active === i ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.55)",
            transition: "color 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
          onMouseEnter={e => {
            if (active !== i) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
          }}
          onMouseLeave={e => {
            if (active !== i) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
