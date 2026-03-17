"use client";

import Image from "next/image";

export default function FavoritesSection() {
  return (
    <>
      {/* ================= SECTION 1: Headline + 2 emojis ================= */}
      <section className="bg-[#F9F9F9] w-full overflow-hidden min-h-[1000px] flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 text-center">
            <span className="hover-bee inline-block cursor-default transition-transform">
              <Image
                src="/how/light.png"
                alt=""
                width={120}
                height={100}
                className="w-20 sm:w-24 lg:w-32 h-auto block"
              />
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-black leading-tight max-w-3xl">
              Let our AI find you
              <br className="hidden sm:block" />
              the coolest place, faster.
            </h2>
            <span className="hover-bee inline-block cursor-default transition-transform">
              <Image
                src="/how/serach.png"
                alt=""
                width={120}
                height={100}
                className="w-20 sm:w-24 lg:w-32 h-auto block"
              />
            </span>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: Save favorites + card + bottom text ================= */}
      <section className="bg-[#F9F9F9] w-full overflow-hidden relative min-h-[1400px] flex flex-col">
        <span
          className="absolute left-6 lg:left-12 top-6 lg:top-8 text-[#E5E5E5] font-semibold text-4xl sm:text-5xl lg:text-6xl leading-none select-none"
          aria-hidden
        >
          2
        </span>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pt-0 pb-0 flex flex-col flex-1 min-h-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p
                className="max-w-[739px]"
                style={{
                  fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontStyle: "normal",
                  fontWeight: 590,
                  fontSize: "64px",
                  lineHeight: "140%",
                  display: "block",
                  background: "linear-gradient(90deg, #DE2F32 0%, #B00098 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Save your favorite spots, share with your friends.
              </p>
            </div>
            <div className="relative flex justify-end">
              <div className="relative w-full max-w-2xl aspect-[4/3] overflow-hidden rounded-[26px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <Image
                  src="/QuestionsMapsGPT/FavoriteQuestion.png"
                  alt=""
                  fill
                  className="object-contain rounded-[26px]"
                />
              </div>
            </div>
          </div>

          <div className="mt-24 flex justify-center mb-[100px] mt-auto relative z-20">
            <p
              className="text-center max-w-[837px]"
              style={{
                fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "48px",
                lineHeight: "140%",
                display: "block",
                background: "linear-gradient(180deg, #000000 0%, #666666 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MapsGPT remembers your preferences,
              <br />
              and continuously learns
              <br />
              your vibes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}