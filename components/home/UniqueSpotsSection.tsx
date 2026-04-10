"use client";

import { Star, MapPin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GridSection, GridHeader, GridCell, gl } from "./ContentGrid";

const FAVORITE_SPOTS_FILES = ["(20).jpeg", "(14).jpeg", "(17).jpeg", "(19).jpeg", "(21).jpeg", "(23).jpeg", "(24).jpeg", "(22).jpeg"];
const spotImageSrc = (filename: string) => `/FavoriteSpots/${encodeURIComponent(filename)}`;

const SPOTS = [
  { title: "The Palm Hotel", location: "Dubai, UAE", rating: "4.2", image: FAVORITE_SPOTS_FILES[0], query: "Best luxury hotel with a view in Dubai?", response: "Top match — iconic palm location, aquarium dining, 4.2★", avatar: "https://i.pravatar.cc/32?img=3" },
  { title: "Sky Garden Lounge", location: "London, UK", rating: "4.5", image: FAVORITE_SPOTS_FILES[1], query: "Rooftop bar with sunset views in London?", response: "Great pick — panoramic skyline, relaxed vibe, 4.5★", avatar: "https://i.pravatar.cc/32?img=7" },
  { title: "Casa del Mar", location: "Barcelona, Spain", rating: "4.8", image: FAVORITE_SPOTS_FILES[2], query: "Most romantic restaurant in Barcelona for a date?", response: "Strong match — beachfront, fresh seafood, 4.8★", avatar: "https://i.pravatar.cc/32?img=11" },
  { title: "Temple of Dawn", location: "Bangkok, Thailand", rating: "4.6", image: FAVORITE_SPOTS_FILES[3], query: "Best spot for golden hour in Bangkok?", response: "Perfect fit — riverside temple, stunning at dusk, 4.6★", avatar: "https://i.pravatar.cc/32?img=16" },
  { title: "Alpine Lodge", location: "Zermatt, Switzerland", rating: "4.4", image: FAVORITE_SPOTS_FILES[4], query: "Cozy mountain retreat near the Matterhorn?", response: "Great match — fireplace, mountain views, 4.4★", avatar: "https://i.pravatar.cc/32?img=22" },
];

export const UniqueSpotsSection = () => {
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
    <>
      <GridSection>
        <div ref={ref}>
          <GridHeader
            label=""
            title="Spots found faster on MapsGPT"
            subtitle="AI-powered recommendations from real traveler questions."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {SPOTS.map((spot, i) => (
              <GridCell key={i} flush hoverable={false} style={anim(i * 60 + 150)}>
                <Link href="/maps-gpt" className="group block">
                  {/* Image with overlaid info */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
                    <Image
                      src={spotImageSrc(spot.image)}
                      alt={spot.title}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }} />

                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 h-6 px-2 flex items-center gap-1 bg-white/90 backdrop-blur-md">
                      <Star className="w-3 h-3 shrink-0 text-[#E46962]" fill="#E46962" />
                      <span className="font-semibold text-[12px] text-[#1D1D1F]">{spot.rating}</span>
                    </div>

                    {/* Title + location */}
                    <div className="absolute bottom-0 inset-x-0 px-6 pb-4">
                      <h3 className="font-semibold text-[17px] text-white tracking-[-0.01em] leading-tight mb-1">
                        {spot.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0 text-white/70" />
                        <span className="text-[12px] text-white/70">{spot.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat UI */}
                  <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
                    {/* AI response */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden border border-[rgba(37,99,235,0.15)]">
                        <Image src="/MapsGPT-logo.png" alt="" width={32} height={32} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[11px] font-medium mb-1 block" style={{ color: "#0066CC" }}>MapsGPT</span>
                        <p className="text-[13px] leading-[1.5] text-[#1D1D1F]">{spot.response}</p>
                      </div>
                    </div>
                    {/* Divider */}
                    <div style={{ height: 1, background: "linear-gradient(to right, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.06) 60%, transparent 100%)" }} />
                    {/* User query */}
                    <div className="flex items-start gap-3">
                      <img src={spot.avatar} alt="" className="w-8 h-8 rounded-full shrink-0 object-cover border border-[rgba(0,0,0,0.06)]" />
                      <div className="flex-1">
                        <span className="text-[11px] font-medium text-[#6E6E73] mb-1 block">You asked</span>
                        <p className="text-[13px] leading-[1.5] text-[#1D1D1F]">{spot.query}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </GridCell>
            ))}

            {/* See more CTA cell */}
            <GridCell style={anim(SPOTS.length * 60 + 150)}>
              <div className="flex flex-col items-center justify-center h-full py-16">
                <a
                  href="/maps-gpt"
                  className="group flex items-center gap-3 text-[15px] font-medium text-[#0A1344] transition-opacity hover:opacity-60"
                >
                  See more
                  <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1l5 5-5 5" />
                  </svg>
                </a>
              </div>
            </GridCell>
          </div>
        </div>
      </GridSection>

      {/* Bottom CTA bar */}
      <div style={{ borderTop: "1px solid var(--grid-line)", borderBottom: "1px solid var(--grid-line)" }}>
        <div className="grid-section relative flex flex-wrap max-w-[1287px] mx-5 md:mx-auto">
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
    </>
  );
};
