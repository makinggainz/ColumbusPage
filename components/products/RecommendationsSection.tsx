"use client";

import Image from "next/image";

export default function RecommendationsSection() {
  const categories = [
    { label: "Spa / Wellness", icon: "💆‍♀️" },
    { label: "Gen Z Spots", icon: "✨" },
    { label: "Fine Dining", icon: "🍷" },
  ];

  return (
    <section className="bg-[#F6F7F8] py-32 px-6">
      <div className="max-w-[1730px] mx-auto">

        {/* ================= HEADLINE ================= */}
        <div className="text-center mb-20">
          <h2 className="text-[#1F6F6C] font-semibold text-[clamp(32px,4vw,64px)] leading-[140%] max-w-[1186px] mx-auto">
            Or get daily recommendations from our AI.
          </h2>

          <p className="text-[#1F6F6C] mt-6 text-[clamp(18px,2.5vw,36px)] leading-[140%] max-w-[797px] mx-auto">
            We’re thinking of new places for you while you sleep
          </p>
        </div>

        {/* ================= CHAT ================= */}
        <div className="flex items-center gap-6 mb-16 max-w-[600px]">
          <div className="w-[69px] h-[69px] relative flex-shrink-0">
            <Image
              src="/how/ai.png"
              alt="AI"
              fill
              className="object-contain"
            />
          </div>

          <p className="text-[#2C2C2C] text-[20px] leading-[140%]">
            Hey you, while you were away I found some places you’d like.
          </p>
        </div>

        {/* ================= CATEGORY PILLS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] 
                         flex items-center justify-center gap-2
                         w-[160px] h-[45px] rounded-full text-sm mx-auto"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[49px]">

          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex flex-col items-center">

              <button
                className="w-full max-w-[497px] h-[334px] bg-white 
                           rounded-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.06)]
                           hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)]
                           transition text-left"
              >
                {/* IMAGE */}
                <div className="w-[462px] h-[170px] mx-auto mt-[18px] rounded-[11px] overflow-hidden">
                  <Image
                    src="/how/card.png"
                    alt=""
                    width={462}
                    height={170}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* TEXT */}
                <div className="px-6 mt-5">
                  <h3 className="text-[20px] font-semibold text-[#0E2F44]">
                    The Palm Hotel
                  </h3>

                  <p className="text-[16px] text-[#6E8C8C] mt-2 leading-[140%]">
                    Luxury hotel, unique aquarium restaurant.
                    Great food, and a great view.
                  </p>

                  <p className="text-[16px] text-[#6E8C8C] mt-3">
                    Dubai, UAE
                  </p>
                </div>
              </button>

              {/* AVATARS */}
              <div className="flex items-center gap-5 mt-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((a) => (
                    <div
                      key={a}
                      className="w-[47px] h-[47px] rounded-full 
                                 border-[3px] border-white bg-gray-300"
                    />
                  ))}
                </div>

                <span className="text-[20px] text-[#2C2C2C] leading-[140%] max-w-[240px]">
                  others like you, loved this spot
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        <div className="text-center mt-24">
          <p className="text-[20px] text-[#2C2C2C] mb-8">
            What’re you waiting for?
          </p>

          <button
            className="border border-[#CFCFCF] bg-white hover:bg-gray-50 transition
                       w-full max-w-[857px] h-[74px] rounded-[12px] text-[18px]"
          >
            Find your own favourite spots now →
          </button>
        </div>

      </div>
    </section>
  );
}