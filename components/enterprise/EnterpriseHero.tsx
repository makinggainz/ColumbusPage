"use client";

import Image from "next/image";

export default function EnterpriseHero() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* Background */}
      <Image
        src="/enterprise/HeroImage.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#19304F]/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[140px] pb-[140px]">

        {/* Toggle */}
        <div className="flex items-center bg-[#0E223C] rounded-full p-[4px] mb-12">
          <button className="px-6 py-2 rounded-full bg-[#1F2A6B] text-white text-sm">
            Enterprise
          </button>

          <button className="px-6 py-2 text-white/70 text-sm">
            Consumer
          </button>
        </div>

        {/* Heading */}
        <h1
          className="
          max-w-[1206px]
          text-white
          font-[Instrument_Serif]
          font-normal
          leading-[110%]
          tracking-[-0.02em]
          text-[42px]
          md:text-[64px]
          lg:text-[96px]
        "
        >
          GIS so easy, the janitor could be your new researcher
        </h1>

        {/* Subtext */}
        <p
          className="
          mt-6
          text-white/80
          leading-[120%]
          max-w-[477px]
          text-[16px]
          md:text-[20px]
          lg:text-[32px]
        "
        >
          Simple, AI powered GIS for Site Selection, and more.
        </p>

        {/* CTA */}
        <button
          className="
          mt-6
          px-6 py-3
          bg-white/20
          backdrop-blur
          rounded-md
          text-white
          text-sm
          hover:bg-white/30
          transition
        "
        >
          Talk to us
        </button>

        {/* Pills */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">

          <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white">
            Map Chat
          </span>

          <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white">
            Agentic Audits
          </span>

          <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white">
            Agentic Research Reports
          </span>

          <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-white">
            Data Catalogue
          </span>

        </div>

        {/* Product UI */}
        <div className="mt-16 w-full max-w-[1200px]">

          <Image
            src="/enterprise/hero.png"
            alt="product preview"
            width={1200}
            height={700}
            className="rounded-xl shadow-2xl"
          />

        </div>

        {/* Bottom Text */}
        <p className="mt-10 text-white text-[32px] font-bold">
        GIS made effortless
        </p>

      </div>

    </section>
  );
}