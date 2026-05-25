"use client";

/**
 * StickyScrollScenes — minimal sticky-scroll stage that wraps the Hero.
 *
 *   • The Hero photo + brand + headline + CTAs render first in normal
 *     flow (with z-index above the sticky backdrop so the photo is
 *     visible at the top of the page).
 *   • A simple sticky phone (PhoneMockup style, 320 × 700 straight, no
 *     tilts and no side-to-side translation) sits in the lower portion
 *     of the viewport — matching the original PhoneMockup placement —
 *     and stays pinned as the user scrolls.
 *   • As the Hero scrolls off, a sticky white backdrop is revealed.
 *   • One scroll block follows ("Find your next ___" cycling title +
 *     intro paragraph). When that block enters the viewport the phone
 *     shrinks and moves up so the cycling title can sit comfortably
 *     UNDER it, and four mini phones fan out around the main phone
 *     with a quick staggered fade-in.
 */

import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";

// Phone vertical offset from viewport centre. Positive = pushed down.
const PHONE_OFFSET_NORMAL_LG = 280;
const PHONE_OFFSET_NORMAL_SM = 180;
const PHONE_OFFSET_CYCLING_LG = -120;
const PHONE_OFFSET_CYCLING_SM = -80;

// Cycling-scene mini phones — fan around the shrunken main phone.
const MINI_PHONES: { src: string; x: number; y: number; rot: number }[] = [
  { src: "/consumer/elio/ElioChat.png",        x: -220, y: -50, rot: -8 },
  { src: "/consumer/elio/ElioFeedback.png",    x:  220, y: -50, rot:  8 },
  { src: "/consumer/elio/ElioSavedPlaces.png", x: -220, y: 110, rot:  5 },
  { src: "/consumer/elio/ElioZone.png",        x:  220, y: 110, rot: -5 },
];

const CYCLING_OPTIONS = [
  "cozy bookspot",
  "hangout spot",
  "neighborhood",
  "travel inspo",
  "niche restaurant",
  "thrift shop",
];

