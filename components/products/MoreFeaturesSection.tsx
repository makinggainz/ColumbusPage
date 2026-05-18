"use client";

/**
 * MoreFeaturesSection — a bento grid of MapsGPT's secondary selling
 * points, right after the hero. Styled with the site design system
 * (Funnel Display headings, Opening Hours Sans body, catcherX colour
 * tokens, 7px corners, 1px gridline borders, 1287px bounds).
 */

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import MapsGPTGlobe from "@/components/products/MapsGPTGlobe";

type Card = {
  col: string;
  row: string;
  variant: "big" | "navy" | "plain" | "photo";
  eyebrow?: string;
  title: string;
  body?: string;
  img?: string;
  chips?: string[];
  globe?: boolean;
};

const CARDS: Card[] = [
  {
    col: "1 / 5",
    row: "1 / 3",
    variant: "big",
    eyebrow: "The core",
    title: "Just ask — it finds it.",
    body: "Tell MapsGPT what you're after in plain words. It reads the vibe and hands back places actually worth your time.",
    chips: ["rooftop bar, sunset view", "quiet beach near Bali", "best ramen, still open"],
  },
  {
    col: "5 / 7",
    row: "1 / 2",
    variant: "navy",
    title: "Free to explore",
    body: "No account, no paywall — start asking right away.",
  },
  {
    col: "5 / 7",
    row: "2 / 3",
    variant: "plain",
    title: "Powered by Columbus‑01",
    body: "Our own travel-reasoning model — tuned for places, not just answers.",
    globe: true,
  },
  {
    col: "1 / 3",
    row: "3 / 5",
    variant: "photo",
    img: "/FavoriteSpots/(23).jpeg",
    title: "It knows every city worth the trip.",
  },
  {
    col: "3 / 5",
    row: "3 / 4",
    variant: "plain",
    title: "Learns your taste",
    body: "The more you ask, the sharper its picks get.",
  },
  {
    col: "5 / 7",
    row: "3 / 4",
    variant: "plain",
    title: "Roll the dice",
    body: "Can't decide? Let it surprise you.",
  },
  {
    col: "3 / 5",
    row: "4 / 5",
    variant: "plain",
    title: "Open in any browser",
    body: "No download — your AI travel pal is one tab away.",
  },
  {
    col: "5 / 7",
    row: "4 / 5",
    variant: "plain",
    title: "Save your favorites",
    body: "Heart a place, build a list, share the trip.",
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
          gap: 16px;
        }
        @media (max-width: 980px) {
          .mg-bento { grid-template-columns: 1fr; grid-auto-rows: auto; }
          .mg-bento > * { grid-column: 1 / -1 !important; grid-row: auto !important; min-height: 196px; }
        }
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
            Why you&apos;ll love MapsGPT
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
                borderRadius: 7,
                overflow: "hidden",
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

function BentoCard({ card }: { card: Card }) {
  // ── Photo tile ──
  if (card.variant === "photo") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: 280,
          border: "1px solid #E7E7F1",
          borderRadius: 7,
          overflow: "hidden",
        }}
      >
        <Image src={card.img!} alt="" fill sizes="(max-width:980px) 100vw, 460px" style={{ objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(11,19,66,0) 40%, rgba(11,19,66,0.82) 100%)",
          }}
        />
        <h3 className="h5" style={{ position: "absolute", left: 24, right: 24, bottom: 22, color: "#FFFFFF" }}>
          {card.title}
        </h3>
      </div>
    );
  }

  const navy = card.variant === "navy";
  const big = card.variant === "big";
  const titleColor = navy ? "#FFFFFF" : "#0B1B2B";
  const bodyColor = navy ? "rgba(255,255,255,0.78)" : "#5A6B7B";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 200,
        boxSizing: "border-box",
        background: navy ? "#0B1342" : "#FFFFFF",
        border: navy ? "1px solid #0B1342" : "1px solid #E7E7F1",
        borderRadius: 7,
        boxShadow: navy ? "none" : "0 1px 2px rgba(11,27,43,0.04), 0 12px 32px rgba(11,27,43,0.05)",
        padding: big ? 36 : 28,
        display: "flex",
        flexDirection: "column",
        justifyContent: big ? "center" : "flex-start",
        gap: 10,
        overflow: "hidden",
      }}
    >
      {/* signature sky-blue glow — big card only */}
      {big && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -80,
            bottom: -120,
            width: 360,
            height: 320,
            background:
              "radial-gradient(ellipse at center, rgba(56,189,248,0.22) 0%, rgba(56,189,248,0.08) 45%, transparent 75%)",
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
        {card.eyebrow && (
          <span className="eyebrow" style={{ fontSize: 13, letterSpacing: "0.16em" }}>
            {card.eyebrow}
          </span>
        )}
        <h3
          className={big ? "h3" : "h5"}
          style={{ display: "flex", alignItems: "center", gap: 10, color: titleColor, letterSpacing: "-0.01em" }}
        >
          {card.globe && <MapsGPTGlobe size={24} />}
          {card.title}
        </h3>
        {card.body && (
          <p className={big ? "p-l" : "p-m"} style={{ color: bodyColor, maxWidth: big ? 440 : undefined }}>
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
                  background: "#F6F8FB",
                  border: "1px solid #E7E7F1",
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
