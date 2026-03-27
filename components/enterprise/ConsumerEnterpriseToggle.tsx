"use client";

import Link from "next/link";
import glassStyles from "@/components/ui/GlassButton.module.css";

interface Props {
  variant?: "dark" | "light";
  active?: "consumer" | "enterprise";
}

export function ConsumerEnterpriseToggle({ variant = "dark", active = "enterprise" }: Props) {
  const isDark = variant === "dark";

  const containerStyle: React.CSSProperties = {
    width: "266px",
    height: "43px",
    padding: "3px",
  };

  const containerClass = isDark
    ? `relative flex items-center rounded-full border border-black/[0.07] bg-black/30 ${glassStyles.togglePill} ${glassStyles.togglePillHover}`
    : `relative flex items-center rounded-full border border-black/[0.07] bg-white/20 ${glassStyles.togglePillHover}`;

  const baseClass = "flex-1 flex items-center justify-center rounded-full text-[16px] font-medium h-full";

  const activeClass = isDark
    ? `${baseClass} text-white`
    : `${baseClass} text-black`;

  const inactiveClass = isDark
    ? `${baseClass} text-white/55 transition hover:text-white`
    : `${baseClass} text-black/65 transition hover:text-black/85`;

  const activePillStyle: React.CSSProperties = isDark
    ? { backgroundColor: "rgba(0, 0, 0, 0.30)" }
    : {};

  const consumerActive = active === "consumer";
  const enterpriseActive = active === "enterprise";

  return (
    <div className={containerClass} style={containerStyle}>
      <Link
        href="/products"
        className={`${consumerActive ? activeClass : inactiveClass} ${consumerActive && !isDark ? glassStyles.activePillConsumer : ""}`}
        style={consumerActive && isDark ? activePillStyle : undefined}
      >
        Consumer
      </Link>
      <Link
        href="/enterprise"
        className={enterpriseActive ? activeClass : inactiveClass}
        style={enterpriseActive ? activePillStyle : undefined}
      >
        Enterprise
      </Link>
    </div>
  );
}
