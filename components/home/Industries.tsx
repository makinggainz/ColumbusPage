"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Industries = () => {
  return (
    <section className="bg-white py-[80px]">
      <div className="max-w-[404px] mx-auto px-[20px]">

        {/* Heading (forced 2-line break) */}
        <h2 className="text-[28px] font-semibold text-[#1C274C] leading-[130%] mb-[36px]">
          See how Columbus <br />
          could help you
        </h2>

        {/* Single Card */}
        <div className="relative w-full h-[310px] rounded-[20px] overflow-hidden mb-[16px]">
          <Image
            src="/Icon/imge2.png"
            alt="Logistics Optimization"
            fill
            sizes="404px"
            className="object-cover"
          />
        </div>

        {/* Label */}
        <div className="mb-[40px]">
          <Link
            href="#"
            className="text-[18px] font-medium text-[#1C274C] inline-flex items-center gap-[6px]"
          >
            Logistics Optimization
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-[16px]">

          <button className="w-full py-[16px] border border-[#1C274C]/40 rounded-[14px] text-[14px] font-medium text-[#1C274C] inline-flex items-center justify-center gap-[8px]">
            The technology that powers Columbus Pro
            <ArrowUpRight size={16} />
          </button>

          <button className="w-full py-[16px] border border-[#1C274C]/40 rounded-[14px] text-[14px] font-medium text-[#1C274C] inline-flex items-center justify-center gap-[8px]">
            Learn more about Columbus Pro platform
            <ArrowUpRight size={16} />
          </button>

        </div>

      </div>
    </section>
  );
};