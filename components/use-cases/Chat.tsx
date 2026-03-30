"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    id: "city-security",
    label: "City security",
    bgImage: "/use-cases/security.png",
    openContent: {
      title: "City security",
      description: "Use cases and data for city security and defence applications.",
      listItems: [],
    },
  },
  {
    id: "urban-planning",
    label: "Urban Planning & Infrastructure",
    bgImage: "/use-cases/planning.png",
    openContent: {
      title: "Urban Planning & Infrastructure",
      description: "Enabling faster site-selection for Residential and commercial Real Estate customers, including:",
      listItems: ["Franchises", "Consultants", "CRE", "Residential Developers", "Wholesale brokers"],
    },
  },
  {
    id: "environmental",
    label: "Environmental",
    bgImage: "/use-cases/env.png",
    openContent: {
      title: "Environmental",
      description: "Environment and response use cases.",
      listItems: [],
    },
  },
  {
    id: "academic-research",
    label: "Academic Research",
    bgImage: "/use-cases/research.png",
    openContent: {
      title: "Academic Research",
      description: "Geospatial data and tools for academic and research use cases.",
      listItems: [],
    },
  },
  {
    id: "tourism",
    label: "Tourism",
    bgImage: "/use-cases/tourism.png",
    openContent: {
      title: "Tourism",
      description: "Tourism and destination intelligence.",
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
  const [phase, setPhase] = useState<"typing" | "sending" | "thinking" | "done">("typing");
  const [typedQuery, setTypedQuery] = useState("");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const runSequence = async () => {
      setPhase("typing");
      setTypedQuery("");
      setVisibleSteps(0);
      setShowResponse(false);
      setShowFollowUp(false);

      for (let i = 1; i <= QUERY.length; i++) {
        if (cancelled) return;
        await new Promise(r => setTimeout(r, 28));
        setTypedQuery(QUERY.slice(0, i));
      }

      await new Promise(r => setTimeout(r, 300));
      if (cancelled) return;
      setPhase("sending");

      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;
      setPhase("thinking");

      for (let i = 1; i <= CONSIDERING.length; i++) {
        await new Promise(r => setTimeout(r, 380));
        if (cancelled) return;
        setVisibleSteps(i);
      }

      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;
      setShowResponse(true);

      await new Promise(r => setTimeout(r, 500));
      if (cancelled) return;
      setShowFollowUp(true);
      setPhase("done");

      await new Promise(r => setTimeout(r, 4000));
      if (cancelled) return;
      runSequence();
    };

    runSequence();
    return () => { cancelled = true; };
  }, []);

  const sent = phase === "sending" || phase === "thinking" || phase === "done";

  return (
    <div className="absolute left-[72px] top-[40px] bottom-[40px] w-[514px] max-xl:left-[48px] max-xl:w-[440px] max-lg:left-[24px] max-lg:w-[360px] bg-[#f5f5f7] rounded-2xl shadow-xl p-8 flex flex-col">
      <div
        className="flex items-center gap-3 mb-4"
        style={{ opacity: sent ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        <span className="text-[20px]">🌐</span>
        <span className="text-gray-400 text-[15px] font-mono">Columbus is thinking...</span>
      </div>

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

export default function Chat() {
  const [openId, setOpenId] = useState<string>("urban-planning");
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

  const FADE_DURATION_MS = 300;

  const handleCellTap = (itemId: string) => {
    setUserHasTapped(true);
    setOpenId(itemId);
    setMapOpacity(0);
    setTimeout(() => setMapOpacity(1), FADE_DURATION_MS / 2);
  };

  return (
    <section className="w-full bg-black flex justify-center">
      <div ref={sectionRef} className="section-lines-dark w-full max-w-[1287px] mx-auto px-8 md:px-10 py-30">

        <div className="mb-[30px]" style={anim(0)}>
          <h2 className="text-white text-[48px] font-semibold tracking-[-0.02em] max-md:text-[28px]">
            Conversational map chat
          </h2>
        </div>

        {/* Main content */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {/* Mobile sidebar */}
          <div className="hidden max-md:block overflow-hidden mb-6">
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
          <div className="relative w-full overflow-hidden flex max-md:hidden rounded-lg h-[673px] max-lg:h-[520px]">
            {/* Sidebar */}
            <div className="w-[348px] max-lg:w-[280px] shrink-0 text-white flex flex-col overflow-hidden h-full border-[0.7px] border-black border-r-0 rounded-l-lg">
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
              className="absolute top-0 bottom-0 right-0 left-[348px] max-lg:left-[280px] transition-opacity ease-in-out overflow-hidden border-[0.7px] border-black border-l-0 rounded-r-lg"
              style={{
                opacity: mapOpacity,
                transitionDuration: `${FADE_DURATION_MS / 2}ms`,
              }}
            >
              <Image
                src="/HK Map-2.png"
                alt="Map"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(18, 8, 52, 0.22)" }} />

              <AnimatedChatCard />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
