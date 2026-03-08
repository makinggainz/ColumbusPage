"use client";

import Image from "next/image";

export default function UseColumbusHero() {
  return (
    <section className="w-full bg-[#F5F5F5] py-20 lg:py-[120px]">

      <div className="max-w-[1728px] mx-auto flex flex-col items-center px-6">

        {/* Heading */}
        <h2
          className="
          font-[Geist]
          font-semibold
          text-center
          text-[36px]
          md:text-[64px]
          lg:text-[96px]
          leading-[140%]
          tracking-[-0.02em]
        "
        >
          Use <span className="text-[#2D5BFF]">Columbus Pro</span>,
        </h2>

        {/* Image */}
        <div className="mt-6">
          <Image
            src="/enterprise/use.png"
            alt="user"
            width={391}
            height={238}
            className="rounded-[14px] object-cover"
          />
        </div>

        {/* Text block (Figma width 931px) */}
        <div className="mt-6 w-full max-w-[931px] text-center">

          <p
            className="
            text-right
            text-[20px]
            md:text-[40px]
            lg:text-[64px]
            leading-[140%]
            tracking-[-0.02em]
            font-medium
          "
          >
            find your targets faster.
          </p>

        </div>

      </div>

    </section>
  );
}