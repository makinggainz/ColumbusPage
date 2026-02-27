

"use client";

import Image from "next/image";
import Link from "next/link";

export const Industries = () => {
  const items = [
    { src: "/Icon/gen.png", label: "Generative Geodata", href: "#" },
    { src: "/Icon/img1.png", label: "Logistics Optimization", href: "#" },
    { src: "/Icon/site.png", label: "Site Selection", href: "#" },
    { src: "/Icon/urban.png", label: "Urban Planning Research", href: "#" },
    { src: "/Icon/more.png", label: "More", href: "#" },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-24 lg:py-[140px] px-4 sm:px-6 md:px-12 lg:px-[100px]">
      <div className="max-w-[1731px] mx-auto">

        {/* Heading */}
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-medium text-[#1C274C] mb-8 sm:mb-12 md:mb-[64px]">
          See how Columbus could help you
        </h2>

        <div className="flex flex-wrap items-start justify-center sm:justify-start gap-4 sm:gap-5 md:gap-[24px] mb-8 sm:mb-12 md:mb-[64px]">

          {/* First 4 normal cards */}
          {items.slice(0, 4).map((item, index) => (
            <div key={index} className="w-full max-w-[300px] sm:w-[280px] md:w-[300px]">

              <Link href={item.href} className="group block">
                <div className="relative w-full aspect-[300/295] max-h-[295px] rounded-[12px] sm:rounded-[16px] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 rounded-[12px] sm:rounded-[16px] border border-transparent group-hover:border-[#2A64F6] transition" />
                </div>
              </Link>

              <Link
                href={item.href}
                className="mt-2 sm:mt-[14px] inline-flex items-center gap-1 sm:gap-[6px] text-[13px] sm:text-[15px] font-medium text-[#1C274C]"
              >
                {item.label}
              </Link>
            </div>
          ))}

          {/* Special More Card */}
          <div className="w-full max-w-[122px] sm:w-[100px] md:w-[122px]">

            <Link href="#" className="group block">
              <div className="
                relative w-full aspect-[122/295] max-h-[295px]
                rounded-[12px] sm:rounded-[16px]
                overflow-hidden
                bg-gradient-to-br from-[#2A3F5F]/60 to-[#1C274C]/40
                backdrop-blur-sm
              ">
                <div className="absolute inset-0 rounded-[12px] sm:rounded-[16px] border border-transparent group-hover:border-[#2A64F6] transition" />
              </div>
            </Link>

            <Link
              href="#"
              className="mt-2 sm:mt-[14px] inline-flex items-center gap-1 sm:gap-[6px] text-[13px] sm:text-[15px] font-medium text-[#1C274C]"
            >
              More
            </Link>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-[24px]">

          <button className="
            px-[26px]
            py-[12px]
            border border-[#1C274C]/40
            rounded-[8px]
            text-[14px]
            font-medium
            text-[#1C274C]
            hover:bg-[#1C274C]/5
            transition
            text-left sm:text-center
          ">
            The technology that powers Columbus Pro
          </button>

          <button className="
            px-[26px]
            py-[12px]
            border border-[#1C274C]/40
            rounded-[8px]
            text-[14px]
            font-medium
            text-[#1C274C]
            hover:bg-[#1C274C]/5
            transition
            text-left sm:text-center
          ">
            Learn more about Columbus Pro platform
          </button>

        </div>

      </div>
    </section>
  );
};