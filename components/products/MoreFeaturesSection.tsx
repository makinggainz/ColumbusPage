"use client";

/**
 * MoreFeaturesSection — a bento grid of MapsGPT's secondary selling
 * points, right after the hero. Each tile carries its own theme
 * (background, ink, corner glow, motif) for a lively, varied grid;
 * two large anchor tiles (the "ask" core and the full-width "any
 * browser" tile) carry the visuals. Site design system — Funnel
 * Display headings, Opening Hours Sans body, catcherX blue-family
 * palette, 14px corners, soft elevation.
 */

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import MapsGPTGlobe from "@/components/products/MapsGPTGlobe";

const RADIUS = 14;

type ThemeName = "lightblue" | "navy" | "teal" | "white" | "brightblue";

type Theme = {
  bg: string;
  ink: string;
  body: string;
  eyebrow: string;
  border: string;
  glow: string;
  shadow: string;
};

const THEMES: Record<ThemeName, Theme> = {
  lightblue: {
    bg: "linear-gradient(155deg, #F3F7FE 0%, #E7EEFC 100%)",
    ink: "#0B1B2B",
    body: "#5A6B7B",
    eyebrow: "#1451E8",
    border: "1px solid #DCE5FA",
    glow: "rgba(20,81,232,0.16)",
    shadow: "0 1px 2px rgba(11,27,43,0.04), 0 16px 36px -12px rgba(20,81,232,0.16)",
  },
  navy: {
    bg: "linear-gradient(150deg, #0B1342 0%, #1B2C66 100%)",
    ink: "#FFFFFF",
    body: "rgba(255,255,255,0.80)",
    eyebrow: "#8FB2FF",
    border: "1px solid #0B1342",
    glow: "rgba(116,160,254,0.34)",
    shadow: "0 18px 42px -16px rgba(11,19,66,0.5)",
  },
  teal: {
    bg: "linear-gradient(155deg, #FFFFFF 0%, #E3F2F5 100%)",
    ink: "#0B1B2B",
    body: "#5A6B7B",
    eyebrow: "var(--color-accent)",
    border: "1px solid #D4E8EB",
    glow: "color-mix(in srgb, var(--color-accent) 18%, transparent)",
    shadow:
      "0 1px 2px rgba(11,27,43,0.04), 0 16px 36px -12px color-mix(in srgb, var(--color-accent) 18%, transparent)",
  },
  white: {
    bg: "#FFFFFF",
    ink: "#0B1B2B",
    body: "#5A6B7B",
    eyebrow: "#1451E8",
    border: "1px solid #E7E7F1",
    glow: "rgba(20,81,232,0.10)",
    shadow: "0 1px 2px rgba(11,27,43,0.04), 0 12px 32px rgba(11,27,43,0.06)",
  },
  brightblue: {
    bg: "linear-gradient(150deg, #1451E8 0%, #3D74F0 100%)",
    ink: "#FFFFFF",
    body: "rgba(255,255,255,0.84)",
    eyebrow: "#CFE0FF",
    border: "1px solid #1451E8",
    glow: "rgba(255,255,255,0.28)",
    shadow: "0 18px 42px -14px rgba(20,81,232,0.45)",
  },
};

type Card = {
  col: string;
  row: string;
  variant: "big" | "standard" | "desktop";
  theme: ThemeName;
  eyebrow?: string;
  title: string;
  body?: string;
  chips?: string[];
  globe?: boolean;
  motif?: "dice" | "heart";
  img?: string;
};

