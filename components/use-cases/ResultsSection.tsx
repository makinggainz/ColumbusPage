"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { geist } from "@/app/fonts";

export default function ResultsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section className="relative w-full pt-24 pb-8 overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>

      <Image
        src="/use-cases/resultbg.png"
        alt=""
        fill
        className="object-cover -z-10"
      />

      <div ref={ref} className="grid-section grid-section-fade-both max-w-[1287px] mx-5 md:mx-auto pb-24">

        <h2
          className="text-[48px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1D1D1F] mb-12 max-lg:text-[36px] max-md:text-[28px] px-8 md:px-10"
          style={anim(0)}
        >
          Results of our <br /> Large Geospatial Model:
        </h2>

        {/* Horizontal line — below heading */}
        <div className="w-full" style={{ height: 1, backgroundColor: "var(--grid-line)" }} />

        {/* Row 1 — 2 feature boxes side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 relative">
          {/* Center vertical divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0" style={{ width: 1, backgroundColor: "var(--grid-line)" }} />

          <div className="flex flex-col gap-6 p-8 md:p-10" style={anim(100)}>
            <FeatureText number="1" text="Fast semantic reasoning in cities. Contextual enrichment." anim={anim(100)} />
            <FeatureGraphic id="city" anim={anim(100)} />
          </div>

          <div className="flex flex-col gap-6 p-8 md:p-10" style={anim(150)}>
            <FeatureText number="2" text={`Generalist model,\nwith access to wide catalogue`} anim={anim(150)} />
            <FeatureGraphic id="catalogue" anim={anim(150)} />
          </div>
        </div>

        {/* Horizontal line — between rows */}
        <div className="w-full" style={{ height: 1, backgroundColor: "var(--grid-line)" }} />

        {/* Row 2 — 2 feature boxes side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 relative">
          {/* Center vertical divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0" style={{ width: 1, backgroundColor: "var(--grid-line)" }} />

          <div className="flex flex-col gap-6 p-8 md:p-10" style={anim(250)}>
            <FeatureText number="3" text="Generative geospatial data" anim={anim(250)} />
            <FeatureGraphic id="generative" anim={anim(250)} />
          </div>

          <div className="flex flex-col gap-6 p-8 md:p-10" style={anim(300)}>
            <FeatureText number="4" text="Deep spatial reasoning at scale" anim={anim(300)} />
            <FeatureGraphic id="spatial" anim={anim(300)} />
          </div>
        </div>

        {/* Horizontal line — bottom */}
        <div className="w-full" style={{ height: 1, backgroundColor: "var(--grid-line)" }} />

      </div>
    </section>
  );
}

function FeatureText({ number, text, anim }: { number: string; text: string; anim: React.CSSProperties }) {
  const newlineIdx = text.indexOf("\n");
  const head = newlineIdx === -1 ? text : text.slice(0, newlineIdx);
  const tail = newlineIdx === -1 ? null : text.slice(newlineIdx + 1);

  return (
    <div className="relative p-4" style={anim}>
      <span
        className="absolute left-4 top-4 text-white w-9 h-9 flex items-center justify-center"
        style={{ fontFamily: geist.style.fontFamily, fontSize: 24, fontWeight: 500, backgroundColor: "#2563EB" }}
      >
        {number}
      </span>
      <div
        className="leading-[140%] text-[#1D1D1F]"
        style={{ fontFamily: geist.style.fontFamily, fontSize: 24, fontWeight: 500 }}
      >
        <span style={{ display: "block", textIndent: "48px" }}>{head}</span>
        {tail && (
          <span style={{ display: "block", marginTop: "5px", whiteSpace: "pre-line" }}>{tail}</span>
        )}
      </div>
    </div>
  );
}

