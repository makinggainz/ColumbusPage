"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* The screenshot's left-hand index. Numbered feature → one-line tagline,
   styled in the homepage system (ink title, muted caption). */
const FEATURES = [
  { title: "Map Chat", sub: "Chart your own expedition" },
  { title: "Reports", sub: "Set our fleet to discover" },
  { title: "Data Catalogue", sub: "Browse everything we've discovered" },
  { title: "Dashboard", sub: "Your captain's view" },
] as const;

const HAIRLINE = "1px solid var(--ent-border-card)";

export default function ComparisonSection() {
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
      className="relative w-full pb-16 lg:pb-24"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="ent-content-bounds px-4 md:px-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-16 items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* ── Left: feature index ── */}
        <ol className="flex flex-col gap-9 lg:gap-12 list-none m-0 p-0">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="flex gap-3">
              <span
                className="text-[15px] font-semibold tabular-nums leading-[1.4] shrink-0"
                style={{ color: "var(--ent-text-secondary)" }}
              >
                {i + 1},
              </span>
              <div>
                <h3
                  className="text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                  style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
                >
                  {f.title}
                </h3>
                <p
                  className="mt-1.5 text-[15px] leading-[1.5]"
                  style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.01em" }}
                >
                  {f.sub}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* ── Right: product display ── */}
        <div
          className="w-full overflow-hidden"
          style={{
            border: HAIRLINE,
            borderRadius: "var(--ent-radius-card)",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 1px 2px rgba(11,27,43,0.04), 0 14px 36px rgba(11,27,43,0.10)",
          }}
        >
          {/* App top bar */}
          <div
            className="flex items-center gap-3 px-5"
            style={{ height: 52, borderBottom: HAIRLINE }}
          >
            <div className="flex flex-col gap-[3px]" aria-hidden>
              {[0, 1, 2].map(k => (
                <span key={k} className="block w-[15px] h-[1.5px]" style={{ backgroundColor: "var(--ent-text-primary)" }} />
              ))}
            </div>
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 22, height: 22, backgroundColor: "var(--ent-btn-navy)" }}
              aria-hidden
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
            </span>
            <span className="text-[14px] font-semibold" style={{ color: "var(--ent-text-primary)" }}>Columbus</span>
            <span className="text-[13px]" style={{ color: "var(--ent-text-secondary)" }}>/&nbsp;&nbsp;untitled chat</span>
            <span
              className="ml-auto flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5"
              style={{ border: HAIRLINE, borderRadius: "var(--ent-radius-card)", color: "var(--ent-text-primary)" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Report
            </span>
          </div>

          {/* App body */}
          <div className="flex" style={{ height: 420 }}>
            {/* Icon rail */}
            <div
              className="flex flex-col items-center py-4 gap-5 shrink-0"
              style={{ width: 52, borderRight: HAIRLINE }}
            >
              {[
                <svg key="grid" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ent-text-secondary)" strokeWidth="1.8">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>,
                <span key="active" className="flex items-center justify-center rounded-[7px]" style={{ width: 30, height: 30, backgroundColor: "var(--ent-btn-navy)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                </span>,
                <svg key="pen" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ent-text-secondary)" strokeWidth="1.8">
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>,
                <svg key="db" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ent-text-secondary)" strokeWidth="1.8">
                  <ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
                </svg>,
              ]}
            </div>

            {/* Chat / agents panel */}
            <div className="flex-1 min-w-0 px-7 py-6 overflow-hidden">
              <div className="flex items-center gap-7" style={{ borderBottom: HAIRLINE }}>
                <span
                  className="text-[14px] font-semibold pb-2.5"
                  style={{ color: "var(--ent-text-primary)", borderBottom: "2px solid var(--ent-accent)", marginBottom: -1 }}
                >
                  Chat
                </span>
                <span className="text-[14px] pb-2.5" style={{ color: "var(--ent-text-secondary)" }}>Map Filters</span>
              </div>

              <p className="mt-7 text-[14px] font-semibold" style={{ color: "var(--ent-text-primary)" }}>General Chat</p>
              <p className="mt-6 text-[14px] font-semibold" style={{ color: "var(--ent-text-primary)" }}>Special Agents</p>

              <div className="mt-4 grid grid-cols-2 gap-3.5">
                {[0, 1, 2, 3].map(k => (
                  <div
                    key={k}
                    className="relative flex items-end"
                    style={{ border: HAIRLINE, borderRadius: "var(--ent-radius-card)", height: 88, padding: 14 }}
                  >
                    <span
                      className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-full text-[10px]"
                      style={{ width: 16, height: 16, border: HAIRLINE, color: "var(--ent-text-secondary)" }}
                    >
                      ?
                    </span>
                    <span className="text-[13px] font-medium" style={{ color: "var(--ent-text-primary)" }}>General Report</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map panel */}
            <div
              className="relative shrink-0 hidden md:block"
              style={{ width: "36%", borderLeft: HAIRLINE }}
            >
              <Image src="/business/citymap.png" alt="" fill className="object-cover object-center" />
              <span
                className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white"
                style={{ width: 26, height: 26, border: HAIRLINE }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ent-text-primary)" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
              </span>
              <span
                className="absolute bottom-3 left-3 text-[12px] font-semibold px-2 py-1 rounded-[7px] bg-white/85"
                style={{ color: "var(--ent-text-primary)" }}
              >
                Minneapolis
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
