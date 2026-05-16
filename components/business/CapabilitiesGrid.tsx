"use client";

import { useEffect, useRef, useState } from "react";

/* ── Section: "Business-grade capabilities" ────────────────────────────────
   Six capability tiles in a 3-up grid. The mockups are built as clean
   CSS/SVG skeletons (homepage system: white surfaces, --ent-border-card
   hairlines, --ent-radius-lg corners, muted ink labels) rather than photo
   screenshots, mirroring the low-fidelity placeholder look of the design. */

const HAIRLINE = "1px solid var(--ent-border-card)";
const SKELETON = "#E9E9F1";
const SKELETON_STRONG = "#DBDBE7";

type Variant = "report" | "chat-map" | "layers-map";

const ITEMS: { title: string; variant: Variant; big?: boolean }[] = [
  { title: "Ask the map anything", variant: "chat-map" },
  { title: "Agent research reports", variant: "report" },
  { title: "Generative data layers", variant: "layers-map" },
  { title: "An AI that considers it all", variant: "chat-map", big: true },
  { title: "Data Catalogue", variant: "report" },
  { title: "Light-speed due dilligence", variant: "report" },
];

/* A soft, illustrated-style map tile — layered earthy blobs over sand.
   Deliberately muted and on-brand (no purple); evokes a map without a
   photo. */
function MapTile() {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: "#E9E2D0" }} aria-hidden>
      <div className="absolute" style={{ inset: "-20%", background: "radial-gradient(circle at 30% 35%, #C8D3B2 0 22%, transparent 60%)" }} />
      <div className="absolute" style={{ left: "-10%", top: "-15%", width: "70%", height: "75%", borderRadius: "50%", background: "#C6D2B0", filter: "blur(14px)" }} />
      <div className="absolute" style={{ right: "-12%", top: "8%", width: "55%", height: "60%", borderRadius: "50%", background: "#D7C8A4", filter: "blur(16px)" }} />
      <div className="absolute" style={{ right: "-18%", bottom: "-25%", width: "65%", height: "75%", borderRadius: "50%", background: "#A9C5D6", filter: "blur(14px)" }} />
      <div className="absolute" style={{ left: "12%", bottom: "-22%", width: "45%", height: "50%", borderRadius: "50%", background: "#B7C7A0", filter: "blur(16px)" }} />
      {/* faint contour strokes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none">
        {[0, 1, 2, 3].map(i => (
          <path
            key={i}
            d={`M-10 ${50 + i * 34} C 70 ${30 + i * 34}, 150 ${78 + i * 30}, 320 ${44 + i * 32}`}
            stroke="rgba(90,107,123,0.16)"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}

function Bar({ w, strong = false, h = 7 }: { w: number | string; strong?: boolean; h?: number }) {
  return (
    <div
      style={{
        width: typeof w === "number" ? `${w}%` : w,
        height: h,
        borderRadius: 999,
        backgroundColor: strong ? SKELETON_STRONG : SKELETON,
      }}
    />
  );
}

function ReportMock() {
  return (
    <div className="absolute inset-0 flex flex-col gap-3" style={{ padding: "10%" }}>
      <Bar w={62} strong h={9} />
      <div className="mt-1 flex flex-col gap-2.5">
        <Bar w={94} />
        <Bar w={88} />
        <Bar w={91} />
        <Bar w={48} />
      </div>
      <div className="mt-auto flex items-end gap-4">
        <div
          className="relative overflow-hidden shrink-0"
          style={{ width: "34%", aspectRatio: "16 / 11", borderRadius: 8, border: HAIRLINE }}
        >
          <MapTile />
        </div>
        <div className="flex-1 flex flex-col gap-2 pb-1">
          <Bar w={100} h={6} />
          <Bar w={92} h={6} />
          <Bar w={97} h={6} />
          <Bar w={70} h={6} />
        </div>
      </div>
    </div>
  );
}

function ChatMapMock({ big = false }: { big?: boolean }) {
  return (
    <div className="absolute inset-0">
      <MapTile />
      <div
        className="absolute bg-white flex flex-col gap-2.5"
        style={{
          left: "9%",
          top: "12%",
          width: big ? "60%" : "52%",
          padding: "5%",
          borderRadius: "var(--ent-radius-card)",
          border: HAIRLINE,
          boxShadow: "0 1px 2px rgba(11,27,43,0.05), 0 10px 26px rgba(11,27,43,0.10)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: SKELETON_STRONG }} />
          <div style={{ flex: 1 }}><Bar w={"55%"} strong h={8} /></div>
        </div>
        <div className="mt-1 flex flex-col gap-2">
          <Bar w={96} />
          <Bar w={90} />
          <Bar w={93} />
          {big && <><Bar w={86} /><Bar w={92} /><Bar w={58} /></>}
        </div>
        {!big && (
          <div className="mt-1" style={{ width: "42%", height: 16, borderRadius: 999, backgroundColor: SKELETON }} />
        )}
      </div>
    </div>
  );
}

function LayersMapMock() {
  return (
    <div className="absolute inset-0">
      <MapTile />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" fill="none">
        {[
          "M70 40 L150 30 L165 95 L95 110 Z",
          "M150 30 L235 55 L225 120 L165 95 Z",
          "M95 110 L165 95 L185 165 L100 170 Z",
        ].map((d, i) => (
          <path key={i} d={d} fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
        ))}
      </svg>
      {/* list mini-card */}
      <div
        className="absolute bg-white flex flex-col gap-1.5"
        style={{ right: "7%", top: "12%", width: "26%", padding: "3.5%", borderRadius: 7, border: HAIRLINE, boxShadow: "0 6px 16px rgba(11,27,43,0.10)" }}
      >
        <Bar w={80} h={5} strong />
        <Bar w={100} h={5} />
        <Bar w={88} h={5} />
        <Bar w={94} h={5} />
      </div>
      {/* zoom control */}
      <div
        className="absolute bg-white flex flex-col items-center overflow-hidden"
        style={{ left: "7%", bottom: "12%", borderRadius: 7, border: HAIRLINE }}
      >
        {["+", "−"].map((s, i) => (
          <span
            key={s}
            className="flex items-center justify-center text-[11px]"
            style={{ width: 22, height: 22, color: "var(--ent-text-secondary)", borderBottom: i === 0 ? HAIRLINE : "none" }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CapabilitiesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ backgroundColor: "#FFFFFF", paddingTop: "var(--ent-section-lg)", paddingBottom: "var(--ent-section-lg)" }}
    >
      <div className="ent-content-bounds">
        <h2
          className="text-center leading-[1.1] text-[28px] md:text-[36px] lg:text-[45px]"
          style={{ color: "var(--ent-text-primary)", fontWeight: 500, letterSpacing: "-0.02em" }}
        >
          Enterprise-grade capabilities
        </h2>

        <div className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-16 lg:gap-y-20">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(18px)",
                transition: `opacity 0.6s ease ${0.06 * i}s, transform 0.6s ease ${0.06 * i}s`,
              }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "3 / 2",
                  borderRadius: "var(--ent-radius-lg)",
                  border: HAIRLINE,
                  backgroundColor: "#FFFFFF",
                }}
              >
                {item.variant === "report" && <ReportMock />}
                {item.variant === "chat-map" && <ChatMapMock big={item.big} />}
                {item.variant === "layers-map" && <LayersMapMock />}
              </div>
              <p
                className="mt-4 text-center text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
