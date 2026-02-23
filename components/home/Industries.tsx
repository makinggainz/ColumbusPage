

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
    <section className="bg-white py-[140px]">
      <div className="max-w-[1731px] mx-auto px-[100px]">

        {/* Heading */}
        <h2 className="text-[32px] font-medium text-[#1C274C] mb-[64px]">
          See how Columbus could help you
        </h2>

        <div className="flex items-start gap-[24px] mb-[64px]">

          {/* First 4 normal cards */}
          {items.slice(0, 4).map((item, index) => (
            <div key={index} className="w-[300px]">

              <Link href={item.href} className="group block">
                <div className="relative w-[300px] h-[295px] rounded-[16px] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 rounded-[16px] border border-transparent group-hover:border-[#2A64F6] transition" />
                </div>
              </Link>

              <Link
                href={item.href}
                className="mt-[14px] inline-flex items-center gap-[6px] text-[15px] font-medium text-[#1C274C]"
              >
                {item.label}
              </Link>
            </div>
          ))}

          {/* Special More Card */}
          <div className="w-[122px]">

            <Link href="#" className="group block">
              <div className="
                relative
                w-[122px]
                h-[295px]
                rounded-[16px]
                overflow-hidden
                bg-gradient-to-br from-[#2A3F5F]/60 to-[#1C274C]/40
                backdrop-blur-sm
              ">
                <div className="absolute inset-0 rounded-[16px] border border-transparent group-hover:border-[#2A64F6] transition" />
              </div>
            </Link>

            <Link
              href="#"
              className="mt-[14px] inline-flex items-center gap-[6px] text-[15px] font-medium text-[#1C274C]"
            >
              More
            </Link>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-[24px]">

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
          ">
            Learn more about Columbus Pro platform
          </button>

        </div>

      </div>
    </section>
  );
};