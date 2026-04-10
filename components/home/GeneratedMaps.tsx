"use client";

import { ThumbsUp, ThumbsDown, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
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
    image: "/FavoriteSpots/(20).jpeg",
    avatars: [AVATARS[0], AVATARS[1], AVATARS[2]],
  },
  {
    title: "Best Valentine's Day Restaurants",
    description: "No cringe, no overpriced prix fixe. Just genuinely romantic spots worth booking.",
    location: "New York, NY",
    upvotes: 1247, downvotes: 89,
    emoji: "🌹",
    image: "/FavoriteSpots/(14).jpeg",
    avatars: [AVATARS[3], AVATARS[4], AVATARS[5]],
  },
  {
    title: "Most Expensive Neighborhoods",
    description: "A visual breakdown of DC's priciest zip codes — where the money lives and what it looks like.",
    location: "Washington, DC",
    upvotes: 384, downvotes: 41,
    emoji: "💰",
    image: "/FavoriteSpots/(17).jpeg",
    avatars: [AVATARS[6], AVATARS[7], AVATARS[8]],
  },
  {
    title: "TikTok Famous Restaurants",
    description: "Every place that went viral this year, mapped so you can actually find them.",
    location: "Los Angeles, CA",
    upvotes: 2103, downvotes: 154,
    emoji: "🎵",
    image: "/FavoriteSpots/(19).jpeg",
    avatars: [AVATARS[9], AVATARS[10], AVATARS[11]],
  },
  {
    title: "Queer Parks & Hangouts",
    description: "Community-built guide to the parks, plazas, and outdoor spots where you belong.",
    location: "Washington, DC",
    upvotes: 679, downvotes: 28,
    emoji: "🏳️‍🌈",
    image: "/FavoriteSpots/(21).jpeg",
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
          label=""
          title="Community-curated maps"
          subtitle="Discover maps made by real people about the places they love."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {MAPS.map((item, i) => (
            <GridCell key={i} flush hoverable={false} style={anim(i * 60 + 150)}>
              <a href="/maps-gpt" className="group block">
                {/* Blurred image visual */}
                <div
                  className="relative w-full flex items-center justify-center overflow-hidden"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                    style={{ filter: "blur(8px) brightness(0.7)", transform: "scale(1.1)" }}
                  />

                  <span className="relative z-10 select-none drop-shadow-lg" style={{ fontSize: 40 }}>{item.emoji}</span>

                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <div className="h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md">
                      <ThumbsUp className="w-3 h-3 shrink-0 text-[#22C55E]" />
                      <span className="font-semibold text-[12px] text-[#1D1D1F]">{item.upvotes}</span>
                    </div>
                    <div className="h-7 px-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md">
                      <ThumbsDown className="w-3 h-3 shrink-0 text-[#EF4444]" />
                      <span className="font-semibold text-[12px] text-[#1D1D1F]">{item.downvotes}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
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
                        <img key={j} src={src} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-white" />
                      ))}
                    </div>
                    <span className="text-[13px] text-[#6E6E73] font-medium">{item.upvotes + item.downvotes} votes</span>
                  </div>
                </div>
              </a>
            </GridCell>
          ))}

          {/* Find more CTA cell */}
          <GridCell style={anim(MAPS.length * 60 + 150)}>
            <div className="flex flex-col items-center justify-center h-full py-16">
              <a
                href="/maps-gpt"
                className="group flex items-center gap-3 text-[15px] font-medium text-[#0A1344] transition-opacity hover:opacity-60"
              >
                Find more
                <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1l5 5-5 5" />
                </svg>
              </a>
            </div>
          </GridCell>
        </div>
      </div>
    </GridSection>
  );
};
