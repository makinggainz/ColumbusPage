"use client";

import { useState } from "react";
import Link from "next/link";
import glassStyles from "@/components/ui/GlassButton.module.css";

interface Props {
  variant?: "dark" | "light";
  active?: "consumer" | "enterprise";
  glass?: boolean;
}

export function ConsumerEnterpriseToggle({ variant = "dark", active = "enterprise", glass = true }: Props) {
  const isDark = variant === "dark";
  const [hoveringInactive, setHoveringInactive] = useState(false);

  const containerStyle: React.CSSProperties = {
    width: "304px",
    height: "48px",
    padding: "4px",
    border: "1px solid rgba(0, 0, 0, 0.10)",
  };

  const containerClass = isDark
    ? `relative flex items-center rounded-full border border-white/[0.10] bg-white/[0.06] ${glass ? `${glassStyles.togglePill} ${glassStyles.togglePillHover}` : ""}`
    : `relative flex items-center rounded-full border border-[#0A1344]/[0.08] bg-[#0A1344]/[0.03] ${glass ? glassStyles.togglePillHover : ""}`;

  const baseClass = "flex-1 flex items-center justify-center rounded-full text-[14px] font-normal h-full tracking-[-0.01em] transition-colors duration-250";

  const activeClass = isDark
    ? `${baseClass} ${glass ? "text-white" : "text-black"}`
    : `${baseClass} text-white`;

  const inactiveClass = isDark
    ? `${baseClass} ${glass ? "text-white/45 hover:text-white/75" : "text-black/40 hover:text-black/65"}`
    : `${baseClass} text-[#0A1344]/40 hover:text-[#0A1344]/65`;

  const activePillStyle: React.CSSProperties = isDark
    ? glass
      ? {
          backgroundColor: "rgba(255, 255, 255, 0.14)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 4px rgba(0,0,0,0.40)",
        }
      : {
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          boxShadow: "none",
        }
    : {
        backgroundColor: "rgba(10,19,68,0.55)",
        boxShadow: "0 1px 4px rgba(10,19,68,0.12)",
      };

  const consumerActive = active === "consumer";
  const enterpriseActive = active === "enterprise";

  // Subtle shift: active pill nudges toward hovered inactive side
  const shift = hoveringInactive ? (enterpriseActive ? 4 : -4) : 0;

  return (
    <div className={containerClass} style={containerStyle}>
      <Link
        href="/products/enterprise"
        className={enterpriseActive ? activeClass : inactiveClass}
        style={{
          ...(enterpriseActive ? {
            ...activePillStyle,
            transform: `translateX(${shift}px)`,
            transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
          } : {}),
        }}
        onMouseEnter={() => { if (!enterpriseActive) setHoveringInactive(true); }}
        onMouseLeave={() => setHoveringInactive(false)}
      >
        Columbus Pro
      </Link>
      <Link
        href="/products/mapsgpt"
        className={`${consumerActive ? activeClass : inactiveClass} ${consumerActive && !isDark ? glassStyles.activePillConsumer : ""}`}
        style={{
          ...(consumerActive ? {
            ...(isDark ? activePillStyle : {}),
            transform: `translateX(${shift}px)`,
            transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
          } : {}),
        }}
        onMouseEnter={() => { if (!consumerActive) setHoveringInactive(true); }}
        onMouseLeave={() => setHoveringInactive(false)}
      >
        MapsGPT
      </Link>
    </div>
  );
}
