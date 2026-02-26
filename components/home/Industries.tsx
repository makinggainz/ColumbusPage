


"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Industries = () => {
  const items = [
    { src: "/Icon/gen.png", label: "Generative Geodata", href: "#" },
    { src: "/Icon/img1.png", label: "Logistics Optimization", href: "#" },
    { src: "/Icon/site.png", label: "Site Selection", href: "#" },
    { src: "/Icon/urban.png", label: "Urban Planning Research", href: "#" },
    { src: "/Icon/more.png", label: "More", href: "#" },
  ];

  return (
    <section className="bg-white py-[60px] sm:py-[100px] md:py-[140px]">
      <div className="max-w-[1731px] mx-auto px-5 sm:px-10 md:px-[100px]">

        {/* Heading */}
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-medium text-[#1C274C] mb-[32px] md:mb-[64px]">
          See how Columbus could help you
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-[24px] mb-[32px] md:mb-[64px]">

          {/* First 4 normal cards */}
          {items.slice(0, 4).map((item, index) => (
            <div key={index} className="w-full">

              <Link href={item.href} className="group block">
                <div className="relative w-full aspect-square sm:aspect-[300/295] rounded-[12px] md:rounded-[16px] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 rounded-[12px] md:rounded-[16px] border border-transparent group-hover:border-[#2A64F6] transition" />
                </div>
              </Link>

              <Link
                href={item.href}
                className="mt-[10px] md:mt-[14px] inline-flex items-center gap-[6px] text-[13px] md:text-[15px] font-medium text-[#1C274C]"
              >
                {item.label}
              </Link>
            </div>
          ))}

          {/* Special More Card */}
          <div className="w-full col-span-2 sm:col-span-1">

            <Link href="#" className="group block">
              <div className="
                relative
                w-full
                aspect-[2/1]
                sm:aspect-[122/295]
                rounded-[12px]
                md:rounded-[16px]
                overflow-hidden
                bg-gradient-to-br from-[#2A3F5F]/60 to-[#1C274C]/40
                backdrop-blur-sm
              ">
                <div className="absolute inset-0 rounded-[12px] md:rounded-[16px] border border-transparent group-hover:border-[#2A64F6] transition" />
              </div>
            </Link>

            <Link
              href="#"
              className="mt-[10px] md:mt-[14px] inline-flex items-center gap-[6px] text-[13px] md:text-[15px] font-medium text-[#1C274C]"
            >
              More
            </Link>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-[12px] md:gap-[24px]">

          <button className="
            px-[18px]
            md:px-[26px]
            py-[10px]
            md:py-[12px]
            border border-[#1C274C]/40
            rounded-[8px]
            text-[13px]
            md:text-[14px]
            font-medium
            text-[#1C274C]
            hover:bg-[#1C274C]/5
            transition
          ">
            The technology that powers Columbus Pro
          </button>

          <button className="
            px-[18px]
            md:px-[26px]
            py-[10px]
            md:py-[12px]
            border border-[#1C274C]/40
            rounded-[8px]
            text-[13px]
            md:text-[14px]
            font-medium
            text-[#1C274C]
            hover:bg-[#1C274C]/5
            transition
          ">
            Learn more about Columbus Pro platform
          </button>

        </div>

      </div>
    </section>
  );
};
