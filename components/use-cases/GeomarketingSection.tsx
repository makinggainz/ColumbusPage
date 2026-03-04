"use client";

import Image from "next/image";

const Pin = ({ top, left }: { top: string; left: string }) => (
  <Image
    src="/use-cases/pin.png"
    alt="pin"
    width={62}
    height={87}
    className="absolute"
    style={{ top, left }}
  />
);

export function GeomarketingSection() {
  return (
    <section className="bg-[#F2F2F2] py-20 lg:py-[140px]">

      <div className="max-w-[1728px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-[80px] px-6 lg:px-[60px]">

        {/* LEFT TEXT */}
        <div>

          <h2 className="text-3xl lg:text-[38px] leading-tight font-medium">
            Geomarketing
          </h2>

          <p className="mt-6 text-[#7A7A7A]">
            Columbus
          </p>

        </div>


        {/* MAP SIDE */}
        <div>

          <div className="relative w-full h-[420px] md:h-[520px] lg:h-[674px] rounded-[12px] overflow-hidden">

            <Image
              src="/use-cases/gm.png"
              alt="geomarketing map"
              fill
              className="object-cover"
            />

            {/* PINS (LEFT SIDE CLUSTER) */}
            <Pin top="26%" left="22%" />
            <Pin top="44%" left="28%" />
            <Pin top="28%" left="52%" />
            <Pin top="45%" left="40%" />
            <Pin top="60%" left="25%" />
            <Pin top="68%" left="34%" />

            {/* AI CARD (RIGHT BOTTOM) */}
            <div className="absolute right-4 md:right-10 lg:right-[10px] bottom-4 md:bottom-10 lg:bottom-[60px] w-[92%] md:w-[407px] rounded-[24px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">

              {/* THINKING AREA */}
              <div className="bg-[#ECECEC] p-6 md:p-8">

                <p className="text-sm text-gray-500 mb-4">
                  Columbus is thinking...
                </p>

                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Considering demographics of Miami</li>
                  <li>Considering billboard prices</li>
                  <li>Considering trade area competition</li>
                  <li>Considering your customer target</li>
                </ul>

              </div>

              {/* PROMPT */}
              <div className="bg-white p-5 flex justify-between items-center gap-4">

                <div>

                  <div className="text-xs border border-gray-200 px-3 py-1 rounded-full inline-block mb-3">
                    NewCafeMarketing
                  </div>

                  <p className="text-sm leading-relaxed">
                    I want to run an ad for my new Coffee shop. The ad would be
                    about an opening day promotion. My Cafe’s marketing and
                    business vibe is attached in the pdf. Where should I put up
                    ads?
                  </p>

                </div>

                <div className="w-8 h-8 bg-[#1F2A6B] rounded-md" />

              </div>

            </div>

          </div>


          {/* LINKS */}
          <div className="flex justify-between mt-6 font-semibold">
            <span>How we do it?</span>
            <span>Other questions</span>
          </div>

        </div>

      </div>

    </section>
  );
}