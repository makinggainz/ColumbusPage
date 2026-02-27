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
    <footer className="relative w-full text-white">

      {/* MOBILE: wireframe style - simple dark bar, centered copyright only */}
      <div className="md:hidden bg-[#0A1344] py-6 px-4 text-center">
        <p className="text-white/80 text-sm">© {new Date().getFullYear()} Columbus. All rights reserved.</p>
      </div>

      {/* DESKTOP/TABLET: full footer with background image and content */}
      <div className="relative hidden md:block min-h-[600px] lg:min-h-[700px] lg:h-[800px]">
        <Image
          src="/emoji/Footer.png"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full max-w-[1730px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[120px] flex flex-col justify-between py-10 sm:py-12 md:py-16 lg:py-[80px]">

        {/* TOP MISSION TEXT */}
        <div className="text-center max-w-[900px] mx-auto mt-6 sm:mt-8 md:mt-[40px]">
          <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[170%] text-white/80">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the
            geospatial intelligence systems of tomorrow.
          </p>

          <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[170%] text-white/80 mt-6 sm:mt-8 md:mt-[40px]">
            We're building foundation models that understand the physical world
            through geospatial reasoning. GeoContext-1 processes satellite imagery,
            terrain data, infrastructure networks, and temporal patterns to generate
            actionable intelligence across defence, climate, consumer and urban
            planning domains.
          </p>

          <div className="mt-8 sm:mt-10 md:mt-[50px] flex flex-wrap justify-center gap-3 sm:gap-4 md:space-x-0 md:gap-[30px] text-white/70">
            <button className="hover:text-white transition">[ Our Mission ]</button>
            <button className="hover:text-white transition">[ Product ]</button>
            <button className="hover:text-white transition">[ Technology ]</button>
            <button className="hover:text-white transition">[ Use Cases ]</button>
          </div>
        </div>

        {/* BOTTOM SECTION: stack on mobile */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 sm:gap-10 mt-10 sm:mt-12">

          {/* LEFT LOGO + DESCRIPTION */}
          <div className="text-center md:text-left max-w-[420px]">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold mb-2 sm:mb-[12px]">
              Columbus Earth
            </h3>

            <p className="text-[13px] sm:text-[14px] text-white/70 mb-4 sm:mb-[20px]">
              The frontier AI lab building the first production Universal
              Geospatial Model to answer the planet's toughest questions.
            </p>

            <div className="flex justify-center md:justify-start gap-4 sm:gap-[16px]">
              <Mail size={18} className="sm:w-5 sm:h-5 cursor-pointer hover:text-white/80" />
              <Linkedin size={18} className="sm:w-5 sm:h-5 cursor-pointer hover:text-white/80" />
            </div>
          </div>

          {/* RIGHT LINKS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-[60px] text-[12px] sm:text-[14px] text-white/80 text-center sm:text-left">

            <div>
              <p className="mb-[20px] text-white font-medium">PRODUCT</p>
              <ul className="space-y-[10px]">
                <li className="hover:text-white cursor-pointer">Columbus Pro</li>
                <li className="hover:text-white cursor-pointer">Use-Cases</li>
                <li className="hover:text-white cursor-pointer">MapsGPT</li>
              </ul>
            </div>

            <div>
              <p className="mb-[20px] text-white font-medium">TECHNOLOGY</p>
              <ul className="space-y-[10px]">
                <li className="hover:text-white cursor-pointer">LGM vs LLM</li>
                <li className="hover:text-white cursor-pointer">Data Collection</li>
                <li className="hover:text-white cursor-pointer">Core Reasoning</li>
                <li className="hover:text-white cursor-pointer">Research Blog</li>
              </ul>
            </div>

            <div>
              <p className="mb-[20px] text-white font-medium">COMPANY</p>
              <ul className="space-y-[10px]">
                <li className="hover:text-white cursor-pointer">+ Our Mission</li>
                <li className="hover:text-white cursor-pointer">+ Careers</li>
                <li className="hover:text-white cursor-pointer">Legal</li>
                <li className="hover:text-white cursor-pointer">Report</li>

              </ul>
            </div>

          </div>

        </div>

        </div>
      </div>
    </footer>
  );
};