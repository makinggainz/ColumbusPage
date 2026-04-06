"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Heart, Star } from "lucide-react";
// @ts-expect-error — CSS side-effect import
import "@/components/products/how-it-works-tokens.css";

/* ═══════════════════════════════════════════════════════════════
   Animated heart card — cycles through tap → fill → burst → settle
   ═══════════════════════════════════════════════════════════════ */
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
      clear();
      timers.current = [];
      setPhase("idle");
      after(1500, () => setPhase("tapping"));
      after(1700, () => setPhase("filled"));
      after(2900, () => setPhase("fading"));
      after(3700, () => setPhase("settled"));
      after(7700, runCycle);
    };

    after(800, runCycle);
    return clear;
  }, []);

  const isFilled      = phase !== "idle" && phase !== "tapping";
  const showParticles = phase === "filled" || phase === "fading";
  const particleOpacity  = phase === "filled" ? 1 : 0;
  const showSaved     = isFilled;
  const heartScale    = phase === "tapping" ? 1.4 : phase === "filled" ? 1.15 : 1;

  return (
    <div
      style={{
        background: "var(--hiw-bg-card)",
        borderRadius: "var(--hiw-radius-2xl)",
        boxShadow: "var(--hiw-shadow-lg)",
        padding: "var(--hiw-space-5)",
        paddingBottom: "var(--hiw-space-8)",
        width: "100%",
        overflow: "visible",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--hiw-space-4)", overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--hiw-space-3)" }}>
          <span style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-bold)" as unknown as number,
            fontSize: "var(--hiw-text-sm)",
            letterSpacing: "0.07em",
            color: "var(--hiw-text-primary)",
          }}>
            ZLATÁ PRAHA
          </span>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--hiw-space-1)",
            background: "var(--hiw-bg-subtle)",
            borderRadius: "var(--hiw-radius-sm)",
            padding: "3px 9px",
          }}>
            <Star size={12} fill="var(--hiw-accent-alt)" color="var(--hiw-accent-alt)" />
            <span style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
              fontSize: "var(--hiw-text-xs)",
              color: "var(--hiw-text-primary)",
            }}>5.0</span>
          </div>
        </div>

        {/* Heart + particles + Saved! */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--hiw-space-2)" }}>
          <span style={{
            fontFamily: "var(--hiw-font-sans)",
            fontSize: "var(--hiw-text-sm)",
            fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            color: "var(--hiw-accent)",
            whiteSpace: "nowrap",
            opacity: showSaved ? 1 : 0,
            transform: showSaved ? "translateX(0)" : "translateX(6px)",
            transition: `opacity var(--hiw-duration-normal) var(--hiw-easing-default), transform var(--hiw-duration-normal) var(--hiw-easing-default)`,
            pointerEvents: "none",
          }}>
            Saved!
          </span>

          <div style={{ position: "relative", width: 22, height: 22, overflow: "visible" }}>
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
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`,
                    opacity: particleOpacity,
                    transition: `opacity 0.7s ease ${i * 25}ms`,
                  }}
                >
                  ❤️
                </span>
              );
            })}
            <Heart
              size={22}
              fill={isFilled ? "var(--hiw-accent-alt)" : "none"}
              color={isFilled ? "var(--hiw-accent-alt)" : "var(--hiw-text-primary)"}
              style={{
                position: "relative",
                zIndex: 1,
                transform: `scale(${heartScale})`,
                transition: `transform var(--hiw-duration-fast) var(--hiw-easing-spring)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Photo */}
      <div style={{
        width: "100%",
        aspectRatio: "4 / 3",
        borderRadius: "var(--hiw-radius-lg)",
        overflow: "hidden",
        marginBottom: "var(--hiw-space-5)",
      }}>
        <img
          src={`/FavoriteSpots/${encodeURIComponent("(20).jpeg")}`}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Query text */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--hiw-space-3)" }}>
        <img
          src="https://i.pravatar.cc/80?img=47"
          alt=""
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--hiw-radius-full)",
            objectFit: "cover",
            flexShrink: 0,
            marginTop: "var(--hiw-space-1)",
          }}
        />
        <p className="text-[20px] lg:text-[26px]" style={{
          fontFamily: "var(--hiw-font-sans)",
          fontWeight: "var(--hiw-weight-medium)" as unknown as number,
          lineHeight: "var(--hiw-leading-snug)" as unknown as number,
          color: "var(--hiw-text-primary)",
          margin: 0,
        }}>
          Find me a cute romantic restaurant with views of the river
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FavoritesSection — statement text + animated card
   ═══════════════════════════════════════════════════════════════ */
export default function FavoritesSection() {
  return (
    <section
      className="hiw-scope"
      style={{
        background: "var(--hiw-bg-page)",
        paddingTop: "var(--hiw-section-py)",
        paddingBottom: "var(--hiw-section-py)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--hiw-max-width)",
          marginInline: "auto",
          paddingInline: "var(--hiw-content-px)",
        }}
      >
        {/* Headline + emojis */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 text-center" style={{ marginBottom: "var(--hiw-step-gap)" }}>
          <span className="hover-bee inline-block cursor-default">
            <Image
              src="/how/light.png"
              alt=""
              width={120}
              height={100}
              className="w-20 sm:w-24 lg:w-32 h-auto block"
            />
          </span>
          <h2 style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            fontSize: "clamp(var(--hiw-text-xl), 5vw, var(--hiw-text-4xl))",
            lineHeight: "var(--hiw-leading-tight)" as unknown as number,
            color: "var(--hiw-text-primary)",
            margin: 0,
          }}>
            Let our AI find you
            <br />
            the coolest place, faster.
          </h2>
          <span className="hover-bee inline-block cursor-default">
            <Image
              src="/how/serach.png"
              alt=""
              width={120}
              height={100}
              className="w-20 sm:w-24 lg:w-32 h-auto block"
            />
          </span>
        </div>

        {/* Card + text row */}
        <div className="grid lg:grid-cols-[1fr_1fr] items-center" style={{ gap: "var(--hiw-space-16)" }}>
          {/* Text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-medium)" as unknown as number,
              fontSize: "clamp(var(--hiw-text-xl), 4vw, var(--hiw-text-3xl))",
              lineHeight: "var(--hiw-leading-snug)" as unknown as number,
              color: "var(--hiw-text-primary)",
              margin: 0,
              maxWidth: 560,
              marginInline: "auto",
            }}>
              MapsGPT remembers your preferences and continuously learns your vibes.
            </p>
          </div>

          {/* Card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <FavoriteSpotCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
