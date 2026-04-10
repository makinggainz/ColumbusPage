"use client";

import { ThumbsUp, ThumbsDown, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { GridSection, GridHeader, GridCell, gl } from "./ContentGrid";

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

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  });

  return (
    <GridSection>
      <div ref={ref}>
        <GridHeader
          label="GENERATED MAPS"
          title="Community-curated maps"
          subtitle="Discover maps made by real people about the places they love."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {MAPS.map((item, i) => (
            <GridCell key={i} flush hoverable={false} style={anim(i * 60 + 150)}>
              <a href="/maps-gpt" className="group block">
                {/* Gradient visual */}
                <div
                  className="relative w-full flex items-center justify-center overflow-hidden"
                  style={{ aspectRatio: "16 / 10", background: item.gradient }}
                >
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" fill="none">
                    <line x1="48" y1="0" x2="48" y2="200" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                    <line x1="96" y1="0" x2="96" y2="200" stroke={item.accent} strokeOpacity="0.15" strokeWidth="0.75"/>
                    <line x1="152" y1="0" x2="152" y2="200" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                    <line x1="210" y1="0" x2="210" y2="200" stroke={item.accent} strokeOpacity="0.15" strokeWidth="0.75"/>
                    <line x1="268" y1="0" x2="268" y2="200" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                    <line x1="0" y1="42" x2="320" y2="42" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                    <line x1="0" y1="80" x2="320" y2="80" stroke={item.accent} strokeOpacity="0.15" strokeWidth="0.75"/>
                    <line x1="0" y1="118" x2="320" y2="118" stroke={item.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                    <line x1="0" y1="158" x2="320" y2="158" stroke={item.accent} strokeOpacity="0.15" strokeWidth="0.75"/>
                    <line x1="0" y1="200" x2="320" y2="0" stroke={item.accent} strokeOpacity="0.12" strokeWidth="1.5"/>
                    <path d="M 0 100 Q 160 20 320 100" stroke={item.accent} strokeOpacity="0.18" strokeWidth="1.5"/>
                    <circle cx="152" cy="80" r="5" fill={item.accent} fillOpacity="0.9"/>
                    <circle cx="152" cy="80" r="9" fill={item.accent} fillOpacity="0.2"/>
                    <circle cx="96" cy="118" r="3.5" fill={item.accent} fillOpacity="0.7"/>
                    <circle cx="268" cy="42" r="3.5" fill={item.accent} fillOpacity="0.7"/>
                    <rect x="49" y="43" width="46" height="36" fill={item.accent} fillOpacity="0.06" rx="1"/>
                    <rect x="153" y="119" width="56" height="38" fill={item.accent} fillOpacity="0.06" rx="1"/>
                    <rect x="211" y="43" width="56" height="36" fill={item.accent} fillOpacity="0.08" rx="1"/>
                  </svg>

                  <span className="relative z-10 select-none drop-shadow-lg" style={{ fontSize: 40 }}>{item.emoji}</span>

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <div className="h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md">
                      <ThumbsUp className="w-3 h-3 shrink-0 text-[#22C55E]" />
                      <span className="font-semibold text-[12px] text-[#1D1D1F]">{item.upvotes}</span>
                    </div>
                    <div className="h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md">
                      <ThumbsDown className="w-3 h-3 shrink-0 text-[#EF4444]" />
                      <span className="font-semibold text-[12px] text-[#1D1D1F]">{item.downvotes}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-white" />
                    <span className="text-[12px] text-white font-medium">{item.location}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 md:p-8">
                  <h3 className="font-semibold text-[17px] text-[#1D1D1F] tracking-[-0.01em] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.5] text-[#6E6E73] mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {item.avatars.map((src, j) => (
                        <img key={j} src={src} alt="" className="w-7 h-7 rounded-full object-cover border border-white" />
                      ))}
                    </div>
                    <span className="text-[13px] text-[#6E6E73] font-medium">{item.upvotes + item.downvotes} votes</span>
                  </div>
                </div>
              </a>
            </GridCell>
          ))}
        </div>
      </div>
    </GridSection>
  );
};