function FeatureGraphic({ id, anim }: { id: string; anim: React.CSSProperties }) {
  const stroke = "rgba(37, 99, 235, 0.5)";
  const strokeLight = "rgba(37, 99, 235, 0.2)";
  const strokeFaint = "rgba(37, 99, 235, 0.1)";
  const fill = "rgba(37, 99, 235, 0.06)";

  const graphics: Record<string, React.ReactNode> = {
    city: (
      <svg viewBox="0 0 349 276" fill="none" className="w-full h-full">
        {/* City grid */}
        {[60, 120, 180, 240, 300].map(x => <line key={`v${x}`} x1={x} y1={40} x2={x} y2={256} stroke={strokeFaint} strokeWidth={0.7} />)}
        {[80, 130, 180, 230].map(y => <line key={`h${y}`} x1={30} y1={y} x2={320} y2={y} stroke={strokeFaint} strokeWidth={0.7} />)}
        {/* Buildings */}
        <rect x={70} y={90} width={40} height={166} stroke={stroke} strokeWidth={1.2} fill={fill} />
        <rect x={130} y={60} width={35} height={196} stroke={stroke} strokeWidth={1.2} fill={fill} />
        <rect x={185} y={110} width={50} height={146} stroke={stroke} strokeWidth={1.2} fill={fill} />
        <rect x={255} y={80} width={30} height={176} stroke={stroke} strokeWidth={1.2} fill={fill} />
        {/* Building windows */}
        {[110, 140, 170, 200, 230].map(y => <rect key={`w1${y}`} x={80} y={y} width={8} height={6} fill={strokeLight} />)}
        {[80, 110, 140, 170, 200, 230].map(y => <rect key={`w2${y}`} x={140} y={y} width={8} height={6} fill={strokeLight} />)}
        {[130, 160, 190, 220].map(y => <rect key={`w3${y}`} x={200} y={y} width={8} height={6} fill={strokeLight} />)}
        {/* Semantic connection arcs */}
        <path d="M90 120 Q174 50 210 130" stroke={stroke} strokeWidth={1} strokeDasharray="4 3" fill="none" />
        <path d="M148 90 Q220 60 270 110" stroke={stroke} strokeWidth={1} strokeDasharray="4 3" fill="none" />
        {/* Connection dots */}
        <circle cx={90} cy={120} r={3} fill={stroke} />
        <circle cx={210} cy={130} r={3} fill={stroke} />
        <circle cx={148} cy={90} r={3} fill={stroke} />
        <circle cx={270} cy={110} r={3} fill={stroke} />
        {/* Ground line */}
        <line x1={30} y1={256} x2={320} y2={256} stroke={stroke} strokeWidth={1.2} />
      </svg>
    ),
    catalogue: (
      <svg viewBox="0 0 349 276" fill="none" className="w-full h-full">
        {/* Stacked layers / catalogue sheets */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <rect x={60 + i * 8} y={50 + i * 20} width={200} height={140} rx={0} stroke={stroke} strokeWidth={1.2} fill={i === 4 ? fill : "none"} />
          </g>
        ))}
        {/* Data rows on top sheet */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={`row${i}`}>
            <line x1={110} y1={145 + i * 18} x2={280} y2={145 + i * 18} stroke={strokeLight} strokeWidth={0.8} />
            <circle cx={104} cy={145 + i * 18} r={2.5} fill={stroke} />
          </g>
        ))}
        {/* Search/magnifier icon */}
        <circle cx={280} cy={80} r={18} stroke={stroke} strokeWidth={1.5} fill="none" />
        <line x1={293} y1={93} x2={308} y2={108} stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
        {/* Data dots inside magnifier */}
        <circle cx={275} cy={76} r={2} fill={strokeLight} />
        <circle cx={283} cy={82} r={2} fill={strokeLight} />
        <circle cx={278} cy={85} r={2} fill={strokeLight} />
      </svg>
    ),
    generative: (
      <svg viewBox="0 0 349 276" fill="none" className="w-full h-full">
        {/* Terrain/topographic lines */}
        <path d="M30 200 Q80 170 130 190 Q180 210 230 175 Q280 140 320 160" stroke={stroke} strokeWidth={1.2} fill="none" />
        <path d="M30 180 Q80 150 130 170 Q180 190 230 155 Q280 120 320 140" stroke={stroke} strokeWidth={1} fill="none" />
        <path d="M30 160 Q80 130 130 150 Q180 170 230 135 Q280 100 320 120" stroke={strokeLight} strokeWidth={0.8} fill="none" />
        <path d="M30 140 Q80 110 130 130 Q180 150 230 115 Q280 80 320 100" stroke={strokeFaint} strokeWidth={0.7} fill="none" />
        <path d="M30 120 Q80 90 130 110 Q180 130 230 95 Q280 60 320 80" stroke={strokeFaint} strokeWidth={0.7} fill="none" />
        {/* Generated data points appearing */}
        <circle cx={100} cy={168} r={4} stroke={stroke} strokeWidth={1.2} fill={fill} />
        <circle cx={100} cy={168} r={8} stroke={stroke} strokeWidth={0.7} fill="none" strokeDasharray="3 2" />
        <circle cx={200} cy={180} r={4} stroke={stroke} strokeWidth={1.2} fill={fill} />
        <circle cx={200} cy={180} r={8} stroke={stroke} strokeWidth={0.7} fill="none" strokeDasharray="3 2" />
        <circle cx={280} cy={148} r={4} stroke={stroke} strokeWidth={1.2} fill={fill} />
        <circle cx={280} cy={148} r={8} stroke={stroke} strokeWidth={0.7} fill="none" strokeDasharray="3 2" />
        {/* Sparkle/generation markers */}
        <path d="M155 130 l0 -10 M155 130 l0 10 M155 130 l-10 0 M155 130 l10 0" stroke={stroke} strokeWidth={1} strokeLinecap="round" />
        <path d="M250 100 l0 -7 M250 100 l0 7 M250 100 l-7 0 M250 100 l7 0" stroke={strokeLight} strokeWidth={0.8} strokeLinecap="round" />
        {/* Grid underlay */}
        {[60, 120, 180, 240, 300].map(x => <line key={`v${x}`} x1={x} y1={50} x2={x} y2={230} stroke={strokeFaint} strokeWidth={0.5} />)}
      </svg>
    ),
    spatial: (
      <svg viewBox="0 0 349 276" fill="none" className="w-full h-full">
        {/* Globe outline */}
        <circle cx={174} cy={138} r={90} stroke={stroke} strokeWidth={1.2} fill="none" />
        {/* Meridians */}
        <ellipse cx={174} cy={138} rx={45} ry={90} stroke={strokeLight} strokeWidth={0.7} fill="none" />
        <ellipse cx={174} cy={138} rx={70} ry={90} stroke={strokeFaint} strokeWidth={0.7} fill="none" />
        <line x1={174} y1={48} x2={174} y2={228} stroke={strokeLight} strokeWidth={0.7} />
        {/* Parallels */}
        <ellipse cx={174} cy={100} rx={82} ry={12} stroke={strokeFaint} strokeWidth={0.7} fill="none" />
        <ellipse cx={174} cy={138} rx={90} ry={14} stroke={strokeLight} strokeWidth={0.7} fill="none" />
        <ellipse cx={174} cy={176} rx={82} ry={12} stroke={strokeFaint} strokeWidth={0.7} fill="none" />
        {/* Network nodes on globe */}
        <circle cx={140} cy={108} r={4} fill={stroke} />
        <circle cx={200} cy={120} r={4} fill={stroke} />
        <circle cx={160} cy={160} r={4} fill={stroke} />
        <circle cx={210} cy={155} r={4} fill={stroke} />
        <circle cx={130} cy={145} r={4} fill={stroke} />
        {/* Network connections */}
        <line x1={140} y1={108} x2={200} y2={120} stroke={stroke} strokeWidth={1} />
        <line x1={200} y1={120} x2={210} y2={155} stroke={stroke} strokeWidth={1} />
        <line x1={140} y1={108} x2={130} y2={145} stroke={stroke} strokeWidth={1} />
        <line x1={130} y1={145} x2={160} y2={160} stroke={stroke} strokeWidth={1} />
        <line x1={160} y1={160} x2={210} y2={155} stroke={stroke} strokeWidth={1} />
        {/* Pulse rings around key nodes */}
        <circle cx={200} cy={120} r={10} stroke={stroke} strokeWidth={0.7} fill="none" strokeDasharray="3 2" />
        <circle cx={160} cy={160} r={10} stroke={stroke} strokeWidth={0.7} fill="none" strokeDasharray="3 2" />
      </svg>
    ),
  };

  return (
    <div className="flex justify-end" style={anim}>
      <div className="w-[349px] h-[276px] max-md:w-full max-md:h-auto max-md:aspect-[349/276]">
        {graphics[id]}
      </div>
    </div>
  );
}
