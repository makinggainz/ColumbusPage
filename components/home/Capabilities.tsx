"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GridSection, gl } from "./ContentGrid";

type SidebarItem = {
  id: string;
  label: string;
  bgImage: string;
  openContent?: {
    title: string;
    description: string;
    listItems: string[];
  };
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "generative-geodata",
    label: "Generative GeoData",
    bgImage: "/use-cases/security.png",
    openContent: {
      title: "Generative GeoData",
      description: "AI-generated geospatial datasets that fill gaps where traditional surveying is expensive or unavailable.",
      listItems: [],
    },
  },
  {
    id: "research-reports",
    label: "Research Reports",
    bgImage: "/use-cases/planning.png",
    openContent: {
      title: "Research Reports",
      description: "Enabling faster site-selection for Residential and commercial Real Estate customers, including:",
      listItems: ["Franchises", "Consultants", "CRE", "Residential Developers", "Wholesale brokers"],
    },
  },
  {
    id: "data-catalogue",
    label: "Data Catalogue",
    bgImage: "/use-cases/env.png",
    openContent: {
      title: "Data Catalogue",
      description: "The most comprehensive geospatial data catalogue with vetted, high-fidelity datasets.",
      listItems: [],
    },
  },
  {
    id: "map-chat",
    label: "Map Chat",
    bgImage: "/use-cases/research.png",
    openContent: {
      title: "Map Chat",
      description: "Conversational interface for querying any location on Earth in natural language.",
      listItems: [],
    },
  },
  {
    id: "generative-due-diligence",
    label: "Generative Due Dillegence",
    bgImage: "/use-cases/tourism.png",
    openContent: {
      title: "Generative Due Dillegence",
      description: "Automated geospatial due diligence reports for real estate and infrastructure projects.",
      listItems: [],
    },
  },
];

export const Capabilities = () => {
  const [openId, setOpenId] = useState<string>("research-reports");
  const [userHasTapped, setUserHasTapped] = useState(false);
  const [mapOpacity, setMapOpacity] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (userHasTapped) return;
    const interval = setInterval(() => {
      const currentIndex = SIDEBAR_ITEMS.findIndex((item) => item.id === openId);
      const nextIndex = (currentIndex + 1) % SIDEBAR_ITEMS.length;
      setOpenId(SIDEBAR_ITEMS[nextIndex].id);
    }, 5000);
    return () => clearInterval(interval);
  }, [openId, userHasTapped]);

  const FADE_DURATION_MS = 300;

  const handleCellTap = (itemId: string) => {
    setUserHasTapped(true);
    setOpenId(itemId);
    setMapOpacity(0);
    setTimeout(() => setMapOpacity(1), FADE_DURATION_MS / 2);
  };

  return (
    <GridSection style={{ borderTop: "none" }}>
      <div ref={sectionRef}>
        {/* Header */}
        <div
          className="flex items-center justify-center px-8 md:px-10 py-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h2 className="text-[#1D1D1F] text-[24px] font-normal tracking-[-0.02em]">
            Capabilities
          </h2>
        </div>

        {/* Main content */}
        <div
          style={{
            borderBottom: gl,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {/* Mobile sidebar */}
          <div className="hidden max-md:block overflow-hidden">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCellTap(item.id)}
                className={`relative w-full flex flex-col text-left text-white overflow-hidden focus:outline-none cursor-pointer transition-[height] duration-300 ease-in-out ${
                  openId === item.id ? "h-[330px]" : "h-[76px]"
                }`}
              >
                <Image src={item.bgImage} alt="" fill className="object-cover" sizes="100vw" />
                {openId === item.id ? (
                  <span className="absolute inset-0 z-[1] bg-black/50 pointer-events-none" aria-hidden />
                ) : (
                  <div className="absolute inset-0 z-[1] bg-black/60 pointer-events-none" aria-hidden />
                )}
                <span
                  className={`relative z-10 flex items-center h-[76px] px-6 font-medium drop-shadow-md flex-shrink-0 transition-[font-size] duration-300 ease-in-out ${
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

          {/* Desktop layout: sidebar + map */}
          <div className="relative w-full overflow-hidden flex max-md:hidden rounded-lg">
            {/* Sidebar */}
            <div className="w-[348px] max-lg:w-[280px] flex-shrink-0 text-white flex-col overflow-hidden h-[673px] max-lg:h-[520px] border-[0.7px] border-[var(--grid-line)] border-r-0 rounded-l-lg flex">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleCellTap(item.id)}
                  className={`relative w-full flex flex-col text-left overflow-hidden focus:outline-none cursor-pointer transition-[height] duration-300 ease-in-out ${
                    openId === item.id
                      ? "h-[369px] max-lg:h-[216px] flex-shrink-0"
                      : "h-[76px] flex-shrink-0"
                  }`}
                >
                  <Image src={item.bgImage} alt="" fill className="object-cover" sizes="348px" />
                  {openId === item.id ? (
                    <span className="absolute inset-0 z-[1] bg-black/50 pointer-events-none" aria-hidden />
                  ) : (
                    <div className="absolute inset-0 z-[1] bg-black/60 pointer-events-none" aria-hidden />
                  )}
                  <span
                    className={`relative z-10 flex items-center h-[76px] px-6 font-medium drop-shadow-md flex-shrink-0 transition-[font-size] duration-300 ease-in-out ${
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

            {/* Map area */}
            <div
              className="relative flex-1 min-w-0 h-[673px] max-lg:h-[520px] transition-opacity ease-in-out overflow-hidden border-[0.7px] border-[var(--grid-line)] border-l-0 rounded-r-lg"
              style={{
                opacity: mapOpacity,
                transitionDuration: `${FADE_DURATION_MS / 2}ms`,
              }}
            >
              <Image
                src="/use-cases/mapchat.png"
                alt="Map"
                fill
                className="object-cover"
                priority
              />

              {/* Chat card */}
              <div className="absolute left-[72px] top-[100px] w-[514px] max-xl:left-[48px] max-xl:w-[440px] max-lg:left-[24px] max-lg:w-[360px] bg-white rounded-xl shadow-xl p-6">
                <div className="text-gray-400 text-[14px] mb-8 font-mono">
                  🌐 Columbus is thinking...
                </div>

                <div className="text-gray-400 text-[13px] space-y-1 mb-8 font-mono">
                  <p>Considering demographics of Miami</p>
                  <p>Considering lot prices</p>
                  <p>Considering trade area competition</p>
                  <p>Considering your customer target</p>
                </div>

                <div className="text-gray-700 text-[14px] mb-8 leading-relaxed">
                  These areas marked, have streets that often have had crashes.
                  There is poor road signal trafficking. Consumer&apos;s have
                  expressed disastisfaction with this section.
                </div>

                <div className="text-gray-700 text-[14px]">
                  / Would you like to order a specific dataset and survey?
                  Our partner agents will be dispatched for the study.
                </div>
              </div>

              {/* More examples link */}
              <Link
                href="/use-cases"
                className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white text-[20px] font-medium hover:opacity-80 transition-opacity drop-shadow-lg"
              >
                More examples
                <svg width="10" height="16" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GridSection>
  );
};