const CARDS: Card[] = [
  {
    col: "1 / 5",
    row: "1 / 3",
    variant: "big",
    theme: "lightblue",
    eyebrow: "The core",
    title: "Just ask — it finds it.",
    body: "Tell Elio what you're after in plain words. It reads the vibe and hands back places actually worth your time.",
    chips: ["rooftop bar, sunset view", "quiet beach near Bali", "best ramen, still open"],
  },
  {
    col: "5 / 7",
    row: "1 / 2",
    variant: "standard",
    theme: "navy",
    title: "Free to explore",
    body: "No account, no paywall — start asking right away.",
  },
  {
    col: "5 / 7",
    row: "2 / 3",
    variant: "standard",
    theme: "teal",
    title: "Powered by Columbus‑01",
    body: "Our own travel model — reasons about places, neighborhoods, and routes.",
    globe: true,
  },
  {
    col: "1 / 7",
    row: "3 / 5",
    variant: "desktop",
    theme: "white",
    eyebrow: "Any browser, any screen",
    title: "Open it right in your browser.",
    body: "No download, no install — Elio runs in any browser. Plan the trip on your laptop, pick it up on your phone.",
    img: "/mapsgptdesktopimg.png",
  },
  {
    col: "1 / 3",
    row: "5 / 6",
    variant: "standard",
    theme: "lightblue",
    title: "Learns your taste",
    body: "Use it a few times — it surfaces spots before you ask.",
  },
  {
    col: "3 / 5",
    row: "5 / 6",
    variant: "standard",
    theme: "brightblue",
    title: "Roll the dice",
    body: "Can't decide? Let it surprise you.",
    motif: "dice",
  },
  {
    col: "5 / 7",
    row: "5 / 6",
    variant: "standard",
    theme: "teal",
    title: "Save your favorites",
    body: "Heart a place, build a list, share the trip.",
    motif: "heart",
  },
];

