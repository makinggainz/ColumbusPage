"use client";

import { Star, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { GridSection, gl } from "./ContentGrid";

const FAVORITE_SPOTS_FILES = ["(20).jpeg", "(14).jpeg", "(17).jpeg", "(19).jpeg", "(21).jpeg", "(23).jpeg", "(24).jpeg", "(22).jpeg"];
const spotImageSrc = (filename: string) => `/FavoriteSpots/${encodeURIComponent(filename)}`;

const SPOTS: { title: string; location: string; rating: string; image: string; query: string; response: string; avatar: string }[] = [
  { title: "The Palm Hotel", location: "Dubai, UAE", rating: "4.2", image: FAVORITE_SPOTS_FILES[0], query: "Best luxury hotel with a view in Dubai?", response: "Top match — iconic palm location, aquarium dining, 4.2★", avatar: "https://i.pravatar.cc/32?img=3" },
  { title: "Sky Garden Lounge", location: "London, UK", rating: "4.5", image: FAVORITE_SPOTS_FILES[1], query: "Rooftop bar with sunset views in London?", response: "Great pick — panoramic skyline, relaxed vibe, 4.5★", avatar: "https://i.pravatar.cc/32?img=7" },
  { title: "Casa del Mar", location: "Barcelona, Spain", rating: "4.8", image: FAVORITE_SPOTS_FILES[2], query: "Most romantic restaurant in Barcelona for a date?", response: "Strong match — beachfront, fresh seafood, 4.8★", avatar: "https://i.pravatar.cc/32?img=11" },
  { title: "Temple of Dawn", location: "Bangkok, Thailand", rating: "4.6", image: FAVORITE_SPOTS_FILES[3], query: "Best spot for golden hour in Bangkok?", response: "Perfect fit — riverside temple, stunning at dusk, 4.6★", avatar: "https://i.pravatar.cc/32?img=16" },
  { title: "Alpine Lodge", location: "Zermatt, Switzerland", rating: "4.4", image: FAVORITE_SPOTS_FILES[4], query: "Cozy mountain retreat near the Matterhorn?", response: "Great match — fireplace, mountain views, 4.4★", avatar: "https://i.pravatar.cc/32?img=22" },
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
        <div className="flex items-center justify-center px-8 pt-14 pb-10" style={anim(0)}>
          <h2 className="font-medium tracking-[-0.02em] text-[20px] lg:text-[25px] text-[#6E6E73]">
            Spots found faster on MapsGPT
          </h2>
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
        <div className="flex flex-wrap mt-24">
          <div className="px-8 min-[1287px]:px-10 py-5 flex items-center flex-1 min-w-70" style={{ minHeight: 76, borderRight: gl, backgroundColor: "rgba(20, 41, 148, 0.07)" }}>
            <p className="text-[18px] lg:text-[20px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
              MapsGPT is a local guide in your pocket
            </p>
          </div>
          <a
            href="/maps-gpt"
            className="group px-8 min-[1287px]:px-10 py-5 flex items-center justify-between hover:opacity-90 transition-opacity flex-1 min-w-70"
            style={{ minHeight: 76, backgroundColor: "#000000" }}
          >
            <span className="text-white text-[18px] lg:text-[20px] font-medium transition-colors duration-300 group-hover:text-[#2563EB]">Try it out</span>
            <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <Link href="/maps-gpt" className="flex flex-col shrink-0 overflow-hidden rounded-lg transition-colors duration-300" style={{ width: 260, border: "1px solid var(--grid-line)", background: "rgba(37, 99, 235, 0.06)" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(37, 99, 235, 0.14)")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(37, 99, 235, 0.06)")}
    >
      {/* Image with overlaid info */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "4 / 3" }}>
        <img
          src={spotImageSrc(spot.image)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient scrim */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }} />
        {/* Rating badge */}
        <div className="absolute top-3 right-3 h-6 px-2 flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-sm">
          <Star className="w-3 h-3 shrink-0 text-[#E46962]" fill="#E46962" />
          <span className="font-semibold text-[12px] text-[#1D1D1F]">{spot.rating}</span>
        </div>
        {/* Title + location over image */}
        <div className="absolute bottom-0 inset-x-0 px-3 pb-3">
          <h3 className="font-semibold text-[14px] text-white tracking-[-0.01em] leading-tight mb-1">
            {spot.title}
          </h3>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0 text-white/70" />
            <span className="text-[11px] text-white/70">{spot.location}</span>
          </div>
        </div>
      </div>

      {/* Chat UI */}
      <div className="px-3 pt-3 pb-3 flex flex-col gap-2">
        {/* Response row — earth + bubble */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full shrink-0 overflow-hidden" style={{ marginTop: 1 }}>
            <img src="/MapsGPT-logo.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(37,99,235,0.10)", border: "1px solid rgba(37,99,235,0.18)" }}>
            <p className="text-[11px] leading-[1.45] text-[#1D1D1F] line-clamp-2">{spot.response}</p>
          </div>
        </div>
        {/* Query row — avatar + bubble */}
        <div className="flex items-start gap-2 flex-row-reverse">
          <img src={spot.avatar} alt="" className="w-6 h-6 rounded-full shrink-0 object-cover border border-white" style={{ marginTop: 1 }} />
          <div className="flex-1 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)" }}>
            <p className="text-[11px] leading-[1.45] text-[#3C3C43] line-clamp-2">{spot.query}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
