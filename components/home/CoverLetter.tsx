"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Animation phases:
// "init"    — overlay visible, logo hidden at full size (144px)
// "mark"    — logo fades in at 35% opacity, still large (wabi.ai circles effect)
// "full"    — logo brightens to 100% + shrinks to final size, wordmark fades in
// "fadeout" — whole overlay blurs + fades up
// "gone"    — unmounted
type Phase = "init" | "mark" | "full" | "fadeout" | "gone";

const LOGO_BIG   = 144;
const LOGO_SMALL = 72;

export const CoverLetter = () => {
  const [phase, setPhase] = useState<Phase>("gone");

  useEffect(() => {
    // if (sessionStorage.getItem("cover-seen")) return;
    // sessionStorage.setItem("cover-seen", "1");

    setPhase("init");
    const t0 = setTimeout(() => setPhase("mark"),     80);
    const t1 = setTimeout(() => setPhase("full"),    900);
    const t2 = setTimeout(() => setPhase("fadeout"), 2800);
    const t3 = setTimeout(() => setPhase("gone"),    3600);

    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "gone") return null;

  const isFull    = phase === "full" || phase === "fadeout";
  const isFading  = phase === "fadeout";

  const logoSize    = isFull ? LOGO_SMALL : LOGO_BIG;
  const logoOpacity = phase === "mark" ? 0.35 : phase === "init" ? 0 : 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: isFading ? "none" : "auto",
        opacity: isFading ? 0 : 1,
        filter: isFading ? "blur(14px)" : "blur(0px)",
        transform: isFading ? "translateY(-18px)" : "translateY(0)",
        transition: isFading
          ? "opacity 0.75s ease-in, filter 0.75s ease-in, transform 0.75s ease-in"
          : "none",
      }}
    >
      {/* Centered group — logo + wordmark always centered as a unit */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: isFull ? 20 : 0,
          transition: "gap 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Logo mark — fades in large, then shrinks */}
        <div
          style={{
            width: logoSize,
            height: logoSize,
            position: "relative",
            flexShrink: 0,
            opacity: logoOpacity,
            transition: [
              "width 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
              "height 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
              "opacity 0.55s ease-out",
            ].join(", "),
          }}
        >
          <Image src="/logobueno.png" alt="Columbus" fill className="object-contain" priority />
        </div>

        {/* Wordmark — expands from 0 width so the group stays centered */}
        <span
          className="brand-wordmark"
          style={{
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#0A1344",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: isFull ? 400 : 0,
            opacity: isFull ? 1 : 0,
            transition: [
              "max-width 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
              "opacity 0.5s ease-out 0.15s",
            ].join(", "),
          }}
        >
          Columbus Earth
        </span>
      </div>
    </div>
  );
};
