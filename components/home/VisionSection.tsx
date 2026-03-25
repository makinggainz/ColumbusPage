"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";

export const Vision = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  const sentinelTopRef = useRef<HTMLDivElement>(null);
  const sentinelBottomRef = useRef<HTMLDivElement>(null);
  const topPastRef = useRef(false);
  const bottomPastRef = useRef(false);

  useEffect(() => {
    const topEl = sentinelTopRef.current;
    const bottomEl = sentinelBottomRef.current;
    if (!topEl || !bottomEl) return;

    const fire = () => {
      const stuck = topPastRef.current && !bottomPastRef.current;
      window.dispatchEvent(new CustomEvent("vision-sticky", { detail: { stuck } }));
    };

    const topObs = new IntersectionObserver(
      ([entry]) => { topPastRef.current = !entry.isIntersecting; fire(); },
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );
    const bottomObs = new IntersectionObserver(
      ([entry]) => { bottomPastRef.current = !entry.isIntersecting; fire(); },
      { threshold: 0 }
    );

    topObs.observe(topEl);
    bottomObs.observe(bottomEl);
    return () => { topObs.disconnect(); bottomObs.disconnect(); };
  }, []);

  return (
    <div>
      <div ref={sentinelTopRef} className="h-0" />

      <GridSection>
        {/* Heading */}
        <div
          ref={ref}
          className="px-8 md:px-10 py-12 md:py-16"
        >
          <h2
            className="text-[#1D1D1F] leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: 48, fontWeight: 300, ...anim(0) }}
          >
            Introducing new kind of AI,{" "}
            <span className="font-bold">COLUMBUS-01</span>
          </h2>
        </div>

        {/* Image grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
          style={{ gridAutoFlow: "dense", ...anim(100) }}
        >
          {/* Row 1: img · General Intelligence (2 cols) · img · img · img */}
          <Tile src="/image1.png" />
          <TextTile title="General Intelligence" subtitle="for the physical world" />
          <Tile src="/image2.png" />
          <Tile src="/image3.png" />
          <Tile src="/image4.png" />

          {/* Row 2: img · img · img · img · Foundational Models (2 cols) */}
          <Tile src="/image111.png" />
          <Tile src="/image112.png" />
          <Tile src="/image113.png" />
          <TextTile title="Foundational Models" subtitle="for Earth" />
          <Tile src="/image114.png" />
        </div>

        {/* Architecture diagram */}
        <div style={{ borderBottom: gl, ...anim(180) }}>
          <ArchitectureDiagram />
        </div>

        {/* Bottom bar — two columns */}
        <div className="grid grid-cols-2" style={{ ...anim(260) }}>
          <div className="px-10 flex items-center" style={{ height: 76, borderRight: gl, backgroundColor: "rgba(20, 41, 148, 0.07)" }}>
            <p className="text-[20px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
              Think of us like the OpenAI for maps.
            </p>
          </div>
          <Link
            href="/technology"
            className="px-10 flex items-center justify-between hover:opacity-90 transition-opacity"
            style={{ height: 76, backgroundColor: "#000000" }}
          >
            <span className="text-white text-[20px] font-medium">Our research &amp; technology</span>
            <svg width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#7B6FE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </GridSection>

      <div ref={sentinelBottomRef} className="h-0" />
    </div>
  );
};

/* ── Tile components ── */

const Tile = ({ src }: { src: string }) => (
  <div
    className="relative w-full h-full overflow-hidden"
  >
    <Image src={src} alt="" fill className="object-cover" />
  </div>
);

const TextTile = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div
    className="col-span-1 sm:col-span-2 flex flex-col justify-center items-center text-center px-6"
  >
    <h3 className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] leading-tight tracking-tight">
      {title}
    </h3>
    <p className="text-base md:text-lg text-[#6E6E73] mt-1 tracking-tight">{subtitle}</p>
  </div>
);

/* ── Architecture diagram ── */

