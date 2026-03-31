"use client";

import { ThumbsUp, ThumbsDown, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { GridSection, gl } from "./ContentGrid";

const AVATARS = [
  "https://i.pravatar.cc/64?img=1",
  "https://i.pravatar.cc/64?img=5",
  "https://i.pravatar.cc/64?img=8",
  "https://i.pravatar.cc/64?img=12",
  "https://i.pravatar.cc/64?img=15",
  "https://i.pravatar.cc/64?img=20",
  "https://i.pravatar.cc/64?img=25",
  "https://i.pravatar.cc/64?img=32",
  "https://i.pravatar.cc/64?img=36",
  "https://i.pravatar.cc/64?img=41",
  "https://i.pravatar.cc/64?img=44",
  "https://i.pravatar.cc/64?img=47",
  "https://i.pravatar.cc/64?img=49",
  "https://i.pravatar.cc/64?img=52",
  "https://i.pravatar.cc/64?img=56",
  "https://i.pravatar.cc/64?img=60",
  "https://i.pravatar.cc/64?img=63",
  "https://i.pravatar.cc/64?img=68",
];

const MAPS = [
  {
    title: "Coolest Date Night Spots",
    description: "Moody lighting, great cocktails, and vibes that actually impress. Curated by locals who've done the research.",
    location: "Philadelphia, PA",
    upvotes: 842, downvotes: 67,
    emoji: "🕯️",
    gradient: "linear-gradient(135deg, #020617 0%, #1E3A8A 55%, #2563EB 100%)",
    accent: "#2563EB",
    avatars: [AVATARS[0], AVATARS[1], AVATARS[2]],
  },
  {
    title: "Best Valentine's Day Restaurants",
    description: "No cringe, no overpriced prix fixe. Just genuinely romantic spots worth booking.",
    location: "New York, NY",
    upvotes: 1247, downvotes: 89,
    emoji: "🌹",
    gradient: "linear-gradient(135deg, #0A1628 0%, #1D4ED8 55%, #60A5FA 100%)",
    accent: "#60A5FA",
    avatars: [AVATARS[3], AVATARS[4], AVATARS[5]],
  },
  {
    title: "Most Expensive Neighborhoods",
    description: "A visual breakdown of DC's priciest zip codes — where the money lives and what it looks like.",
    location: "Washington, DC",
    upvotes: 384, downvotes: 41,
    emoji: "💰",
    gradient: "linear-gradient(135deg, #030712 0%, #0A1344 55%, #3B82F6 100%)",
    accent: "#3B82F6",
    avatars: [AVATARS[6], AVATARS[7], AVATARS[8]],
  },
  {
    title: "TikTok Famous Restaurants",
    description: "Every place that went viral this year, mapped so you can actually find them.",
    location: "Los Angeles, CA",
    upvotes: 2103, downvotes: 154,
    emoji: "🎵",
    gradient: "linear-gradient(135deg, #020617 0%, #172554 45%, #2563EB 80%, #93C5FD 100%)",
    accent: "#93C5FD",
    avatars: [AVATARS[9], AVATARS[10], AVATARS[11]],
  },
  {
    title: "Queer Parks & Hangouts",
    description: "Community-built guide to the parks, plazas, and outdoor spots where you belong.",
    location: "Washington, DC",
    upvotes: 679, downvotes: 28,
    emoji: "🏳️‍🌈",
    gradient: "linear-gradient(135deg, #0A1628 0%, #1E40AF 50%, #3B82F6 80%, #93C5FD 100%)",
    accent: "#93C5FD",
    avatars: [AVATARS[12], AVATARS[13], AVATARS[14]],
  },
  {
    title: "Hidden Rooftop Bars",
    description: "The ones without signs, without reservations, and without tourists. Locals only — until now.",
    location: "Chicago, IL",
    upvotes: 516, downvotes: 73,
    emoji: "🌆",
    gradient: "linear-gradient(135deg, #030712 0%, #0F172A 50%, #1E3A8A 100%)",
    accent: "#2563EB",
    avatars: [AVATARS[15], AVATARS[16], AVATARS[17]],
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
          <h2 className="font-medium tracking-[-0.02em] text-[20px] lg:text-[25px] text-[#6E6E73]">
            Generated Maps
          </h2>
        </div>

        {/* Scrollable row */}
        <div
          className="flex overflow-x-auto px-6 pb-12 gap-5 select-none"
          style={{ scrollbarWidth: "none", ...anim(150) }}
        >
          {MAPS.map((item, i) => (
            <Link key={i} href="/maps-gpt" className="group flex flex-col shrink-0 rounded-lg overflow-hidden transition-colors duration-300" style={{ width: 260, border: "0.8px solid var(--grid-line)", background: "rgba(37, 99, 235, 0.06)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(37, 99, 235, 0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(37, 99, 235, 0.06)")}
            >
              {/* Gradient visual */}
              <div
                className="relative w-full flex items-center justify-center overflow-hidden rounded-lg"
                style={{ aspectRatio: "4 / 3", background: item.gradient }}
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

                {/* Upvote / Downvote badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className="h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-sm">
                    <ThumbsUp className="w-3 h-3 shrink-0 text-[#22C55E]" />
                    <span className="font-semibold text-[12px] text-[#1D1D1F]">{item.upvotes}</span>
                  </div>
                  <div className="h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-sm">
                    <ThumbsDown className="w-3 h-3 shrink-0 text-[#EF4444]" />
                    <span className="font-semibold text-[12px] text-[#1D1D1F]">{item.downvotes}</span>
                  </div>
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
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#6E6E73]" />
                  <span className="text-[13px] text-[#6E6E73]">{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {item.avatars.map((src, j) => (
                      <img
                        key={j}
                        src={src}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-white"
                      />
                    ))}
                  </div>
                  <span className="text-[12px] text-[#6E6E73] font-medium">{item.upvotes + item.downvotes} votes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GridSection>
  );
};
