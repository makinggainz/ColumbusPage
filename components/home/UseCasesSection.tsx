"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const useCases = [
  {
    title: "Defence & Security",
    description: "Monitor terrain changes, track infrastructure development, and detect anomalies across vast operational areas in near real-time.",
    route: "M 20 80 Q 60 20, 100 50 T 180 30",
  },
  {
    title: "Urban Planning",
    description: "Model urban growth patterns, assess development impact, and plan infrastructure expansion with geospatial intelligence.",
    route: "M 20 30 Q 50 70, 100 40 T 180 70",
  },
  {
    title: "Climate & Environment",
    description: "Track deforestation, coastal erosion, glacier retreat, and carbon footprint changes across global ecosystems.",
    route: "M 20 50 C 60 10, 120 90, 180 50",
  },
  {
    title: "Consumer Intelligence",
    description: "Understand location-based market dynamics, foot traffic patterns, and site selection signals at granular precision.",
    route: "M 20 60 Q 80 10, 100 60 T 180 40",
  },
];

/* ── Journey path SVG with animated dots ── */
const JourneyPath = ({ route, index, active }: { route: string; index: number; active: boolean }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
    {/* Map-like surface lines */}
    {[25, 50, 75].map((y) => (
      <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#0A1344" strokeWidth="0.2" opacity="0.06" />
    ))}
    {[50, 100, 150].map((x) => (
      <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="#0A1344" strokeWidth="0.2" opacity="0.06" />
    ))}

    {/* Route path */}
    <path
      d={route}
      fill="none"
      stroke="#0A1344"
      strokeWidth="0.8"
      opacity={active ? 0.15 : 0.08}
      style={{ transition: "opacity 0.5s ease" }}
    />

    {/* Moving dot along the path */}
    <circle r="2" fill="#0A1344" opacity={active ? 0.4 : 0.15} style={{ transition: "opacity 0.5s ease" }}>
      <animateMotion dur={`${4 + index}s`} repeatCount="indefinite" path={route} />
    </circle>

    {/* Second dot, offset */}
    <circle r="1.2" fill="#0A1344" opacity={active ? 0.25 : 0.08} style={{ transition: "opacity 0.5s ease" }}>
      <animateMotion dur={`${4 + index}s`} begin={`${(4 + index) / 2}s`} repeatCount="indefinite" path={route} />
    </circle>

    {/* Start and end markers */}
    <circle cx="20" cy={route.includes("M 20 80") ? 80 : route.includes("M 20 30") ? 30 : route.includes("M 20 50") ? 50 : 60} r="3" fill="none" stroke="#0A1344" strokeWidth="0.6" opacity="0.2" />
    <circle cx="180" cy={route.includes("30") ? 30 : route.includes("70") ? 70 : route.includes("50") ? 50 : 40} r="3" fill="#0A1344" opacity="0.12" />
  </svg>
);

export const UseCasesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    <section className="bg-white py-[100px] md:py-[140px]">
      <div ref={ref} className="max-w-[1100px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#0A1344]/30 mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            Use Cases
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
            Every journey starts with understanding.
          </h2>
        </div>

        {/* Use case cards — stacked rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <div
              key={uc.title}
              className="group relative bg-[#F8F9FC] rounded-2xl overflow-hidden cursor-default transition-all duration-500 hover:shadow-md"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease ${0.25 + i * 0.1}s, transform 0.6s ease ${0.25 + i * 0.1}s, box-shadow 0.5s ease`,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Route visualization area */}
              <div className="relative h-[140px] overflow-hidden">
                <JourneyPath route={uc.route} index={i} active={hoveredIndex === i} />
              </div>

              {/* Content */}
              <div className="px-8 pb-8 pt-2">
                <h3 className="text-[20px] font-semibold text-[#0A1344] mb-2">{uc.title}</h3>
                <p className="text-[15px] leading-[1.6] text-[#0A1344]/50 mb-4">
                  {uc.description}
                </p>
                <Link
                  href="/use-cases"
                  className="inline-flex items-center text-[14px] font-medium text-[#0A1344]/60 group-hover:text-[#0A1344] transition-colors duration-300"
                >
                  Learn more
                  <svg className="ml-1.5 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
