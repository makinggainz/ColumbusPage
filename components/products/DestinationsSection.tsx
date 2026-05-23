"use client";

/**
 * DestinationsSection — a wanderlust band between the bento and the
 * closing CTA: a heading plus two auto-scrolling rows of travel photos.
 * Styled with the site design system (Funnel Display heading, Opening
 * Hours Sans body, 7px corners, 1px gridline borders).
 */

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const ROW_A = [
  "/FavoriteSpots/(14).jpeg",
  "/FavoriteSpots/(20).jpeg",
  "/FavoriteSpots/(22).jpeg",
  "/FavoriteSpots/(17).jpeg",
  "/FavoriteSpots/(19).jpeg",
  "/FavoriteSpots/(21).jpeg",
];
const ROW_B = [
  "/FavoriteSpots/(23).jpeg",
  "/FavoriteSpots/(24).jpeg",
  "/FavoriteSpots/(21).jpeg",
  "/FavoriteSpots/(19).jpeg",
  "/FavoriteSpots/(14).jpeg",
  "/FavoriteSpots/(17).jpeg",
];

function Marquee({ imgs, reverse }: { imgs: string[]; reverse?: boolean }) {
  // Two copies of the list → translating one copy-width loops seamlessly.
  const doubled = [...imgs, ...imgs];
  return (
    <div className="mg-dest-mask">
      <div className={`mg-dest-track${reverse ? " mg-dest-rev" : ""}`}>
        {doubled.map((src, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              flex: "none",
              width: 304,
              height: 208,
              borderRadius: 7,
              overflow: "hidden",
              border: "1px solid #E7E7F1",
            }}
          >
            <Image src={src} alt="" fill sizes="304px" style={{ objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DestinationsSection() {
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
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <style>{`
        .mg-dest-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .mg-dest-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: mg-dest-scroll 52s linear infinite;
        }
        .mg-dest-rev { animation-direction: reverse; }
        .mg-dest-mask:hover .mg-dest-track { animation-play-state: paused; }
        @keyframes mg-dest-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - 10px)); }
        }
        @media (prefers-reduced-motion: reduce) { .mg-dest-track { animation: none; } }
      `}</style>

      {/* Heading */}
      <div
        style={{
          maxWidth: 1287,
          marginInline: "auto",
          paddingInline: 24,
          textAlign: "center",
          marginBottom: 48,
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <div className="eyebrow">Anywhere on Earth</div>
        <h2 className="h2" style={{ marginTop: 14, color: "#0B1B2B", letterSpacing: "-0.01em" }}>
          Wherever you go, Elio knows the spots.
        </h2>
        <p className="p-l" style={{ margin: "16px auto 0", maxWidth: 540, color: "#5A6B7B" }}>
          Rooftop bars, hidden trails, late-night taco joints — a pick for every kind of trip.
        </p>
      </div>

      {/* Two scrolling photo rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          opacity: vis ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.15s",
        }}
      >
        <Marquee imgs={ROW_A} />
        <Marquee imgs={ROW_B} reverse />
      </div>
    </section>
  );
}
