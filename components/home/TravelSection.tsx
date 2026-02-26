"use client";

import Image from "next/image";

export const TravelSection = () => {
  return (
    <div className="w-full flex justify-center bg-[#EDEDED]">

      {/* 404 FRAME */}
      <div className="relative w-[404px] h-[1902px] bg-[#EDEDED]">

        {/* ORANGE PANEL */}
        <div className="absolute left-[15.5px] top-0 w-[373px] min-h-[1902px] rounded-[20px] bg-[#E7CBBE] px-[49px] pt-[80px]">

          {/* HEADER TEXT */}
          <p className="text-[12px] tracking-[0.18em] uppercase text-[#1C274C]/60 mb-[14px]">
            Available everywhere
          </p>

          <h2 className="font-[Cambo] text-[32px] leading-[42px] text-[#1C274C] mb-[18px]">
            Travel like a boss
          </h2>

          {/* DESK IMAGE FIRST */}
          <div className=" relative w-[320px] h-[641px] rounded-[16px] overflow-hidden mb-[28px]">
            <Image
              src="/emoji/image.png"
              alt="Desktop Preview"
              fill
              className="object-cover"
            />
          </div>

          {/* MAPSGPT TEXT + BULLETS */}
          <p className="text-[18px] text-[#1C274C] mb-[14px]">
            MapsGPT is local guide in your pocket.
          </p>

          <ul className="space-y-[4px] text-[18px] text-[#1C274C] mb-[28px]">
            <li>• Plan cool trips</li>
            <li>• make itineraries</li>
            <li>• take care of every preference & detail</li>
          </ul>

          {/* MOBILE IMAGE NEXT */}
          <div className="relative w-[307px] h-[590px] rounded-[28px] overflow-hidden mb-[38px]">
            <Image
              src="/emoji/mob.png"
              alt="Mobile Preview"
              fill
              className="object-cover"
            />
          </div>

                {/* FIND TEXT */}
        <p className="text-[16px] text-[#1C274C] mb-[16px]">
          Find your next hang out spot, easier.
        </p>

        {/* LEARN MORE (LEFT) */}
        <p className="text-[14px] text-[#1C274C] mb-[16px]">
          Learn more →
        </p>

        {/* TRY IT OUT (CENTERED BELOW) */}
        <div className="flex justify-center">
          <button className="h-[32px] px-[18px] bg-white border border-black/30 rounded-[6px] text-[14px]">
            Try it out →
          </button>
        </div>

        </div>
      </div>
    </div>
  );
};