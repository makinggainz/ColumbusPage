"use client";

import { Star, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { GridSection, gl } from "./ContentGrid";

const FAVORITE_SPOTS_FILES = ["(20).jpeg", "(14).jpeg", "(17).jpeg", "(19).jpeg", "(21).jpeg", "(23).jpeg"];
const spotImageSrc = (filename: string) => `/FavoriteSpots/${encodeURIComponent(filename)}`;

const MAPS = [
  { title: "The Palm Hotel", description: "Luxury hotel, with unique aquarium restaurant. Great food, and a great view.", location: "Dubai, UAE", rating: "4.2", image: FAVORITE_SPOTS_FILES[0] },
  { title: "Sky Garden Lounge", description: "Rooftop bar with panoramic city views. Perfect for sunset drinks.", location: "London, UK", rating: "4.5", image: FAVORITE_SPOTS_FILES[1] },
  { title: "Casa del Mar", description: "Beachfront dining with fresh seafood and Mediterranean cuisine.", location: "Barcelona, Spain", rating: "4.8", image: FAVORITE_SPOTS_FILES[2] },
  { title: "Temple of Dawn", description: "Historic temple with riverside views. Best visited at golden hour.", location: "Bangkok, Thailand", rating: "4.6", image: FAVORITE_SPOTS_FILES[3] },
  { title: "Alpine Lodge", description: "Cozy mountain retreat with fireplace and stunning mountain views.", location: "Zermatt, Switzerland", rating: "4.4", image: FAVORITE_SPOTS_FILES[4] },
  { title: "Harbor Lights", description: "Waterfront restaurant known for lobster and harbor views.", location: "Boston, USA", rating: "4.3", image: FAVORITE_SPOTS_FILES[5] },
];

export const GeneratedMaps = () => {
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

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <GridSection style={{ borderTop: "none" }}>
      <div ref={ref} style={{ borderRight: gl, borderBottom: gl }}>
        {/* Heading */}
        <div className="flex items-center justify-center px-8 pt-14 pb-10" style={anim(0)}>
          <h2 className="text-[#1D1D1F] text-[32px] md:text-[40px] font-bold tracking-[-0.02em] leading-[1.1]">
            Generated Maps
          </h2>
        </div>

        {/* 3x2 grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 px-8 md:px-16 pb-14"
          style={anim(150)}
        >
          {MAPS.map((item, i) => (
            <div key={i} className="flex flex-col">
              {/* Image */}
              <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16 / 10" }}>
                <img
                  src={spotImageSrc(item.image)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-sm">
                  <Star className="w-3.5 h-3.5 shrink-0 text-[#E46962]" fill="#E46962" />
                  <span className="font-semibold text-[13px] text-[#1D1D1F]">{item.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="pt-3 flex flex-col">
                <h3 className="font-semibold text-[15px] text-[#1D1D1F] tracking-[-0.01em] mb-1">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-[1.5] text-[#6E6E73] line-clamp-2 mb-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#6E6E73]" />
                  <span className="text-[13px] text-[#6E6E73]">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GridSection>
  );
};
