"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { StructureGrid } from "./StructureGrid";

const QUESTION = "Where is the best place to purchase property for new company headquarters for our billion dollar company Manthano?";

type Phase = "idle" | "typing" | "done";

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

  // Intersection observer — kick off typing when section enters view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
          setTimeout(() => setPhase("typing"), 400);
        }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
    if (phase === "idle") return;
    const id = setInterval(() => setCursorOn(c => !c), 520);
    return () => clearInterval(id);
  }, [phase]);

  const showTyped = phase === "typing" || phase === "done";

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--ent-bg-light)" }}
    >
      {/* Background image — top-aligned, grayscale base */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/productbackground1.png)",
          backgroundPosition: "top center",
          backgroundSize: "100% auto",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(1)",
          transform: "scale(1.02)",
          zIndex: 0,
        }}
      />
      {/* Blue tint over the image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "var(--ent-blue-tint)", mixBlendMode: "color", opacity: 0.5, zIndex: 0 }}
      />
      {/* Fade to white at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "40%",
          background: "linear-gradient(to bottom, transparent 0%, var(--ent-bg-light) 100%)",
          zIndex: 0,
        }}
      />
      {/* Vertical structure lines — extends the grid from sections below into the hero */}
      <StructureGrid lineColor="rgba(10,19,68,0.12)" cellSize={9999} />

      {/* ── Text block ── */}
      {/* pt-[200px] restores the vertical breathing room previously
          provided by the removed ConsumerEnterpriseToggle wrapper
          (pt-32 + pill height ~43px + pb-10 ≈ 211px). */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[200px]" style={reveal(visible, 0.1)}>
        <h1
          className="text-[#1D1D1F] leading-[1.1] text-[39px] md:text-[49px] lg:text-[76px]"
          style={{ fontFamily: "var(--font-hero)", fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 900 }}
        >
          An Agentic GIS platform
        </h1>

        <p
          className="mt-5"
          style={{ fontSize: 21, color: "var(--ent-text-muted)", letterSpacing: "-0.01em", fontWeight: 400, maxWidth: 480 }}
        >
          GIS so easy, the janitor could be your new researcher
        </p>

        <Link
          href="/contact"
          className="group flex items-center gap-3 mt-8 text-[18px] lg:text-[20px] text-[#1D1D1F] font-semibold transition-opacity"
        >
          <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Talk to Founders</span>
          <svg
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            width="9" height="16" viewBox="0 0 7 12" fill="none"
            stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>

      {/* ── Desktop monitor mockup ── */}
      <div
        className="relative z-10 flex justify-center w-full"
        style={{ marginTop: "clamp(48px, 6vw, 80px)", paddingLeft: 20, paddingRight: 20, ...reveal(visible, 0.22) }}
      >
        <div style={{ width: "100%", maxWidth: 1100, display: "flex", flexDirection: "column" }}>
          {/* Monitor frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "var(--ent-bg-monitor-frame)",
              borderRadius: "clamp(12px, 1.6vw, 24px)",
              padding: "clamp(6px, 0.8vw, 12px)",
              boxShadow: "var(--ent-shadow-monitor)",
            }}
          >
            {/* Screen area */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: "clamp(4px, 0.5vw, 8px)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                opacity: 1,
                transform: "scale(1) translateY(0)",
              }}
            >

              {/* Window title bar */}
              <div style={{
                height: "6%", minHeight: 20,
                backgroundColor: "var(--ent-bg-monitor-titlebar)",
                borderBottom: `1px solid var(--ent-border-medium)`,
                display: "flex", alignItems: "center",
                paddingLeft: "1.5%", gap: "0.55%", flexShrink: 0, position: "relative",
              }}>
                {(["var(--ent-chrome-red)","var(--ent-chrome-yellow)","var(--ent-chrome-green)"] as const).map(c => (
                  <div key={c} style={{ width: "1.3%", aspectRatio: "1", minWidth: 7, borderRadius: "50%", backgroundColor: c }} />
                ))}
                <div style={{
                  position: "absolute", left: "50%", transform: "translateX(-50%)",
                  height: "62%", width: "20%", minWidth: 60,
                  backgroundColor: "var(--ent-border-subtle)", border: "1px solid var(--ent-border-subtle)",
                  borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(0,0,0,0.40)", userSelect: "none" }}>columbus.earth/pro</span>
                </div>
              </div>

              {/* App top navbar */}
              <div style={{
                height: "7%", minHeight: 22,
                backgroundColor: "#fff",
                borderBottom: "1px solid var(--ent-border-subtle)",
                display: "flex", alignItems: "center",
                paddingLeft: "1.2%", paddingRight: "1.5%",
                flexShrink: 0, gap: "0.8%",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3vw", marginRight: "0.6%" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: "clamp(8px,1.1vw,14px)", height: "1px", backgroundColor: "var(--ent-text-navy)" }} />)}
                </div>
                <div style={{ width: "clamp(10px,1.4vw,18px)", height: "clamp(10px,1.4vw,18px)", borderRadius: "50%", backgroundColor: "var(--ent-btn-navy)", opacity: 0.85 }} />
                <span style={{ fontSize: "clamp(7px,0.75vw,11px)", fontWeight: 600, color: "var(--ent-text-navy)", letterSpacing: "-0.01em" }}>Columbus</span>
                <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "var(--ent-text-muted)" }}>/</span>
                <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "var(--ent-text-muted)" }}>untitled chat</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.8%" }}>
                  {["Report View","Save Mapshot","Edits not saved"].map((label, i) => (
                    <div key={label} style={{
                      height: "clamp(12px,1.4vw,20px)",
                      paddingLeft: "0.6%", paddingRight: "0.6%",
                      border: `1px solid ${i === 2 ? "transparent" : "rgba(10,19,68,0.18)"}`,
                      borderRadius: 3,
                      display: "flex", alignItems: "center",
                      fontSize: "clamp(5px,0.58vw,9px)", color: i === 2 ? "var(--ent-text-muted)" : "var(--ent-text-navy)",
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
                  borderRight: "1px solid var(--ent-border-subtle)",
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
                    <div key="active" style={{ width: "55%", maxWidth: 12, aspectRatio: "1", borderRadius: "50%", backgroundColor: "var(--ent-btn-navy)" }} />,
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
                  borderRight: "1px solid var(--ent-border-subtle)",
                  display: "flex", flexDirection: "column",
                  flexShrink: 0, position: "relative",
                }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8% 6%" }}>
                    {showTyped ? (
                      <span style={{ fontSize: "clamp(7px,0.85vw,13px)", color: "var(--ent-text-navy)", letterSpacing: "-0.01em", lineHeight: 1.4, alignSelf: "flex-start", width: "100%" }}>
                        {typed}
                        <span style={{ opacity: cursorOn ? 1 : 0, transition: "opacity 0.1s", borderRight: "1.5px solid var(--ent-text-navy)", marginLeft: 1 }}>&nbsp;</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: "clamp(7px,0.85vw,13px)", fontWeight: 500, color: "var(--ent-text-navy)", letterSpacing: "-0.01em" }}>
                        Where should we begin?
                      </span>
                    )}
                  </div>
                  <div style={{
                    height: "11%", minHeight: 18,
                    borderTop: "1px solid var(--ent-border-subtle)",
                    display: "flex", alignItems: "center",
                    paddingLeft: "5%", paddingRight: "3%", gap: "3%",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "var(--ent-text-muted)", flex: 1 }}>Ask Columbus</span>
                    <div style={{
                      width: "clamp(12px,1.6vw,22px)", height: "clamp(12px,1.6vw,22px)",
                      borderRadius: "50%", backgroundColor: "var(--ent-btn-navy)",
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
                  <div style={{
                    position: "absolute", right: "2%", top: "50%", transform: "translateY(-50%)",
                    display: "flex", flexDirection: "column", gap: 1,
                    backgroundColor: "#fff",
                    border: "1px solid var(--ent-border-medium)",
                    borderRadius: 4, overflow: "hidden",
                  }}>
                    {["+","−"].map(s => (
                      <div key={s} style={{
                        width: "clamp(12px,1.5vw,20px)", height: "clamp(12px,1.5vw,20px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "clamp(8px,0.9vw,13px)", color: "var(--ent-text-navy)", cursor: "pointer",
                        borderBottom: s === "+" ? "1px solid var(--ent-border-medium)" : "none",
                      }}>{s}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monitor stand neck — extends to bottom of section */}
          <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
            <div style={{
              width: "clamp(80px, 10%, 130px)",
              minHeight: "clamp(40px, 5vw, 70px)",
              height: "100%",
              background: "linear-gradient(180deg, #2A2A2C 0%, #3A3A3C 100%)",
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}