const ArchitectureDiagram = () => {
  const inputs = [
    { lines: ["SATELLITE", "IMAGERY"],   y: 10 },
    { lines: ["TERRAIN",   "DATA"],      y: 76 },
    { lines: ["HUMAN",     "ACTIVITY"],  y: 142 },
    { lines: ["TEMPORAL",  "PATTERNS"],  y: 208 },
  ];

  const outputs = [
    { lines: ["REAL ESTATE", "ANALYTICS"],    y: 50  },
    { lines: ["RESEARCH &",  "INTELLIGENCE"], y: 109 },
    { lines: ["CONSUMER",    "APPS"],         y: 168 },
  ];

  const NODE_H = 40;
  const INPUT_X = 40,  INPUT_W = 155, INPUT_RIGHT = INPUT_X + INPUT_W;   // 195
  const OUT_X   = 1005, OUT_W  = 155;
  const CX = 435, CY_TOP = 54, CW = 330, CH = 140;
  const CCY = CY_TOP + CH / 2; // 124
  const CR = CX + CW; // 765

  // mid-x for bezier elbows
  const LMX = (INPUT_RIGHT + CX) / 2; // 315
  const RMX = (CR + OUT_X) / 2;       // 885

  return (
    <div style={{ padding: "120px 0 112px" }}>
      <svg
        viewBox="0 0 1200 258"
        width="100%"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <style>{`
            @keyframes visionDash {
              to { stroke-dashoffset: -20; }
            }
          `}</style>
        </defs>

        {/* Background grid */}
        {Array.from({ length: 29 }).map((_, i) => (
          <line key={`gv${i}`}
            x1={(i + 1) * 40} y1={0} x2={(i + 1) * 40} y2={258}
            stroke="rgba(10,19,68,0.03)" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`gh${i}`}
            x1={0} y1={(i + 1) * 32} x2={1200} y2={(i + 1) * 32}
            stroke="rgba(10,19,68,0.03)" strokeWidth={0.5} />
        ))}

        {/* Input nodes + fan-in paths */}
        {inputs.map((inp, i) => {
          const cy = inp.y + NODE_H / 2;
          return (
            <g key={`inp${i}`}>
              <rect x={INPUT_X} y={inp.y} width={INPUT_W} height={NODE_H} rx={3}
                fill="rgba(10,19,68,0.05)" stroke="rgba(10,19,68,0.14)" strokeWidth={0.75} />
              <text x={INPUT_X + INPUT_W / 2} y={inp.y + 15}
                textAnchor="middle" fill="rgba(10,19,68,0.52)"
                fontSize={8.5} fontFamily="ui-monospace,monospace" fontWeight="700" letterSpacing="0.1em">
                {inp.lines[0]}
              </text>
              <text x={INPUT_X + INPUT_W / 2} y={inp.y + 28}
                textAnchor="middle" fill="rgba(10,19,68,0.34)"
                fontSize={8.5} fontFamily="ui-monospace,monospace" letterSpacing="0.07em">
                {inp.lines[1]}
              </text>
              <path
                d={`M${INPUT_RIGHT} ${cy} C${LMX} ${cy} ${LMX} ${CCY} ${CX} ${CCY}`}
                stroke="rgba(10,19,68,0.2)" strokeWidth={1} fill="none"
                strokeDasharray="6 4"
                style={{ animation: `visionDash ${1.3 + i * 0.18}s linear infinite` }}
              />
            </g>
          );
        })}

        {/* Central Columbus-01 node */}
        <rect x={CX} y={CY_TOP} width={CW} height={CH} rx={5} fill="rgba(10,19,68,0.55)" />
        {/* Inner vertical dividers */}
        {[0.25, 0.5, 0.75].map((p, i) => (
          <line key={`cv${i}`}
            x1={CX + CW * p} y1={CY_TOP + 8} x2={CX + CW * p} y2={CY_TOP + CH - 8}
            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
        ))}
        {/* Horizontal divider */}
        <line x1={CX + 16} y1={CY_TOP + CH * 0.56} x2={CX + CW - 16} y2={CY_TOP + CH * 0.56}
          stroke="rgba(255,255,255,0.07)" strokeWidth={0.5} />
        {/* Label */}
        <text x={CX + CW / 2} y={CY_TOP + 38}
          textAnchor="middle" fill="white"
          fontSize={15} fontFamily="ui-monospace,monospace" fontWeight="700" letterSpacing="0.08em">
          COLUMBUS-01
        </text>
        <text x={CX + CW / 2} y={CY_TOP + 56}
          textAnchor="middle" fill="rgba(255,255,255,0.38)"
          fontSize={7.5} fontFamily="ui-monospace,monospace" letterSpacing="0.11em">
          GEOSPATIAL FOUNDATION MODEL
        </text>
        {/* Capability labels */}
        {[
          { label: "VISION",   pct: 0.2 },
          { label: "SPATIAL",  pct: 0.5 },
          { label: "TEMPORAL", pct: 0.8 },
        ].map(c => (
          <text key={c.label} x={CX + CW * c.pct} y={CY_TOP + 93}
            textAnchor="middle" fill="rgba(255,255,255,0.25)"
            fontSize={7} fontFamily="ui-monospace,monospace" letterSpacing="0.1em">
            {c.label}
          </text>
        ))}
        <text x={CX + CW / 2} y={CY_TOP + 118}
          textAnchor="middle" fill="rgba(255,255,255,0.05)"
          fontSize={6.5} fontFamily="ui-monospace,monospace" letterSpacing="0.13em">
          v1.0 · PRODUCTION
        </text>

        {/* Fan-out paths + output nodes */}
        {outputs.map((out, i) => {
          const cy = out.y + NODE_H / 2;
          return (
            <g key={`out${i}`}>
              <path
                d={`M${CR} ${CCY} C${RMX} ${CCY} ${RMX} ${cy} ${OUT_X} ${cy}`}
                stroke="rgba(10,19,68,0.2)" strokeWidth={1} fill="none"
                strokeDasharray="6 4"
                style={{ animation: `visionDash ${1.3 + i * 0.18}s linear infinite` }}
              />
              <rect x={OUT_X} y={out.y} width={OUT_W} height={NODE_H} rx={3} fill="rgba(10,19,68,0.55)" />
              <text x={OUT_X + OUT_W / 2} y={out.y + 15}
                textAnchor="middle" fill="rgba(255,255,255,0.85)"
                fontSize={8.5} fontFamily="ui-monospace,monospace" fontWeight="700" letterSpacing="0.1em">
                {out.lines[0]}
              </text>
              <text x={OUT_X + OUT_W / 2} y={out.y + 28}
                textAnchor="middle" fill="rgba(255,255,255,0.45)"
                fontSize={8.5} fontFamily="ui-monospace,monospace" letterSpacing="0.07em">
                {out.lines[1]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
