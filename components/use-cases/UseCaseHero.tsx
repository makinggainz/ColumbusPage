"use client";

import Image from "next/image";

export default function UseCasesHero() {
  return (
    <section className="relative w-full min-h-[1055px] flex items-center justify-center overflow-hidden bg-black">

      {/* GRID BACKGROUND */}
      <div
        className="
        absolute inset-0
        bg-[url('/use-cases/grid.png')]
        bg-repeat
        bg-[length:140px_140px]
        opacity-40
        "
      />

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        <p className="text-gray-400 text-[32px] mb-4 max-md:text-[14px]">
          An agentic approach to geography and space
        </p>

        <h1 className="text-white font-semibold text-[64px] leading-[140%] max-md:text-[36px]">
          More than Site Selection
        </h1>

        <p className="text-gray-400 text-[32px] mt-3 max-md:text-[16px]">
          Industry use cases of Columbus Pro
        </p>

      </div>

      {/* FLOAT IMAGE 1 */}
      <div
        className="
        absolute
        left-1/2
        top-1/2
        -translate-x-[260px]
        translate-y-[110px]
        max-lg:-translate-x-[200px]
        max-md:-translate-x-[140px]
        max-md:translate-y-[140px]
        "
      >
        <Image
          src="/use-cases/float1.png"
          alt=""
          width={142}
          height={142}
          className="opacity-30"
        />
      </div>

      {/* FLOAT IMAGE 2 */}
      <div
        className="
        absolute
        left-1/2
        top-1/2
        -translate-x-[120px]
        translate-y-[240px]
        max-lg:-translate-x-[90px]
        max-md:-translate-x-[40px]
        max-md:translate-y-[260px]
        "
      >
        <Image
          src="/use-cases/float2.png"
          alt=""
          width={147}
          height={146}
        />
      </div>

    </section>
  );
}