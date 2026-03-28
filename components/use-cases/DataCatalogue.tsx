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
    id: "competitive-price",
    label: "Competitive Price per POI",
    openContent: {
      title: "Competitive Price per POI",
      description: "Our competitors price their data differently. We offer transparent, competitive pricing per point of interest.",
      listItems: ["Our competitors price their", "more", "info", "goes", "here"],
    },
  },
  {
    id: "wide-breadth",
    label: "LGM considers wide breadth of data",
    openContent: {
      title: "LGM considers wide breadth of data",
      description: "Wide breadth of data sources and attributes for comprehensive geospatial analysis.",
      listItems: [],
    },
  },
  {
    id: "file-compatibility",
    label: "Universal file compatibility",
    openContent: {
      title: "Universal file compatibility",
      description: "Import and export in standard formats for seamless integration with your tools.",
      listItems: [],
    },
  },
  {
    id: "access-free",
    label: "Access expensive data for free",
    openContent: {
      title: "Access expensive data for free",
      description: "Selected premium datasets available at no cost for qualifying use cases.",
      listItems: [],
    },
  },
];

const FADE_DURATION_MS = 300;

export default function DataCatalogue() {
  const [openId, setOpenId] = useState<string>("competitive-price");
  const [userHasTapped, setUserHasTapped] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
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
    setContentOpacity(0);
    setTimeout(() => setContentOpacity(1), FADE_DURATION_MS / 2);
  };

  return (
    <section className="w-full bg-black flex justify-center">
      <div ref={sectionRef} className="section-lines-dark w-full max-w-[1287px] mx-auto px-8 md:px-10 py-[120px]">

        <h2 className="text-white text-[48px] font-semibold tracking-[-0.02em] mb-[30px] max-md:text-[32px]" style={anim(0)}>
          The most accurate data catalogue
        </h2>

        {/* MOBILE SIDEBAR */}
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
                      <ul className="text-[14px] text-gray-300 space-y-1">
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

        {/* DESKTOP: sidebar + main content */}
        <div className="flex flex-col md:flex-row overflow-hidden gap-0 min-h-0" style={anim(100)}>
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
                        <ul className="text-[16px] text-gray-300 space-y-1 max-lg:text-[14px]">
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

          {/* MAIN CONTENT — tabs + cards (fades on sidebar tap) */}
          <div
            className="flex-1 min-w-0 h-[674px] max-lg:h-[520px] transition-opacity ease-in-out overflow-auto border-[0.7px] border-white/50 border-l-0 rounded-r-lg p-6"
            style={{
              opacity: contentOpacity,
              transitionDuration: `${FADE_DURATION_MS / 2}ms`,
            }}
          >
            <div className="flex flex-col">
              <div className="flex gap-6 text-gray-400 text-[15px] mb-6 overflow-x-auto">
                <button type="button" className="cursor-pointer hover:text-white">My Data</button>
                <button type="button" className="cursor-pointer hover:text-white">Suggested</button>
                <button type="button" className="cursor-pointer hover:text-white">All</button>
                <button type="button" className="cursor-pointer hover:text-white">Base Maps</button>
                <button type="button" className="cursor-pointer hover:text-white">Overlays</button>
                <button type="button" className="cursor-pointer hover:text-white">Packs</button>
                <button type="button" className="cursor-pointer hover:text-white">Environmental</button>
                <button type="button" className="cursor-pointer hover:text-white">Infrastructure</button>
                <button type="button" className="cursor-pointer text-white font-semibold border-b border-white pb-1">
                  Smart Layers
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
                <div className="bg-white rounded-xl overflow-hidden flex flex-col">
                  <div className="relative h-[296px]">
                    <Image
                      src="/use-cases/layer1.png"
                      alt="Future Appreciation Zones"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <h4 className="font-semibold text-[20px] mb-1">Future Appreciation Zones</h4>
                    <p className="text-gray-500 text-[15px] mb-2">55,010 rows</p>
                    <p className="text-gray-600 text-[15px]">
                      Predicts 2–5 year property value growth using migration,
                      job forecasts, and permit trends.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden flex flex-col">
                  <div className="relative h-[296px]">
                    <Image
                      src="/use-cases/layer2.png"
                      alt="Future Turnover Hotspots"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <h4 className="font-semibold text-[20px] mb-1">Future Turnover Hotspots</h4>
                    <p className="text-gray-500 text-[15px] mb-2">40,206 rows</p>
                    <p className="text-gray-600 text-[15px]">
                      Predicts high-flip areas (DOM &lt;20 days) from sales
                      velocity, investor inflows, and economic cycles.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden flex flex-col">
                  <div className="relative h-[296px]">
                    <Image
                      src="/use-cases/layer3.png"
                      alt="Future Displacement Risk Overlay"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <h4 className="font-semibold text-[20px] mb-1">
                      Future Displacement Risk Overlay
                    </h4>
                    <p className="text-gray-500 text-[15px] mb-2">33,520 rows</p>
                    <p className="text-gray-600 text-[15px]">
                      Flags areas at risk of resident displacement from rising
                      costs, affordable housing site selection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="group flex items-center gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300"
                  style={{ fontSize: 14, fontWeight: 500, height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "white", color: "#1D1D1F" }}
                >
                  <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Learn about our data</span>
                  <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1l5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
