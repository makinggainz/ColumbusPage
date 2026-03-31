"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GridSection, gl } from "./ContentGrid";

const D = ({ n }: { n: number }) => (
  <span style={{ position: "absolute", top: 0, left: 0, zIndex: 9999, background: "red", color: "white", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>{n}</span>
);

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

const QUERY = "Where should the Transportation authority install a new road-signal for traffic?";
const CONSIDERING = [
  "Considering demographics of Miami",
  "Considering lot prices",
  "Considering trade area competition",
  "Considering your customer target",
];

function AnimatedChatCard() {
  const phase = "done" as const;
  const typedQuery = QUERY;
  const visibleSteps = CONSIDERING.length;
  const showResponse = true;
  const showFollowUp = true;
  const sent = true;

  return (
    <div className="absolute left-[72px] top-[40px] bottom-[40px] w-[514px] max-xl:left-[48px] max-xl:w-[440px] max-lg:left-[24px] max-lg:w-[360px] bg-[#f5f5f7] shadow-xl p-8 flex flex-col">
      <D n={30} />
      {/* Thinking header */}
      <div
        className="flex items-center gap-3 mb-4"
        style={{ opacity: sent ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        <span className="text-[20px]">🌐</span>
        <span className="text-gray-400 text-[15px] font-mono">Columbus is thinking...</span>
      </div>

      {/* Considering steps */}
      <div className="text-gray-400 text-[14px] space-y-1 mb-6 font-mono pl-9">
        {CONSIDERING.map((step, i) => (
          <p
            key={i}
            style={{
              opacity: visibleSteps > i ? 1 : 0,
              transform: visibleSteps > i ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          >
            {step}
          </p>
        ))}
      </div>

      {/* Response text */}
      <div
        className="text-gray-800 text-[15px] mb-6 leading-[1.65] font-medium"
        style={{ opacity: showResponse ? 1 : 0, transform: showResponse ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}
      >
        These areas <span className="text-red-700">marked,</span> have streets that often have had crashes.
        There is poor road signal trafficking. Consumer&apos;s have
        expressed disastisfaction with this section.
      </div>

      <div
        className="text-gray-700 text-[15px] leading-[1.65]"
        style={{ opacity: showFollowUp ? 1 : 0, transform: showFollowUp ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}
      >
        / Would you like to order a specific dataset and survey?
        Our partner agents will be dispatched for the study.
      </div>

      <div className="flex-1" />

      {/* Input bar */}
      <div className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center justify-between gap-5 mt-6">
        <span className="text-gray-500 text-[16px] leading-snug" style={{ minHeight: "1.5em" }}>
          {sent ? QUERY : (typedQuery || <span className="opacity-0">x</span>)}
          {!sent && <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse" />}
        </span>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
          style={{ background: sent ? "#0A1344" : "rgba(37, 99, 235, 0.12)" }}
        >
          <div className="w-5 h-5 rounded-sm" style={{ background: sent ? "white" : "#0A1344" }} />
        </div>
      </div>
    </div>
  );
}

export const Capabilities = () => {
  const [openId, setOpenId] = useState<string>("research-reports");
  const [userHasTapped, setUserHasTapped] = useState(false);
  const [mapOpacity, setMapOpacity] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
    <GridSection style={{ borderTop: "none", position: "relative", zIndex: 1 }}>
      <D n={1} />
      <div ref={sectionRef} style={{ overflow: "visible", position: "relative" }}>
        <D n={2} />
        {/* Header */}
        <div
          className="flex items-center justify-center px-8 md:px-10 pt-24 pb-12"
          style={{
            position: "relative",
            zIndex: 2,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <D n={3} />
          <h2 className="font-medium tracking-[-0.02em] text-[20px] lg:text-[25px] text-[#6E6E73]">
            Capabilities
          </h2>
        </div>

        {/* Main content */}
        <div
          style={{
            borderBottom: gl,
            position: "relative",
            zIndex: 10,
          }}
        >
          <D n={5} />
          {/* Mobile sidebar */}
          <div className="hidden max-md:block overflow-hidden" style={{ position: "relative" }}>
            <D n={6} />
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCellTap(item.id)}
                className={`relative w-full flex flex-col text-left text-white overflow-hidden focus:outline-none cursor-pointer transition-[height] duration-300 ease-in-out ${
                  openId === item.id ? "h-[330px]" : "h-[76px]"
                }`}
              >
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #111827 0%, #15203a 30%, #1a2d50 60%, #0f1a2e 100%)" }} />
                <Image src={item.bgImage} alt="" fill className="object-cover" sizes="100vw" style={{ filter: "grayscale(1) brightness(0.8) contrast(1.1)", mixBlendMode: "luminosity", opacity: 0.35 }} />
                {openId === item.id ? (
                  <span className="absolute inset-0 z-[1] bg-black/20 pointer-events-none" aria-hidden />
                ) : (
                  <div className="absolute inset-0 z-[1] bg-black/35 pointer-events-none" aria-hidden />
                )}
                <span
                  className={`relative z-10 flex items-center h-[76px] px-8 font-medium drop-shadow-md flex-shrink-0 transition-[font-size] duration-300 ease-in-out ${
                    openId === item.id ? "text-[18px]" : "text-[13px]"
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
                      className="relative z-10 flex-1 px-8 pb-6 pt-0 flex flex-col min-h-0"
                    >
                      <p className="text-[14px] text-gray-300 mb-4">{item.openContent.description}</p>
                      {item.openContent.listItems.length > 0 && (
                        <ul className="text-[14px] text-gray-300 space-y-2 mb-4">
                          {item.openContent.listItems.map((li) => (
                            <li key={li}>• {li}</li>
                          ))}
                        </ul>
                      )}
                      <Link
                        href="/use-cases"
                        onClick={e => e.stopPropagation()}
                        className="group inline-flex items-center gap-4 mt-auto leading-none whitespace-nowrap hover:opacity-80 transition-opacity"
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "white",
                        }}
                      >
                        <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Learn more</span>
                        <svg
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                          width="8" height="14" viewBox="0 0 7 12" fill="none"
                          stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M1 1l5 5-5 5" />
                        </svg>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* Desktop layout: sidebar + map */}
          <div ref={contentRef} className="relative w-full overflow-hidden flex max-md:hidden h-[673px] max-lg:h-[520px] bg-[#111827]">
            <D n={16} />
            {/* Sidebar */}
            <div className="w-[348px] max-lg:w-[280px] shrink-0 text-white flex flex-col overflow-hidden h-full" style={{ position: "relative" }}>
              <D n={17} />
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
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #111827 0%, #15203a 30%, #1a2d50 60%, #0f1a2e 100%)" }} />
                  <Image src={item.bgImage} alt="" fill className="object-cover" sizes="348px" style={{ filter: "grayscale(1) brightness(0.8) contrast(1.1)", mixBlendMode: "luminosity", opacity: 0.35 }} />
                  {openId === item.id ? (
                    <span className="absolute inset-0 z-[1] bg-black/20 pointer-events-none" aria-hidden />
                  ) : (
                    <div className="absolute inset-0 z-[1] bg-black/35 pointer-events-none" aria-hidden />
                  )}
                  <span
                    className={`relative z-10 flex items-center h-[76px] px-8 font-medium drop-shadow-md flex-shrink-0 transition-[font-size] duration-300 ease-in-out ${
                      openId === item.id ? "text-[18px] max-lg:text-[16px]" : "text-[13px]"
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
                        className="relative z-10 flex-1 px-8 pb-6 pt-0 flex flex-col min-h-0"
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
              className="absolute top-0 bottom-0 right-0 left-[348px] max-lg:left-[280px] transition-opacity ease-in-out overflow-hidden bg-[#111827]"
              style={{
                opacity: mapOpacity,
                transitionDuration: `${FADE_DURATION_MS / 2}ms`,
              }}
            >
              <D n={26} />
              <Image
                src="/HK Map-2.png"
                alt="Map"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(18, 8, 52, 0.22)" }} />

              {/* Chat card — animated */}
              <AnimatedChatCard />

              {/* More examples link */}
              <Link
                href="/use-cases"
                className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[15px] font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 18px", borderRadius: 9999 }}
              >
                More examples
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
