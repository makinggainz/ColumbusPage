"use client";

import Image from "next/image";

export default function ChatSection() {
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col items-center"
      style={{ backgroundColor: "#1a1a1a", paddingTop: 140, paddingBottom: 0 }}
    >
      {/* Background image — same as hero */}
      <Image
        src="/ProductBackgroundImageHome.png"
        alt=""
        fill
        className="object-cover object-center"
        style={{ opacity: 0.45 }}
      />
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.45) 100%)",
          zIndex: 1,
        }}
        aria-hidden
      />

      {/* Heading */}
      <h2
        className="relative z-10 font-medium text-center text-[28px] md:text-[36px] lg:text-[48px] leading-[1.15] tracking-[-0.02em] text-white px-6"
      >
        Chat with us now about Columbus Pro
      </h2>

      {/* Button */}
      <button
        type="button"
        className="relative z-10 group mt-8 flex items-center gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300 cursor-pointer"
        style={{ fontSize: 14, fontWeight: 500, height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.18)" }}
      >
        <span className="transition-colors duration-300 group-hover:text-[#6BA3FF]">Get in touch</span>
        <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#6BA3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l5 5-5 5" />
        </svg>
      </button>

      {/* Monitor — top 50% visible, popping from bottom */}
      <div
        className="relative z-10 flex justify-center w-full"
        style={{ marginTop: 80, paddingLeft: 20, paddingRight: 20, height: 340, overflow: "hidden" }}
      >
        <div style={{ width: "100%", maxWidth: 1100, position: "relative" }}>
          {/* Monitor frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "#1D1D1F",
              borderRadius: "clamp(12px, 1.6vw, 24px) clamp(12px, 1.6vw, 24px) 0 0",
              padding: "clamp(6px, 0.8vw, 12px)",
              paddingBottom: 0,
              boxShadow: "0 -20px 60px rgba(0,0,0,0.30), 0 -6px 20px rgba(0,0,0,0.15)",
            }}
          >
            {/* Screen area */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: "clamp(4px, 0.5vw, 8px) clamp(4px, 0.5vw, 8px) 0 0",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
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
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3vw", marginRight: "0.6%" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: "clamp(8px,1.1vw,14px)", height: "1px", backgroundColor: "#0A1344" }} />)}
                </div>
                <div style={{ width: "clamp(10px,1.4vw,18px)", height: "clamp(10px,1.4vw,18px)", borderRadius: "50%", backgroundColor: "#0A1344", opacity: 0.85 }} />
                <span style={{ fontSize: "clamp(7px,0.75vw,11px)", fontWeight: 600, color: "#0A1344", letterSpacing: "-0.01em" }}>Columbus</span>
                <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.35)" }}>/</span>
                <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.45)" }}>untitled chat</span>
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
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8% 6%" }}>
                    <span style={{ fontSize: "clamp(7px,0.85vw,13px)", fontWeight: 500, color: "#0A1344", letterSpacing: "-0.01em" }}>
                      Where should we begin?
                    </span>
                  </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
