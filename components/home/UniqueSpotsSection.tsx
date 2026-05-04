"use client";

import { useRef, useState, useEffect } from "react";
import { GridSection, gl } from "./ContentGrid";
import { QueryCard, type CardData } from "@/components/products/SeeWhatPeopleSection";
import "@/components/products/how-it-works-tokens.css";

const FAVORITE_SPOTS_FILES = ["(20).jpeg", "(14).jpeg", "(17).jpeg", "(19).jpeg", "(21).jpeg", "(23).jpeg", "(24).jpeg", "(22).jpeg"];
const spotImageSrc = (filename: string) => `/FavoriteSpots/${encodeURIComponent(filename)}`;

// Match the field shape that QueryCard (from SeeWhatPeopleSection on the
// MapsGPT page) expects so this section renders the exact same card UI.
const SPOTS: CardData[] = [
  { place: "The Palm Hotel", rating: "4.2", photo: spotImageSrc(FAVORITE_SPOTS_FILES[0]), query: "Best luxury hotel with a view in Dubai?", response: "Top match — iconic palm location, aquarium dining, 4.2★", avatar: "https://i.pravatar.cc/80?img=3" },
  { place: "Sky Garden Lounge", rating: "4.5", photo: spotImageSrc(FAVORITE_SPOTS_FILES[1]), query: "Rooftop bar with sunset views in London?", response: "Great pick — panoramic skyline, relaxed vibe, 4.5★", avatar: "https://i.pravatar.cc/80?img=7" },
  { place: "Casa del Mar", rating: "4.8", photo: spotImageSrc(FAVORITE_SPOTS_FILES[2]), query: "Most romantic restaurant in Barcelona for a date?", response: "Strong match — beachfront, fresh seafood, 4.8★", avatar: "https://i.pravatar.cc/80?img=11" },
  { place: "Temple of Dawn", rating: "4.6", photo: spotImageSrc(FAVORITE_SPOTS_FILES[3]), query: "Best spot for golden hour in Bangkok?", response: "Perfect fit — riverside temple, stunning at dusk, 4.6★", avatar: "https://i.pravatar.cc/80?img=16" },
  { place: "Alpine Lodge", rating: "4.4", photo: spotImageSrc(FAVORITE_SPOTS_FILES[4]), query: "Cozy mountain retreat near the Matterhorn?", response: "Great match — fireplace, mountain views, 4.4★", avatar: "https://i.pravatar.cc/80?img=22" },
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
    <>
      <GridSection style={{ borderTop: "none" }}>
        <div ref={ref}>
          {/* Heading */}
          <div className="flex items-center justify-center px-8 pt-14 pb-10" style={anim(0)}>
            <h2 className="font-medium tracking-[-0.02em] text-[20px] lg:text-[25px] text-[#6E6E73]">
              Spots found faster on MapsGPT
            </h2>
          </div>

          {/* Scrollable cards — uses the exact QueryCard from the MapsGPT
              "See what people are asking" section. The hiw-scope wrapper
              activates the how-it-works-tokens.css variables that QueryCard
              depends on. */}
          <div
            ref={scrollRef}
            className="hiw-scope flex overflow-x-auto px-8 min-[1287px]:px-10 pb-12 gap-5 select-none min-[1010px]:justify-center"
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
              <QueryCard key={i} {...spot} />
            ))}
          </div>
        </div>
      </GridSection>

      {/* Bottom CTA bar — full width with grid lines */}
      <div style={{
        borderTop: "1px solid var(--grid-line)",
        borderBottom: "1px solid var(--grid-line)"
      }}>
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

