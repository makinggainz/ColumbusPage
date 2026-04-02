"use client";

import { useState } from "react";
import Link from "next/link";
import glassStyles from "@/components/ui/GlassButton.module.css";

interface Props {
  variant?: "dark" | "light";
  active?: "consumer" | "enterprise";
}

export function ConsumerEnterpriseToggle({ variant = "dark", active = "enterprise" }: Props) {
  const isDark = variant === "dark";
  const [hoveringInactive, setHoveringInactive] = useState(false);

  const containerStyle: React.CSSProperties = {
    width: "304px",
    height: "48px",
    padding: "4px",
  };

  const containerClass = isDark
    ? `relative flex items-center rounded-full border border-white/[0.10] bg-white/[0.06] ${glassStyles.togglePill} ${glassStyles.togglePillHover}`
    : `relative flex items-center rounded-full border border-black/[0.07] bg-white/20 ${glassStyles.togglePillHover}`;

  const baseClass = "flex-1 flex items-center justify-center rounded-full text-[15px] font-medium h-full tracking-[-0.01em] transition-colors duration-250";

  const activeClass = isDark
    ? `${baseClass} text-white`
    : `${baseClass} text-[#0A1344]`;

  const inactiveClass = isDark
    ? `${baseClass} text-white/45 hover:text-white/75`
    : `${baseClass} text-[#0A1344]/45 hover:text-[#0A1344]/70`;

  const activePillStyle: React.CSSProperties = isDark
    ? {
        backgroundColor: "rgba(255, 255, 255, 0.14)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 4px rgba(0,0,0,0.40)",
      }
    : {
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(10,19,68,0.12), 0 1px 8px rgba(10,19,68,0.06)",
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
