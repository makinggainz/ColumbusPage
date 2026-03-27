"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type SidebarItem = {
  id: string;
  label: string;
  openContent?: {
    title: string;
    description: string;
    listItems: string[];
  };
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "generative-geodata",
    label: "Generative Geodata",
    openContent: {
      title: "Generative Geodata",
      description: "Columbus has brought accurate GenAI to GeoData, dynamically creating new layers of geospatial information using our UGM. \"Smart Layers\" can be used to create creative data layers that would otherwise be time-intensive or expensive to obtain. Smart layers can also be used when data is unavailable or hard to survey.",
      listItems: [],
    },
  },
  {
    id: "predicting-future",
    label: "Predicting future",
    openContent: {
      title: "Predicting future",
      description: "Use cases for predictive geospatial modeling.",
      listItems: [],
    },
  },
  {
    id: "creative-data-layers",
    label: "Creative data layers",
    openContent: {
      title: "Creative data layers",
      description: "Smart Layers can be used to create creative data layers that would otherwise be time-intensive or expensive to obtain.",
      listItems: [],
    },
  },
  {
    id: "generative-surveying",
    label: "Generative surveying",
    openContent: {
      title: "Generative surveying",
      description: "Smart layers can also be used when data is unavailable or hard to survey.",
      listItems: [],
    },
  },
];

const FADE_DURATION_MS = 300;

export default function SuperModelSection() {
  const [openId, setOpenId] = useState<string>("generative-geodata");
  const [userHasTapped, setUserHasTapped] = useState(false);
  const [mapOpacity, setMapOpacity] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  useEffect(() => {
    if (userHasTapped) return;
    const interval = setInterval(() => {
      const currentIndex = SIDEBAR_ITEMS.findIndex((item) => item.id === openId);
      const nextIndex = (currentIndex + 1) % SIDEBAR_ITEMS.length;
      setOpenId(SIDEBAR_ITEMS[nextIndex].id);
    }, 5000);
    return () => clearInterval(interval);
  }, [openId, userHasTapped]);

  const handleCellTap = (itemId: string) => {
    setUserHasTapped(true);
    setOpenId(itemId);
    setMapOpacity(0);
    setTimeout(() => setMapOpacity(1), FADE_DURATION_MS / 2);
  };

  return (
    <section className="w-full bg-black flex justify-center">
      <div ref={sectionRef} className="section-lines-dark w-full max-w-[1287px] mx-auto px-8 md:px-10 py-[120px]">

        <h2 className="text-white text-[48px] font-semibold tracking-[-0.02em] mb-[50px] max-md:text-[28px]" style={anim(0)}>
          Surveying the earth with a super model
        </h2>

        {/* MOBILE SIDEBAR — 4 cells, no images; total height matches map (420px) so last cell bottom aligns */}
        <div className="hidden max-md:flex max-md:flex-col max-md:h-[420px] overflow-hidden rounded-lg mb-6 border-[0.7px] border-white/50" style={anim(100)}>
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCellTap(item.id)}
              className={`relative w-full flex flex-col text-left text-white overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer transition-[height] duration-300 ease-in-out bg-black border-b-[0.7px] border-white last:border-b-0 ${
                openId === item.id ? "min-h-[192px] flex-1" : "h-[76px] flex-shrink-0"
              }`}
            >
              <span
                className={`relative z-10 flex items-center h-[76px] px-6 font-medium flex-shrink-0 transition-[font-size] duration-300 ease-in-out ${
                  openId === item.id ? "text-[20px]" : "text-[14px]"
                }`}
              >
                {item.label}
              </span>
              <AnimatePresence mode="wait">
                {openId === item.id && item.openContent && (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 flex-1 px-6 pb-6 pt-0 flex flex-col min-h-0"
                  >
                    <p className="text-[14px] text-gray-300 mb-4">{item.openContent.description}</p>
                    {item.openContent.listItems.length > 0 && (
                      <ul className="text-[14px] text-gray-300 space-y-2">
                        {item.openContent.listItems.map((li) => (
                          <li key={li}>• {li}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        {/* DESKTOP: sidebar + map — 4 cells, no images; expanded cell uses flex-1 so last cell bottom = map bottom */}
        <div className="flex flex-col md:flex-row overflow-hidden rounded-lg gap-0" style={anim(100)}>
          <div
            className="hidden md:flex w-[348px] max-lg:w-[280px] flex-shrink-0 text-white flex-col overflow-hidden h-[674px] max-lg:h-[520px] border-[0.7px] border-white/50 border-r-0 rounded-l-lg"
          >
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCellTap(item.id)}
                className={`relative w-full flex flex-col text-left overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer transition-[height] duration-300 ease-in-out flex-shrink-0 bg-black border-b-[0.7px] border-white last:border-b-0 ${
                  openId === item.id
                    ? "min-h-[446px] max-lg:min-h-[292px] flex-1"
                    : "h-[76px]"
                }`}
              >
                <span
                  className={`relative z-10 flex items-center h-[76px] px-6 font-medium flex-shrink-0 transition-[font-size] duration-300 ease-in-out ${
                    openId === item.id ? "text-[24px] max-lg:text-[20px]" : "text-[14px]"
                  }`}
                >
                  {item.label}
                </span>
                <AnimatePresence mode="wait">
                  {openId === item.id && item.openContent && (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="relative z-10 flex-1 px-6 pb-6 pt-0 flex flex-col min-h-0"
                    >
                      <p className="text-[16px] text-gray-300 mb-4 leading-relaxed max-lg:text-[14px]">
                        {item.openContent.description}
                      </p>
                      {item.openContent.listItems.length > 0 && (
                        <ul className="text-[16px] text-gray-300 space-y-2 max-lg:text-[14px]">
                          {item.openContent.listItems.map((li) => (
                            <li key={li}>• {li}</li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          <div
            className="relative flex-1 min-w-0 h-[674px] max-lg:h-[520px] max-md:h-[420px] rounded-r-lg overflow-hidden transition-opacity ease-in-out border-[0.7px] border-white/50 border-l-0"
            style={{
              opacity: mapOpacity,
              transitionDuration: `${FADE_DURATION_MS / 2}ms`,
            }}
          >
            <Image
              src="/use-cases/havana.png"
              alt="Geospatial map"
              fill
              className="object-cover"
            />
            <div className="absolute left-[20px] top-[120px] h-[220px] w-[12px] rounded-full bg-gradient-to-b from-green-400 via-yellow-400 to-red-500" />
            <div className="absolute bottom-[24px] left-[100px] w-[607px] max-xl:w-[80%] h-[97px] bg-white text-black rounded-xl shadow-xl flex items-center justify-between px-5">
              <p className="text-[20px] leading-snug max-w-[500px]">
                I need a data layer of buildings in Havana by safety score.
                In the perspective of: City Planning
              </p>
              <div className="w-[32px] h-[32px] bg-[#1c2c6b] rounded-md flex-shrink-0" />
            </div>
            <div className="absolute bottom-[24px] right-[24px] text-white text-[13px] opacity-80">
              Built on Columbus Pro
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end mt-[25px] gap-10" style={anim(200)}>
          <p className="text-[#6E6E73] text-[20px] font-medium">
            Generating Ground truths
          </p>
          <button
            type="button"
            className="group flex items-center gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300"
            style={{ fontSize: 14, fontWeight: 500, height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "white", color: "#1D1D1F" }}
          >
            <span className="transition-colors duration-300 group-hover:text-[#2563EB]">See live Smart Layers</span>
            <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
