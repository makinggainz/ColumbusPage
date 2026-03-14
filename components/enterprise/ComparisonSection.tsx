"use client";

import Image from "next/image";

export default function ComparisonSection() {
  return (
    <section className="w-full bg-[#F6F5F4] py-20 lg:py-[140px]">
      <div className="max-w-[1728px] mx-auto px-6 flex flex-col items-center">

        {/* Title */}
        <h2
          className="
          font-[Instrument_Serif]
          text-[36px]
          md:text-[48px]
          lg:text-[64px]
          leading-[140%]
          text-center
          whitespace-nowrap
        "
        >
          See How We’re Different
        </h2>

        {/* Prompt Box */}
        <div
          className="
          mt-8
          w-full
          max-w-[759px]
          bg-white
          border
          border-[#1B37CE]/25
          rounded-[14px]
          px-6
          py-5
          flex
          items-center
          justify-between
          gap-6
        "
        >
          {/* Text (3 line clamp) */}
          <p
            className="
            text-[16px]
            md:text-[20px]
            font-medium
            leading-[140%]
            tracking-[-0.02em]
            text-left
            line-clamp-3
          "
          >
            generate the fastest route for next tuesday 10am. It’ll be a
            multi-stop route through Philadelphia. I’ve attached a file with
            vehicle type and each location.
          </p>

          {/* Button */}
          <button
            className="
            flex-shrink-0
            w-[54px]
            h-[55px]
            rounded-[11px]
            bg-[#0A1344]
            flex
            items-center
            justify-center
            text-white
          "
          >
            →
          </button>
        </div>

        {/* Comparison */}
        <div className="mt-20 w-full grid lg:grid-cols-2 gap-16 relative">

          {/* Divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#DADADA]" />

          {/* Columbus LGM */}
          <div className="flex flex-col items-center text-center">

            <h3 className="text-[32px] font-[Instrument_Serif] mb-6 flex items-center gap-3">
              <Image
                src="/enterprise/logo.png"
                alt="columbus"
                width={42}
                height={42}
              />
              Columbus LGM
            </h3>

            {/* Card with perfect image fit — same width as list below so left edges align */}
            <div className="w-full max-w-[467px]">
              <div className="relative w-full aspect-[467/319] rounded-[10px] overflow-hidden shadow-md">
                <Image
                  src="/enterprise/lgm.png"
                  alt="lgm"
                  fill
                  className="object-cover scale-[1.15]"
                />
              </div>

              <ul className="mt-8 space-y-3 text-left w-full list-none pl-0 text-[16px] md:text-[20px] font-normal leading-[140%] tracking-[-0.02em] text-black">
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Highest fidelity and fresh data</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Understands space and coordinates</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Spatial and contextual reasoning</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Thinks with human-like intuition</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Produces maps and visuals</li>
                <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Built for physical world, enterprises</li>
              </ul>
            </div>
          </div>

          {/* Basic AI */}
          <div className="flex flex-col items-center text-center">

            <h3 className="text-[32px] font-[Instrument_Serif] mb-6">
              Basic AI
            </h3>

            <div className="w-full max-w-[467px]">
              <div className="relative w-full aspect-[467/319] rounded-[10px] overflow-hidden">
                <Image
                  src="/enterprise/basic.png"
                  alt="basic"
                  fill
                  className="object-cover opacity-90"
                />
              </div>

              <ul className="mt-8 space-y-3 text-left w-full list-none pl-0 text-[16px] md:text-[20px] font-normal leading-[140%] tracking-[-0.02em] text-black">
                <li className="flex items-center gap-2"><span className="text-red-500">✖</span> Regurgitates old articles about areas</li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✖</span> Hallucinates Coordinates 60% of time{" "}
                  <span className="text-blue-600">Source</span>
                </li>
                <li className="flex items-center gap-2"><span className="text-red-500">✖</span> Limited data reach</li>
                <li className="flex items-center gap-2"><span className="text-red-500">✖</span> Text outputs, no map or GIS</li>
                <li className="flex items-center gap-2"><span className="text-red-500">✖</span> Built for text, consumers</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}