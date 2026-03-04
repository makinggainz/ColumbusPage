"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full h-[700px] md:h-[850px] lg:h-[991px] overflow-hidden">

      <Image
        src="/use-cases/hero.png"
        alt="City at night"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

      {/* Content */}
      <div className="absolute top-20 md:top-32 lg:top-[160px] left-6 md:left-10 lg:left-[59px] right-6 md:right-10 lg:right-[59px] max-w-[1318px] text-white">

        <h1 className="max-w-[1099px] font-extrabold leading-[1.4] text-3xl md:text-5xl lg:text-[64px]">
          Stop using Language Models for
          <br />
          geographical problems.
        </h1>

        <p className="mt-6 md:mt-8 lg:mt-[40px] max-w-[900px] text-base md:text-xl lg:text-[32px] text-white/85 leading-[1.4]">
          ChatGPT, Gemini and Claude do not comprehend coordinates or are trained on
          earth data. Don’t use hallucination chat bots for your critical work.
        </p>

        <button className="mt-10 md:mt-12 lg:mt-[60px] text-lg md:text-2xl lg:text-[32px] font-bold">
          [ Use our LGM instead. ]
        </button>

      </div>

    </section>
  );
}