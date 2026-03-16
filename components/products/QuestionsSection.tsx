"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const CARD_SOURCES = [
  "Question1.png",
  "Question2.png",
  "Question3.png",
  "Question4.png",
  "Question5.png",
  "Question6.png",
  "Question7.png",
  "Question8.png",
  "Question9.png",
  "Question10.png",
  "Question11.png",
];

interface CardDef {
  width: number;
  height: number;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  startZ: number;  // initial translateZ — more negative = further back = disappears LAST
  opacity: number;
}

// Assign each card a unique Z depth.
// The spread from -280 to -760 creates obvious layering: nearest cards fly past first,
// furthest cards (hero card at -760) fly past last.
const CARDS: CardDef[] = [
  { width: 238, height: 289, left: "8%",   top: "10%",    startZ: -320, opacity: 0.55 },
  { width: 272, height: 306, left: "38%",  top: "5%",     startZ: -640, opacity: 0.55 },
  { width: 272, height: 306, right: "10%", top: "8%",     startZ: -480, opacity: 0.55 },
  { width: 255, height: 306, left: "5%",   bottom: "12%", startZ: -400, opacity: 0.55 },
  { width: 408, height: 306, left: "28%",  bottom: "5%",  startZ: -760, opacity: 1.00 }, // hero — last to go
  { width: 255, height: 306, right: "2%",  bottom: "5%",  startZ: -360, opacity: 0.55 },
  { width: 221, height: 272, left: "15%",  top: "25%",    startZ: -560, opacity: 0.55 },
  { width: 255, height: 306, right: "20%", top: "20%",    startZ: -280, opacity: 0.55 }, // nearest — first to go
  { width: 238, height: 289, left: "45%",  top: "15%",    startZ: -680, opacity: 0.55 },
  { width: 272, height: 306, right: "5%",  bottom: "25%", startZ: -520, opacity: 0.55 },
  { width: 221, height: 272, left: "20%",  bottom: "20%", startZ: -600, opacity: 0.55 },
];

const TRAVEL      = 1000; // px each card travels forward over progress 0→1
const PERSPECTIVE = 900;  // CSS perspective depth (px)
const FADE_START  = -160; // Z at which card starts fading out
const FADE_END    = -20;  // Z at which card is fully transparent

function cardStyle(card: CardDef, progress: number) {
  const currentZ = card.startZ + progress * TRAVEL;
  let alpha = card.opacity;
  if (currentZ >= FADE_END) {
    alpha = 0;
  } else if (currentZ >= FADE_START) {
    alpha = card.opacity * (1 - (currentZ - FADE_START) / (FADE_END - FADE_START));
  }
  return {
    left:    card.left,
    right:   card.right,
    top:     card.top,
    bottom:  card.bottom,
    opacity: alpha,
    transform: `translateZ(${currentZ}px)`,
    willChange: "transform, opacity" as const,
  };
}

export default function QuestionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress]           = useState(0);
  const [isStickyActive, setIsStickyActive] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect        = el.getBoundingClientRect();
      const scrollRange = el.offsetHeight - window.innerHeight;

      // Sticky is active: section top has passed viewport top AND bottom still visible
      setIsStickyActive(rect.top <= 0 && rect.bottom > 0);

      if (scrollRange <= 0) { setProgress(1); return; }
      const p = -rect.top / scrollRange;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const atEnd = progress >= 0.97;

  // Fixed layer shows during the scroll animation window
  const showFixed = isStickyActive && !atEnd;

  // Text opacities
  const headingOpacity =
    progress < 0.70 ? 1
    : progress < 0.83 ? 1 - (progress - 0.70) / 0.13
    : 0;

  const tryItOpacity =
    progress < 0.87 ? 0
    : Math.min(1, (progress - 0.87) / 0.13);

  return (
    // Tall outer div = scroll range
    <div ref={sectionRef} style={{ height: "500vh" }}>

      {/* ── In-flow placeholder ──────────────────────────────────────────────────
          Visible BEFORE the scroll range starts (initial state, p=0) and
          AFTER it ends (final state, p≈1). Hidden while the fixed layer is showing.
          Uses sticky so it pins at top when the section first reaches the viewport,
          giving the user a moment to see the initial state before scrolling.
      ─────────────────────────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 h-screen bg-[#F9F9F9]"
        style={{
          perspective: `${PERSPECTIVE}px`,
          visibility: showFixed ? "hidden" : "visible",
        }}
      >
        {CARDS.map((card, i) => (
          <div
            key={`placeholder-${CARD_SOURCES[i]}`}
            className="absolute"
            style={cardStyle(card, atEnd ? 1 : 0)}
          >
            <Image
              src={`/QuestionsMapsGPT/${CARD_SOURCES[i]}`}
              width={card.width}
              height={card.height}
              alt=""
              draggable={false}
            />
          </div>
        ))}

        {/* Text shown in placeholder (initial or final) */}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          {atEnd ? (
            <h2 className="text-4xl font-semibold text-[#0F6B6E] md:text-6xl">
              Try it—find out why
            </h2>
          ) : (
            <>
              <h2 className="text-4xl font-semibold text-[#0F6B6E] md:text-6xl">
                We&apos;ve already answered
              </h2>
              <h2 className="mt-4 text-4xl font-semibold text-[#0F6B6E] md:text-6xl">
                thousands of questions!
              </h2>
            </>
          )}
        </div>
      </div>

      {/* ── Fixed animation layer ────────────────────────────────────────────────
          Renders as position:fixed (viewport-relative) during the scroll window.
          Using fixed instead of sticky avoids the overflow-x:hidden on <main>
          breaking sticky, and avoids overflow:hidden + perspective conflicts.
          z-index below the navbar (which is typically z-50).
      ─────────────────────────────────────────────────────────────────────────── */}
      {showFixed && (
        <div
          className="fixed inset-0 z-30 bg-[#F9F9F9] pointer-events-none"
          style={{ perspective: `${PERSPECTIVE}px` }}
        >
          {/* 3D Cards — each at its own Z depth, staggered disappearance */}
          {CARDS.map((card, i) => (
            <div
              key={`fixed-${CARD_SOURCES[i]}`}
              className="absolute"
              style={cardStyle(card, progress)}
            >
              <Image
                src={`/QuestionsMapsGPT/${CARD_SOURCES[i]}`}
                width={card.width}
                height={card.height}
                alt=""
                draggable={false}
              />
            </div>
          ))}

          {/* "We've already answered thousands of questions!" */}
          <div
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ opacity: headingOpacity }}
          >
            <h2 className="text-4xl font-semibold text-[#0F6B6E] md:text-6xl">
              We&apos;ve already answered
            </h2>
            <h2 className="mt-4 text-4xl font-semibold text-[#0F6B6E] md:text-6xl">
              thousands of questions!
            </h2>
          </div>

          {/* "Try it—find out why" */}
          <div
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ opacity: tryItOpacity }}
          >
            <h2 className="text-4xl font-semibold text-[#0F6B6E] md:text-6xl">
              Try it—find out why
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
