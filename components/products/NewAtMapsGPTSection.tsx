"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";
// @ts-expect-error — CSS side-effect import
import "@/components/products/how-it-works-tokens.css";

/* ═══════════════════════════════════════════════════════════════
   Feature data
   ═══════════════════════════════════════════════════════════════ */
interface MiniCard {
  image: string;
  title: string;
  subtitle: string;
}

interface EmojiDeco {
  src: string;
  size: number;
  left: string;
  top: string;
}

interface Feature {
  label: string;
  description: string;
  href: string;
  bgColorA: string;
  bgColorB: string;
  bgColorC: string;
  bgColorD: string;
  miniCards: [MiniCard, MiniCard, MiniCard];
  emojis: EmojiDeco[];
}

const FEATURES: Feature[] = [
  {
    label: "Ranked Spots",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    href: "https://mapsgpt.es",
    bgColorA: "#5FBFF1",
    bgColorB: "#01A35D",
    bgColorC: "#01A35D",
    bgColorD: "#5FBFF1",
    miniCards: [
      { image: `/FavoriteSpots/${encodeURIComponent("(22).jpeg")}`, title: "Lorem Ipsum", subtitle: "Dolor sit amet consectetur" },
      { image: `/FavoriteSpots/${encodeURIComponent("(20).jpeg")}`, title: "Adipiscing Elit", subtitle: "Sed do eiusmod tempor" },
      { image: `/FavoriteSpots/${encodeURIComponent("(24).jpeg")}`, title: "Incididunt Ut", subtitle: "Labore et dolore magna" },
    ],
    emojis: [
      { src: "/product/passport.png", size: 55, left: "6%", top: "58%" },
      { src: "/how/pane.png", size: 58, left: "72%", top: "12%" },
    ],
  },
  {
    label: "Shared Itineraries",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    href: "https://mapsgpt.es",
    bgColorA: "#DE2F32",
    bgColorB: "#B00098",
    bgColorC: "#B00098",
    bgColorD: "#DE2F32",
    miniCards: [
      { image: `/FavoriteSpots/${encodeURIComponent("(23).jpeg")}`, title: "Consectetur", subtitle: "Adipiscing elit sed" },
      { image: `/FavoriteSpots/${encodeURIComponent("(14).jpeg")}`, title: "Eiusmod Tempor", subtitle: "Incididunt ut labore" },
      { image: `/FavoriteSpots/${encodeURIComponent("(17).jpeg")}`, title: "Dolore Magna", subtitle: "Aliqua ut enim" },
    ],
    emojis: [
      { src: "/product/champ.png", size: 52, left: "8%", top: "14%" },
      { src: "/product/martini.png", size: 50, left: "74%", top: "56%" },
    ],
  },
  {
    label: "Search by Character",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit.",
    href: "https://mapsgpt.es",
    bgColorA: "#0A6E5C",
    bgColorB: "#2A8FC2",
    bgColorC: "#2A8FC2",
    bgColorD: "#0A6E5C",
    miniCards: [
      { image: `/FavoriteSpots/${encodeURIComponent("(19).jpeg")}`, title: "Reprehenderit", subtitle: "In voluptate velit" },
      { image: `/FavoriteSpots/${encodeURIComponent("(21).jpeg")}`, title: "Esse Cillum", subtitle: "Dolore eu fugiat" },
      { image: `/FavoriteSpots/${encodeURIComponent("(22).jpeg")}`, title: "Nulla Pariatur", subtitle: "Excepteur sint" },
    ],
    emojis: [
      { src: "/product/palm.png", size: 55, left: "72%", top: "14%" },
      { src: "/product/earth.png", size: 50, left: "7%", top: "55%" },
    ],
  },
  {
    label: "Roll the Dice",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident.",
    href: "https://mapsgpt.es",
    bgColorA: "#00B1D4",
    bgColorB: "#5FBFF1",
    bgColorC: "#5FBFF1",
    bgColorD: "#00B1D4",
    miniCards: [
      { image: `/FavoriteSpots/${encodeURIComponent("(24).jpeg")}`, title: "???", subtitle: "Tap to reveal" },
      { image: `/FavoriteSpots/${encodeURIComponent("(17).jpeg")}`, title: "???", subtitle: "Tap to reveal" },
      { image: `/FavoriteSpots/${encodeURIComponent("(14).jpeg")}`, title: "???", subtitle: "Tap to reveal" },
    ],
    emojis: [
      { src: "/product/car.png", size: 55, left: "7%", top: "16%" },
      { src: "/how/earth.png", size: 50, left: "74%", top: "58%" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   CardFanVisual — 3 fanned mini cards + floating 3D emojis
   ═══════════════════════════════════════════════════════════════ */
const CARD_CONFIGS = [
  { rotate: -6, tx: -40, ty: 10, z: 1 },
  { rotate: 0,  tx: 0,   ty: 0,  z: 3 },
  { rotate: 6,  tx: 40,  ty: 10, z: 2 },
];

function CardFanVisual({ feature, hovering }: { feature: Feature; hovering: boolean }) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      background: "transparent",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* 3D Emojis */}
      {feature.emojis.map((emoji, i) => (
        <div
          key={emoji.src}
          style={{
            position: "absolute",
            left: emoji.left,
            top: emoji.top,
            width: emoji.size,
            height: emoji.size,
            zIndex: 4,
            transform: hovering ? `translateY(${i % 2 === 0 ? -5 : 5}px) scale(1.05)` : "translateY(0) scale(1)",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <Image src={emoji.src} alt="" width={emoji.size} height={emoji.size} className="w-full h-auto" draggable={false} />
        </div>
      ))}

      {/* 3 fanned mini cards */}
      {feature.miniCards.map((card, i) => {
        const cfg = CARD_CONFIGS[i];
        const hoverSpread = hovering ? (i === 0 ? -6 : i === 2 ? 6 : 0) : 0;
        const hoverRotate = hovering ? (i === 0 ? -1.5 : i === 2 ? 1.5 : 0) : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 140,
              height: 200,
              background: "var(--hiw-bg-card)",
              borderRadius: "var(--hiw-radius-lg)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
              zIndex: cfg.z,
              transform: `translate(${cfg.tx + hoverSpread}px, ${cfg.ty}px) rotate(${cfg.rotate + hoverRotate}deg)`,
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ width: "100%", height: 120, overflow: "hidden", flexShrink: 0 }}>
              <img src={card.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ padding: "8px 10px", flex: 1 }}>
              <p style={{
                fontFamily: "var(--hiw-font-sans)", fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
                fontSize: 11, color: "var(--hiw-text-primary)", margin: 0, marginBottom: 3,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{card.title}</p>
              <p style={{
                fontFamily: "var(--hiw-font-sans)", fontWeight: "var(--hiw-weight-regular)" as unknown as number,
                fontSize: 10, color: "var(--hiw-text-tertiary)", margin: 0,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FeatureCard
   ═══════════════════════════════════════════════════════════════ */
function FeatureCard({ feature }: { feature: Feature }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      onMouseEnter={() => { if (window.innerWidth >= 1024) setHovering(true); }}
      onMouseLeave={() => { if (window.innerWidth >= 1024) setHovering(false); }}
      style={{
        flexShrink: 0,
        width: "clamp(280px, 78vw, 448px)",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        position: "relative" as const,
        background: "transparent",
        borderRadius: "var(--hiw-radius-2xl)",
        boxShadow: hovering ? "var(--hiw-shadow-card-hover)" : "var(--hiw-shadow-card)",
        overflow: "hidden",
        transition: `box-shadow var(--hiw-duration-slow) var(--hiw-easing-default)`,
      }}
    >
      {/* Dual radial gradient bg — color A from top-left, color B from top-right, fading to white */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "var(--hiw-radius-2xl)",
        overflow: "hidden",
        zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 45% at 0% 0%, ${feature.bgColorA}80 0%, transparent 100%),
          radial-gradient(ellipse 80% 45% at 100% 0%, ${feature.bgColorB}80 0%, transparent 100%),
          #FFFFFF
        `,
      }} />

      {/* Card fan visual */}
      <div style={{ width: "100%", height: "clamp(280px, 60vw, 400px)", position: "relative", zIndex: 1 }}>
        <CardFanVisual feature={feature} hovering={hovering} />
      </div>

      {/* Text content */}
      <div style={{
          padding: "var(--hiw-space-5)",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}>
        <h3 style={{
          fontFamily: "var(--hiw-font-sans)",
          fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
          fontSize: "24px",
          lineHeight: "var(--hiw-leading-snug)" as unknown as number,
          color: "var(--hiw-text-primary)",
          margin: 0,
          marginBottom: "var(--hiw-space-2)",
        }}>
          {feature.label}
        </h3>
        <p style={{
          fontFamily: "var(--hiw-font-sans)",
          fontWeight: "var(--hiw-weight-regular)" as unknown as number,
          fontSize: "var(--hiw-text-base)",
          lineHeight: "var(--hiw-leading-relaxed)" as unknown as number,
          color: "var(--hiw-text-secondary)",
          margin: 0,
          marginBottom: "var(--hiw-space-5)",
          flex: 1,
        }}>
          {feature.description}
        </p>

        {/* CTA — matches section C style */}
        <Link
          href="/maps-gpt"
          className={`group flex items-center justify-center gap-6 w-full h-[52px] cursor-pointer no-underline ${glassStyles.btn}`}
          style={{ padding: 0 }}
        >
          <span className="text-[clamp(18px,2vw,22px)] lg:text-[20px]!" style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: 590,
            letterSpacing: "-0.02em",
            color: "#00B1D4",
          }}>
            Try it now
          </span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
            <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#00B1D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NewAtMapsGPTSection — horizontal carousel
   ═══════════════════════════════════════════════════════════════ */
export default function NewAtMapsGPTSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const didDrag = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll position for dots
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      const children = container.children;
      if (!children.length) return;
      const containerLeft = container.getBoundingClientRect().left;
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < FEATURES.length; i++) {
        const child = children[i] as HTMLElement;
        if (!child) continue;
        const dist = Math.abs(child.getBoundingClientRect().left - containerLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      }
      setActiveIndex(closest);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true; didDrag.current = false;
      startX.current = e.clientX; scrollStart.current = container.scrollLeft;
      container.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      if (Math.abs(dx) > 3) didDrag.current = true;
      container.scrollLeft = scrollStart.current - dx;
    };
    const onPointerUp = () => { isDragging.current = false; };
    const preventClick = (e: MouseEvent) => {
      if (didDrag.current) { e.preventDefault(); e.stopPropagation(); }
    };
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("click", preventClick, true);
    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("click", preventClick, true);
    };
  }, []);

  return (
    <section
      className="hiw-scope"
      style={{
        background: "var(--hiw-bg-page)",
        paddingTop: "var(--hiw-section-py)",
        paddingBottom: "var(--hiw-section-py)",
      }}
    >
      {/* Title */}
      <div style={{
        maxWidth: "var(--hiw-max-width)",
        marginInline: "auto",
        paddingInline: "var(--hiw-content-px)",
      }}>
        <h2 style={{
          fontFamily: "var(--hiw-font-sans)",
          fontWeight: "var(--hiw-weight-bold)" as unknown as number,
          fontSize: "clamp(42px, 5vw, var(--hiw-text-4xl))",
          lineHeight: "var(--hiw-leading-tight)" as unknown as number,
          color: "var(--hiw-text-primary)",
          margin: 0,
          marginBottom: "var(--hiw-space-16)",
          textAlign: "center",
        }}>
          New at MapsGPT
        </h2>
      </div>

      {/* Carousel — left-aligned to content bounds, no scroll-snap to prevent jump-back */}
      <div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing select-none"
        style={{
          display: "flex",
          gap: "var(--hiw-space-6)",
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingLeft: "max(32px, calc((100vw - 1408px) / 2 + 32px))",
          paddingRight: "var(--hiw-space-8)",
          paddingBottom: "var(--hiw-space-4)",
        }}
      >
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.label} feature={feature} />
        ))}
      </div>

      {/* Dots indicator — mobile only */}
      <div className="flex lg:hidden" style={{
        justifyContent: "center",
        gap: "var(--hiw-space-2)",
        marginTop: "var(--hiw-space-6)",
      }}>
        {FEATURES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to card ${i + 1}`}
            onClick={() => {
              const container = containerRef.current;
              if (!container) return;
              const child = container.children[i] as HTMLElement;
              if (child) child.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
            }}
            style={{
              width: activeIndex === i ? 24 : 8,
              height: 8,
              borderRadius: "var(--hiw-radius-full)",
              background: activeIndex === i ? "var(--hiw-accent)" : "var(--hiw-border)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.3s var(--hiw-easing-default), background 0.3s var(--hiw-easing-default)",
            }}
          />
        ))}
      </div>

      <style>{`
        .hiw-scope [style*="overflow-x"]::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
