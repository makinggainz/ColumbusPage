"use client";

import Image from "next/image";

export default function SuperModelSection() {
  return (
    <section className="w-full bg-black py-[120px] flex justify-center">
      <div className="w-full max-w-[1728px] px-[100px] max-xl:px-12 max-md:px-6">

        {/* TITLE */}
        <h2 className="text-white text-[36px] font-semibold mb-[50px] max-md:text-[28px]">
          Surveying the earth with a super model
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-[410px_1203px] gap-[15px] justify-start max-xl:grid-cols-[410px_1fr] max-lg:grid-cols-1">

          {/* LEFT PANEL */}
          <div className="border border-[#2a2a2a] text-white flex flex-col h-[674px] max-lg:h-auto">

            {/* MAIN CARD */}
            <div className="p-6 border-b border-[#2a2a2a] flex-1">

              <h3 className="text-[24px] font-semibold mb-4">
                Generative Geodata
              </h3>

              <p className="text-gray-400 text-[16px] leading-relaxed mb-4">
                Columbus has brought accurate GenAI to GeoData,
                dynamically creating new layers of geospatial
                information using our UGM.
              </p>

              <p className="text-gray-400 text-[16px] leading-relaxed mb-4">
                “Smart Layers” can be used to create creative data layers
                that would otherwise be time-intensive or expensive to obtain.
              </p>

              <p className="text-gray-400 text-[16px] leading-relaxed">
                Smart layers can also be used when data is unavailable
                or hard to survey.
              </p>

            </div>

            {/* MENU */}
            <div className="divide-y divide-[#2a2a2a] text-[20px]">

              <div className="px-6 py-[22px] hover:bg-white/5 cursor-pointer">
                Predicting future
              </div>

              <div className="px-6 py-[22px] hover:bg-white/5 cursor-pointer">
                Creative data layers
              </div>

              <div className="px-6 py-[22px] hover:bg-white/5 cursor-pointer">
                Generative surveying
              </div>

            </div>

          </div>

          {/* MAP */}
          <div className="relative w-[1203px] h-[674px] max-xl:w-full max-lg:h-[520px] max-md:h-[420px] rounded-lg overflow-hidden">

            <Image
              src="/use-cases/havana.png"
              alt="Geospatial map"
              fill
              className="object-cover"
            />

            {/* COLOR SCALE */}
            <div className="absolute left-[20px] top-[120px] h-[220px] w-[12px] rounded-full bg-gradient-to-b from-green-400 via-yellow-400 to-red-500"/>

            {/* CHAT PROMPT */}
            <div className="absolute bottom-[24px] left-[100px] w-[607px] h-[97px] bg-white text-black rounded-xl shadow-xl flex items-center justify-between px-5">

              <p className="text-[20px] leading-snug max-w-[500px]">
                I need a data layer of buildings in Havana by safety score.
                In the perspective of: City Planning
              </p>

              <div className="w-[32px] h-[32px] bg-[#1c2c6b] rounded-md flex-shrink-0"/>

            </div>

            {/* BRAND */}
            <div className="absolute bottom-[24px] right-[24px] text-white text-[13px] opacity-80">
              Built on Columbus Pro
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center mt-[25px] text-gray-300 text-[25px]">

          <p className="ml-auto mr-[80px]">
            Generating Ground truths
          </p>

          <button className="hover:underline">
            See live Smart Layers →
          </button>

        </div>

      </div>
    </section>
  );
}