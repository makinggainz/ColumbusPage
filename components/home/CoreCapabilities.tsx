"use client";

import { useEffect, useRef, useState } from "react";

const capabilities = [
  {
    title: "Geospatial Reasoning",
    description: "Understands spatial relationships, terrain context, and infrastructure connectivity at any scale.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="16" cy="16" r="12" />
        <ellipse cx="16" cy="16" rx="6" ry="12" />
        <line x1="4" y1="16" x2="28" y2="16" />
        <line x1="16" y1="4" x2="16" y2="28" />
      </svg>
    ),
  },
  {
    title: "Temporal Analysis",
    description: "Tracks change over time — urban sprawl, environmental shifts, infrastructure decay — across decades of data.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="16" cy="16" r="12" />
        <path d="M16 8v8l5 5" />
      </svg>
    ),
  },
  {
    title: "Multi-Source Fusion",
    description: "Combines satellite imagery, LiDAR, street-level data, and open datasets into a single coherent model.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="4" y="4" width="10" height="10" rx="2" />
        <rect x="18" y="4" width="10" height="10" rx="2" />
        <rect x="4" y="18" width="10" height="10" rx="2" />
        <rect x="18" y="18" width="10" height="10" rx="2" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: "Natural Language Queries",
    description: "Ask questions about any place on Earth in plain language and receive structured, actionable answers.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M6 10a10 8 0 0 1 20 0c0 4.4-4.5 8-10 8v4" />
        <circle cx="16" cy="26" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Infrastructure Mapping",
    description: "Automatically detects and classifies roads, buildings, utilities, and networks from raw geospatial inputs.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4 28L16 4l12 24" />
        <line x1="8" y1="20" x2="24" y2="20" />
        <line x1="10" y1="24" x2="22" y2="24" />
      </svg>
    ),
  },
  {
    title: "Real-Time Intelligence",
    description: "Continuously updated models that reflect the current state of the world, not last month's snapshot.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4 24c4-8 8-4 12-12s8-4 12-8" />
        <circle cx="28" cy="4" r="2" />
        <circle cx="4" cy="24" r="2" />
      </svg>
    ),
  },
];

/* ── Coordinate-grid SVG overlay for cards ── */
const CardGridOverlay = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.035 }}>
    <defs>
      <pattern id="card-coord-grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0A1344" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#card-coord-grid)" />
  </svg>
);

export const CoreCapabilities = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#F5F5F7] py-[100px] md:py-[140px]">
      <div ref={ref} className="max-w-[1100px] mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <p
            className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#0A1344]/30 mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            Core Capabilities
          </p>
          <h2
            className="text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.1] text-[#0A1344]"
            style={{
              opacity: visible ? 1 : 0,
              filter: visible ? "blur(0px)" : "blur(6px)",
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.15s, filter 0.8s ease 0.15s, transform 0.8s ease 0.15s",
            }}
          >
            What the model sees.
          </h2>
        </div>

        {/* Grid of capability cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, i) => (
            <div
              key={cap.title}
              className="group relative bg-white rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1 cursor-default"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease ${0.2 + i * 0.08}s, transform 0.6s ease ${0.2 + i * 0.08}s, box-shadow 0.5s ease, translate 0.5s ease`,
              }}
            >
              {/* Coordinate grid overlay */}
              <CardGridOverlay />

              {/* Subtle contour arc in top-right */}
              <div className="absolute top-0 right-0 w-[120px] h-[120px] pointer-events-none" style={{ opacity: 0.04 }}>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  {[30, 50, 70, 90].map((r) => (
                    <circle key={r} cx="120" cy="0" r={r} stroke="#0A1344" strokeWidth="0.5" />
                  ))}
                </svg>
              </div>

              {/* Icon */}
              <div className="relative z-10 text-[#0A1344]/40 mb-5 transition-colors duration-300 group-hover:text-[#0A1344]/60">
                {cap.icon}
              </div>

              {/* Content */}
              <h3 className="relative z-10 text-[18px] font-semibold text-[#0A1344] mb-2">
                {cap.title}
              </h3>
              <p className="relative z-10 text-[15px] leading-[1.6] text-[#0A1344]/50">
                {cap.description}
              </p>

              {/* Bottom-left pulse dot */}
              <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-[#0A1344]/10 capability-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
