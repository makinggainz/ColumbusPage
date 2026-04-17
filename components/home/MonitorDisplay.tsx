import Image from "next/image";

export function MonitorDisplay() {
  return (
    <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column" }}>
      {/* Monitor frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          backgroundColor: "#1D1D1F",
          borderRadius: "clamp(10px, 1.4vw, 18px)",
          padding: "clamp(4px, 0.6vw, 8px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        {/* Screen area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 10",
            borderRadius: "clamp(3px, 0.4vw, 6px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
          }}
        >
          {/* Title bar */}
          <div style={{
            height: "6%", minHeight: 18,
            backgroundColor: "#F5F5F7",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex", alignItems: "center",
            paddingLeft: "1.5%", gap: "0.55%", flexShrink: 0, position: "relative",
          }}>
            {(["#FF5F57", "#FFBD2E", "#28C840"] as const).map(c => (
              <div key={c} style={{ width: "1.3%", aspectRatio: "1", minWidth: 6, borderRadius: "50%", backgroundColor: c }} />
            ))}
            <div style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              height: "62%", width: "20%", minWidth: 50,
              backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "clamp(5px,0.55vw,8px)", color: "rgba(0,0,0,0.35)", userSelect: "none" }}>columbus.earth/pro</span>
            </div>
          </div>

          {/* App navbar */}
          <div style={{
            height: "7%", minHeight: 20,
            backgroundColor: "#fff",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex", alignItems: "center",
            paddingLeft: "1.2%", paddingRight: "1.5%",
            flexShrink: 0, gap: "0.8%",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25vw", marginRight: "0.6%" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "clamp(6px,0.9vw,12px)", height: "1px", backgroundColor: "#0A1344" }} />)}
            </div>
            <div style={{ width: "clamp(8px,1.1vw,14px)", height: "clamp(8px,1.1vw,14px)", borderRadius: "50%", backgroundColor: "#0A1344", opacity: 0.85 }} />
            <span style={{ fontSize: "clamp(6px,0.65vw,9px)", fontWeight: 600, color: "#0A1344", letterSpacing: "-0.01em" }}>Columbus</span>
            <span style={{ fontSize: "clamp(5px,0.55vw,8px)", color: "rgba(0,0,0,0.3)" }}>/</span>
            <span style={{ fontSize: "clamp(5px,0.55vw,8px)", color: "rgba(0,0,0,0.3)" }}>untitled chat</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.8%" }}>
              {["Report View", "Save Mapshot"].map(label => (
                <div key={label} style={{
                  height: "clamp(10px,1.2vw,16px)",
                  paddingLeft: "0.5%", paddingRight: "0.5%",
                  border: "1px solid rgba(10,19,68,0.15)",
                  borderRadius: 2,
                  display: "flex", alignItems: "center",
                  fontSize: "clamp(4px,0.5vw,7px)", color: "#0A1344",
                  whiteSpace: "nowrap",
                }}>{label}</div>
              ))}
            </div>
          </div>

          {/* App body */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
            {/* Icon sidebar */}
            <div style={{
              width: "4.5%", minWidth: 14,
              backgroundColor: "#fff",
              borderRight: "1px solid rgba(0,0,0,0.06)",
              display: "flex", flexDirection: "column",
              alignItems: "center", paddingTop: "2%", gap: "1.8%",
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: "55%", maxWidth: 10 }}>
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
              </svg>
              <div style={{ width: "55%", maxWidth: 10, aspectRatio: "1", borderRadius: "50%", backgroundColor: "#0A1344" }} />
            </div>

            {/* Chat panel */}
            <div style={{
              width: "30%",
              backgroundColor: "#fff",
              borderRight: "1px solid rgba(0,0,0,0.06)",
              display: "flex", flexDirection: "column",
              flexShrink: 0,
            }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8% 6%" }}>
                <span style={{ fontSize: "clamp(6px,0.7vw,10px)", fontWeight: 500, color: "#0A1344", letterSpacing: "-0.01em" }}>
                  Where should we begin?
                </span>
              </div>
              <div style={{
                height: "11%", minHeight: 16,
                borderTop: "1px solid rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center",
                paddingLeft: "5%", paddingRight: "3%",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: "clamp(5px,0.55vw,8px)", color: "rgba(0,0,0,0.3)", flex: 1 }}>Ask Columbus</span>
                <div style={{
                  width: "clamp(10px,1.3vw,18px)", height: "clamp(10px,1.3vw,18px)",
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
              <Image src="/enterprise/mapchat.png" alt="" fill className="object-cover object-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Monitor stand */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          width: "clamp(60px, 10%, 100px)",
          height: "clamp(30px, 4vw, 50px)",
          background: "linear-gradient(180deg, #2A2A2C 0%, #3A3A3C 100%)",
        }} />
      </div>
    </div>
  );
}
