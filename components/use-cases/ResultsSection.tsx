"use client";

import { useEffect, useRef, useState } from "react";

const STROKE = "#0A1344";

/* ── Per-card line-art illustrations ──────────────────────────── */

/* #1 — Semantic reasoning in cities. A coordinate plot with a faint grid,
   crosshair extending past the frame, and an ellipse cutting through.
   Reads as "spatial context + reasoning". */
const CoordinateArt = () => (
  <svg viewBox="0 0 140 140" fill="none" className="w-full h-full" aria-hidden>
    {[40, 60, 80, 100].map((y) => (
      <line key={`h${y}`} x1="20" y1={y} x2="120" y2={y} stroke={STROKE} strokeOpacity="0.18" strokeWidth="0.5" strokeDasharray="2 2" />
    ))}
    {[40, 60, 80, 100].map((x) => (
      <line key={`v${x}`} x1={x} y1="20" x2={x} y2="120" stroke={STROKE} strokeOpacity="0.18" strokeWidth="0.5" strokeDasharray="2 2" />
    ))}
    <rect x="20" y="20" width="100" height="100" stroke={STROKE} strokeWidth="0.7" />
    <line x1="0" y1="70" x2="20" y2="70" stroke={STROKE} strokeWidth="0.7" strokeDasharray="3 3" />
    <line x1="120" y1="70" x2="140" y2="70" stroke={STROKE} strokeWidth="0.7" strokeDasharray="3 3" />
    <line x1="70" y1="0" x2="70" y2="20" stroke={STROKE} strokeWidth="0.7" strokeDasharray="3 3" />
    <line x1="70" y1="120" x2="70" y2="140" stroke={STROKE} strokeWidth="0.7" strokeDasharray="3 3" />
    <ellipse cx="70" cy="65" rx="28" ry="38" stroke={STROKE} strokeWidth="0.9" />
    <circle cx="20" cy="20" r="2" fill={STROKE} />
    <circle cx="120" cy="20" r="2" fill={STROKE} />
    <circle cx="20" cy="120" r="2" fill={STROKE} />
    <circle cx="120" cy="120" r="2" fill={STROKE} />
    <circle cx="70" cy="70" r="2.2" fill={STROKE} />
  </svg>
);

/* #2 — Generalist model with wide catalogue. A 4×4×4 wireframe cube in
   isometric projection. */
