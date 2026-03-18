"use client";

import { Star, MapPin } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useRef, useState } from "react";

const FAVORITE_SPOTS_FILES = ["(20).jpeg", "(14).jpeg", "(17).jpeg", "(19).jpeg", "(21).jpeg", "(23).jpeg", "(24).jpeg", "(22).jpeg"];
const spotImageSrc = (filename: string) => `/FavoriteSpots/${encodeURIComponent(filename)}`;

const SPOTS: { title: string; description: string; location: string; rating: string; image?: string }[] = [
  { title: "The Palm Hotel", description: "Luxury hotel, with unique aquarium restaurant. Great food, and a great view.", location: "Dubai, UAE", rating: "4.2", image: FAVORITE_SPOTS_FILES[0] },
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    <section className="bg-[#07112A] py-20 md:py-28 lg:py-32 overflow-hidden relative">
      <Container className="mb-6 md:mb-8">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
          Unique spots people are favoriting
        </h2>
      </Container>

      <div className="w-full relative min-h-120">
        <div
          className="absolute inset-0 w-full h-120 top-0 left-0"
          style={{
            background: "linear-gradient(270deg, rgba(0, 255, 38, 0.2) 0%, rgba(33, 140, 206, 0.4) 51.15%, rgba(199, 32, 32, 0.3) 100%)",
          }}
          aria-hidden
        />
        {/* Top fade */}
        <div
          className="absolute left-0 top-0 w-full pointer-events-none z-20"
          style={{
            height: "180px",
            background: "linear-gradient(to bottom, #07112A 0%, rgba(7,17,42,0.85) 30%, rgba(7,17,42,0.4) 65%, rgba(7,17,42,0) 100%)",
          }}
          aria-hidden
        />
        {/* Bottom fade */}
        <div
          className="absolute left-0 bottom-0 w-full pointer-events-none z-20"
          style={{
            height: "180px",
            background: "linear-gradient(to top, #07112A 0%, rgba(7,17,42,0.85) 30%, rgba(7,17,42,0.4) 65%, rgba(7,17,42,0) 100%)",
          }}
          aria-hidden
        />
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto py-6 px-6 relative z-30 select-none"
          style={{
            scrollbarWidth: "none",
            cursor: isDragging ? "grabbing" : "grab",
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
    <div className="unique-spots-card flex flex-col shrink-0 rounded-[14px] bg-white/10 overflow-hidden relative px-4.5 pt-4.75 pb-4 transition-transform duration-200 ease-out hover:scale-[1.03]">
      {/* Image area: 462×170, radius 11px (design) */}
      <div className="relative w-full max-w-115.5 h-42.5 rounded-[11px] overflow-hidden bg-white/10 shrink-0">
        {spot.image ? (
          <img
            src={spotImageSrc(spot.image)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
        {/* Rating pill: top-right */}
        <div
          className="absolute top-2.25 right-2.25 h-7 pl-2 pr-2 flex items-center gap-1 rounded-[14px]"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <Star className="w-4.25 h-4.25 shrink-0 text-[#E46962]" fill="#E46962" />
          <span className="font-semibold text-base leading-[140%] tracking-[-0.02em] text-white">
            {spot.rating}
          </span>
        </div>
      </div>

      {/* Title, description, location */}
      <h3 className="mt-2.25 font-semibold text-xl leading-[140%] tracking-[-0.02em] text-white shrink-0">
        {spot.title}
      </h3>
      <p className="mt-2 text-xl leading-[140%] tracking-[-0.02em] text-white/70 font-normal line-clamp-2 shrink-0">
        {spot.description}
      </p>
      <div className="mt-2 flex items-center gap-2 opacity-70 shrink-0">
        <MapPin className="w-6 h-6 shrink-0 text-white" />
        <span className="text-xl leading-[140%] tracking-[-0.02em] text-white">{spot.location}</span>
      </div>
    </div>
  );
}
