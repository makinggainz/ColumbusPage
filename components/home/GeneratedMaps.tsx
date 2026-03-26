"use client";

import { Star, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { GridSection, gl } from "./ContentGrid";

const MAPS = [
  {
    title: "Coolest Date Night Spots",
    description: "Moody lighting, great cocktails, and vibes that actually impress. Curated by locals who've done the research.",
    location: "Philadelphia, PA",
    rating: "4.8",
    emoji: "🕯️",
    gradient: "linear-gradient(135deg, #1a0a04 0%, #7C2D12 55%, #FF6A3D 100%)",
    accent: "#FF6A3D",
  },
  {
    title: "Best Valentine's Day Restaurants",
    description: "No cringe, no overpriced prix fixe. Just genuinely romantic spots worth booking.",
    location: "New York, NY",
    rating: "4.7",
    emoji: "🌹",
    gradient: "linear-gradient(135deg, #1C0C06 0%, #9A3412 55%, #FB923C 100%)",
    accent: "#FB923C",
  },
  {
    title: "Most Expensive Neighborhoods",
    description: "A visual breakdown of DC's priciest zip codes — where the money lives and what it looks like.",
    location: "Washington, DC",
    rating: "4.5",
    emoji: "💰",
    gradient: "linear-gradient(135deg, #140A04 0%, #7C2D12 55%, #EA580C 100%)",
    accent: "#EA580C",
  },
  {
    title: "TikTok Famous Restaurants",
    description: "Every place that went viral this year, mapped so you can actually find them.",
    location: "Los Angeles, CA",
    rating: "4.6",
    emoji: "🎵",
    gradient: "linear-gradient(135deg, #180B04 0%, #7C2D12 45%, #FF6A3D 80%, #FDBA74 100%)",
    accent: "#FDBA74",
  },
  {
    title: "Queer Parks & Hangouts",
    description: "Community-built guide to the parks, plazas, and outdoor spots where you belong.",
    location: "Washington, DC",
    rating: "4.9",
    emoji: "🏳️‍🌈",
    gradient: "linear-gradient(135deg, #1C0C06 0%, #9A3412 50%, #EA580C 80%, #FDBA74 100%)",
    accent: "#FDBA74",
  },
  {
    title: "Hidden Rooftop Bars",
    description: "The ones without signs, without reservations, and without tourists. Locals only — until now.",
    location: "Chicago, IL",
    rating: "4.4",
    emoji: "🌆",
    gradient: "linear-gradient(135deg, #140A04 0%, #1E0F08 50%, #7C2D12 100%)",
    accent: "#FF6A3D",
  },
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
      <div ref={ref} style={{ borderBottom: gl }}>
        {/* Heading */}
        <div className="flex items-center justify-center px-8 pt-14 pb-10" style={anim(0)}>
          <h2 className="text-[#1D1D1F] text-[36px] font-semibold tracking-[-0.02em] leading-[1.1]">
            Generated Maps
          </h2>
        </div>

        {/* 3x2 grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 px-8 md:px-16 pb-14"
          style={anim(150)}
        >
          {MAPS.map((item, i) => (
            <div key={i} className="flex flex-col rounded-lg overflow-hidden" style={{ border: "1px solid var(--grid-line)" }}>
              {/* Gradient visual */}
              <div
                className="relative w-full flex items-center justify-center overflow-hidden rounded-lg"
                style={{ aspectRatio: "16 / 10", background: item.gradient }}
              >
                {/* Street grid SVG */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" fill="none">
                  {/* City blocks — vertical streets */}
                  <line x1="48" y1="0" x2="48" y2="200" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                  <line x1="96" y1="0" x2="96" y2="200" stroke={item.accent} strokeOpacity="0.15" strokeWidth="0.75"/>
                  <line x1="152" y1="0" x2="152" y2="200" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                  <line x1="210" y1="0" x2="210" y2="200" stroke={item.accent} strokeOpacity="0.15" strokeWidth="0.75"/>
                  <line x1="268" y1="0" x2="268" y2="200" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                  {/* City blocks — horizontal streets */}
                  <line x1="0" y1="42" x2="320" y2="42" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                  <line x1="0" y1="80" x2="320" y2="80" stroke={item.accent} strokeOpacity="0.15" strokeWidth="0.75"/>
                  <line x1="0" y1="118" x2="320" y2="118" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                  <line x1="0" y1="158" x2="320" y2="158" stroke={item.accent} strokeOpacity="0.15" strokeWidth="0.75"/>
                  {/* Diagonal road */}
                  <line x1="0" y1="200" x2="320" y2="0" stroke={item.accent} strokeOpacity="0.12" strokeWidth="1.5"/>
                  {/* Curved road */}
                  <path d="M 0 100 Q 160 20 320 100" stroke={item.accent} strokeOpacity="0.18" strokeWidth="1.5"/>
                  {/* Map pins */}
                  <circle cx="152" cy="80" r="5" fill={item.accent} fillOpacity="0.9"/>
                  <circle cx="152" cy="80" r="9" fill={item.accent} fillOpacity="0.2"/>
                  <circle cx="96" cy="118" r="3.5" fill={item.accent} fillOpacity="0.7"/>
                  <circle cx="96" cy="118" r="6.5" fill={item.accent} fillOpacity="0.15"/>
                  <circle cx="268" cy="42" r="3.5" fill={item.accent} fillOpacity="0.7"/>
                  <circle cx="268" cy="42" r="6.5" fill={item.accent} fillOpacity="0.15"/>
                  {/* Block fills */}
                  <rect x="49" y="43" width="46" height="36" fill={item.accent} fillOpacity="0.06" rx="1"/>
                  <rect x="153" y="119" width="56" height="38" fill={item.accent} fillOpacity="0.06" rx="1"/>
                  <rect x="211" y="43" width="56" height="36" fill={item.accent} fillOpacity="0.08" rx="1"/>
                </svg>

                {/* Emoji */}
                <span className="relative z-10 select-none drop-shadow-lg" style={{ fontSize: 36 }}>{item.emoji}</span>

                {/* Rating badge */}
                <div className="absolute top-3 right-3 h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-sm">
                  <Star className="w-3.5 h-3.5 shrink-0 text-[#E46962]" fill="#E46962" />
                  <span className="font-semibold text-[13px] text-[#1D1D1F]">{item.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="pt-4 pb-3 px-3 flex flex-col">
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
