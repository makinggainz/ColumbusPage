"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GridSection, GridHeader, GridCell, gl } from "./ContentGrid";

const LOGOS = [
  "/Icon/logo1.png",
  "/Icon/logo2.png",
  "/Icon/image1.png",
  "/Icon/logo4.png",
  "/Icon/image2.png",
  "/Icon/logo6.png",
  "/Icon/logo7.png",
];

const TINT = "grayscale(100%) sepia(40%) hue-rotate(190deg) saturate(120%)";

export const PartnerStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <GridSection>
      <div ref={ref}>
        <GridHeader
          label="DATA PARTNERS"
          title="High-fidelity and smart datasets"
          subtitle="We vet our data with reputable partner organizations"
        />

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {LOGOS.map((src, i) => (
            <GridCell key={i} style={anim(i * 50 + 100)}>
              <div className="flex items-center justify-center h-16">
                <Image
                  src={src}
                  alt=""
                  width={175}
                  height={62}
                  className="object-contain h-8 w-auto"
                  style={{ filter: TINT, opacity: 0.5 }}
                />
              </div>
            </GridCell>
          ))}
        </div>
      </div>
    </GridSection>
  );
};
