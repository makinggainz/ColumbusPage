"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Heart, Star } from "lucide-react";

// 8 particles radiating at different angles
const PARTICLES = [
  { angle: -80,  dist: 38 },
  { angle: -40,  dist: 44 },
  { angle:   0,  dist: 40 },
  { angle:  40,  dist: 44 },
  { angle:  80,  dist: 38 },
  { angle: -130, dist: 42 },
  { angle:  130, dist: 42 },
  { angle: 180,  dist: 36 },
];

// idle → tapping → filled (burst+Saved!) → fading (fade out burst+Saved!) → settled (heart stays filled 4s) → idle
type Phase = "idle" | "tapping" | "filled" | "fading" | "settled";

function FavoriteSpotCard() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => timers.current.forEach(clearTimeout);
    const after = (ms: number, fn: () => void) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    const runCycle = () => {
      timers.current = [];
      setPhase("idle");
      after(1500, () => setPhase("tapping"));
      after(1700, () => setPhase("filled"));   // burst + Saved! appear
      after(2900, () => setPhase("fading"));   // burst + Saved! fade out
      after(3700, () => setPhase("settled"));  // heart stays filled, quiet
      after(7700, runCycle);                   // 4s settled → repeat
    };

    after(800, runCycle);
    return clear;
  }, []);

  const isFilled      = phase !== "idle" && phase !== "tapping";
  const showParticles = phase === "filled" || phase === "fading";
  // Particles stay at their spread position throughout; only opacity changes on fading
  const particlesSpread  = true; // always spread once mounted — fade handles disappearance
  const particleOpacity  = phase === "filled" ? 1 : 0;
  const showSaved     = isFilled;
  const heartScale    = phase === "tapping" ? 1.4 : phase === "filled" ? 1.15 : 1;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 26,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        padding: "20px 20px 28px",
        width: "100%",
        overflow: "visible",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.07em", color: "#1D1D1F" }}>
            ZLATÁ PRAHA
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "#F5F5F7",
              borderRadius: 6,
              padding: "3px 9px",
            }}
          >
            <Star size={12} fill="#E46962" color="#E46962" />
            <span style={{ fontWeight: 600, fontSize: 13, color: "#1D1D1F" }}>5.0</span>
          </div>
        </div>

        {/* Heart button + particles + Saved! label */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
          {/* "Saved!" label */}
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#00B1D4",
              whiteSpace: "nowrap",
              opacity: showSaved ? 1 : 0,
              transform: showSaved ? "translateX(0)" : "translateX(6px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
              pointerEvents: "none",
              fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            Saved!
          </span>

          {/* Heart + particle container — overflow visible so particles escape card bounds */}
          <div style={{ position: "relative", width: 22, height: 22, overflow: "visible" }}>
            {/* Burst particles — mount spread, fade out in place */}
            {showParticles && PARTICLES.map((p, i) => {
              const rad = (p.angle * Math.PI) / 180;
              const tx = Math.cos(rad) * p.dist;
              const ty = Math.sin(rad) * p.dist;
              return (
                <span
                  key={i}
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    fontSize: 9,
                    lineHeight: 1,
                    pointerEvents: "none",
                    // Always at final spread position — never return to center
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`,
                    opacity: particleOpacity,
                    transition: `opacity 0.7s ease ${i * 25}ms`,
                  }}
                >
                  ❤️
                </span>
              );
            })}

            {/* Main heart */}
            <Heart
              size={22}
              fill={isFilled ? "#E46962" : "none"}
              color={isFilled ? "#E46962" : "#000000"}
              style={{
                position: "relative",
                zIndex: 1,
                transform: `scale(${heartScale})`,
                transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Photo */}
      <div style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 16, overflow: "hidden", marginBottom: 22 }}>
        <img
          src={`/FavoriteSpots/${encodeURIComponent("(20).jpeg")}`}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Query text */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <img
          src="https://i.pravatar.cc/80?img=47"
          alt=""
          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginTop: 4 }}
        />
        <p className="text-[20px] lg:text-[26px]" style={{ fontWeight: 500, color: "#1D1D1F", lineHeight: 1.35, margin: 0 }}>
          Find me a cute romantic restaurant with views of the river
        </p>
      </div>
    </div>
  );
}

export default function FavoritesSection() {
  return (
    <>
      {/* ================= SECTION 1: Headline + 2 emojis ================= */}
      <section className="bg-[#F9F9F9] w-full overflow-hidden min-h-[500px] lg:min-h-[1000px] flex items-center">
        <div className="max-w-[1408px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 text-center">
            <span className="hover-bee inline-block cursor-default transition-transform">
              <Image
                src="/how/light.png"
                alt=""
                width={120}
                height={100}
                className="w-20 sm:w-24 lg:w-32 h-auto block"
              />
            </span>
            <h2 className="text-[27px] sm:text-[36px] lg:text-[64px] font-semibold text-black leading-tight max-w-3xl">
              Let our AI find you
              <br className="hidden sm:block" />
              the coolest place, faster.
            </h2>
            <span className="hover-bee inline-block cursor-default transition-transform">
              <Image
                src="/how/serach.png"
                alt=""
                width={120}
                height={100}
                className="w-20 sm:w-24 lg:w-32 h-auto block"
              />
            </span>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: Save favorites + card + bottom text ================= */}
      <section className="bg-[#F9F9F9] w-full relative min-h-350 flex flex-col">
        <span
          className="absolute left-6 lg:left-12 top-6 lg:top-8 text-[#E5E5E5] font-semibold text-4xl sm:text-5xl lg:text-6xl leading-none select-none"
          aria-hidden
        >
          2
        </span>
        <div className="max-w-[1408px] mx-auto px-4 lg:px-6 pt-0 pb-0 flex flex-col flex-1 min-h-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p
                className="max-w-[739px] text-[27px] sm:text-[36px] lg:text-[64px] leading-[140%]"
                style={{
                  fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: 590,
                  background: "linear-gradient(90deg, #DE2F32 0%, #B00098 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Save your favorite spots, share with your friends.
              </p>
            </div>
            <div className="relative flex justify-end">
              <div className="w-full max-w-lg">
                <FavoriteSpotCard />
              </div>
            </div>
          </div>

          <div className="mt-24 flex justify-center mb-[100px] mt-auto relative z-20">
            <p
              className="text-center max-w-[837px] text-[27px] sm:text-[36px] lg:text-[48px] leading-[130%]"
              style={{
                fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 400,
                background: "linear-gradient(180deg, #000000 0%, #666666 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MapsGPT remembers your preferences,
              <br />
              and continuously learns
              <br />
              your vibes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}