"use client";

import Image from "next/image";
import Link from "next/link";

export default function RecommendationsSection() {
  const categories = [
    { label: "Spa/Wellness", icon: "🧖‍♀️" },
    { label: "Gen Z Spots", icon: "✨" },
    { label: "Fine Dining", icon: "🍷" },
  ];

  return (
    <section className="bg-[#F9F9F9] py-32 px-6">
      <div className="max-w-[1730px] mx-auto">

        {/* ================= HEADLINE ================= */}
        <div className="text-center mb-20">
          <h2 className="text-[#1F6F6C] font-semibold text-[clamp(32px,4vw,64px)] leading-[140%] max-w-[1400px] mx-auto">
            Or get daily recommendations from our AI.
          </h2>

          <p className="text-[#1F6F6C] mt-6 text-[clamp(18px,2.5vw,36px)] leading-[140%] max-w-[797px] mx-auto">
            We’re thinking of new places for you while you sleep
          </p>
        </div>

        {/* ================= CHAT ================= */}
        <div className="flex items-center gap-6 mb-16 max-w-[560px] ml-[40px]">
          <div className="w-[69px] h-[69px] relative flex-shrink-0">
            <Image
              src="/how/ai.png"
              alt="AI"
              fill
              className="object-contain"
            />
          </div>

          <p className="text-[#2C2C2C] text-[20px] leading-[140%]">
            Hey you, while you were away
            <br />
            I found some places you’d like.
          </p>
        </div>

        {/* ================= CARDS: 10 cards with category pill each, infinite marquee ================= */}
        <div className="relative overflow-hidden w-full">
          {/* Left edge gradient: white → transparent, 50px */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-[50px] shrink-0"
            style={{
              background: "linear-gradient(to right, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
            }}
            aria-hidden
          />
          {/* Right edge gradient: transparent → white, 50px */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-[50px] shrink-0"
            style={{
              background: "linear-gradient(to left, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
            }}
            aria-hidden
          />
          <div className="recommendations-marquee flex gap-[49px] items-start">
            {Array.from({ length: 10 }).map((_, index) => (
              <CardWithPill
                key={index}
                category={categories[index % categories.length]}
              />
            ))}
            {Array.from({ length: 10 }).map((_, index) => (
              <CardWithPill
                key={`dup-${index}`}
                category={categories[index % categories.length]}
                ariaHidden
              />
            ))}
          </div>
        </div>

        {/* ================= CTA ================= */}
        <div className="text-center mt-24">
          <p className="text-[20px] text-[#2C2C2C] mb-3 font-semibold">
            What’re you waiting for?
          </p>

          <Link
            href="/maps-gpt"
            className="inline-flex items-center justify-center border border-[#CFCFCF] bg-white hover:bg-gray-50 transition w-full max-w-[857px] h-[74px] rounded-[12px] text-[18px] text-[#2C2C2C] no-underline cursor-pointer"
          >
            Find your own favourite spots now →
          </Link>
        </div>

      </div>
    </section>
  );
}

type Category = { label: string; icon: string };

function CardWithPill({
  category,
  ariaHidden = false,
}: {
  category: Category;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center w-[497px] shrink-0 gap-4"
      aria-hidden={ariaHidden || undefined}
    >
      <div
        className="flex items-center justify-center gap-2 w-[160px] h-[45px] rounded-[22.5px] box-border shrink-0"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(13, 43, 97, 0.2)",
        }}
      >
        <span className="leading-none" aria-hidden>{category.icon}</span>
        <span
          className="text-center"
          style={{
            fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
            fontStyle: "normal",
            fontWeight: 510,
            fontSize: "16px",
            lineHeight: "140%",
            color: "#000000",
          }}
        >
          {category.label}
        </span>
      </div>
      <RecommendationCard />
    </div>
  );
}

function RecommendationCard({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean } = {}) {
  return (
    <div className="relative w-[497px] h-[334px] shrink-0" aria-hidden={ariaHidden}>
      {/* Parent layer: 497×334, bg rgba(255,255,255,0.1), radius 14px */}
      <div
        className="absolute inset-0 rounded-[14px] overflow-hidden text-left"
        style={{
          width: 497,
          height: 334,
          background: "rgba(255, 255, 255, 0.1)",
        }}
      >
      {/* Image: 462×170, 16px from left, 19px from top */}
      <div className="absolute left-4 top-[19px] w-[462px] max-w-[calc(100%-32px)] h-[170px] rounded-[11px] overflow-hidden">
        <Image
          src="/how/card.png"
          alt=""
          width={462}
          height={170}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Rating pill: 64×28, top-right */}
      <div
        className="absolute right-[30px] top-[28px] w-[64px] h-[28px] rounded-[14px] flex items-center justify-center gap-1"
        style={{ background: "rgba(217, 217, 217, 0.5)" }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E46962" />
        </svg>
        <span
          className="font-semibold text-[16px] leading-[140%] tracking-[-0.02em] text-black"
          style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          4.2
        </span>
      </div>

      {/* Title: The Palm Hotel */}
      <h3
        className="absolute left-4 top-[198px] text-[20px] font-semibold leading-[140%] tracking-[-0.02em] text-black"
        style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 590 }}
      >
        The Palm Hotel
      </h3>

      {/* Description */}
      <p
        className="absolute left-4 top-[229px] max-w-[412px] text-[20px] font-normal leading-[140%] tracking-[-0.02em] text-black"
        style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        Luxury hotel, with unique aquarium restaurant. Great food, and a great view.
      </p>

      {/* Location: icon + Dubai, UAE, opacity 0.7 */}
      <div className="absolute left-[10px] bottom-[30px] flex items-center gap-2 opacity-70">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-black" aria-hidden>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="currentColor" />
        </svg>
        <span
          className="text-[20px] leading-[140%] tracking-[-0.02em] text-black"
          style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 400 }}
        >
          Dubai, UAE
        </span>
      </div>
      </div>
    </div>
  );
}