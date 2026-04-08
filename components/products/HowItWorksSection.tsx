"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, Star, Share, X, Copy, Link2, MessageCircle, Info, Ban, Flag, MapPin } from "lucide-react";
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
  favoriteCard?: boolean;
  recommendationCard?: boolean;
}

const STEPS: Step[] = [
  {
    title: "Chat to find what you need",
    titleGradient: "linear-gradient(90deg, #063140 0%, #5FBFF1 100%)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    image: "/how/center.png",
    imageAlt: "MapsGPT chat interface with destination suggestions",
    imageCluster: true,
  },
  {
    title: "Get personalized recommendations",
    titleGradient: "linear-gradient(90deg, #DE2F32 0%, #B00098 100%)",
    description:
      "MapsGPT remembers your preferences and continuously learns your vibes. The more you use it, the better it gets — surfacing spots that match your taste before you even ask.",
    image: "",
    imageAlt: "",
    recommendationCard: true,
  },
  {
    title: "Save & share your favorites",
    titleGradient: "linear-gradient(90deg, #0A6E5C 0%, #2A8FC2 100%)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image: "",
    imageAlt: "",
    favoriteCard: true,
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
  const isBeachVibes = index === 1;
  return (
    <div
      className="absolute flex items-center justify-center gap-1.5 px-2"
      style={{
        background: "var(--hiw-bg-card)",
        borderRadius: "var(--hiw-radius-full)",
        border: isBeachVibes ? "1px solid var(--hiw-border)" : "none",
        boxShadow: isBeachVibes ? "none" : "var(--hiw-shadow-sm)",
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
            boxShadow: "var(--hiw-shadow-card)",
          }}
        />
        <Image src="/how/hidden-gems.jpg" alt="Hidden gems" width={107} height={129}
          className="absolute w-[16%] h-auto object-cover"
          style={{ left: "34.98%", top: "5.4%", aspectRatio: "107/129", borderRadius: "var(--hiw-radius-md)", boxShadow: "var(--hiw-shadow-card)" }} />
        <Image src="/how/5.png" alt="" width={113} height={135}
          className="absolute w-[16.89%] h-auto"
          style={{ left: "68.46%", top: "41.08%", aspectRatio: "113/135", borderRadius: "var(--hiw-radius-lg)", boxShadow: "var(--hiw-shadow-card)" }} />
        <Image src="/how/adventure.jpg" alt="Adventure" width={98} height={97}
          className="absolute w-[14.65%] h-auto object-cover"
          style={{ left: "60.09%", top: "15.73%", aspectRatio: "98/97", borderRadius: "var(--hiw-radius-md)", boxShadow: "var(--hiw-shadow-card)" }} />
        <Image src="/how/art-culture.jpg" alt="Art & Culture" width={107} height={106}
          className="absolute w-[16%] h-auto object-cover"
          style={{ left: "56.05%", top: "73.94%", aspectRatio: "107/106", borderRadius: "var(--hiw-radius-md)", boxShadow: "var(--hiw-shadow-card)" }} />
        <Image src="/how/beach-vibes.jpg" alt="Beach Vibes" width={134} height={158}
          className="absolute w-[20.03%] h-auto object-cover"
          style={{ left: "8.07%", top: "16.9%", aspectRatio: "134/158", borderRadius: "var(--hiw-radius-lg)", boxShadow: "var(--hiw-shadow-card)" }} />
        <Image src="/how/cafe-culture.jpg" alt="Café Culture" width={134} height={158}
          className="absolute w-[20.03%] h-auto object-cover"
          style={{ left: "11.21%", top: "60.8%", aspectRatio: "134/158", borderRadius: "var(--hiw-radius-lg)", boxShadow: "var(--hiw-shadow-card)" }} />

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
            : "var(--hiw-shadow-card)",
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
   RecommendationCard — personalized recommendations showcase (step 2)
   Consistent card shell with FavoriteSpotCard; shows a conversational
   AI message that types in, followed by place cards that appear.
   ═══════════════════════════════════════════════════════════════ */
const REC_MSG = "Hey! While you were away I found some cool spots for your Madrid trip.";

const REC_PLACES = [
  { name: "Le Jules Verne", location: "Paris, France", rating: "4.8", tag: "Fine Dining", emoji: "🍷", image: "/see/4.png" },
  { name: "Aman Spa & Resort", location: "Ubud, Bali", rating: "4.9", tag: "Spa/Wellness", emoji: "🧖‍♀️", image: "/see/2.png" },
  { name: "Shibuya Sky", location: "Tokyo, Japan", rating: "4.7", tag: "Gen Z Spots", emoji: "✨", image: "/see/3.png" },
];

function RecommendationCard() {
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        // ── Professional typing animation ──
        // Pre-compute cumulative timestamps per character so rAF can
        // binary-search the current index — no setTimeout drift.
        // Timing: gentle ease-in (first few chars slower), natural
        // word-boundary breathing, soft punctuation holds.
        const len = REC_MSG.length;
        const timestamps: number[] = [];
        let t = 0;
        for (let i = 0; i < len; i++) {
          timestamps.push(t);
          const ch = REC_MSG[i];
          // Ease-in: first 8 chars ramp from 2× to 1× speed
          const warmup = i < 8 ? 1 + (1 - i / 8) * 1 : 1;
          // Base cadence per character
          let delay = 18 * warmup;
          // Contextual pauses
          if (/[.!?]/.test(ch))      delay = 160 * warmup;   // sentence end — breathe
          else if (ch === ",")        delay = 80 * warmup;    // clause pause
          else if (ch === " ") {
            // Word boundary — micro-pause, slightly longer before long words
            const nextWord = REC_MSG.slice(i + 1).split(/\s/)[0] || "";
            delay = (22 + Math.min(nextWord.length, 6) * 1.5) * warmup;
          }
          t += delay;
        }
        let raf: number;
        const start = performance.now() + 200; // initial hold before first char

        const frame = (now: number) => {
          const elapsed = now - start;
          if (elapsed < 0) { raf = requestAnimationFrame(frame); return; }

          // Find how many characters should be visible at this moment
          let idx = 0;
          let lo = 0, hi = len;
          while (lo < hi) {
            const mid = (lo + hi + 1) >>> 1;
            if (timestamps[mid] <= elapsed) lo = mid; else hi = mid - 1;
          }
          idx = Math.min(lo + 1, len);

          setTypedText(REC_MSG.slice(0, idx));

          if (idx >= len) {
            setTypingDone(true);
            return;
          }
          raf = requestAnimationFrame(frame);
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  // Stagger place cards after typing finishes
  useEffect(() => {
    if (!typingDone) return;
    const timers = [
      setTimeout(() => setVisibleCount(1), 400),
      setTimeout(() => setVisibleCount(2), 900),
      setTimeout(() => setVisibleCount(3), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [typingDone]);

  return (
    <div ref={cardRef} style={{
      background: "var(--hiw-bg-card)",
      borderRadius: "var(--hiw-radius-2xl)",
      boxShadow: "var(--hiw-shadow-lg)",
      padding: "var(--hiw-space-5)",
      width: "100%",
      overflow: "hidden",
    }}>
      {/* Chat bubble: logo + typed message */}
      <div style={{ display: "flex", gap: "var(--hiw-space-3)", alignItems: "flex-start", marginBottom: "var(--hiw-space-5)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "var(--hiw-radius-full)", overflow: "hidden", flexShrink: 0 }}>
          <Image src="/MapsGPT-logo.png" alt="MapsGPT" width={40} height={40} className="object-contain w-full h-full" />
        </div>
        <div>
          <span style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            fontSize: "var(--hiw-text-sm)",
            color: "var(--hiw-text-primary)",
            display: "block",
            marginBottom: "var(--hiw-space-1)",
          }}>MapsGPT</span>
          <div style={{
            fontFamily: "var(--hiw-font-sans)",
            fontSize: "var(--hiw-text-sm)",
            lineHeight: 1.5,
            color: "var(--hiw-text-secondary)",
            minHeight: 22,
          }}>
            {typedText}
            {!typingDone && (
              <span style={{
                display: "inline-block", width: 2, height: 14,
                background: "var(--hiw-text-primary)", borderRadius: 1,
                marginLeft: 1, verticalAlign: "text-bottom",
                animation: "blink 1.1s step-start infinite",
              }} />
            )}
          </div>
        </div>
      </div>

      {/* Place cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--hiw-space-3)" }}>
        {REC_PLACES.map((place, i) => (
          <div
            key={place.name}
            style={{
              display: "flex",
              gap: "var(--hiw-space-3)",
              alignItems: "center",
              padding: "var(--hiw-space-3)",
              borderRadius: "var(--hiw-radius-lg)",
              background: "var(--hiw-bg-subtle)",
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: "var(--hiw-radius-md)", overflow: "hidden", flexShrink: 0 }}>
              <Image src={place.image} alt={place.name} width={56} height={56} className="object-cover w-full h-full" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--hiw-space-2)", marginBottom: 2 }}>
                <span style={{
                  fontFamily: "var(--hiw-font-sans)",
                  fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
                  fontSize: "var(--hiw-text-sm)",
                  color: "var(--hiw-text-primary)",
                }}>{place.name}</span>
                <div style={{
                  display: "flex", alignItems: "center", gap: 2,
                  background: "var(--hiw-bg-card)", borderRadius: "var(--hiw-radius-sm)",
                  padding: "1px 6px",
                }}>
                  <Star size={10} fill="var(--hiw-accent-alt)" color="var(--hiw-accent-alt)" />
                  <span style={{
                    fontFamily: "var(--hiw-font-sans)",
                    fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
                    fontSize: "11px",
                    color: "var(--hiw-text-primary)",
                  }}>{place.rating}</span>
                </div>
              </div>
              <span style={{
                fontFamily: "var(--hiw-font-sans)",
                fontSize: "var(--hiw-text-xs)",
                color: "var(--hiw-text-secondary)",
              }}>{place.location}</span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: "var(--hiw-radius-full)",
              border: "1px solid var(--hiw-border)", background: "var(--hiw-bg-card)", flexShrink: 0,
            }}>
              <span style={{ fontSize: 12, lineHeight: 1 }}>{place.emoji}</span>
              <span style={{
                fontFamily: "var(--hiw-font-sans)", fontSize: "12px",
                fontWeight: "var(--hiw-weight-medium)" as unknown as number,
                color: "var(--hiw-text-primary)", whiteSpace: "nowrap",
              }}>{place.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer — match percentage */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "var(--hiw-space-2)", marginTop: "var(--hiw-space-4)", padding: "var(--hiw-space-2) 0",
        opacity: visibleCount >= 3 ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "var(--hiw-radius-full)", background: "#01A35D" }} />
        <span style={{
          fontFamily: "var(--hiw-font-sans)", fontSize: "var(--hiw-text-xs)",
          fontWeight: "var(--hiw-weight-medium)" as unknown as number,
          color: "var(--hiw-text-secondary)",
        }}>98% match to your taste</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FavoriteSpotCard — animated heart card (step 3 content)
   ═══════════════════════════════════════════════════════════════ */
const PARTICLES = [
  { angle: -80, dist: 38 }, { angle: -40, dist: 44 }, { angle: 0, dist: 40 },
  { angle: 40, dist: 44 }, { angle: 80, dist: 38 }, { angle: -130, dist: 42 },
  { angle: 130, dist: 42 }, { angle: 180, dist: 36 },
];

const FRIEND_AVATARS = [
  { img: 12, name: "Alex" }, { img: 32, name: "David" }, { img: 44, name: "Erick" },
  { img: 15, name: "Josue" }, { img: 59, name: "Justin S" }, { img: 28, name: "George" },
  { img: 36, name: "Yifei" }, { img: 51, name: "Tamara" },
];

const SHARE_ACTIONS = [
  { icon: "map", label: "Shared Map", color: "#5FBFF1" },
  { icon: "copy", label: "Copy Link", color: "#6B7280" },
  { icon: "whatsapp", label: "WhatsApp", color: "#25D366" },
  { icon: "sms", label: "SMS", color: "#34C759" },
  { icon: "snapchat", label: "Snapchat", color: "#FFFC00" },
  { icon: "telegram", label: "Telegram", color: "#0088CC" },
];

type Phase = "idle" | "tapping" | "filled" | "fading" | "share-tap" | "share-open" | "share-visible";

function ShareActionIcon({ type, color, size = 20 }: { type: string; color: string; size?: number }) {
  switch (type) {
    case "map": return <MapPin size={size} color={color} />;
    case "copy": return <Copy size={size} color={color} />;
    case "sms": return <MessageCircle size={size} color={color} />;
    case "whatsapp":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.8-2.93-.19-.3A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      );
    case "snapchat":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M12.206 1c.062 0 .124.002.186.005 1.9.07 3.313.93 4.19 2.553.46.85.55 2.058.55 2.76v.002c0 .344-.01.696-.034 1.06.182.083.387.125.607.125.263 0 .502-.062.692-.174a.42.42 0 01.217-.057c.1 0 .205.03.33.1.38.21.44.515.44.67 0 .443-.453.73-.843.922-.116.058-.226.11-.316.16-.5.27-.567.46-.527.63.04.16.19.33.38.46.73.5 1.58.88 2.15 1.07.29.1.5.35.55.65.04.21-.02.56-.56.73-.22.07-.49.13-.79.19-.14.03-.21.12-.24.28-.02.11-.05.23-.08.37-.05.21-.2.46-.67.46-.14 0-.29-.02-.46-.05-.42-.08-.84.03-1.34.17-.39.11-.83.24-1.37.28-.03 0-.06.01-.09.01-.72 0-1.32-.63-2.08-1.42-.47-.49-.96-.65-1.33-.65-.37 0-.86.16-1.33.65-.76.79-1.36 1.42-2.08 1.42-.03 0-.06 0-.09-.01-.54-.04-.98-.17-1.37-.28-.5-.14-.92-.25-1.34-.17-.17.03-.32.05-.46.05-.47 0-.62-.25-.67-.46-.03-.14-.06-.26-.08-.37-.03-.16-.1-.25-.24-.28-.3-.06-.57-.12-.79-.19-.54-.17-.6-.52-.56-.73.05-.3.26-.55.55-.65.57-.19 1.42-.57 2.15-1.07.19-.13.34-.3.38-.46.04-.17-.03-.36-.53-.63-.09-.05-.2-.1-.31-.16-.39-.19-.84-.48-.84-.92 0-.15.06-.46.44-.67.12-.07.23-.1.33-.1.07 0 .15.02.22.06.19.11.43.17.69.17.22 0 .42-.04.6-.12-.02-.37-.03-.72-.03-1.07v-.002c0-.7.09-1.91.55-2.76C8.7 1.93 10.113 1.07 12.013 1h.193z"/>
        </svg>
      );
    case "telegram":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      );
    default: return null;
  }
}

function FavoriteSpotCard() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => timers.current.forEach(clearTimeout);
    const after = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
    const runCycle = () => {
      clear(); timers.current = [];
      setPhase("idle");
      after(1500, () => setPhase("tapping"));
      after(1700, () => setPhase("filled"));
      after(2900, () => setPhase("fading"));
      after(3700, () => setPhase("share-tap"));
      after(4000, () => setPhase("share-open"));
      after(4400, () => setPhase("share-visible"));
      after(9400, runCycle);
    };
    after(800, runCycle);
    return clear;
  }, []);

  const isFilled = phase !== "idle" && phase !== "tapping";
  const showParticles = phase === "filled" || phase === "fading";
  const particleOpacity = phase === "filled" ? 1 : 0;
  const showSaved = isFilled && phase !== "share-open" && phase !== "share-visible";
  const heartScale = phase === "tapping" ? 1.4 : phase === "filled" ? 1.15 : 1;
  const shareScale = phase === "share-tap" ? 1.35 : 1;
  const isShareOpen = phase === "share-open" || phase === "share-visible";
  const shareCardReady = phase === "share-visible";

  return (
    <div style={{
      position: "relative",
      background: "var(--hiw-bg-card)", borderRadius: "var(--hiw-radius-2xl)",
      boxShadow: "var(--hiw-shadow-lg)", padding: "var(--hiw-space-5)",
      paddingBottom: "var(--hiw-space-8)", width: "100%", overflow: "hidden",
    }}>
      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--hiw-space-4)", overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--hiw-space-3)" }}>
          <span style={{ fontFamily: "var(--hiw-font-sans)", fontWeight: "var(--hiw-weight-bold)" as unknown as number, fontSize: "var(--hiw-text-sm)", letterSpacing: "0.07em", color: "var(--hiw-text-primary)" }}>ZLATÁ PRAHA</span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--hiw-space-1)", background: "var(--hiw-bg-subtle)", borderRadius: "var(--hiw-radius-sm)", padding: "3px 9px" }}>
            <Star size={12} fill="var(--hiw-accent-alt)" color="var(--hiw-accent-alt)" />
            <span style={{ fontFamily: "var(--hiw-font-sans)", fontWeight: "var(--hiw-weight-semibold)" as unknown as number, fontSize: "var(--hiw-text-xs)", color: "var(--hiw-text-primary)" }}>5.0</span>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--hiw-space-3)" }}>
          <span style={{
            fontFamily: "var(--hiw-font-sans)", fontSize: "var(--hiw-text-sm)", fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            color: "var(--hiw-accent)", whiteSpace: "nowrap", opacity: showSaved ? 1 : 0,
            transform: showSaved ? "translateX(0)" : "translateX(6px)",
            transition: `opacity var(--hiw-duration-normal) var(--hiw-easing-default), transform var(--hiw-duration-normal) var(--hiw-easing-default)`,
            pointerEvents: "none",
          }}>Saved!</span>
          {/* Heart button */}
          <div style={{ position: "relative", width: 22, height: 22, overflow: "visible" }}>
            {showParticles && PARTICLES.map((p, i) => {
              const rad = (p.angle * Math.PI) / 180;
              return (
                <span key={i} aria-hidden style={{
                  position: "absolute", top: "50%", left: "50%", fontSize: 9, lineHeight: 1, pointerEvents: "none",
                  transform: `translate(calc(-50% + ${Math.cos(rad) * p.dist}px), calc(-50% + ${Math.sin(rad) * p.dist}px)) scale(1)`,
                  opacity: particleOpacity, transition: `opacity 0.7s ease ${i * 25}ms`,
                }}>❤️</span>
              );
            })}
            <Heart size={22} fill={isFilled ? "var(--hiw-accent-alt)" : "none"} color={isFilled ? "var(--hiw-accent-alt)" : "var(--hiw-text-primary)"}
              style={{ position: "relative", zIndex: 1, transform: `scale(${heartScale})`, transition: `transform var(--hiw-duration-fast) var(--hiw-easing-spring)` }} />
          </div>
          {/* Share button */}
          <div style={{
            position: "relative", width: 22, height: 22,
            transform: `scale(${shareScale})`,
            transition: `transform var(--hiw-duration-fast) var(--hiw-easing-spring)`,
          }}>
            <Share size={22} color="var(--hiw-text-primary)"
              style={{ position: "relative", zIndex: 1 }} />
          </div>
        </div>
      </div>

      {/* ── Image ── */}
      <div style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: "var(--hiw-radius-lg)", overflow: "hidden", marginBottom: "var(--hiw-space-5)" }}>
        <img src={`/FavoriteSpots/${encodeURIComponent("(20).jpeg")}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* ── Bottom text ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--hiw-space-3)" }}>
        <img src="https://i.pravatar.cc/80?img=47" alt="" style={{ width: 44, height: 44, borderRadius: "var(--hiw-radius-full)", objectFit: "cover", flexShrink: 0, marginTop: "var(--hiw-space-1)" }} />
        <p className="text-[20px] lg:text-[26px]" style={{ fontFamily: "var(--hiw-font-sans)", fontWeight: "var(--hiw-weight-medium)" as unknown as number, lineHeight: "var(--hiw-leading-snug)" as unknown as number, color: "var(--hiw-text-primary)", margin: 0 }}>
          Find me a cute romantic restaurant with views of the river
        </p>
      </div>

      {/* ═══ Share card overlay ═══ */}
      {/* Dark blurred backdrop */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 5,
        background: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        borderRadius: "var(--hiw-radius-2xl)",
        opacity: isShareOpen ? 1 : 0,
        pointerEvents: isShareOpen ? "auto" : "none",
        transition: "opacity 0.35s var(--hiw-easing-default)",
      }} />

      {/* Share card — slides up from bottom */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 6,
        height: "90%",
        background: "var(--hiw-bg-card)",
        borderRadius: "var(--hiw-radius-2xl) var(--hiw-radius-2xl) var(--hiw-radius-2xl) var(--hiw-radius-2xl)",
        boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.15)",
        transform: isShareOpen ? "translateY(0)" : "translateY(100%)",
        opacity: isShareOpen ? 1 : 0,
        transition: "transform 0.4s var(--hiw-easing-spring), opacity 0.3s var(--hiw-easing-default)",
        display: "flex", flexDirection: "column",
        padding: "var(--hiw-space-5)",
        overflow: "hidden",
      }}>
        {/* Share card header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--hiw-space-5)", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--hiw-font-sans)", fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            fontSize: "var(--hiw-text-xl)", color: "var(--hiw-text-primary)",
          }}>Send to</span>
          <div style={{
            width: 36, height: 36, borderRadius: "var(--hiw-radius-full)",
            background: "var(--hiw-bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
            <X size={18} color="var(--hiw-text-secondary)" />
          </div>
        </div>

        {/* Friends row */}
        <div style={{
          display: "flex", gap: "var(--hiw-space-4)", marginBottom: "var(--hiw-space-5)", flexShrink: 0,
          overflowX: "auto", paddingBottom: "var(--hiw-space-1)",
        }}>
          {FRIEND_AVATARS.map((friend) => (
            <div key={friend.name} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--hiw-space-2)",
              minWidth: 56,
              opacity: shareCardReady ? 1 : 0,
              transform: shareCardReady ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.3s var(--hiw-easing-default), transform 0.3s var(--hiw-easing-default)",
            }}>
              <img
                src={`https://i.pravatar.cc/80?img=${friend.img}`} alt={friend.name}
                style={{ width: 56, height: 56, borderRadius: "var(--hiw-radius-full)", objectFit: "cover" }}
              />
              <span style={{
                fontFamily: "var(--hiw-font-sans)", fontSize: "var(--hiw-text-xs)", fontWeight: "var(--hiw-weight-medium)" as unknown as number,
                color: "var(--hiw-text-secondary)", whiteSpace: "nowrap",
              }}>{friend.name}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--hiw-border-light)", marginBottom: "var(--hiw-space-4)", flexShrink: 0 }} />

        {/* Action buttons row */}
        <div style={{
          display: "flex", gap: "var(--hiw-space-4)", marginBottom: "var(--hiw-space-5)", flexShrink: 0,
          overflowX: "auto", paddingBottom: "var(--hiw-space-1)",
        }}>
          {SHARE_ACTIONS.map((action, i) => (
            <div key={action.label} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--hiw-space-2)",
              minWidth: 56,
              opacity: shareCardReady ? 1 : 0,
              transform: shareCardReady ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.3s var(--hiw-easing-default) ${i * 40}ms, transform 0.3s var(--hiw-easing-default) ${i * 40}ms`,
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: "var(--hiw-radius-full)",
                background: action.icon === "snapchat" ? "#FFFC00" : "var(--hiw-bg-subtle)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid var(--hiw-border-light)`,
              }}>
                <ShareActionIcon type={action.icon} color={action.icon === "snapchat" ? "#111" : action.color} size={24} />
              </div>
              <span style={{
                fontFamily: "var(--hiw-font-sans)", fontSize: "var(--hiw-text-xs)", fontWeight: "var(--hiw-weight-medium)" as unknown as number,
                color: "var(--hiw-text-secondary)", whiteSpace: "nowrap", textAlign: "center",
              }}>{action.label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--hiw-border-light)", marginBottom: "var(--hiw-space-4)", flexShrink: 0 }} />

        {/* Bottom row — Report, Not interested, Info */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "var(--hiw-space-8)", flexShrink: 0,
          opacity: shareCardReady ? 1 : 0,
          transition: "opacity 0.3s var(--hiw-easing-default) 0.15s",
        }}>
          {[
            { icon: <Flag size={22} color="var(--hiw-text-tertiary)" />, label: "Report" },
            { icon: <Ban size={22} color="var(--hiw-text-tertiary)" />, label: "Not interested" },
            { icon: <Info size={22} color="var(--hiw-text-tertiary)" />, label: "Info" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--hiw-space-2)",
              cursor: "pointer",
            }}>
              {item.icon}
              <span style={{
                fontFamily: "var(--hiw-font-sans)", fontSize: "var(--hiw-text-xs)", fontWeight: "var(--hiw-weight-medium)" as unknown as number,
                color: "var(--hiw-text-tertiary)", whiteSpace: "nowrap",
              }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
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
        ) : step.recommendationCard ? (
          <div className="w-full max-w-lg mx-auto">
            <RecommendationCard />
          </div>
        ) : step.favoriteCard ? (
          <div className="w-full max-w-lg mx-auto">
            <FavoriteSpotCard />
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
            fontSize: "clamp(32px, 4vw, var(--hiw-text-3xl))",
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
            fontSize: "20px",
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
              fontSize: "clamp(42px, 5vw, var(--hiw-text-4xl))",
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
