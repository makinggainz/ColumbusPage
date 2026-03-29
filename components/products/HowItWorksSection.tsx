// "use client";

// import Image from "next/image";

// export default function HowItWorksSection() {
//   return (
//     <section className="bg-[#F4F4F4] py-24 lg:py-32">
//       <div className="max-w-[1400px] mx-auto px-6">

//         {/* ================= TITLE ================= */}
//         <h2 className="text-center text-[40px] md:text-[56px] lg:text-[64px] leading-[140%] font-semibold text-black mb-16 lg:mb-24">
//           How It Works
//         </h2>

//         {/* ================= CONTENT ================= */}
//         <div className="grid lg:grid-cols-2 items-center gap-16 lg:gap-20">

//           {/* LEFT TEXT */}
//           <div className="flex justify-center lg:justify-start">
//             <p className="text-[32px] md:text-[48px] lg:text-[64px] leading-[140%] font-semibold text-[#0C4F4E] max-w-[450px] text-center lg:text-left">
//               Chat to find
//               <br />
//               what you need.
//             </p>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex flex-col items-center">

//             {/* ================= CLUSTER ================= */}
//             <div className="relative w-full max-w-[593px] aspect-square mb-[34px]">

//               {/* ===== CENTER IMAGE ===== */}
//               <Image
//                 src="/how/center.png"
//                 alt=""
//                 width={141}
//                 height={141}
//                 className="absolute left-[226px] top-[226px]"
//               />

//               {/* ================= IMAGES ================= */}

//               <Image
//                 src="/how/1.png"
//                 alt=""
//                 width={134}
//                 height={158}
//                 className="absolute left-[0px] top-[80px] rounded-[17px]"
//               />

//               <Image
//                 src="/how/3.png"
//                 alt=""
//                 width={107}
//                 height={129}
//                 className="absolute left-[220px] top-[40px] rounded-[14px]"
//               />

//               <Image
//                 src="/how/4.png"
//                 alt=""
//                 width={98}
//                 height={97}
//                 className="absolute right-[40px] top-[90px] rounded-[14px]"
//               />

//               <Image
//                 src="/how/5.png"
//                 alt=""
//                 width={113}
//                 height={135}
//                 className="absolute right-[30px] bottom-[140px] rounded-[17px]"
//               />

//               <Image
//                 src="/how/6.png"
//                 alt=""
//                 width={107}
//                 height={106}
//                 className="absolute left-[230px] bottom-[90px] rounded-[14px]"
//               />

//               <Image
//                 src="/how/7.png"
//                 alt=""
//                 width={134}
//                 height={158}
//                 className="absolute left-[60px] bottom-[0px] rounded-[17px]"
//               />

//               {/* ================= PILLS ================= */}

//               <Pill className="left-[10px] top-[20px]" />
//               <Pill className="left-[240px] top-[0px]" />
//               <Pill className="right-[0px] top-[120px]" />
//               <Pill className="right-[0px] bottom-[200px]" />
//               <Pill className="left-[210px] bottom-[40px]" />
//               <Pill className="left-[20px] bottom-[180px]" />

//             </div>
//             {/* ================= INPUT BOX ================= */}
// <div className="flex flex-col items-center">

//   {/* OUTER CONTAINER (593 x 134) */}
//   <div
//     className="relative w-[593px] h-[134px] rounded-[24px] bg-white"
//     style={{
//       boxShadow: "inset 0 0 0 2px #2F6F73"
//     }}
//   >

//     {/* TITLE */}
//     <div className="absolute top-[22px] left-0 w-full text-center text-[#3F9C95] text-[22px] font-medium">
//       Roll the dice
//     </div>

//     {/* INPUT FIELD (589 x 69 EXACT) */}
//     <div
//       className="absolute left-[2px] top-[63px] w-[589px] h-[69px] rounded-[24px] bg-white"
//       style={{
//         boxShadow: "inset 0 0 0 1px #C7DCDC"
//       }}
//     >
//       {/* TEXT */}
//       <div className="absolute left-[24px] top-[18px] text-[24px] text-[#6F8584]">
//         Ask MapsGPT anything
//       </div>

//       {/* ARROW BUTTON */}
//       <div className="absolute right-[16px] top-[8.5px] w-[52px] h-[52px] bg-[#8FC9C3] rounded-[16px] flex items-center justify-center">
//         <span className="text-white text-[26px] leading-none">→</span>
//       </div>
//     </div>

//   </div>

//   {/* FOOTER */}
//   <div className="mt-[24px] text-[18px] text-[#1E2432]">
//     Powered by Columbus-01
//     <span className="ml-[8px]">▶</span>
//   </div>

// </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


// /* ===================== PILL COMPONENT ===================== */

