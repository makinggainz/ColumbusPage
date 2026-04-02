"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConsumerEnterpriseToggle } from "./ConsumerEnterpriseToggle";

// Globe graticule — orthographic projection, globe centre offset to top-right
function GlobeGraticule() {
  const W = 480, H = 360;
  const R = 420; // globe radius — large so only ~1/4 fits in the viewBox
  // Place globe centre near top-right so just the lower-left quadrant is visible
  const cx = W - 60, cy = 60;

  // Rotate so a mix of meridians and parallels arc nicely across the visible area
  const tiltX = 25 * (Math.PI / 180);
  const tiltY = -20 * (Math.PI / 180);

  function project(lon: number, lat: number): [number, number] | null {
    const l = lon * (Math.PI / 180);
    const p = lat * (Math.PI / 180);
    // 3D point on unit sphere
    let x = Math.cos(p) * Math.cos(l);
    let y = Math.cos(p) * Math.sin(l);
    let z = Math.sin(p);
    // Apply tilt rotations
    const y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
    const z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
    const x2 = x * Math.cos(tiltY) + z1 * Math.sin(tiltY);
    const z2 = -x * Math.sin(tiltY) + z1 * Math.cos(tiltY);
    // Only draw front hemisphere
    if (z2 < 0) return null;
    return [cx + x2 * R, cy - y1 * R];
  }

  function buildLine(points: ([number, number] | null)[]): string {
    let d = "";
    let penDown = false;
    for (const pt of points) {
      if (!pt) { penDown = false; continue; }
      if (!penDown) { d += `M ${pt[0].toFixed(1)} ${pt[1].toFixed(1)} `; penDown = true; }
      else d += `L ${pt[0].toFixed(1)} ${pt[1].toFixed(1)} `;
    }
    return d;
  }

  const steps = 90;
  const meridians: string[] = [];
  const parallels: string[] = [];

  // Meridians every 15°
  for (let lon = -180; lon < 180; lon += 15) {
    const pts = Array.from({ length: steps + 1 }, (_, i) => project(lon, -90 + i * (180 / steps)));
    const d = buildLine(pts);
    if (d) meridians.push(d);
  }

  // Parallels every 15°
  for (let lat = -75; lat <= 75; lat += 15) {
    const pts = Array.from({ length: steps + 1 }, (_, i) => project(-180 + i * (360 / steps), lat));
    const d = buildLine(pts);
    if (d) parallels.push(d);
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMaxYMin meet"
      className="absolute"
      style={{ top: 0, right: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <radialGradient id="globeFade" cx={W} cy={0} r={W * 0.9} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="white" stopOpacity="1" />
          <stop offset="60%"  stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="globeMask">
          <rect x="0" y="0" width={W} height={H} fill="url(#globeFade)" />
        </mask>
      </defs>
      <g mask="url(#globeMask)" stroke="rgba(0,102,204,0.28)" strokeWidth="1" fill="none">
        {meridians.map((d, i) => <path key={`m${i}`} d={d} />)}
        {parallels.map((d, i) => <path key={`p${i}`} d={d} />)}
      </g>
    </svg>
  );
}

const QUESTION = "Where is the best place to purchase property for new company headquarters for our billion dollar company Manthano?";

type Phase = "idle" | "opening" | "open" | "windowed" | "typing" | "done";

const reveal = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(14px)",
  transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
});

