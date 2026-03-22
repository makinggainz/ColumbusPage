"use client";

import { useEffect, useRef, useState } from "react";

const layers = [
  {
    label: "Application Layer",
    items: ["MapsGPT", "Market Spy", "Custom Deployments"],
    color: "rgba(10, 19, 68, 0.9)",
  },
  {
    label: "Reasoning Engine",
    items: ["Spatial Inference", "Temporal Analysis", "Multi-modal Fusion"],
    color: "rgba(10, 19, 68, 0.7)",
  },
  {
    label: "Foundation Model",
    items: ["GeoContext-1", "500B+ Parameters", "Geospatial Pre-training"],
    color: "rgba(10, 19, 68, 0.5)",
  },
  {
    label: "Data Infrastructure",
    items: ["Satellite Imagery", "LiDAR & Terrain", "Street-Level Capture", "Open Datasets"],
    color: "rgba(10, 19, 68, 0.35)",
  },
];

export const TechnologySection = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left — copy */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <p className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#0A1344]/30 mb-5">
              Technology
            </p>
            <h2 className="text-[36px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1] text-[#0A1344] mb-6">
              Built from the ground up.
            </h2>
            <p className="text-[17px] leading-[1.7] text-[#0A1344]/50 mb-5">
              Our stack is purpose-built for geospatial reasoning. Every layer —
              from raw data ingestion to real-time inference — is designed to
              handle the complexity, scale, and temporal nature of physical-world data.
            </p>
            <p className="text-[17px] leading-[1.7] text-[#0A1344]/50">
              No retrofitted language models. No off-the-shelf GIS. This is
              infrastructure engineered from first principles for the largest,
              most complex dataset on Earth.
            </p>
          </div>

          {/* Right — abstract stack diagram */}
          <div
            className="relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: "opacity 1s ease 0.3s, transform 1s ease 0.3s",
            }}
          >
            <div className="space-y-3">
              {layers.map((layer, i) => (
                <div
                  key={layer.label}
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.5s ease ${0.5 + i * 0.12}s, transform 0.5s ease ${0.5 + i * 0.12}s`,
                  }}
                >
                  <div
                    className="px-6 py-5"
                    style={{ backgroundColor: layer.color }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[13px] font-mono uppercase tracking-wider text-white/50 mb-2">
                          {layer.label}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {layer.items.map((item) => (
                            <span
                              key={item}
                              className="text-[14px] text-white/80"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Connection indicator */}
                      <div className="flex flex-col items-center gap-1 mt-1 ml-4">
                        {i < layers.length - 1 && (
                          <>
                            <div className="w-px h-3 bg-white/20" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vertical connection line on the right */}
            <div
              className="absolute right-8 top-0 bottom-0 w-px pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(10,19,68,0.15), rgba(10,19,68,0.05))",
                opacity: visible ? 1 : 0,
                transition: "opacity 1.5s ease 1s",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
