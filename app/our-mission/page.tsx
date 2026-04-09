"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GridSection, GridCell, gl } from "@/components/home/ContentGrid";

const ContactOceanScene = dynamic(() => import("@/components/contact/ContactOceanScene"), { ssr: false });

/* ── Scroll fade-in hook ── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });
  return { ref, visible, anim };
}

/* ── Wireframe Globe (from enterprise ProductBanner) ── */
function WireframeGlobe({ className = "" }: { className?: string }) {
  const cx = 400, cy = 400, R = 350;
  const tiltX = 20 * (Math.PI / 180);
  const tiltY = -15 * (Math.PI / 180);
  const project = (lon: number, lat: number): [number, number] | null => {
    const l = lon * (Math.PI / 180), p = lat * (Math.PI / 180);
    const x = Math.cos(p) * Math.cos(l);
    const y = Math.cos(p) * Math.sin(l);
    const z = Math.sin(p);
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
  for (let lon = -180; lon < 180; lon += 20) {
    const pts = Array.from({ length: steps + 1 }, (_, i) => project(lon, -90 + i * (180 / steps)));
    const d = buildLine(pts);
    if (d) lines.push(<path key={`m${lon}`} d={d} stroke="rgba(37,99,235,0.12)" strokeWidth={0.8} />);
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const pts = Array.from({ length: steps + 1 }, (_, i) => project(-180 + i * (360 / steps), lat));
    const d = buildLine(pts);
    if (d) lines.push(<path key={`p${lat}`} d={d} stroke="rgba(37,99,235,0.10)" strokeWidth={0.6} />);
  }
  const eq = Array.from({ length: steps + 1 }, (_, i) => project(-180 + i * (360 / steps), 0));
  const eqD = buildLine(eq);
  if (eqD) lines.push(<path key="eq" d={eqD} stroke="rgba(37,99,235,0.20)" strokeWidth={1.2} />);
  const pm = Array.from({ length: steps + 1 }, (_, i) => project(0, -90 + i * (180 / steps)));
  const pmD = buildLine(pm);
  if (pmD) lines.push(<path key="pm" d={pmD} stroke="rgba(37,99,235,0.18)" strokeWidth={1.0} />);
  lines.push(<circle key="outline" cx={cx} cy={cy} r={R} stroke="rgba(37,99,235,0.08)" strokeWidth={1} />);

  return (
    <svg className={className} viewBox="0 0 800 800" fill="none" aria-hidden>
      <style>{`@keyframes globe-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <g style={{ transformOrigin: "400px 400px", animation: "globe-spin 60s linear infinite" }}>
        {lines}
      </g>
    </svg>
  );
}

/* ── Page ── */
export default function OurMissionPage() {
  const hero = useScrollReveal(0);
  const mission = useScrollReveal(0.05);
  const globe = useScrollReveal(0.1);
  const differ = useScrollReveal(0.05);
  const philosophy = useScrollReveal(0.1);
  const values = useScrollReveal(0.05);

  const [sceneOpacity, setSceneOpacity] = useState(1);
  const [gridLineOpacity, setGridLineOpacity] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSceneOpacity(Math.max(0, 1 - y / 100));
      // Grid lines fade in as the scene fades out (0-100px scroll)
      setGridLineOpacity(Math.min(1, y / 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="mission-page min-h-screen" style={{ backgroundColor: "#F9F9F9" }}>
      <style>{`
        .mission-page .grid-section::before,
        .mission-page .grid-section::after {
          opacity: ${gridLineOpacity};
          transition: opacity 0.1s ease;
        }
      `}</style>
      {/* Ocean scene background — fades out on scroll */}
      {sceneOpacity > 0 && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1,
          opacity: sceneOpacity, willChange: "opacity", pointerEvents: "none",
          transform: "translateY(-120px)",
          mask: "linear-gradient(to bottom, transparent 0%, black 20%, black 75%, rgba(0,0,0,0.15) 100%), linear-gradient(to right, rgba(0,0,0,0.1) 0%, black 20%, black 80%, rgba(0,0,0,0.1) 100%)",
          WebkitMask: "linear-gradient(to bottom, transparent 0%, black 20%, black 75%, rgba(0,0,0,0.15) 100%), linear-gradient(to right, rgba(0,0,0,0.1) 0%, black 20%, black 80%, rgba(0,0,0,0.1) 100%)",
          maskComposite: "intersect" as unknown as string,
          WebkitMaskComposite: "destination-in" as React.CSSProperties["WebkitMaskComposite"],
        }}>
          <ContactOceanScene camHeight={180} horizonPct={0.38} fieldOfView={700} islandCenterX={0} islandCenterZ={650} islandScale={0.28} skipAnimation />
        </div>
      )}

      <Navbar />

      {/* ════════ 1. HERO ════════ */}
      <div className="relative overflow-hidden">
        {/* Accent gradient */}
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none"
          style={{ height: "100%", background: "linear-gradient(to bottom, rgba(0, 102, 204, 0.15) 0%, rgba(0, 102, 204, 0.08) 60%, transparent 100%)", zIndex: 1 }}
          aria-hidden
        />
        {/* Grid pattern — fades out before ocean mesh */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div className="max-w-[1287px] mx-auto h-full" style={{
            backgroundImage: `linear-gradient(to right, rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.08) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            mask: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, black 0%, black 55%, transparent 75%)",
            WebkitMask: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, black 0%, black 55%, transparent 75%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "destination-in" as React.CSSProperties["WebkitMaskComposite"],
          }} />
        </div>

        <div ref={hero.ref} className="relative z-10 mx-auto w-full pt-40 md:pt-52 pb-40 md:pb-56 flex flex-col items-center text-center px-8 md:px-10" style={{ maxWidth: 1287 }}>
          <h1
            className="font-light leading-[1.15] text-[#0A1344] text-[39px] md:text-[49px] lg:text-[61px]"
            style={{ letterSpacing: "-0.02em", ...hero.anim(0) }}
          >
            Building a thinking Earth
          </h1>
          <p
            className="mt-6 text-[16px] md:text-[20px] leading-[1.5] max-w-[600px]"
            style={{ color: "rgba(10, 19, 68, 0.45)", letterSpacing: "-0.015em", fontWeight: 400, ...hero.anim(100) }}
          >
            What if you could ask the planet a question, and it understood?
          </p>
        </div>
      </div>

      {/* ════════ 2. MISSION & VISION ════════ */}
      <div style={{
        position: "relative",
        zIndex: 2,
        background: "linear-gradient(to bottom, transparent 0%, #F9F9F9 25%)",
      }}>
      <GridSection className="bg-transparent! grid-section-fade-top">
        <div ref={mission.ref} style={{ borderBottom: gl }}>

          <div className="flex flex-col items-center text-center px-8 md:px-10 py-20 md:py-28">
            <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#1D1D1F] mb-8" style={mission.anim(0)}>
              OUR MISSION
            </p>
            <p className="text-[18px] md:text-[22px] leading-[1.6] text-[#1D1D1F] max-w-[700px]" style={{ fontWeight: 400, ...mission.anim(100) }}>
              To create intelligence to critically understand our planet better.
              Deep surveying of all earth. To create a computer brain, able
              to think across the vastness of our earth&apos;s data.
            </p>
            <p className="text-[18px] md:text-[22px] leading-[1.6] text-[#1D1D1F] max-w-[700px] mt-10" style={{ fontWeight: 400, ...mission.anim(200) }}>
              To create the most powerful map platform.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full" style={{ height: 1, backgroundColor: "var(--grid-line)" }} />

          <div className="flex flex-col items-center text-center px-8 md:px-10 py-20 md:py-28">
            <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#1D1D1F] mb-8" style={mission.anim(300)}>
              OUR VISION
            </p>
            <p className="text-[18px] md:text-[22px] leading-[1.6] text-[#1D1D1F] max-w-[700px]" style={{ fontWeight: 400, ...mission.anim(400) }}>
              We believe maps can lead to the journey to a Universal Geospatial Model.
              A thinking earth.
            </p>
          </div>

        </div>
      </GridSection>
      </div>

      {/* ════════ 3. GLOBE CENTERPIECE ════════ */}
      <div ref={globe.ref} className="flex flex-col items-center py-20 md:py-32 px-8 overflow-hidden">
        <div style={{ width: "100%", maxWidth: 400, ...globe.anim(0) }}>
          <WireframeGlobe className="w-full h-auto" />
        </div>
        <p
          className="mt-8 text-[22px] md:text-[28px] leading-[1.3] text-center font-medium text-[#1D1D1F] max-w-[600px]"
          style={{ letterSpacing: "-0.02em", ...globe.anim(200) }}
        >
          The most extensive data on Earth, of Earth.
        </p>
      </div>

      {/* ════════ 4. HOW WE DIFFER ════════ */}
      <GridSection className="bg-transparent! grid-section-fade-top">
        <div ref={differ.ref} style={{ borderBottom: gl }}>
          <div className="px-8 md:px-10 py-20 md:py-28">

            <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#1D1D1F] mb-12 text-center" style={differ.anim(0)}>
              HOW WE DIFFER
            </p>

            <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-[900px] mx-auto">
              {/* Columbus */}
              <div style={differ.anim(100)}>
                <div className="flex items-center gap-3 mb-6">
                  <Image src="/logobueno.png" alt="Columbus" width={32} height={32} />
                  <h3 className="text-[24px] md:text-[28px] font-medium text-[#1D1D1F]" style={{ letterSpacing: "-0.02em" }}>
                    Columbus LGM
                  </h3>
                </div>
                <ul className="space-y-4 text-[16px] md:text-[18px] leading-[1.65] text-[#1D1D1F]">
                  <li className="flex items-start gap-3"><span className="text-green-600 mt-0.5">✔</span> Highest fidelity and fresh data</li>
                  <li className="flex items-start gap-3"><span className="text-green-600 mt-0.5">✔</span> Understands space and coordinates</li>
                  <li className="flex items-start gap-3"><span className="text-green-600 mt-0.5">✔</span> Spatial and contextual reasoning</li>
                  <li className="flex items-start gap-3"><span className="text-green-600 mt-0.5">✔</span> Produces maps and visuals</li>
                  <li className="flex items-start gap-3"><span className="text-green-600 mt-0.5">✔</span> Built for physical world, enterprises</li>
                </ul>
              </div>

              {/* Generic AI */}
              <div style={differ.anim(200)}>
                <h3 className="text-[24px] md:text-[28px] font-medium text-[#1D1D1F] mb-6" style={{ letterSpacing: "-0.02em" }}>
                  Generic AI
                </h3>
                <ul className="space-y-4 text-[16px] md:text-[18px] leading-[1.65] text-[#1D1D1F]">
                  <li className="flex items-start gap-3"><span className="text-[#1D1D1F] mt-0.5">✖</span> Regurgitates old articles about areas</li>
                  <li className="flex items-start gap-3"><span className="text-[#1D1D1F] mt-0.5">✖</span> Hallucinates coordinates 60% of time</li>
                  <li className="flex items-start gap-3"><span className="text-[#1D1D1F] mt-0.5">✖</span> Limited data reach</li>
                  <li className="flex items-start gap-3"><span className="text-[#1D1D1F] mt-0.5">✖</span> Text outputs, no map or GIS</li>
                  <li className="flex items-start gap-3"><span className="text-[#1D1D1F] mt-0.5">✖</span> Built for text, consumers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </GridSection>

      {/* ════════ 5. PHILOSOPHY — Dark Section ════════ */}
      <div ref={philosophy.ref} className="relative overflow-hidden" style={{ backgroundColor: "#060810" }}>
        {/* Noise grain */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: 0.40, mixBlendMode: "multiply" }}>
          <filter id="missionNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#missionNoise)" />
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center px-8 md:px-10 py-24 md:py-36">
          <p className="text-[13px] font-bold tracking-[0.08em] uppercase mb-10" style={{ color: "rgba(255,255,255,0.4)", ...philosophy.anim(0) }}>
            OUR PHILOSOPHY
          </p>
          <p
            className="text-[20px] md:text-[24px] leading-[1.6] max-w-[600px]"
            style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400, ...philosophy.anim(100) }}
          >
            In a world full of slop, we want reality.
            <br />
            Our AI is for reality. None of our content,
            <br />
            or coding was Artificial.
          </p>
          <p
            className="text-[20px] md:text-[24px] leading-[1.6] mt-8"
            style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400, ...philosophy.anim(200) }}
          >
            Nature always prevails.
          </p>

          {/* Founder avatars */}
          <div className="flex items-center gap-5 mt-12" style={philosophy.anim(300)}>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
              <Image src="/David.png" alt="David" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
              <Image src="/Alex.jpg" alt="Alex" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
              <Image src="/Erick.png" alt="Erick" width={64} height={64} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* ════════ 6. VALUES GRID ════════ */}
      <GridSection className="bg-transparent!">
        <div ref={values.ref}>
          <div className="grid md:grid-cols-3">
            {[
              { label: "Real Data", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
              { label: "Spatial Intelligence", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud." },
              { label: "Accessible", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit." },
            ].map((v, i) => (
              <div
                key={v.label}
                className="px-8 md:px-10 py-12 md:py-16"
                style={{ borderRight: i < 2 ? gl : "none", borderBottom: gl, ...values.anim(i * 100) }}
              >
                <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#0A1344] mb-4">{v.label}</p>
                <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#6E6E73]" style={{ fontWeight: 400 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </GridSection>

      {/* ════════ CTA ════════ */}
      <div className="flex justify-center py-16 md:py-24">
        <Link
          href="/contact"
          className="group flex items-center justify-between gap-5 leading-none hover:opacity-90 transition-opacity"
          style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, backgroundColor: "#000000", color: "white" }}
        >
          <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Contact</span>
          <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
