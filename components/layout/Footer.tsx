"use client";

import type { FC } from "react";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

export type FooterProps = {
  variant?: "default" | "compact";
};

export const Footer: FC<FooterProps> = ({ variant = "default" }) => {
  if (variant === "compact") {
    return (
      <footer className="relative w-full min-h-[280px] text-white">
        <Image
          src="/emoji/Footer.png"
          alt="Footer Background"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-6 py-10 flex flex-col justify-center items-center text-center">
          <p className="text-sm text-white/80 max-w-xl mb-6">
            The frontier AI lab building the first production Universal Geospatial Model.
          </p>
          <div className="flex gap-4">
            <Mail size={18} className="cursor-pointer hover:text-white/80" />
            <Linkedin size={18} className="cursor-pointer hover:text-white/80" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative w-full min-h-[500px] md:h-[800px] text-white">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/emoji/Footer.png"
        alt="Footer Background"
        fill
        className="object-cover"
        priority
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/55" />

      {/* CONTENT */}
      <div className="relative z-10 h-full max-w-[1730px] mx-auto px-5 sm:px-10 md:px-[120px] flex flex-col justify-between py-[40px] sm:py-[60px] md:py-[80px]">

        {/* TOP MISSION TEXT */}
        <div className="text-center max-w-[900px] mx-auto mt-[20px] md:mt-[40px]">
          <p className="text-[13px] sm:text-[14px] md:text-[16px] leading-[170%] text-white/80">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the
            geospatial intelligence systems of tomorrow.
          </p>

          <p className="text-[13px] sm:text-[14px] md:text-[16px] leading-[170%] text-white/80 mt-[20px] md:mt-[40px]">
            We&apos;re building foundation models that understand the physical world
            through geospatial reasoning. GeoContext-1 processes satellite imagery,
            terrain data, infrastructure networks, and temporal patterns to generate
            actionable intelligence across defence, climate, consumer and urban
            planning domains.
          </p>

          <div className="mt-[30px] md:mt-[50px] flex flex-wrap justify-center gap-4 md:gap-0 md:space-x-[30px] text-white/70 text-[13px] md:text-base">
            <button className="hover:text-white transition">[ Our Mission ]</button>
            <button className="hover:text-white transition">[ Product ]</button>
            <button className="hover:text-white transition">[ Technology ]</button>
            <button className="hover:text-white transition">[ Use Cases ]</button>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mt-8 md:mt-0">

          {/* LEFT LOGO + DESCRIPTION */}
          <div className="text-center md:text-left">
            <h3 className="text-[24px] md:text-[32px] font-semibold mb-[8px] md:mb-[12px]">
              Columbus Earth
            </h3>

            <p className="text-[13px] md:text-[14px] text-white/70 max-w-[420px] mb-[16px] md:mb-[20px]">
              The frontier AI lab building the first production Universal
              Geospatial Model to answer the planet&apos;s toughest questions.
            </p>

            <div className="flex gap-[16px] justify-center md:justify-start">
              <Mail size={20} className="cursor-pointer hover:text-white/80" />
              <Linkedin size={20} className="cursor-pointer hover:text-white/80" />
            </div>
          </div>

          {/* RIGHT LINKS GRID */}
          <div className="grid grid-cols-3 gap-[30px] md:gap-[60px] text-[13px] md:text-[14px] text-white/80">

            <div>
              <p className="mb-[12px] md:mb-[20px] text-white font-medium text-[12px] md:text-[14px]">PRODUCT</p>
              <ul className="space-y-[8px] md:space-y-[10px]">
                <li className="hover:text-white cursor-pointer">Columbus Pro</li>
                <li className="hover:text-white cursor-pointer">Use-Cases</li>
                <li className="hover:text-white cursor-pointer">MapsGPT</li>
              </ul>
            </div>

            <div>
              <p className="mb-[12px] md:mb-[20px] text-white font-medium text-[12px] md:text-[14px]">TECHNOLOGY</p>
              <ul className="space-y-[8px] md:space-y-[10px]">
                <li className="hover:text-white cursor-pointer">LGM vs LLM</li>
                <li className="hover:text-white cursor-pointer">Data Collection</li>
                <li className="hover:text-white cursor-pointer">Core Reasoning</li>
                <li className="hover:text-white cursor-pointer">Research Blog</li>
              </ul>
            </div>

            <div>
              <p className="mb-[12px] md:mb-[20px] text-white font-medium text-[12px] md:text-[14px]">COMPANY</p>
              <ul className="space-y-[8px] md:space-y-[10px]">
                <li className="hover:text-white cursor-pointer">+ Our Mission</li>
                <li className="hover:text-white cursor-pointer">+ Careers</li>
                <li className="hover:text-white cursor-pointer">Legal</li>
                <li className="hover:text-white cursor-pointer">Report</li>

              </ul>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
};
