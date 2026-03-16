"use client";

import Link from "next/link";

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
    ? "flex items-center rounded-full border border-black/[0.07] bg-black/30 backdrop-blur-sm"
    : "flex items-center rounded-full border border-black/[0.08] bg-black/[0.05] backdrop-blur-sm";

  const activeClass = isDark
    ? "flex-1 flex items-center justify-center rounded-full text-[16px] font-medium text-white h-full"
    : "flex-1 flex items-center justify-center rounded-full text-[16px] font-medium text-black h-full";

  const inactiveClass = isDark
    ? "flex-1 flex items-center justify-center rounded-full text-[16px] font-medium text-white/55 transition hover:text-white h-full"
    : "flex-1 flex items-center justify-center rounded-full text-[16px] font-medium text-black/45 transition hover:text-black/70 h-full";

  const activePillStyle: React.CSSProperties = isDark
    ? { backgroundColor: "rgba(0, 0, 0, 0.30)" }
    : { backgroundColor: "rgba(255, 255, 255, 0.85)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" };

  return (
    <div className={containerClass} style={containerStyle}>
      <Link
        href="/products"
        className={active === "consumer" ? activeClass : inactiveClass}
        style={active === "consumer" ? activePillStyle : undefined}
      >
        Consumer
      </Link>
      <Link
        href="/enterprise"
        className={active === "enterprise" ? activeClass : inactiveClass}
        style={active === "enterprise" ? activePillStyle : undefined}
      >
        Enterprise
      </Link>
    </div>
  );
}
