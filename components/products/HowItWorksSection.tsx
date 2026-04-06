"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
// @ts-expect-error — CSS side-effect import
import "@/components/products/how-it-works-tokens.css";

/* ═══════════════════════════════════════════════════════════════
   Step data — each step maps to one visual card in the section.
   ═══════════════════════════════════════════════════════════════ */
interface Step {
  title: string;
  titleGradient: string;
  description: string;
  image: string;
  imageAlt: string;
  imageCluster?: boolean;
}

const STEPS: Step[] = [
  {
    title: "Chat to find what you need",
    titleGradient: "linear-gradient(90deg, #063140 0%, #5FBFF1 100%)",
    description:
      "Ask MapsGPT for suggestions for any destination — restaurants, hidden gems, or an entire itinerary. Just describe what you're looking for.",
    image: "/how/center.png",
    imageAlt: "MapsGPT chat interface with destination suggestions",
    imageCluster: true,
  },
  {
    title: "Get personalized recommendations",
    titleGradient: "linear-gradient(90deg, #DE2F32 0%, #B00098 100%)",
    description:
      "Our AI learns your preferences and continuously refines suggestions — so every recommendation feels like it was made just for you.",
    image: "/how/card.png",
    imageAlt: "Personalized travel recommendation card",
  },
  {
    title: "Save & share your favorites",
    titleGradient: "linear-gradient(90deg, #0A6E5C 0%, #2A8FC2 100%)",
    description:
      "Bookmark the places you love, organize them into collections, and share your finds with friends and travel companions.",
    image: `/FavoriteSpots/${encodeURIComponent("(20).jpeg")}`,
    imageAlt: "Saved favorite spots collection",
  },
];

/* ═══════════════════════════════════════════════════════════════
   Pill component — floating category tags around the chat image
   ═══════════════════════════════════════════════════════════════ */
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

function Pill({ index, style }: { index: number; style?: React.CSSProperties }) {
  const { emoji, label } = PILL_DATA[index % PILL_DATA.length];
  return (
    <div
      className="absolute flex items-center justify-center gap-1.5 px-2"
      style={{
        background: "var(--hiw-bg-card)",
        borderRadius: "var(--hiw-radius-full)",
        border: `1px solid var(--hiw-border)`,
        fontFamily: "var(--hiw-font-sans)",
        fontWeight: "var(--hiw-weight-medium)" as unknown as number,
        fontSize: "var(--hiw-text-sm)",
        color: "var(--hiw-text-primary)",
        width: "23.92%",
        height: "10.56%",
        minWidth: 80,
        minHeight: 28,
        maxWidth: 160,
        maxHeight: 45,
        ...style,
      }}
    >
      <span className="leading-none shrink-0" aria-hidden>{emoji}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Image cluster — step 1's collage of travel photos + pills
   ═══════════════════════════════════════════════════════════════ */
function ImageCluster() {
  return (
    <div className="relative w-full aspect-[669/426] overflow-visible">
      <div className="absolute inset-0">
        <Image
          src="/how/center.png"
          alt=""
          width={141}
          height={141}
          className="absolute rounded-full object-cover w-[21.08%] h-auto"
          style={{
            left: "37.97%",
            top: "39.67%",
            border: `4px solid var(--hiw-text-primary)`,
            boxSizing: "border-box",
            aspectRatio: "1",
          }}
        />
        <Image src="/how/3.png" alt="" width={107} height={129}
          className="absolute w-[16%] h-auto"
          style={{ left: "34.98%", top: "5.4%", aspectRatio: "107/129", borderRadius: "var(--hiw-radius-md)" }} />
        <Image src="/how/5.png" alt="" width={113} height={135}
          className="absolute w-[16.89%] h-auto"
          style={{ left: "68.46%", top: "41.08%", aspectRatio: "113/135", borderRadius: "var(--hiw-radius-lg)" }} />
        <Image src="/how/4.png" alt="" width={98} height={97}
          className="absolute w-[14.65%] h-auto"
          style={{ left: "60.09%", top: "15.73%", aspectRatio: "98/97", borderRadius: "var(--hiw-radius-md)" }} />
        <Image src="/how/6.png" alt="" width={107} height={106}
          className="absolute w-[16%] h-auto"
          style={{ left: "56.05%", top: "73.94%", aspectRatio: "107/106", borderRadius: "var(--hiw-radius-md)" }} />
        <Image src="/how/1.png" alt="" width={134} height={158}
          className="absolute w-[20.03%] h-auto"
          style={{ left: "8.07%", top: "16.9%", aspectRatio: "134/158", borderRadius: "var(--hiw-radius-lg)" }} />
        <Image src="/how/7.png" alt="" width={134} height={158}
          className="absolute w-[20.03%] h-auto"
          style={{ left: "11.21%", top: "60.8%", aspectRatio: "134/158", borderRadius: "var(--hiw-radius-lg)" }} />

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
  );
}

/* ═══════════════════════════════════════════════════════════════
   Chat input — original interface (step 1 content)
   ═══════════════════════════════════════════════════════════════ */
function ChatInput() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasText = inputValue.trim().length > 0;

  const handleSend = () => { window.location.href = "https://mapsgpt.es"; };

  return (
    <div className="flex flex-col items-center w-full max-w-[593px]">
      <div
        className="relative w-full rounded-2xl bg-white overflow-hidden cursor-text"
        style={{
          border: `1.5px solid ${isFocused ? "var(--hiw-accent)" : "var(--hiw-border)"}`,
          boxShadow: isFocused
            ? "0px 2px 12px rgba(0, 177, 212, 0.15)"
            : "var(--hiw-shadow-sm)",
          transition: `border-color var(--hiw-duration-fast), box-shadow var(--hiw-duration-fast)`,
        }}
        onClick={() => inputRef.current?.focus()}
      >
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
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            fontSize: "var(--hiw-text-sm)",
            color: "var(--hiw-accent)",
          }}>
            Suggested questions
          </span>
        </a>
        <div style={{ height: "1px", background: "var(--hiw-border)" }} />
        <div className="flex items-center gap-3 px-4" style={{ height: 70 }}>
          <div
            className="flex items-center justify-center shrink-0 rounded-full"
            style={{ width: 40, height: 40, border: "1.5px solid var(--hiw-border)", background: "var(--hiw-bg-subtle)" }}
            aria-hidden
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.5 8.5L8.5 15.5C6.84 17.16 4.16 17.16 2.5 15.5C0.84 13.84 0.84 11.16 2.5 9.5L9 3C10.1 1.9 11.9 1.9 13 3C14.1 4.1 14.1 5.9 13 7L6.5 13.5C5.95 14.05 5.05 14.05 4.5 13.5C3.95 12.95 3.95 12.05 4.5 11.5L10.5 5.5" stroke="var(--hiw-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
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
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "var(--hiw-text-primary)", caretColor: "var(--hiw-accent)" }}
            />
            {!isFocused && !inputValue && (
              <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-0.75">
                <span style={{ width: "2px", height: "20px", background: "#000", borderRadius: "1px", animation: "blink 1.1s step-start infinite", flexShrink: 0, display: "block" }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "var(--hiw-text-tertiary)", lineHeight: 1 }}>
                  Ask MapsGPT anything
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (hasText) handleSend(); }}
            className="flex items-center justify-center shrink-0 rounded-full"
            style={{
              width: 40, height: 40, background: "var(--hiw-accent)",
              opacity: hasText ? 1 : 0.4, cursor: hasText ? "pointer" : "default",
              transition: `opacity var(--hiw-duration-fast)`,
            }}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 14V4M4 9l5-5 5 5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <Link
        href="/technology"
        className="flex items-center justify-center gap-2 mt-6 hover:opacity-75"
        style={{ textDecoration: "none", transition: `opacity var(--hiw-duration-normal)`, opacity: 0.35 }}
      >
        <span
          className="text-[15px] leading-[140%]"
          style={{
            fontFamily: "var(--hiw-font-sans)", fontWeight: 274,
            background: "linear-gradient(90deg, #0A1342 0%, #2A2A2A 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
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
  );
}

