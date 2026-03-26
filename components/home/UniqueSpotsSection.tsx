"use client";

import { Star, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { GridSection, gl } from "./ContentGrid";

const FAVORITE_SPOTS_FILES = ["(20).jpeg", "(14).jpeg", "(17).jpeg", "(19).jpeg", "(21).jpeg", "(23).jpeg", "(24).jpeg", "(22).jpeg"];
const spotImageSrc = (filename: string) => `/FavoriteSpots/${encodeURIComponent(filename)}`;

const SPOTS: { title: string; description: string; location: string; rating: string; image: string }[] = [
  { title: "The Palm Hotel", description: "Luxury hotel, with unique aquarium restaurant. Great food, and a great view.", location: "Dubai, UAE", rating: "4.2", image: FAVORITE_SPOTS_FILES[0] },
  { title: "Sky Garden Lounge", description: "Rooftop bar with panoramic city views. Perfect for sunset drinks.", location: "London, UK", rating: "4.5", image: FAVORITE_SPOTS_FILES[1] },
  { title: "Casa del Mar", description: "Beachfront dining with fresh seafood and Mediterranean cuisine.", location: "Barcelona, Spain", rating: "4.8", image: FAVORITE_SPOTS_FILES[2] },
  { title: "Temple of Dawn", description: "Historic temple with riverside views. Best visited at golden hour.", location: "Bangkok, Thailand", rating: "4.6", image: FAVORITE_SPOTS_FILES[3] },
  { title: "Alpine Lodge", description: "Cozy mountain retreat with fireplace and stunning mountain views.", location: "Zermatt, Switzerland", rating: "4.4", image: FAVORITE_SPOTS_FILES[4] },
];

export const UniqueSpotsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
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

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0));
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <GridSection style={{ borderTop: "none" }}>
      <div ref={ref} style={{ borderBottom: gl }}>
        {/* Heading */}
        <div className="flex flex-col items-center text-center px-8 pt-14 pb-3" style={anim(0)}>
          <h2 className="text-[#1D1D1F] text-[36px] font-semibold tracking-[-0.02em] leading-[1.1]">
            Find your next hang out spot, easier
          </h2>
        </div>

        {/* Subtitle */}
        <div className="flex items-center justify-center px-8 pb-10" style={anim(100)}>
          <p className="text-[#6E6E73] text-[20px]">
            Spots found faster on MapsGPT
          </p>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto px-6 pb-12 gap-5 select-none"
          style={{
            scrollbarWidth: "none",
            cursor: isDragging ? "grabbing" : "grab",
            ...anim(200),
          }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {SPOTS.map((spot, i) => (
            <SpotCard key={i} spot={spot} />
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="grid grid-cols-2 mt-24">
          <div className="px-10 flex items-center" style={{ height: 76, borderRight: gl, backgroundColor: "rgba(255, 106, 61, 0.05)" }}>
            <p className="text-[20px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
              MapsGPT is a local guide in your pocket
            </p>
          </div>
          <a
            href="/maps-gpt"
            className="px-10 flex items-center justify-between hover:opacity-90 transition-opacity"
            style={{ height: 76, backgroundColor: "#000000" }}
          >
            <span className="text-white text-[20px] font-medium">Try it out</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#FF6A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10L10 2M10 2H4M10 2V8" />
            </svg>
          </a>
        </div>
      </div>
    </GridSection>
  );
};

function SpotCard({ spot }: { spot: (typeof SPOTS)[0] }) {
  return (
    <div className="flex flex-col shrink-0 overflow-hidden rounded-lg" style={{ width: 260, border: "1px solid var(--grid-line)" }}>
      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "4 / 3" }}>
        <img
          src={spotImageSrc(spot.image)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-sm">
          <Star className="w-3.5 h-3.5 shrink-0 text-[#E46962]" fill="#E46962" />
          <span className="font-semibold text-[13px] text-[#1D1D1F]">{spot.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-3 px-3 flex flex-col flex-1">
        <h3 className="font-semibold text-[15px] text-[#1D1D1F] tracking-[-0.01em] mb-1">
          {spot.title}
        </h3>
        <p className="text-[13px] leading-[1.5] text-[#6E6E73] line-clamp-2 mb-2">
          {spot.description}
        </p>
        <div className="flex items-center gap-1.5 mt-auto">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#6E6E73]" />
          <span className="text-[13px] text-[#6E6E73]">{spot.location}</span>
        </div>
      </div>
    </div>
  );
}
