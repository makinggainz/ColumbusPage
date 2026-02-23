"use client";

import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative w-full h-[800px] text-white">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/emoji/Footer.png" // with your real image
        alt="Footer Background"
        fill
        className="object-cover"
        priority
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/55" />

      {/* CONTENT */}
      <div className="relative z-10 h-full max-w-[1730px] mx-auto px-[120px] flex flex-col justify-between py-[80px]">

        {/* TOP MISSION TEXT */}
        <div className="text-center max-w-[900px] mx-auto mt-[40px]">
          <p className="text-[16px] leading-[170%] text-white/80">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the
            geospatial intelligence systems of tomorrow.
          </p>

          <p className="text-[16px] leading-[170%] text-white/80 mt-[40px]">
            We're building foundation models that understand the physical world
            through geospatial reasoning. GeoContext-1 processes satellite imagery,
            terrain data, infrastructure networks, and temporal patterns to generate
            actionable intelligence across defence, climate, consumer and urban
            planning domains.
          </p>

          <div className="mt-[50px] space-x-[30px] text-white/70">
            <button className="hover:text-white transition">[ Our Mission ]</button>
            <button className="hover:text-white transition">[ Product ]</button>
            <button className="hover:text-white transition">[ Technology ]</button>
            <button className="hover:text-white transition">[ Use Cases ]</button>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex justify-between items-end">

          {/* LEFT LOGO + DESCRIPTION */}
          <div>
            <h3 className="text-[32px] font-semibold mb-[12px]">
              Columbus Earth
            </h3>

            <p className="text-[14px] text-white/70 max-w-[420px] mb-[20px]">
              The frontier AI lab building the first production Universal
              Geospatial Model to answer the planet’s toughest questions.
            </p>

            <div className="flex gap-[16px]">
              <Mail size={20} className="cursor-pointer hover:text-white/80" />
              <Linkedin size={20} className="cursor-pointer hover:text-white/80" />
            </div>
          </div>

          {/* RIGHT LINKS GRID */}
          <div className="grid grid-cols-3 gap-[60px] text-[14px] text-white/80">

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
    </footer>
  );
};