/* ═══════════════════════════════════════════════════════════════
   StepCard — one step in the How It Works flow
   ═══════════════════════════════════════════════════════════════ */
function StepCard({
  step,
  reverse,
}: {
  step: Step;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-[var(--hiw-space-10)] lg:gap-[var(--hiw-space-16)] lg:grid-cols-[1fr_1fr]`}
    >
      {/* Image side */}
      <div className={`${reverse ? "lg:order-2" : "lg:order-1"} order-1`}>
        {step.imageCluster ? (
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-[669px] mb-[34px]">
              <ImageCluster />
            </div>
            <ChatInput />
          </div>
        ) : (
          <div
            className="w-full overflow-hidden"
            style={{
              borderRadius: "var(--hiw-step-image-radius)",
              boxShadow: "var(--hiw-shadow-card)",
            }}
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={step.image}
                alt={step.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        )}
      </div>

      {/* Text side */}
      <div className={`${reverse ? "lg:order-1" : "lg:order-2"} order-2`}>
        <h3
          style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            fontSize: "clamp(var(--hiw-text-xl), 4vw, var(--hiw-text-3xl))",
            lineHeight: "var(--hiw-leading-tight)" as unknown as number,
            background: step.titleGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
            marginBottom: "var(--hiw-space-4)",
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-regular)" as unknown as number,
            fontSize: "var(--hiw-text-base)",
            lineHeight: "var(--hiw-leading-relaxed)" as unknown as number,
            color: "var(--hiw-text-secondary)",
            margin: 0,
            maxWidth: 480,
          }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main section
   ═══════════════════════════════════════════════════════════════ */
export default function HowItWorksSection() {
  return (
    <section
      className="hiw-scope"
      style={{
        background: "var(--hiw-bg-page)",
        paddingTop: "var(--hiw-section-py)",
        paddingBottom: "var(--hiw-section-py)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--hiw-max-width)",
          marginInline: "auto",
          paddingInline: "var(--hiw-content-px)",
        }}
      >
        {/* Section heading */}
        <div style={{ textAlign: "center", marginBottom: "var(--hiw-step-gap)" }}>
          <h2
            style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-bold)" as unknown as number,
              fontSize: "clamp(var(--hiw-text-2xl), 5vw, var(--hiw-text-4xl))",
              lineHeight: "var(--hiw-leading-tight)" as unknown as number,
              color: "var(--hiw-text-primary)",
              margin: 0,
            }}
          >
            How It Works
          </h2>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--hiw-step-gap)",
          }}
        >
          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} reverse={i % 2 === 1} />
          ))}
        </div>

      </div>
    </section>
  );
}
