

// "use client";

// import Image from "next/image";

// export default function Chat() {
//   return (
//     <section className="w-full bg-black py-[120px] flex justify-center">
//       <div className="w-full max-w-[1728px] px-6">

//         {/* TITLE */}
//         <div className="mb-[48px]">
//           <h2 className="text-white text-[36px] font-semibold max-md:text-[28px]">
//             Conversational map chat
//           </h2>
//           <div className="w-full h-[1px] bg-[#2a2a2a] mt-4" />
//         </div>

//         {/* MAP FRAME */}
//         <div className="relative w-full overflow-hidden rounded-lg">

//           {/* Map image */}
//           <div className="relative w-full h-[673px] max-lg:h-[520px] max-md:h-[420px]">

//             <Image
//               src="/use-cases/mapchat.png"
//               alt="Map"
//               fill
//               className="object-cover"
//             />

//             {/* LEFT PANEL */}
//             <div className="
//               absolute left-0 top-0 h-full
//               w-[348px]
//               max-lg:w-[280px]
//               max-md:w-full
//               max-md:h-auto
//               max-md:relative
//               bg-black/70 backdrop-blur-md
//               text-white flex flex-col
//             ">

//               {/* City security */}
//               <div className="h-[76px] flex items-center px-6 text-[14px] text-gray-300 border-b border-red-500/10">
//                 City security
//               </div>

//               {/* Active card */}
//               <div className="px-6 py-6 bg-white/10 max-md:py-5">

//                 <h3 className="text-[24px] font-semibold mb-3 max-md:text-[20px]">
//                   Urban Planning & Infrastructure
//                 </h3>

//                 <p className="text-[16px] text-gray-300 mb-4 leading-relaxed max-md:text-[14px]">
//                   Enabling faster site-selection for Residential and commercial
//                   Real Estate customers, including:
//                 </p>

//                 <ul className="text-[16px] text-gray-300 space-y-2 max-md:text-[14px]">
//                   <li>• Franchises</li>
//                   <li>• Consultants</li>
//                   <li>• CRE</li>
//                   <li>• Residential Developers</li>
//                   <li>• Wholesale brokers</li>
//                 </ul>

//               </div>

//               {/* Menu items */}
//               <div className="h-[76px] flex items-center px-6 border-t border-red-500/10 text-gray-300">
//                 Environmental
//               </div>

//               <div className="h-[76px] flex items-center px-6 border-t border-red-500/10 text-gray-300">
//                 Todo list apps
//               </div>

//               <div className="h-[76px] flex items-center px-6 border-t border-red-500/10 text-gray-300">
//                 Tourism
//               </div>

//             </div>

//             {/* CHAT CARD */}
//             <div className="
//               absolute
//               left-[420px]
//               top-[100px]
//               w-[514px]
//               max-xl:left-[360px]
//               max-xl:w-[440px]
//               max-lg:left-[300px]
//               max-lg:w-[360px]
//               max-md:relative
//               max-md:left-0
//               max-md:top-6
//               max-md:w-full
//               bg-white rounded-xl shadow-xl p-6
//             ">

//               <div className="text-gray-400 text-[14px] mb-10">
//                 🌐 Columbus is thinking...
//               </div>

//               <div className="text-gray-400 text-[13px] space-y-1 mb-10">
//                 <p>Considering demographics of Miami</p>
//                 <p>Considering lot prices</p>
//                 <p>Considering trade area competition</p>
//                 <p>Considering your customer target</p>
//               </div>

//               <div className="text-gray-700 text-[14px] mb-10 leading-relaxed">
//                 These areas marked have streets that often had crashes.
//                 There is poor road signal trafficking. Consumers have
//                 expressed dissatisfaction with this section.
//               </div>

//               <div className="text-gray-700 text-[14px] mb-10">
//                 / Would you like to order a specific dataset and survey?
//                 Our partner agents will be dispatched for the study.
//               </div>

//               <div className="flex items-center justify-between border-t pt-3">

//                 <p className="text-[13px] text-gray-500 max-w-[280px]">
//                   Where should the Transportation authority install a new road
//                   signal for traffic?
//                 </p>

//                 <div className="w-[32px] h-[32px] bg-[#1c2c6b] rounded-md" />

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

