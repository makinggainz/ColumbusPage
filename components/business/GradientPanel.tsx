"use client";

import React from "react";

/* Codex-inspired gradient placeholder. Rendered when a non-residential
   industry is selected in the use-cases zone, since real per-industry
   visuals are still to be authored. Fills its parent with a soft
   diagonal gradient and an optional grain overlay for depth. */
export default function GradientPanel({
  gradient,
  ariaLabel,
  className,
}: {
  gradient: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className ?? ""}`}
      style={{
        background: gradient,
        borderRadius: "var(--ent-radius-2xl)",
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 60% at 20% 0%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 60%), radial-gradient(120% 80% at 100% 100%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 55%)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

export const CODEX_GRADIENTS = {
  chat:
    "linear-gradient(135deg, #FFE9CC 0%, #FFB088 28%, #5FB8E8 65%, #0081AC 100%)",
  dataCatalogue:
    "linear-gradient(135deg, #E6F4FB 0%, #62B6E2 40%, #0F7AA8 75%, #06405E 100%)",
  agenticResearch:
    "linear-gradient(135deg, #C8E8F8 0%, #5FB1DE 35%, #105A82 75%, #062F49 100%)",
  dashboard:
    "linear-gradient(135deg, #FFF4DF 0%, #FFCB8B 22%, #8FCFE9 60%, #0081AC 100%)",
} as const;