// function Pill({ className }: { className?: string }) {
//   return (
//     <div
//       className={`absolute w-[160px] h-[45px] bg-white border border-[#BCBCBC] rounded-[22.5px] flex items-center gap-3 px-4 text-[16px] font-medium text-black ${className}`}
//     >
//       <span className="text-[18px] leading-none">👩‍🦰</span>
//       <span>Gen Z Spots</span>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export default function HowItWorksSection() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasText = inputValue.trim().length > 0;

  const handleSend = () => {
    window.location.href = "https://mapsgpt.es";
  };

  return (
    <section className="bg-[#F9F9F9] py-16 lg:py-24">
      <div className="max-w-[1408px] mx-auto px-8 min-[1408px]:px-0">

        {/* ================= TITLE ================= */}
        <h2 className="text-center text-[36px] md:text-[48px] lg:text-[64px] leading-[140%] font-semibold text-black mb-12 lg:mb-24">
          How It Works
        </h2>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20">

          {/* LEFT TEXT */}
          <div className="flex justify-center lg:justify-start items-center">
            <p
              className="text-center lg:text-left text-[36px] md:text-[48px] lg:text-[64px] leading-[140%] max-w-[449px] w-full"
              style={{
                fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 590,
                background: "linear-gradient(90deg, #063140 0%, #5FBFF1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Chat to find what you need.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center">

            {/* ================= CLUSTER (669×426 from design, responsive with %) ================= */}
            <div className="relative w-full max-w-[669px] mb-[34px] overflow-visible aspect-[669/426]">
              <div className="absolute inset-0">
                {/* Center ellipse: 141×141, border 4px #000 — pos (254,169) */}
                <Image
                  src="/how/center.png"
                  alt=""
                  width={141}
                  height={141}
                  className="absolute rounded-full object-cover w-[21.08%] h-auto"
                  style={{
                    left: "37.97%",
                    top: "39.67%",
                    border: "4px solid #000000",
                    boxSizing: "border-box",
                    aspectRatio: "1",
                  }}
                />

                <Image
                  src="/how/3.png"
                  alt=""
                  width={107}
                  height={129}
                  className="absolute rounded-[14px] w-[16%] h-auto"
                  style={{ left: "34.98%", top: "5.4%", aspectRatio: "107/129" }}
                />

                <Image
                  src="/how/5.png"
                  alt=""
                  width={113}
                  height={135}
                  className="absolute rounded-[17px] w-[16.89%] h-auto"
                  style={{ left: "68.46%", top: "41.08%", aspectRatio: "113/135" }}
                />

                <Image
                  src="/how/4.png"
                  alt=""
                  width={98}
                  height={97}
                  className="absolute rounded-[14px] w-[14.65%] h-auto"
                  style={{ left: "60.09%", top: "15.73%", aspectRatio: "98/97" }}
                />

                <Image
                  src="/how/6.png"
                  alt=""
                  width={107}
                  height={106}
                  className="absolute rounded-[14px] w-[16%] h-auto"
                  style={{ left: "56.05%", top: "73.94%", aspectRatio: "107/106" }}
                />

                <Image
                  src="/how/1.png"
                  alt=""
                  width={134}
                  height={158}
                  className="absolute rounded-[17px] w-[20.03%] h-auto"
                  style={{ left: "8.07%", top: "16.9%", aspectRatio: "134/158" }}
                />

                <Image
                  src="/how/7.png"
                  alt=""
                  width={134}
                  height={158}
                  className="absolute rounded-[17px] w-[20.03%] h-auto"
                  style={{ left: "11.21%", top: "60.8%", aspectRatio: "134/158" }}
                />

                {/* Pills: positions as % of 669×426 (pills can sit slightly outside) */}
                <Pill index={0} style={{ left: "12.71%", top: "46.48%" }} />
                <Pill index={1} style={{ left: "7.32%", top: "0%" }} />
                <Pill index={2} style={{ left: "34.98%", top: "89.44%" }} />
                <Pill index={3} style={{ left: "67.41%", top: "16.9%" }} />
                <Pill index={4} style={{ left: "40.66%", top: "2.58%" }} />
                <Pill index={5} style={{ left: "76.08%", top: "60.8%" }} />
                <Pill index={6} style={{ left: "64.87%", top: "80.99%" }} />
                <Pill index={7} style={{ left: "0%", top: "75.82%" }} />
              </div>
            </div>

            {/* ================= INPUT BOX ================= */}
            <div className="flex flex-col items-center w-full max-w-[593px]">
              <div
                className="relative w-full rounded-2xl bg-white overflow-hidden cursor-text"
                style={{
                  border: `1.5px solid ${isFocused ? "#5FBFF1" : "#D1D5DB"}`,
                  boxShadow: isFocused
                    ? "0px 2px 12px rgba(0, 177, 212, 0.15)"
                    : "0px 2px 12px rgba(0, 0, 0, 0.06)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onClick={() => inputRef.current?.focus()}
              >
                {/* Header: dice icon + "Suggested questions" — clickable, goes to mapsgpt.es */}
                <a
                  href="https://mapsgpt.es"
                  className="flex items-center justify-center gap-2 px-6 hover:opacity-75 transition-opacity"
                  style={{ height: 62, textDecoration: "none" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <rect x="1.5" y="1.5" width="17" height="17" rx="4" stroke="#5FBFF1" strokeWidth="1.5"/>
                    <circle cx="6.5" cy="6.5" r="1.25" fill="#5FBFF1"/>
                    <circle cx="13.5" cy="6.5" r="1.25" fill="#5FBFF1"/>
                    <circle cx="10" cy="10" r="1.25" fill="#5FBFF1"/>
                    <circle cx="6.5" cy="13.5" r="1.25" fill="#5FBFF1"/>
                    <circle cx="13.5" cy="13.5" r="1.25" fill="#5FBFF1"/>
                  </svg>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      lineHeight: "140%",
                      color: "#5FBFF1",
                    }}
                  >
                    Suggested questions
                  </span>
                </a>

                {/* Divider */}
                <div style={{ height: "1px", background: "#E5E7EB" }} />

                {/* Input row */}
                <div
                  className="flex items-center gap-3 px-4"
                  style={{ height: 70 }}
                >
                  {/* Paperclip icon */}
                  <div
                    className="flex items-center justify-center shrink-0 rounded-full"
                    style={{ width: 40, height: 40, border: "1.5px solid #D1D5DB", background: "#F9FAFB" }}
                    aria-hidden
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M15.5 8.5L8.5 15.5C6.84 17.16 4.16 17.16 2.5 15.5C0.84 13.84 0.84 11.16 2.5 9.5L9 3C10.1 1.9 11.9 1.9 13 3C14.1 4.1 14.1 5.9 13 7L6.5 13.5C5.95 14.05 5.05 14.05 4.5 13.5C3.95 12.95 3.95 12.05 4.5 11.5L10.5 5.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Real input */}
                  <div className="relative flex-1 flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={(e) => { if (e.key === "Enter" && hasText) handleSend(); }}
                      className="w-full bg-transparent outline-none border-none placeholder-transparent"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "18px",
                        color: "#111827",
                        caretColor: "#5FBFF1",
                      }}
                    />
                    {/* Idle state: blinking cursor + placeholder text */}
                    {!isFocused && !inputValue && (
                      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-0.75">
                        <span
                          style={{
                            width: "2px",
                            height: "20px",
                            background: "#000000",
                            borderRadius: "1px",
                            animation: "blink 1.1s step-start infinite",
                            flexShrink: 0,
                            display: "block",
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: "18px",
                            color: "#9CA3AF",
                            lineHeight: 1,
                          }}
                        >
                          Ask MapsGPT anything
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Send button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); if (hasText) handleSend(); }}
                    className="flex items-center justify-center shrink-0 rounded-full transition-all duration-200"
                    style={{
                      width: 40,
                      height: 40,
                      background: "#5FBFF1",
                      opacity: hasText ? 1 : 0.4,
                      cursor: hasText ? "pointer" : "default",
                      transition: "opacity 0.2s",
                    }}
                    aria-label="Send"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M9 14V4M4 9l5-5 5 5"
                        stroke="#ffffff"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Powered by Columbus-01 — links to /technology */}
              <Link
                href="/technology"
                className="flex items-center justify-center gap-2 mt-6 hover:opacity-75 transition-opacity"
                style={{ textDecoration: "none" }}
              >
                <span
                  className="text-[15px] leading-[140%]"
                  style={{
                    fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontWeight: 274,
                    background: "linear-gradient(90deg, #0A1342 0%, #2A2A2A 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Powered by Columbus-01
                </span>
                <span className="w-6 h-6 flex items-center justify-center" aria-hidden>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#0A1342]">
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                  </svg>
                </span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


/* ===================== PILL COMPONENT ===================== */

const PILL_DATA = [
  { emoji: "🍜", label: "Street Food" },
  { emoji: "🏖️", label: "Beach Vibes" },
  { emoji: "🎭", label: "Night Out" },
  { emoji: "🌿", label: "Eco Trail" },
  { emoji: "🛍️", label: "Hidden Gems" },
  { emoji: "🗺️", label: "Adventure" },
  { emoji: "☕", label: "Café Culture" },
  { emoji: "🎨", label: "Art & Culture" },
];

function Pill({ className, style, index = 0 }: { className?: string; style?: React.CSSProperties; index?: number }) {
  const { emoji, label } = PILL_DATA[index % PILL_DATA.length];
  return (
    <div
      className={`absolute flex items-center justify-center gap-1.5 px-2 bg-white rounded-[22.5px] ${className ?? ""}`}
      style={{
        width: "23.92%",
        height: "10.56%",
        minWidth: 80,
        minHeight: 28,
        maxWidth: 160,
        maxHeight: 45,
        border: "0.8px solid #BCBCBC",
        boxSizing: "border-box",
        fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "15px",
        lineHeight: "135%",
        letterSpacing: 0,
        color: "#000000",
        ...style,
      }}
    >
      <span className="leading-none shrink-0" aria-hidden>{emoji}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}