export default function Chat() {
  const [openId, setOpenId] = useState<string>("urban-planning");
  const [userHasTapped, setUserHasTapped] = useState(false);
  const [mapOpacity, setMapOpacity] = useState(1);

  // Auto-cycle to next sidebar cell every 5s; stops once the user taps a cell
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
    <section className="w-full bg-black py-[120px] flex justify-center">
      <div className="w-full max-w-screen-2xl px-[var(--page-padding)]">

        {/* TITLE — left edge aligned with sidebar; 30px above top edge of left sidebar */}
        <div className="mb-[30px]">
          <h2 className="text-white text-[36px] font-semibold max-md:text-[28px]">
            Conversational map chat
          </h2>
        </div>

        {/* MOBILE SIDEBAR (shows above map) */}
        <div className="hidden max-md:block overflow-hidden mb-6">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCellTap(item.id)}
              className={`relative w-full flex flex-col text-left text-white overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer transition-[height] duration-300 ease-in-out ${
                openId === item.id ? "h-[330px]" : "h-[76px]"
              }`}
            >
              <Image
                src={item.bgImage}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
              {openId === item.id ? (
                <span className="absolute inset-0 z-[1] bg-black/50 pointer-events-none" aria-hidden />
              ) : (
                <div className="glass-rect pointer-events-none" aria-hidden />
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

        {/* MAP FRAME — sidebar + map */}
        <div className="relative w-full overflow-hidden flex max-md:flex-col rounded-lg">

          {/* DESKTOP SIDEBAR — takes fixed width; map starts at its right edge */}
          <div className="
            hidden md:flex
            w-[348px]
            max-lg:w-[280px]
            flex-shrink-0
            text-white flex-col overflow-hidden
            h-[673px] max-lg:h-[520px]
            border-[0.7px] border-white border-r-0 rounded-l-lg
          ">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCellTap(item.id)}
                className={`relative w-full flex flex-col text-left overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer transition-[height] duration-300 ease-in-out ${
                  openId === item.id
                    ? "h-[369px] max-lg:h-[216px] flex-shrink-0"
                    : "h-[76px] flex-shrink-0"
                }`}
              >
                <Image
                  src={item.bgImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="348px"
                />
                {openId === item.id ? (
                  <span className="absolute inset-0 z-[1] bg-black/50 pointer-events-none" aria-hidden />
                ) : (
                  <div className="glass-rect pointer-events-none" aria-hidden />
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

          {/* MAP — left edge at sidebar right edge; fades out/in when user taps a cell */}
          <div
            className="relative flex-1 min-w-0 h-[673px] max-lg:h-[520px] max-md:h-[420px] transition-opacity ease-in-out overflow-hidden border-[0.7px] border-white border-l-0 rounded-r-lg"
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

            {/* CHAT CARD — positioned from map area left */}
            <div className="
              absolute
              left-[72px]
              top-[100px]
              w-[514px]
              max-xl:left-[48px]
              max-xl:w-[440px]
              max-lg:left-[24px]
              max-lg:w-[360px]
              max-md:relative
              max-md:left-0
              max-md:top-6
              max-md:w-full
              bg-white rounded-xl shadow-xl p-6
            ">

              <div className="text-gray-400 text-[14px] mb-8">
                🌐 Columbus is thinking...
              </div>

              <div className="text-gray-400 text-[13px] space-y-1 mb-8">
                <p>Considering demographics of Miami</p>
                <p>Considering lot prices</p>
                <p>Considering trade area competition</p>
                <p>Considering your customer target</p>
              </div>

              <div className="text-gray-700 text-[14px] mb-8">
                These areas marked have streets that often had crashes.
                There is poor road signal trafficking. Consumers have
                expressed dissatisfaction with this section.
              </div>

              <div className="text-gray-700 text-[14px] mb-8">
                / Would you like to order a specific dataset and survey?
                Our partner agents will be dispatched for the study.
              </div>

              <div className="flex items-center justify-between border-t pt-3">

                <p className="text-[13px] text-gray-500 max-w-[280px]">
                  Where should the Transportation authority install a new road
                  signal for traffic?
                </p>

                <div className="w-[32px] h-[32px] bg-[#1c2c6b] rounded-md" />

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}