function CyclingTitle() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = CYCLING_OPTIONS[index];
    const speed = isDeleting ? 45 : 90;
    const pause = 1400;
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < current.length) setDisplayText(current.slice(0, displayText.length + 1));
        else setTimeout(() => setIsDeleting(true), pause);
      } else {
        if (displayText.length > 0) setDisplayText(displayText.slice(0, -1));
        else {
          setIsDeleting(false);
          setIndex((p) => (p + 1) % CYCLING_OPTIONS.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index]);

  return (
    <h2
      style={{
        fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: "clamp(28px, 5vw, 48px)",
        fontWeight: 600,
        color: "#0B1342",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        margin: 0,
        textAlign: "center",
      }}
    >
      Find your next
      <br />
      <span
        style={{
          background: "linear-gradient(180deg, #00B1D4 0%, #0089A3 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {displayText}
        <span style={{ opacity: 0.4, animation: "elio-blink 1s infinite" }}>|</span>
      </span>
      <style>{`@keyframes elio-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }`}</style>
    </h2>
  );
}

export default function StickyScrollScenes({ children }: { children?: ReactNode }) {
  const [isLg, setIsLg] = useState(true);
  const [inCycling, setInCycling] = useState(false);

  const cyclingRef = useRef<HTMLDivElement>(null);
  const isLgRef = useRef(true);
  const inCyclingRef = useRef(false);

  useEffect(() => {
    const check = () => {
      const lg = window.innerWidth >= 1024;
      isLgRef.current = lg;
      setIsLg(lg);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const onScroll = useCallback(() => {
    const el = cyclingRef.current;
    if (!el) return;
    const vh = window.innerHeight;
    const r = el.getBoundingClientRect();
    const c = r.top + r.height / 2;
    // True while the cycling block's centre is within half a viewport of
    // the viewport centre — i.e. the block is "in" the viewport.
    const next = Math.abs(c - vh / 2) < vh * 0.5;
    if (next !== inCyclingRef.current) {
      inCyclingRef.current = next;
      setInCycling(next);
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        onScroll();
        raf = 0;
      });
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onScroll]);

  const phoneW = isLg ? (inCycling ? 200 : 320) : (inCycling ? 150 : 240);
  const phoneH = Math.round((phoneW * 700) / 320);
  const phoneBorder = isLg ? (inCycling ? 5 : 7) : (inCycling ? 4 : 5);
  const phoneRadius = isLg ? (inCycling ? 28 : 40) : (inCycling ? 22 : 32);
  const offset = inCycling
    ? (isLg ? PHONE_OFFSET_CYCLING_LG : PHONE_OFFSET_CYCLING_SM)
    : (isLg ? PHONE_OFFSET_NORMAL_LG : PHONE_OFFSET_NORMAL_SM);

  return (
    <div className="relative">
      {/* Hero — z-index puts the photo above the sticky white backdrop */}
      <div style={{ position: "relative", zIndex: 20 }}>{children}</div>

      {/* Sticky white backdrop. Hero (z:20) covers this while it's in
          view; as Hero scrolls off, the white field is revealed and the
          rest of the scroll stage reads against pure white. */}
      <div className="absolute inset-0 z-0">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          <div className="absolute inset-0" style={{ background: "#FFFFFF" }} />
        </div>
      </div>

      {/* Sticky overlay — phone + mini-phone fan-out, pinned for the
          full hero+cycling lifetime. */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
          {/* Mini phones — only on desktop, only during the cycling
              scene. Fade + scale in with a small stagger. */}
          {isLg && MINI_PHONES.map((m, i) => {
            const w = 120;
            const h = Math.round((w * 700) / 320);
            const delay = i * 80;
            return (
              <div
                key={m.src}
                aria-hidden
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: w,
                  height: h,
                  borderRadius: 22,
                  border: "5px solid #000000",
                  boxSizing: "content-box",
                  overflow: "hidden",
                  background: "#000",
                  boxShadow: "0 20px 50px -15px rgba(0,0,0,0.45)",
                  transformOrigin: "center center",
                  transform: `translate(calc(-50% + ${m.x}px), calc(-50% + ${offset + m.y}px)) rotate(${m.rot}deg) scale(${inCycling ? 1 : 0.7})`,
                  opacity: inCycling ? 1 : 0,
                  transition: `opacity 350ms ease ${delay}ms, transform 450ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                  zIndex: 8,
                  pointerEvents: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                  }}
                />
              </div>
            );
          })}

          {/* Main phone — sticky-pinned, straight (no tilt, no
              side-to-side). Width / corner radius / vertical offset
              animate when the cycling scene becomes active. */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, calc(-50% + ${offset}px))`,
              width: phoneW,
              height: phoneH,
              borderRadius: phoneRadius,
              overflow: "hidden",
              border: `${phoneBorder}px solid #000000`,
              boxSizing: "content-box",
              background: "#000",
              boxShadow:
                "0 30px 80px -20px rgba(0,0,0,0.45), 0 12px 32px -12px rgba(0,0,0,0.30)",
              zIndex: 10,
              transition:
                "width 450ms cubic-bezier(0.22, 1, 0.36, 1), height 450ms cubic-bezier(0.22, 1, 0.36, 1), border-width 450ms ease, border-radius 450ms ease, transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/consumer/elioHome1.png"
              alt=""
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>

      {/* Cycling scroll block — 100vh of runway. The CyclingTitle +
          intro paragraph sit in the lower-third of this block so that
          when the block is centred in the viewport, the title appears
          UNDER the (shrunken, upper-positioned) sticky phone. */}
      <div ref={cyclingRef} style={{ position: "relative", height: "100vh", zIndex: 5 }}>
        <div
          style={{
            position: "absolute",
            top: "78%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(720px, 90vw)",
            textAlign: "center",
            paddingInline: 24,
            pointerEvents: "none",
          }}
        >
          <CyclingTitle />
          <p
            style={{
              fontFamily:
                "Opening Hours Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "clamp(15px, 1.8vw, 17px)",
              fontWeight: 400,
              color: "#5A6B7B",
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
              textAlign: "center",
              margin: "20px auto 0",
              maxWidth: 540,
            }}
          >
            Ask Elio anything. It pulls from your taste, your city, and the
            people you trust — not from whoever paid the most.
          </p>
        </div>
      </div>
    </div>
  );
}
