"use client";

import { useEffect, useRef, useState } from "react";
import { Star, MapPin } from "lucide-react";

const SPOTS: {
  title: string;
  location: string;
  rating: string;
  image: string;
  query: string;
  response: string;
  avatar: string;
}[] = [
  { title: "The Palm Hotel", location: "Dubai, UAE", rating: "4.2", image: "(20).jpeg", query: "Best luxury hotel with a view in Dubai?", response: "Top match — iconic palm location, aquarium dining, 4.2★", avatar: "https://i.pravatar.cc/32?img=3" },
  { title: "Sky Garden Lounge", location: "London, UK", rating: "4.5", image: "(14).jpeg", query: "Rooftop bar with sunset views in London?", response: "Great pick — panoramic skyline, relaxed vibe, 4.5★", avatar: "https://i.pravatar.cc/32?img=7" },
  { title: "Casa del Mar", location: "Barcelona, Spain", rating: "4.8", image: "(17).jpeg", query: "Most romantic restaurant in Barcelona for a date?", response: "Strong match — beachfront, fresh seafood, 4.8★", avatar: "https://i.pravatar.cc/32?img=11" },
  { title: "Temple of Dawn", location: "Bangkok, Thailand", rating: "4.6", image: "(19).jpeg", query: "Best spot for golden hour in Bangkok?", response: "Perfect fit — riverside temple, stunning at dusk, 4.6★", avatar: "https://i.pravatar.cc/32?img=16" },
  { title: "Alpine Lodge", location: "Zermatt, Switzerland", rating: "4.4", image: "(21).jpeg", query: "Cozy mountain retreat near the Matterhorn?", response: "Great match — fireplace, mountain views, 4.4★", avatar: "https://i.pravatar.cc/32?img=22" },
];

function GlassSpotCard({ spot }: { spot: (typeof SPOTS)[0] }) {
  return (
    <div
      className="flex flex-col shrink-0 overflow-hidden rounded-xl"
      style={{
        width: 240,
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Image with overlaid info */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "4 / 3" }}>
        <img
          src={`/FavoriteSpots/${encodeURIComponent(spot.image)}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }}
        />
        <div className="absolute top-3 right-3 h-6 px-2 flex items-center gap-1 rounded-sm" style={{ background: "rgba(255,255,255,0.20)", backdropFilter: "blur(8px)" }}>
          <Star className="w-3 h-3 shrink-0 text-white" fill="white" />
          <span className="font-semibold text-[12px] text-white">{spot.rating}</span>
        </div>
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
        {/* Response row */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full shrink-0 overflow-hidden" style={{ marginTop: 1 }}>
            <img src="/MapsGPT-logo.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="flex-1 rounded-lg px-2.5 py-1.5"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <p className="text-[11px] leading-[1.45] text-white/90 line-clamp-2">{spot.response}</p>
          </div>
        </div>
        {/* Query row */}
        <div className="flex items-start gap-2 flex-row-reverse">
          <img
            src={spot.avatar}
            alt=""
            className="w-6 h-6 rounded-full shrink-0 object-cover"
            style={{ marginTop: 1, border: "1px solid rgba(255,255,255,0.30)" }}
          />
          <div
            className="flex-1 rounded-lg px-2.5 py-1.5"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <p className="text-[11px] leading-[1.45] text-white/70 line-clamp-2">{spot.query}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setShowSecond(true), 1500);
          observer.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Duplicate cards for seamless infinite scroll
  const loopCards = [...SPOTS, ...SPOTS];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: 500,
        background: showSecond ? "#063140" : "#F9F9F9",
        transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* First label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center max-w-[1408px] mx-auto px-6"
        style={{
          opacity: showSecond ? 0 : 1,
          transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: showSecond ? "none" : "auto",
          zIndex: 2,
        }}
      >
        <h2 className="text-[36px] font-semibold text-[#0F6B6E] md:text-[64px]">
          We&apos;ve already answered
        </h2>
        <h2 className="mt-4 text-[36px] font-semibold text-[#0F6B6E] md:text-[64px]">
          thousands of questions!
        </h2>
      </div>

      {/* Second state: heading + glass carousel */}
      <div
        className="flex flex-col"
        style={{
          opacity: showSecond ? 1 : 0,
          transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: showSecond ? "auto" : "none",
        }}
      >
        <div className="flex items-center justify-center pt-16 pb-10 px-6 max-w-[1408px] mx-auto w-full">
          <h2 className="text-[36px] font-semibold text-white text-center md:text-[64px]">
            Thousands of adventurers<br />are using it!
          </h2>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden pb-16 px-4">
          <div className="adventurers-marquee">
            {loopCards.map((spot, i) => (
              <GlassSpotCard key={i} spot={spot} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