export default function MoreFeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: "#FFFFFF" }}>
      <style>{`
        .mg-bento-bounds { max-width: 1287px; margin-left: 20px; margin-right: 20px; box-sizing: border-box; }
        @media (min-width: 768px) { .mg-bento-bounds { margin-left: auto; margin-right: auto; } }
        .mg-bento {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: 200px;
          gap: 18px;
        }
        @media (max-width: 980px) {
          .mg-bento { grid-template-columns: 1fr; grid-auto-rows: auto; }
          .mg-bento > * { grid-column: 1 / -1 !important; grid-row: auto !important; }
        }
        .mg-desk-card { display: flex; }
        @media (max-width: 980px) { .mg-desk-card { flex-direction: column; } }
      `}</style>

      <div className="mg-bento-bounds">
        {/* Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div className="eyebrow">The good stuff</div>
          <h2 className="h2" style={{ marginTop: 14, color: "#0B1B2B", letterSpacing: "-0.01em" }}>
            Why you&apos;ll love Elio
          </h2>
        </div>

        {/* Bento grid */}
        <div className="mg-bento">
          {CARDS.map((c, i) => (
            <div
              key={i}
              style={{
                gridColumn: c.col,
                gridRow: c.row,
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.55s ease-out ${0.05 * i}s, transform 0.55s ease-out ${0.05 * i}s`,
              }}
            >
              <BentoCard card={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Decorative corner glow shared by every tile. */
function Glow({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        right: -90,
        bottom: -120,
        width: 360,
        height: 320,
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
        pointerEvents: "none",
      }}
    />
  );
}

/* Five-dot die face — motif for the "Roll the dice" tile. */
function DiceMotif() {
  const dots = [
    [12, 12],
    [44, 12],
    [28, 28],
    [12, 44],
    [44, 44],
  ];
  return (
    <svg
      aria-hidden
      width="150"
      height="150"
      viewBox="0 0 56 56"
      style={{ position: "absolute", right: -16, bottom: -22, opacity: 0.5 }}
    >
      <rect x="2" y="2" width="52" height="52" rx="12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="rgba(255,255,255,0.6)" />
      ))}
    </svg>
  );
}

/* Soft heart — motif for the "Save your favorites" tile. */
function HeartMotif() {
  return (
    <svg
      aria-hidden
      width="170"
      height="170"
      viewBox="0 0 32 30"
      style={{ position: "absolute", right: -34, bottom: -44 }}
    >
      <path
        d="M16 28S2 19.5 2 9.8C2 5 5.6 2 9.4 2 12 2 14.5 3.6 16 6.2 17.5 3.6 20 2 22.6 2 26.4 2 30 5 30 9.8 30 19.5 16 28 16 28z"
        fill="color-mix(in srgb, var(--color-accent) 12%, transparent)"
      />
    </svg>
  );
}

function BentoCard({ card }: { card: Card }) {
  const t = THEMES[card.theme];

  // ── Desktop / any-browser tile — text + a browser-window screenshot ──
  if (card.variant === "desktop") {
    return (
      <div
        className="mg-desk-card"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: 280,
          boxSizing: "border-box",
          background: t.bg,
          border: t.border,
          borderRadius: RADIUS,
          boxShadow: t.shadow,
          overflow: "hidden",
        }}
      >
        <Glow color={t.glow} />
        {/* Text */}
        <div
          style={{
            position: "relative",
            flex: "1 1 0",
            minWidth: 250,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <span className="eyebrow" style={{ fontSize: 13, letterSpacing: "0.16em", color: t.eyebrow }}>
            {card.eyebrow}
          </span>
          <h3 className="h3" style={{ color: t.ink, letterSpacing: "-0.01em" }}>
            {card.title}
          </h3>
          <p className="p-l" style={{ color: t.body, maxWidth: 420 }}>
            {card.body}
          </p>
        </div>

        {/* Browser-window screenshot */}
        <div
          style={{
            position: "relative",
            flex: "1.3 1 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 28,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #E7E7F1",
              boxShadow: "0 18px 40px -16px rgba(11,27,43,0.28)",
              background: "#FFFFFF",
            }}
          >
            <div
              style={{
                height: 30,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 12px",
                background: "#EEF0F3",
                borderBottom: "1px solid #E7E7F1",
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <span key={c} style={{ width: 9, height: 9, borderRadius: 999, background: c }} />
              ))}
              <span
                className="p-s"
                style={{
                  marginLeft: 10,
                  padding: "2px 12px",
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: "1px solid #E7E7F1",
                  color: "#5A6B7B",
                }}
              >
                mapsgpt.es
              </span>
            </div>
            <div style={{ position: "relative", width: "100%", aspectRatio: "1.7" }}>
              <Image
                src={card.img!}
                alt="Elio in a desktop browser"
                fill
                sizes="(max-width:980px) 90vw, 560px"
                style={{ objectFit: "cover", objectPosition: "left top" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Big & standard text tiles ──
  const big = card.variant === "big";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 200,
        boxSizing: "border-box",
        background: t.bg,
        border: t.border,
        borderRadius: RADIUS,
        boxShadow: t.shadow,
        padding: big ? 36 : 28,
        display: "flex",
        flexDirection: "column",
        justifyContent: big ? "center" : "flex-start",
        gap: 10,
        overflow: "hidden",
      }}
    >
      <Glow color={t.glow} />
      {card.motif === "dice" && <DiceMotif />}
      {card.motif === "heart" && <HeartMotif />}

      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
        {card.eyebrow && (
          <span className="eyebrow" style={{ fontSize: 13, letterSpacing: "0.16em", color: t.eyebrow }}>
            {card.eyebrow}
          </span>
        )}
        <h3
          className={big ? "h3" : "h5"}
          style={{ display: "flex", alignItems: "center", gap: 10, color: t.ink, letterSpacing: "-0.01em" }}
        >
          {card.globe && <MapsGPTGlobe size={24} />}
          {card.title}
        </h3>
        {card.body && (
          <p className={big ? "p-l" : "p-m"} style={{ color: t.body, maxWidth: big ? 440 : undefined }}>
            {card.body}
          </p>
        )}
        {big && card.chips && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {card.chips.map((chip) => (
              <span
                key={chip}
                className="p-m"
                style={{
                  color: "#0B1B2B",
                  background: "#FFFFFF",
                  border: "1px solid #DCE5FA",
                  borderRadius: 999,
                  padding: "6px 13px",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