const CubeArt = () => {
  const N = 4;
  const ox = 70, oy = 78;
  const s = 11;
  const dx = s, dy = s * 0.5;
  const proj = (x: number, y: number, z: number) => [
    ox + (x - z) * dx,
    oy + (x + z) * dy - y * s,
  ];
  const lines: React.ReactNode[] = [];
  // Front face (z=0)
  for (let i = 0; i <= N; i++) {
    const [x1, y1] = proj(i, 0, 0);
    const [x2, y2] = proj(i, N, 0);
    const outer = i === 0 || i === N;
    lines.push(<line key={`fv${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={outer ? 0.9 : 0.5} strokeOpacity={outer ? 1 : 0.5} />);
  }
  for (let j = 0; j <= N; j++) {
    const [x1, y1] = proj(0, j, 0);
    const [x2, y2] = proj(N, j, 0);
    const outer = j === 0 || j === N;
    lines.push(<line key={`fh${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={outer ? 0.9 : 0.5} strokeOpacity={outer ? 1 : 0.5} />);
  }
  // Right face (x=N)
  for (let k = 0; k <= N; k++) {
    const [x1, y1] = proj(N, 0, k);
    const [x2, y2] = proj(N, N, k);
    const outer = k === 0 || k === N;
    lines.push(<line key={`rv${k}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={outer ? 0.9 : 0.5} strokeOpacity={outer ? 1 : 0.5} />);
  }
  for (let j = 0; j <= N; j++) {
    const [x1, y1] = proj(N, j, 0);
    const [x2, y2] = proj(N, j, N);
    const outer = j === 0 || j === N;
    lines.push(<line key={`rh${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={outer ? 0.9 : 0.5} strokeOpacity={outer ? 1 : 0.5} />);
  }
  // Top face (y=N)
  for (let i = 0; i <= N; i++) {
    const [x1, y1] = proj(i, N, 0);
    const [x2, y2] = proj(i, N, N);
    const outer = i === 0 || i === N;
    lines.push(<line key={`tv${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={outer ? 0.9 : 0.5} strokeOpacity={outer ? 1 : 0.5} />);
  }
  for (let k = 0; k <= N; k++) {
    const [x1, y1] = proj(0, N, k);
    const [x2, y2] = proj(N, N, k);
    const outer = k === 0 || k === N;
    lines.push(<line key={`th${k}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={outer ? 0.9 : 0.5} strokeOpacity={outer ? 1 : 0.5} />);
  }
  return (
    <svg viewBox="0 0 140 140" fill="none" className="w-full h-full" aria-hidden>
      {lines}
    </svg>
  );
};

/* #3 — Generative geospatial data. A 3D wireframe wavy plane. */
const WaveSurfaceArt = () => {
  const cols = 9, rows = 5;
  const proj = (i: number, j: number) => {
    const xw = i - (cols - 1) / 2;
    const zw = j / (rows - 1);
    const y = Math.sin(xw * 0.7) * 6 + Math.cos(zw * Math.PI) * 3;
    const sx = 70 + xw * 9 - zw * 16;
    const sy = 90 - y + zw * 22;
    return [sx, sy];
  };
  const rowPaths: string[] = [];
  for (let j = 0; j < rows; j++) {
    let p = "";
    for (let i = 0; i < cols; i++) {
      const [x, y] = proj(i, j);
      p += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " ";
    }
    rowPaths.push(p);
  }
  const colPaths: string[] = [];
  for (let i = 0; i < cols; i++) {
    let p = "";
    for (let j = 0; j < rows; j++) {
      const [x, y] = proj(i, j);
      p += (j === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " ";
    }
    colPaths.push(p);
  }
  return (
    <svg viewBox="0 0 140 140" fill="none" className="w-full h-full" aria-hidden>
      {rowPaths.map((d, i) => (
        <path key={`r${i}`} d={d} stroke={STROKE} strokeWidth="0.7" fill="none" />
      ))}
      {colPaths.map((d, i) => (
        <path key={`c${i}`} d={d} stroke={STROKE} strokeWidth="0.7" fill="none" />
      ))}
    </svg>
  );
};

/* #4 — Deep spatial reasoning at scale. Concentric ovals stacked
   vertically — like halos at increasing depth. */
const StackedRingsArt = () => (
  <svg viewBox="0 0 140 140" fill="none" className="w-full h-full" aria-hidden>
    {[
      { cy: 96, rx: 44, ry: 7, sw: 0.9 },
      { cy: 82, rx: 38, ry: 6, sw: 0.85 },
      { cy: 70, rx: 32, ry: 5, sw: 0.8 },
      { cy: 60, rx: 26, ry: 4, sw: 0.75 },
      { cy: 52, rx: 20, ry: 3.2, sw: 0.7 },
    ].map((r, i) => (
      <ellipse key={i} cx="70" cy={r.cy} rx={r.rx} ry={r.ry} stroke={STROKE} strokeWidth={r.sw} strokeOpacity={1 - i * 0.12} />
    ))}
  </svg>
);

/* ── Items ────────────────────────────────────────────────────── */

const ITEMS: { num: string; title: string; art: React.ReactNode }[] = [
  { num: "1", title: "Fast semantic reasoning in cities. Contextual enrichment.", art: <CoordinateArt /> },
  { num: "2", title: "Generalist model, with access to wide catalogue", art: <CubeArt /> },
  { num: "3", title: "Generative geospatial data", art: <WaveSurfaceArt /> },
  { num: "4", title: "Deep spatial reasoning at scale", art: <StackedRingsArt /> },
];

export default function ResultsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      className="relative w-full py-24 rounded-t-[33px] overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* ── Page structure lines — extend the page grid through this section.
          Same pattern as the hero: vertical lines at the bounded 1287px
          container's left/right edges, full section height. */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }} aria-hidden>
        <div className="max-w-[1287px] mx-auto relative h-full">
          <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
        </div>
      </div>

      <div ref={ref} className="relative max-w-[1287px] mx-auto" style={{ zIndex: 2 }}>
        {/* Header keeps its own internal padding so the title doesn't sit
            flush against the structure lines on small viewports. */}
        <div className="px-8 min-[1287px]:px-0">
          <h2
            className="text-[#1D1D1F] text-[31px] md:text-[39px] lg:text-[49px] leading-[1.15] tracking-[-0.02em] text-center max-md:text-left"
            style={{ fontWeight: 500, ...anim(0) }}
          >
            THE LATEST <span style={{ color: "#0066CC" }}>RESULTS</span> FROM
            <br />
            OUR DEVELOPMENT OF
            <br />
            A LARGE GEOSPATIAL <span style={{ color: "#0066CC" }}>MODEL</span>
          </h2>
        </div>

        {/* ── 4-column cards row — bracketed with horizontal lines top and
            bottom that connect the page structure lines to the inter-card
            vertical separators. Forms a continuous grid of lines. */}
        <div className="relative mt-24 max-md:mt-14">
          {/* Top horizontal line — only at lg+ where the 4-col layout has a
              single bracketing row. */}
          <div
            className="pointer-events-none absolute max-lg:hidden"
            style={{ top: 0, left: 0, right: 0, height: 1, background: "var(--grid-line)" }}
            aria-hidden
          />
          {/* Bottom horizontal line */}
          <div
            className="pointer-events-none absolute max-lg:hidden"
            style={{ bottom: 0, left: 0, right: 0, height: 1, background: "var(--grid-line)" }}
            aria-hidden
          />

          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1">
            {ITEMS.map((item, i) => (
              <div
                key={item.num}
                className="relative px-6 lg:px-8 py-12"
                style={anim(120 + i * 90)}
              >
                {/* Inter-card vertical separator — solid, no fade. */}
                {i > 0 && (
                  <div
                    className={
                      "pointer-events-none absolute top-0 bottom-0 left-0 w-px max-md:hidden " +
                      (i % 2 === 0 ? "max-lg:hidden " : "")
                    }
                    style={{ background: "var(--grid-line)" }}
                    aria-hidden
                  />
                )}

                {/* Illustration */}
                <div className="w-full aspect-square max-w-[200px] mb-10">
                  {item.art}
                </div>

                {/* Number on the left of the title */}
                <h3 className="text-[#1D1D1F] text-[20px] lg:text-[22px] leading-[1.3] tracking-[-0.01em] flex items-baseline gap-3" style={{ fontWeight: 500 }}>
                  <span className="shrink-0">{item.num}.</span>
                  <span>{item.title}</span>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
