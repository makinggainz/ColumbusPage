"use client";

import { Star, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { GridSection, GridHeader } from "./ContentGrid";

const FAVORITE_SPOTS_FILES = ["(20).jpeg", "(14).jpeg", "(17).jpeg", "(19).jpeg", "(21).jpeg", "(23).jpeg", "(24).jpeg", "(22).jpeg"];
const spotImageSrc = (filename: string) => `/FavoriteSpots/${encodeURIComponent(filename)}`;

const SPOTS: { title: string; description: string; location: string; rating: string; image?: string }[] = [
  { title: "The Palm Hotel", description: "Luxury hotel with unique aquarium restaurant. Great food, and a great view.", location: "Dubai, UAE", rating: "4.2", image: FAVORITE_SPOTS_FILES[0] },
  { title: "Sky Garden Lounge", description: "Rooftop bar with panoramic city views. Perfect for sunset drinks.", location: "London, UK", rating: "4.5", image: FAVORITE_SPOTS_FILES[1] },
  { title: "Casa del Mar", description: "Beachfront dining with fresh seafood and Mediterranean cuisine.", location: "Barcelona, Spain", rating: "4.8", image: FAVORITE_SPOTS_FILES[2] },
  { title: "Temple of Dawn", description: "Historic temple with riverside views. Best visited at golden hour.", location: "Bangkok, Thailand", rating: "4.6", image: FAVORITE_SPOTS_FILES[3] },
  { title: "Alpine Lodge", description: "Cozy mountain retreat with fireplace and mountain views.", location: "Zermatt, Switzerland", rating: "4.4", image: FAVORITE_SPOTS_FILES[4] },
  { title: "Harbor Lights", description: "Waterfront restaurant known for lobster and harbor views.", location: "Boston, USA", rating: "4.3", image: FAVORITE_SPOTS_FILES[5] },
  { title: "Sakura Garden", description: "Traditional Japanese garden with tea house and cherry blossoms.", location: "Kyoto, Japan", rating: "4.9", image: FAVORITE_SPOTS_FILES[6] },
  { title: "Rooftop Vineyard", description: "Urban vineyard with wine tastings and city skyline.", location: "Cape Town, South Africa", rating: "4.1", image: FAVORITE_SPOTS_FILES[7] },
  { title: "Coral Reef Bar", description: "Underwater-themed bar with aquariums and tropical cocktails.", location: "Miami, USA", rating: "4.0", image: FAVORITE_SPOTS_FILES[0] },
  { title: "Northern Lights Cabin", description: "Glass cabin for aurora viewing. Cozy and unforgettable.", location: "Tromsø, Norway", rating: "4.7", image: FAVORITE_SPOTS_FILES[1] },
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
    <GridSection>
      <GridHeader
        title="Unique spots people are favoriting"
        subtitle="Curated places discovered through MapsGPT."
      />

      <div
        ref={ref}
        style={{ overflow: "hidden" }}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-auto py-0 select-none"
          style={{
            scrollbarWidth: "none",
            cursor: isDragging ? "grabbing" : "grab",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 0.15s",
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
      </div>
    </GridSection>
  );
};

function SpotCard({ spot }: { spot: (typeof SPOTS)[0] }) {
  return (
    <div
      className="flex flex-col shrink-0 overflow-hidden bg-white"
      style={{ width: 300 }}
    >
      <div className="relative w-full h-48 overflow-hidden bg-[#F5F5F7] shrink-0">
        {spot.image && (
          <img
            src={spotImageSrc(spot.image)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3 h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md">
          <Star className="w-3.5 h-3.5 shrink-0 text-[#E46962]" fill="#E46962" />
          <span className="font-semibold text-[13px] text-[#1D1D1F]">{spot.rating}</span>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[17px] text-[#1D1D1F] tracking-[-0.01em] mb-1.5">
          {spot.title}
        </h3>
        <p className="text-[14px] leading-[1.47] text-[#6E6E73] line-clamp-2 mb-3">
          {spot.description}
        </p>
        <div className="flex items-center gap-2 mt-auto">
          <MapPin className="w-4 h-4 shrink-0 text-[#6E6E73]" />
          <span className="text-[14px] text-[#6E6E73]">{spot.location}</span>
        </div>
      </div>
    </div>
  );
}
