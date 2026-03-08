"use client";

import Image from "next/image";

function PromptCard({ image, text }: { image: string; text: string }) {
  return (
    
    <div className="w-[320px] md:w-[360px] lg:w-[376px] rounded-[18px] bg-[#FDFDFD] border border-[#EDEDED] shadow-lg overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 text-[14px] text-[#374151] font-medium">
        🌐 I created this map for you
      </div>

      {/* Image */}
      <div className="relative w-full h-[180px] md:h-[200px]">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Prompt */}
      <div className="flex items-center justify-between px-4 py-3 bg-white text-[14px] leading-[140%]">
        <span className="max-w-[240px] md:max-w-[260px]">{text}</span>
        <div className="w-6 h-6 bg-[#0E1A44] rounded-[6px]" />
      </div>

    </div>
  );
}

function CenterPrompt() {
  return (
    <div className="w-[320px] md:w-[420px] lg:w-[503px] rounded-[18px] bg-[#F7F7F7] border border-[#EDEDED] shadow-xl overflow-hidden">

      <div className="px-5 py-4 text-[13px] text-[#6B7280] leading-[150%]">

        <div className="flex items-center gap-2 mb-2 font-medium text-[#4B5563]">
          🌐 Columbus is thinking...
        </div>

        <p>Considering demographics of Madrid</p>
        <p>Considering commercial lot prices</p>
        <p>Considering trade area competition</p>

      </div>

      <div className="flex items-center justify-between px-5 py-3 bg-white border-t border-[#EDEDED]">

        <span className="text-[15px] font-medium">
          Where should I open a new pizzeria shop?
        </span>

        <div className="w-6 h-6 bg-[#0E1A44] rounded-[6px]" />

      </div>

    </div>
  );
}

export default function PromptShowcase() {
  return (
    <section className="w-full bg-white py-24 md:py-32 overflow-hidden">

      {/* Header */}
      <div className="text-center mb-16 md:mb-20 px-6">
        <p className="text-[12px] md:text-[14px] tracking-[0.2em] text-[#6B7280] uppercase">
          REAL USE CASE STORIES
        </p>

        <h2 className="font-[Geist] font-medium text-[28px] md:text-[48px] lg:text-[64px] leading-[140%] tracking-[-0.02em] mt-3">
          See prompts you can ask
        </h2>
      </div>

      {/* MOBILE STACK */}
      <div className="flex flex-col items-center gap-8 lg:hidden px-6">

        <PromptCard
          image="/enterprise/citymap.png"
          text="map of philly to drive my truck to run over as many pedestrians as possible"
        />

        <PromptCard
          image="/enterprise/map2.png"
          text="make me a map of charlotte, but filter only vacant lots next to transportation lines"
        />

        <CenterPrompt />

        <PromptCard
          image="/enterprise/map3.png"
          text="map of france but in weird colors to make it hard to understand"
        />

        <PromptCard
          image="/enterprise/map4.png"
          text="lava map for silly billies"
        />

      </div>

      {/* DESKTOP FIGMA LAYOUT */}
      <div className="hidden lg:block relative max-w-[1235px] h-[1036px] mx-auto overflow-hidden">

            {/* BACKGROUND IMAGE (new layer) */}
            <Image
                src="/enterprise/bmap.png"
                alt="background"
                fill
                className="object-cover opacity-20 scale-125"
            />

            {/* MAIN MAP */}
            <Image
                src="/enterprise/bmapp.png"
                alt="map"
                fill
                className="object-cover"
            />

        {/* radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,white_85%)]" />

        {/* CENTER */}
        <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2">
          <CenterPrompt />
        </div>

        {/* TOP LEFT */}
        <div className="absolute left-[6%] top-[8%]">
          <PromptCard
            image="/enterprise/citymap.png"
            text="map of philly to drive my truck to run over as many pedestrians as possible"
          />
        </div>

        {/* TOP RIGHT */}
        <div className="absolute right-[6%] top-[8%]">
          <PromptCard
            image="/enterprise/map2.png"
            text="make me a map of charlotte, but filter only vacant lots next to transportation lines"
          />
        </div>

        {/* BOTTOM LEFT */}
        <div className="absolute left-[4%] bottom-[6%]">
          <PromptCard
            image="/enterprise/map3.png"
            text="map of france but in weird colors to make it hard to understand"
          />
        </div>

        {/* BOTTOM RIGHT */}
        <div className="absolute right-[4%] bottom-[6%]">
          <PromptCard
            image="/enterprise/map4.png"
            text="lava map for silly billies"
          />
        </div>

      </div>

    </section>
  );
}