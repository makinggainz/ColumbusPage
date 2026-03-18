"use client";

import { useState, useEffect } from "react";
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
    id: "research",
    label: "Research",
    openContent: {
      title: "Research",
      description: "Research section for agentic geospatial analysis and reporting.",
      listItems: [],
    },
  },
  {
    id: "automated-audits",
    label: "Automated audits & due diligence",
    openContent: {
      title: "Automated audits & due diligence",
      description: "Streamlined automated audits and due diligence workflows.",
      listItems: [],
    },
  },
  {
    id: "regulatory",
    label: "Easy Regulatory compliance",
    openContent: {
      title: "Easy Regulatory compliance",
      description: "Simplify regulatory compliance with integrated checks and reporting.",
      listItems: [],
    },
  },
];

const FADE_DURATION_MS = 300;

export default function AgenticResearch() {
  const [openId, setOpenId] = useState<string>("research");
  const [userHasTapped, setUserHasTapped] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);

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
    <section className="w-full bg-black py-[120px] flex justify-center">
      <div className="w-full max-w-screen-2xl px-[var(--page-padding)]">

        <h2 className="text-white text-[32px] font-semibold mb-[30px] max-md:text-[28px]">
          Agentic geospatial research
        </h2>

        {/* MOBILE SIDEBAR */}
        <div className="hidden max-md:flex max-md:flex-col max-md:h-[420px] overflow-hidden rounded-lg mb-6 border-[0.7px] border-white/50">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCellTap(item.id)}
              className={`relative w-full flex flex-col text-left text-white overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer transition-[height] duration-300 ease-in-out bg-black border-b-[0.7px] border-white last:border-b-0 ${
                openId === item.id ? "min-h-[268px] flex-1" : "h-[76px] flex-shrink-0"
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

        {/* DESKTOP: sidebar + main content (same layout as E/F) */}
        <div className="flex flex-col md:flex-row overflow-hidden gap-0 min-h-0">
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
                    ? "min-h-[522px] max-lg:min-h-[368px] flex-1"
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

          {/* MAIN CONTENT — templates + report (fades on sidebar tap) */}
          <div
            className="flex-1 min-w-0 h-[674px] max-lg:h-[520px] transition-opacity ease-in-out overflow-auto border-[0.7px] border-white/50 border-l-0 rounded-r-lg p-6"
            style={{
              opacity: contentOpacity,
              transitionDuration: `${FADE_DURATION_MS / 2}ms`,
            }}
          >
            <div className="grid grid-cols-[320px_1fr] gap-8 max-xl:grid-cols-1 p-0 max-md:pt-0">
              {/* TEMPLATE CARDS */}
              <div className="flex flex-col gap-4">
                <p className="text-gray-400 text-[13px] mb-2">
                  Templates
                </p>
                <div className="h-[151px] bg-[#2a2a2a] rounded-xl p-5 text-white">
                  <h4 className="text-[20px] font-semibold mb-2">General Report</h4>
                  <p className="text-[16px] text-gray-300">
                    A general review of the parcel, considering key variables in construction
                  </p>
                </div>
                <div className="h-[151px] bg-[#2a2a2a] rounded-xl p-5 text-white">
                  <h4 className="text-[20px] font-semibold mb-2">Geotech/soils report</h4>
                  <p className="text-[16px] text-gray-300">
                    Report for bearing capacity, groundwater, rock, slope stability
                  </p>
                </div>
                <div className="h-[151px] bg-[#2a2a2a] rounded-xl p-5 text-white">
                  <h4 className="text-[20px] font-semibold mb-2">General Geological study</h4>
                  <p className="text-[16px] text-gray-300">
                    Wetlands/flood, stormwater, heritage/trees and other constraints
                  </p>
                </div>
                <div className="relative bg-[#2a2a2a] rounded-[14px] p-5 text-white w-full overflow-hidden">
                  <h4 className="font-semibold text-[15px]">Advanced Geological study</h4>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 pointer-events-none" />
                </div>
              </div>

              {/* REPORT PANEL */}
              <div className="bg-white rounded-2xl p-8">
                <p className="text-gray-500 text-[13px] mb-4">🌐 Report Produced by Columbus</p>
                <h3 className="text-[22px] font-semibold text-[#1f2b5c] mb-4">
                  Greenfield Minnesota Copper Porphyrrs
                </h3>
                <p className="text-gray-600 text-[14px] leading-relaxed mb-6">
                  A discrete subsurface density anomaly located in central Kansas has been
                  identified as a high-priority exploration target for copper and associated
                  sulfide mineralization. The target exhibits elevated rock density values
                  relative to surrounding formations and aligns with regional structural
                  features interpreted as potential pathways for mineralizing fluids.
                </p>
                <div className="relative w-full h-[220px] rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/use-cases/gmap.png"
                    alt="Map"
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-4 left-4 bg-white text-black text-[13px] px-4 py-2 rounded-lg shadow">
                    Interact with me
                  </button>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <p className="text-gray-400 text-[13px]">
                    Input a list of parcels (parcel ID, address, coordinates)
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-gray-200 text-black text-[13px] px-3 py-2 rounded-md">
                      Upload File
                    </button>
                    <button className="bg-gray-200 text-black text-[13px] px-3 py-2 rounded-md">
                      Select on map
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
