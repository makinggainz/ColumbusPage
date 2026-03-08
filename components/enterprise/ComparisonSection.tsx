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

            {/* Card with perfect image fit */}
            <div className="relative w-full max-w-[467px] aspect-[467/319] rounded-[10px] overflow-hidden shadow-md">
            <Image
              src="/enterprise/lgm.png"
              alt="lgm"
              fill
              className="object-cover scale-[1.15]"
            />
          </div>

            <ul className="mt-8 space-y-3 text-left max-w-[420px]">
              <li>✔ Highest fidelity and fresh data</li>
              <li>✔ Understands space and coordinates</li>
              <li>✔ Spatial and contextual reasoning</li>
              <li>✔ Thinks with human-like intuition</li>
              <li>✔ Produces maps and visuals</li>
              <li>✔ Built for physical world, enterprises</li>
            </ul>
          </div>

          {/* Basic AI */}
          <div className="flex flex-col items-center text-center">

            <h3 className="text-[32px] font-[Instrument_Serif] mb-6">
              Basic AI
            </h3>

            <div className="relative w-full max-w-[467px] aspect-[467/319] rounded-[10px] overflow-hidden">
              <Image
                src="/enterprise/basic.png"
                alt="basic"
                fill
                className="object-cover opacity-90"
              />
            </div>

            <ul className="mt-8 space-y-3 text-left max-w-[420px]">
              <li>✖ Regurgitates old articles about areas</li>
              <li>
                ✖ Hallucinates Coordinates 60% of time{" "}
                <span className="text-blue-600">Source</span>
              </li>
              <li>✖ Limited data reach</li>
              <li>✖ Text outputs, no map or GIS</li>
              <li>✖ Built for text, consumers</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}