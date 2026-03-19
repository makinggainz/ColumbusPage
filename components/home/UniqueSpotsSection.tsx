"use client";

import { Star, MapPin } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useRef, useState, useEffect } from "react";

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
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
    <section className="bg-black py-24 md:py-32 overflow-hidden" ref={sectionRef}>

      {/* Header */}
      <Container className="mb-10">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p className="text-[10px] font-medium tracking-[0.28em] text-white/22 uppercase mb-5">
            MapsGPT
          </p>
          <h2
            className="font-semibold text-white"
            style={{ fontSize: "clamp(24px, 3vw, 38px)", letterSpacing: "-0.025em" }}
          >
            Unique spots people are favoriting
          </h2>
        </div>
      </Container>

      {/* Scrollable cards */}
      <div className="w-full relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-20"
          style={{ background: "linear-gradient(to right, #000000 0%, transparent 100%)" }}
          aria-hidden
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-20"
          style={{ background: "linear-gradient(to left, #000000 0%, transparent 100%)" }}
          aria-hidden
        />
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-4 px-8 select-none"
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

    </section>
  );
};

function SpotCard({ spot }: { spot: (typeof SPOTS)[0] }) {
  return (
    <div
      className="flex flex-col shrink-0 overflow-hidden border border-white/[0.07] hover:border-white/15 transition-colors duration-300"
      style={{ width: 320, background: "#070D1C" }}
    >
      {/* Image area */}
      <div className="relative w-full h-44 overflow-hidden bg-white/5 shrink-0">
        {spot.image && (
          <img
            src={spotImageSrc(spot.image)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Rating pill */}
        <div
          className="absolute top-3 right-3 h-7 px-2.5 flex items-center gap-1.5"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
        >
          <Star className="w-3.5 h-3.5 shrink-0 text-[#E46962]" fill="#E46962" />
          <span className="font-semibold text-[13px] text-white">{spot.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[16px] text-white tracking-[-0.015em] mb-1.5">
          {spot.title}
        </h3>
        <p className="text-[13px] leading-[1.55] text-white/40 line-clamp-2 mb-3">
          {spot.description}
        </p>
        <div className="flex items-center gap-2 opacity-40 mt-auto">
          <MapPin className="w-4 h-4 shrink-0 text-white" />
          <span className="text-[13px] text-white">{spot.location}</span>
        </div>
      </div>
    </div>
  );
}
