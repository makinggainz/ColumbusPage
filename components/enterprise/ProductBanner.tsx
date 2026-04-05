"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ProductBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#F9F9F9" }}
    >
      {/* Blue gradient from top — same as hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 102, 204, 0.15) 0%, rgba(0, 102, 204, 0.10) 50%, rgba(0, 102, 204, 0.04) 80%, transparent 100%)",
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Wireframe globe — GIS platform identity */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: "-20%", left: "50%", transform: "translateX(-50%)", width: "120%", height: "90%", zIndex: 0, opacity: 0.6 }}
        viewBox="0 0 800 800"
        fill="none"
        aria-hidden
      >
        {(() => {
          const cx = 400, cy = 400, R = 350;
          const tiltX = 20 * (Math.PI / 180);
          const tiltY = -15 * (Math.PI / 180);
          const project = (lon: number, lat: number): [number, number] | null => {
            const l = lon * (Math.PI / 180), p = lat * (Math.PI / 180);
            let x = Math.cos(p) * Math.cos(l);
            let y = Math.cos(p) * Math.sin(l);
            let z = Math.sin(p);
            const y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
            const z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
            const x2 = x * Math.cos(tiltY) + z1 * Math.sin(tiltY);
            const z2 = -x * Math.sin(tiltY) + z1 * Math.cos(tiltY);
            if (z2 < -0.1) return null;
            return [cx + x2 * R, cy - y1 * R];
          };
          const buildLine = (pts: ([number, number] | null)[]): string => {
            let d = "", pen = false;
            for (const pt of pts) {
              if (!pt) { pen = false; continue; }
              d += pen ? `L${pt[0].toFixed(1)},${pt[1].toFixed(1)} ` : `M${pt[0].toFixed(1)},${pt[1].toFixed(1)} `;
              pen = true;
            }
            return d;
          };
          const steps = 120;
          const lines: React.ReactElement[] = [];
          // Meridians every 20°
          for (let lon = -180; lon < 180; lon += 20) {
            const pts = Array.from({ length: steps + 1 }, (_, i) => project(lon, -90 + i * (180 / steps)));
            const d = buildLine(pts);
            if (d) lines.push(<path key={`m${lon}`} d={d} stroke="rgba(37,99,235,0.12)" strokeWidth={0.8} />);
          }
          // Parallels every 15°
          for (let lat = -75; lat <= 75; lat += 15) {
            const pts = Array.from({ length: steps + 1 }, (_, i) => project(-180 + i * (360 / steps), lat));
            const d = buildLine(pts);
            if (d) lines.push(<path key={`p${lat}`} d={d} stroke="rgba(37,99,235,0.10)" strokeWidth={0.6} />);
          }
          // Equator + prime meridian stronger
          const eq = Array.from({ length: steps + 1 }, (_, i) => project(-180 + i * (360 / steps), 0));
          const eqD = buildLine(eq);
          if (eqD) lines.push(<path key="eq" d={eqD} stroke="rgba(37,99,235,0.20)" strokeWidth={1.2} />);
          const pm = Array.from({ length: steps + 1 }, (_, i) => project(0, -90 + i * (180 / steps)));
          const pmD = buildLine(pm);
          if (pmD) lines.push(<path key="pm" d={pmD} stroke="rgba(37,99,235,0.18)" strokeWidth={1.0} />);
          // Globe outline
          lines.push(<circle key="outline" cx={cx} cy={cy} r={R} stroke="rgba(37,99,235,0.08)" strokeWidth={1} />);
          return lines;
        })()}
      </svg>

      {/* Noise grain texture — strong */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: 0.50, mixBlendMode: "multiply" }}>
        <filter id="sectionDNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sectionDNoise)" />
      </svg>

      {/* Vertical structure lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2" style={{ width: "100%", maxWidth: 1287, borderLeft: "1px solid var(--grid-line)", borderRight: "1px solid var(--grid-line)" }} />
      </div>


      <div
        className="relative z-10 flex flex-col items-center justify-center px-6 md:px-10"
        style={{
          paddingTop: 230,
          paddingBottom: 230,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <h2
          className="text-center leading-[1.1] text-[28px] md:text-[36px] lg:text-[45px]"
          style={{
            fontWeight: 500,
            letterSpacing: "-0.025em",
            color: "transparent",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%231D1D1F' /%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          <strong>Columbus Pro</strong>
          {" — "}
          GIS made effortless
        </h2>

        <Link
          href="/contact"
          className="group mt-10 flex items-center gap-3 text-[18px] lg:text-[20px] text-[#1D1D1F] font-semibold transition-opacity"
        >
          <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Try Demo</span>
          <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