export default function EnterpriseHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [cursorOn, setCursorOn] = useState(true);

  // Intersection observer — kick off animation when section enters view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
          setTimeout(() => setPhase("opening"), 400);
        }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Phase sequencer
  useEffect(() => {
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("open"), 1100);
      return () => clearTimeout(t);
    }
    if (phase === "open") {
      const t = setTimeout(() => setPhase("windowed"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "windowed") {
      const t = setTimeout(() => setPhase("typing"), 700);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Typewriter
  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(QUESTION.slice(0, i));
      if (i >= QUESTION.length) {
        clearInterval(id);
        setPhase("done");
      }
    }, 38);
    return () => clearInterval(id);
  }, [phase]);

  // Cursor blink
  useEffect(() => {
    if (phase === "idle" || phase === "opening" || phase === "open") return;
    const id = setInterval(() => setCursorOn(c => !c), 520);
    return () => clearInterval(id);
  }, [phase]);

  const lidOpen = phase !== "idle" && phase !== "opening";
  const windowVisible = phase === "windowed" || phase === "typing" || phase === "done";
  const showTyped = phase === "typing" || phase === "done";

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#F9F9F9" }}
    >
      {/* Globe graticule — top-right corner, partial quadrant bleeding in */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{ top: 0, right: 0, width: "48%", height: "60%", zIndex: 0 }}
        aria-hidden
      >
        <GlobeGraticule />
      </div>

      {/* Radial blue gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 65% at 50% -5%, rgba(0, 102, 204, 0.32) 0%, rgba(0, 102, 204, 0.16) 55%, transparent 100%)",
          zIndex: 0,
        }}
        aria-hidden
      />
      {/* ── Toggle ── */}
      <div className="flex justify-center pt-32 pb-10 px-6" style={reveal(visible, 0)}>
        <ConsumerEnterpriseToggle variant="light" active="enterprise" />
      </div>

      {/* ── Text block ── */}
      <div className="flex flex-col items-center text-center px-6" style={reveal(visible, 0.1)}>
        <h1
          className="font-light text-[#0A1344] leading-[1.2] text-[39px] md:text-[49px] lg:text-[61px]"
          style={{ letterSpacing: "-0.02em", maxWidth: 900 }}
        >
          An Agentic GIS platform
        </h1>

        <p
          className="mt-5"
          style={{ fontSize: "clamp(15px, 1.3vw, 19px)", color: "rgba(10,19,68,0.45)", letterSpacing: "-0.01em", fontWeight: 400, maxWidth: 480 }}
        >
          GIS so easy, the janitor could be your new researcher
        </p>

        <Link
          href="/contact"
          className="flex items-center justify-center mt-8 whitespace-nowrap transition-colors duration-200"
          style={{ height: 46, paddingLeft: 28, paddingRight: 28, fontSize: 15, fontWeight: 400, color: "#0A1344", border: "1px solid rgba(10,19,68,0.30)", letterSpacing: "-0.01em", backgroundColor: "transparent" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(10,19,68,0.06)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
        >
          Talk to us
        </Link>
      </div>

      {/* ── MacBook Pro mockup ── */}
      <div
        className="relative flex justify-center w-full"
        style={{ marginTop: "clamp(48px, 6vw, 80px)", paddingLeft: "clamp(16px, 4vw, 48px)", paddingRight: "clamp(16px, 4vw, 48px)", ...reveal(visible, 0.22) }}
      >
        {/* Mockup wrapper */}
        <div style={{ width: "min(96%, 1380px)", position: "relative" }}>

          {/* ── Lid with 3D hinge ── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "63%",
              perspective: "2400px",
              perspectiveOrigin: "50% 100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "50% 100%",
                transform: lidOpen ? "rotateX(0deg)" : "rotateX(-76deg)",
                transition: phase === "opening"
                  ? "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)"
                  : phase === "idle"
                  ? "none"
                  : "none",
              }}
            >
              {/* Outer chassis */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#1D1D1F",
                  borderRadius: "clamp(10px, 1.4vw, 20px) clamp(10px, 1.4vw, 20px) 0 0",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.30), 0 12px 32px rgba(0,0,0,0.16)",
                }}
              >
                {/* Screen bezel */}
                <div
                  style={{
                    position: "absolute",
                    top: "4%",
                    left: "3%",
                    right: "3%",
                    bottom: 0,
                    backgroundColor: "#000",
                    borderRadius: "clamp(6px, 0.8vw, 10px) clamp(6px, 0.8vw, 10px) 0 0",
                    overflow: "hidden",
                  }}
                >
                  {/* Camera notch */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "clamp(10px, 1.2vw, 16px)",
                      height: "clamp(4px, 0.5vw, 7px)",
                      backgroundColor: "#1D1D1F",
                      borderRadius: "0 0 4px 4px",
                      zIndex: 10,
                    }}
                  />

                  {/* ── Desktop: wallpaper + floating app window ── */}
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>

                    {/* Wallpaper */}
                    <Image
                      src="/ProductBackgroundImageHome.png"
                      alt=""
                      fill
                      className="object-cover object-center"
                      priority
                    />

                    {/* macOS menu bar */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
                      height: "3.5%", minHeight: 14,
                      backgroundColor: "rgba(236,238,245,0.55)",
                      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                      display: "flex", alignItems: "center", paddingLeft: "1.5%", gap: "0.8%",
                    }}>
                      {["rgba(0,0,0,0.55)","rgba(0,0,0,0.25)","rgba(0,0,0,0.25)","rgba(0,0,0,0.25)","rgba(0,0,0,0.18)"].map((c, i) => (
                        <div key={i} style={{ width: `${[0.9,1.8,2.4,1.8,1.4][i]}%`, height: "45%", backgroundColor: c, borderRadius: 2, minWidth: 4 }} />
                      ))}
                    </div>

                    {/* Floating app window */}
                    <div style={{
                      position: "absolute", top: "7%", left: "4%", right: "4%", bottom: "3%",
                      zIndex: 3, borderRadius: "clamp(4px,0.5vw,8px)",
                      overflow: "hidden",
                      boxShadow: "0 16px 56px rgba(0,0,0,0.42), 0 4px 14px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.14)",
                      display: "flex", flexDirection: "column",
                      backgroundColor: "#fff",
                      opacity: windowVisible ? 1 : 0,
                      transform: windowVisible ? "scale(1) translateY(0)" : "scale(0.96) translateY(10px)",
                      transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                    }}>

                      {/* Window title bar */}
                      <div style={{
                        height: "6%", minHeight: 20,
                        backgroundColor: "#F5F5F7",
                        borderBottom: "1px solid rgba(0,0,0,0.10)",
                        display: "flex", alignItems: "center",
                        paddingLeft: "1.5%", gap: "0.55%", flexShrink: 0, position: "relative",
                      }}>
                        {(["#FF5F57","#FEBC2E","#28C840"] as const).map(c => (
                          <div key={c} style={{ width: "1.3%", aspectRatio: "1", minWidth: 7, borderRadius: "50%", backgroundColor: c }} />
                        ))}
                        <div style={{
                          position: "absolute", left: "50%", transform: "translateX(-50%)",
                          height: "62%", width: "20%", minWidth: 60,
                          backgroundColor: "rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.09)",
                          borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(0,0,0,0.40)", userSelect: "none" }}>columbus.earth/pro</span>
                        </div>
                      </div>

                      {/* App top navbar */}
                      <div style={{
                        height: "7%", minHeight: 22,
                        backgroundColor: "#fff",
                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                        display: "flex", alignItems: "center",
                        paddingLeft: "1.2%", paddingRight: "1.5%",
                        flexShrink: 0, gap: "0.8%",
                      }}>
                        {/* Hamburger */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.3vw", marginRight: "0.6%" }}>
                          {[0,1,2].map(i => <div key={i} style={{ width: "clamp(8px,1.1vw,14px)", height: "1px", backgroundColor: "#0A1344" }} />)}
                        </div>
                        {/* Logo mark */}
                        <div style={{ width: "clamp(10px,1.4vw,18px)", height: "clamp(10px,1.4vw,18px)", borderRadius: "50%", backgroundColor: "#0A1344", opacity: 0.85 }} />
                        <span style={{ fontSize: "clamp(7px,0.75vw,11px)", fontWeight: 600, color: "#0A1344", letterSpacing: "-0.01em" }}>Columbus</span>
                        <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.35)" }}>/</span>
                        <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.45)" }}>untitled chat</span>
                        {/* Right actions */}
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.8%" }}>
                          {["Report View","Save Mapshot","Edits not saved"].map((label, i) => (
                            <div key={label} style={{
                              height: "clamp(12px,1.4vw,20px)",
                              paddingLeft: "0.6%", paddingRight: "0.6%",
                              border: `1px solid ${i === 2 ? "transparent" : "rgba(10,19,68,0.18)"}`,
                              borderRadius: 3,
                              display: "flex", alignItems: "center",
                              fontSize: "clamp(5px,0.58vw,9px)", color: i === 2 ? "rgba(10,19,68,0.35)" : "#0A1344",
                              whiteSpace: "nowrap",
                            }}>{label}</div>
                          ))}
                        </div>
                      </div>

                      {/* App body */}
                      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

                        {/* Icon sidebar */}
                        <div style={{
                          width: "4.5%", minWidth: 16,
                          backgroundColor: "#fff",
                          borderRight: "1px solid rgba(0,0,0,0.07)",
                          display: "flex", flexDirection: "column",
                          alignItems: "center", paddingTop: "2%", gap: "1.8%",
                          flexShrink: 0,
                        }}>
                          {[
                            <svg key="grid" viewBox="0 0 16 16" fill="none" style={{ width: "55%", maxWidth: 12 }}>
                              <rect x="1" y="1" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                              <rect x="9" y="1" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                              <rect x="1" y="9" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                              <rect x="9" y="9" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                            </svg>,
                            <div key="active" style={{ width: "55%", maxWidth: 12, aspectRatio: "1", borderRadius: "50%", backgroundColor: "#0A1344" }} />,
                            <svg key="check" viewBox="0 0 16 16" fill="none" style={{ width: "55%", maxWidth: 12 }}>
                              <rect x="1" y="1" width="14" height="14" rx="2" stroke="#0A1344" strokeWidth="1.2" opacity="0.4"/>
                              <path d="M4 8l3 3 5-5" stroke="#0A1344" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
                            </svg>,
                            <svg key="layers" viewBox="0 0 16 16" fill="none" style={{ width: "55%", maxWidth: 12 }}>
                              <path d="M8 1L14 5L8 9L2 5L8 1Z" stroke="#0A1344" strokeWidth="1.2" opacity="0.4"/>
                              <path d="M2 9l6 4 6-4" stroke="#0A1344" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
                            </svg>,
                          ]}
                        </div>

                        {/* Chat panel */}
                        <div style={{
                          width: "30%",
                          backgroundColor: "#fff",
                          borderRight: "1px solid rgba(0,0,0,0.07)",
                          display: "flex", flexDirection: "column",
                          flexShrink: 0, position: "relative",
                        }}>
                          {/* Empty state / typed message */}
                          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8% 6%" }}>
                            {showTyped ? (
                              <span style={{ fontSize: "clamp(7px,0.85vw,13px)", color: "#0A1344", letterSpacing: "-0.01em", lineHeight: 1.4, alignSelf: "flex-start", width: "100%" }}>
                                {typed}
                                <span style={{ opacity: cursorOn ? 1 : 0, transition: "opacity 0.1s", borderRight: "1.5px solid #0A1344", marginLeft: 1 }}>&nbsp;</span>
                              </span>
                            ) : (
                              <span style={{ fontSize: "clamp(7px,0.85vw,13px)", fontWeight: 500, color: "#0A1344", letterSpacing: "-0.01em" }}>
                                Where should we begin?
                              </span>
                            )}
                          </div>
                          {/* Input bar */}
                          <div style={{
                            height: "11%", minHeight: 18,
                            borderTop: "1px solid rgba(0,0,0,0.07)",
                            display: "flex", alignItems: "center",
                            paddingLeft: "5%", paddingRight: "3%", gap: "3%",
                            flexShrink: 0,
                          }}>
                            <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.30)", flex: 1 }}>Ask Columbus</span>
                            <div style={{
                              width: "clamp(12px,1.6vw,22px)", height: "clamp(12px,1.6vw,22px)",
                              borderRadius: "50%", backgroundColor: "#0A1344",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <svg viewBox="0 0 10 10" fill="none" style={{ width: "50%" }}>
                                <path d="M2 8L8 2M8 2H4M8 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Map panel */}
                        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                          <Image
                            src="/enterprise/mapchat.png"
                            alt=""
                            fill
                            className="object-cover object-center"
                          />
                          {/* Zoom controls */}
                          <div style={{
                            position: "absolute", right: "2%", top: "50%", transform: "translateY(-50%)",
                            display: "flex", flexDirection: "column", gap: 1,
                            backgroundColor: "#fff",
                            border: "1px solid rgba(0,0,0,0.12)",
                            borderRadius: 4, overflow: "hidden",
                          }}>
                            {["+","−"].map(s => (
                              <div key={s} style={{
                                width: "clamp(12px,1.5vw,20px)", height: "clamp(12px,1.5vw,20px)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "clamp(8px,0.9vw,13px)", color: "#0A1344", cursor: "pointer",
                                borderBottom: s === "+" ? "1px solid rgba(0,0,0,0.10)" : "none",
                              }}>{s}</div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Base ── */}
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{ height: 3, backgroundColor: "#111" }} />
            <div
              style={{
                height: "clamp(16px, 2.4vw, 32px)",
                background: "linear-gradient(180deg, #2A2A2C 0%, #3A3A3C 100%)",
                borderRadius: "0 0 4px 4px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "15%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "clamp(44px, 7%, 90px)",
                  height: "42%",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 3,
                }}
              />
            </div>
            <div style={{ height: "clamp(6px, 0.9vw, 12px)", background: "linear-gradient(180deg, #3A3A3C 0%, #505052 100%)", borderRadius: "0 0 8px 8px" }} />
            <div style={{ height: "clamp(16px, 2.5vw, 32px)", background: "radial-gradient(ellipse 75% 100% at 50% 0%, rgba(0,0,0,0.20) 0%, transparent 100%)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
