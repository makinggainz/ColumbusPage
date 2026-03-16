"use client";

import { useEffect, useState } from "react";
import { cormorant } from "@/lib/typography";

type Phase = "init" | "visible" | "fadeout" | "gone";

export const CoverLetter = () => {
  const [phase, setPhase] = useState<Phase>("gone");

  useEffect(() => {
    // Uncomment to only show once per session:
    // if (sessionStorage.getItem("cover-seen")) return;
    // sessionStorage.setItem("cover-seen", "1");

    setPhase("init");
    const t0 = setTimeout(() => setPhase("visible"),  80);
    const t1 = setTimeout(() => setPhase("fadeout"), 2600);
    const t2 = setTimeout(() => setPhase("gone"),    3400);

    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "gone") return null;

  const isFading  = phase === "fadeout";
  const isVisible = phase === "visible" || phase === "fadeout";

  return (
    <>
      <style>{`
        @keyframes gradient-pulse {
          0%   { opacity: 0.55; transform: scale(0.92); }
          50%  { opacity: 1;    transform: scale(1.08); }
          100% { opacity: 0.55; transform: scale(0.92); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px center; }
          100% { background-position:  400px center; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: isFading ? "none" : "auto",
          opacity: isFading ? 0 : 1,
          transition: isFading
            ? "opacity 0.8s cubic-bezier(0.4, 0, 1, 1)"
            : "none",
        }}
      >
        {/* Pulsating radial glow behind text */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 75%)",
            animation: "gradient-pulse 2s ease-in-out infinite",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />

        {/* Text */}
        <h1
          className={cormorant.className}
          style={{
            position: "relative",
            fontSize: "clamp(42px, 6vw, 80px)",
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            // Shimmer gradient on text
            background: "linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,0.25) 100%)",
            backgroundSize: "800px 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: isVisible
              ? "shimmer 2.2s ease-in-out infinite"
              : "none",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.7s ease 0.1s",
          }}
        >
          A new breed of AI.
        </h1>
      </div>
    </>
  );
};
