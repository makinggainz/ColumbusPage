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
    <footer className="relative w-[404px] h-[1995px] mx-auto text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/foot/image.png"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col px-[35px] pt-[120px] pb-[80px]">

        {/* ===== TOP MISSION ===== */}
        <div className="text-left">
          <p className="text-[16px] leading-[140%] text-white mb-[32px]">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the
            geospatial intelligence systems of tomorrow.
          </p>

          <p className="text-[16px] leading-[140%] text-white mb-[60px]">
            We're building foundation models that understand the physical world
            through geospatial reasoning. GeoContext-1 processes satellite imagery,
            terrain data, infrastructure networks, and temporal patterns to
            generate actionable intelligence across defence, climate, consumer
            and urban planning domains.
          </p>

          {/* Nav Buttons (VERTICAL + CENTERED) */}
          <div className="flex flex-col items-center space-y-[24px] mb-[80px] text-center">
          <button className="underline underline-offset-4">
            [ Our Mission ]
          </button>
          <button className="underline underline-offset-4">
            [ Product ]
          </button>
          <button className="underline underline-offset-4">
            [ Technology ]
          </button>
          <button className="underline underline-offset-4">
            [ Use Cases ]
          </button>
        </div>
        </div>

        {/* Divider */}
        <div className="border-b border-white/30 mb-[80px]" />

        {/* ===== LINKS GRID (2 COLUMN MOBILE) ===== */}
        <div className="grid grid-cols-2 gap-y-[40px] text-[15px] mb-[120px]">

          <div>
            <p className="text-white/70 mb-[16px]">PRODUCT</p>
            <ul className="space-y-[12px]">
              <li>Columbus Pro</li>
              <li>Use-Cases</li>
              <li>MapsGPT</li>
            </ul>
          </div>

          <div>
            <p className="text-white/70 mb-[16px]">TECHNOLOGY</p>
            <ul className="space-y-[12px]">
              <li>LGM vs LLM</li>
              <li>Data Collection</li>
              <li>Core Reasoning</li>
              <li>Research Blog</li>
            </ul>
          </div>

          <div>
            <p className="text-white/70 mb-[16px]">COMPANY</p>
            <ul className="space-y-[12px]">
              <li>+ Our Mission</li>
              <li>+ Careers</li>
              <li>Legal</li>
              <li>Report</li>
            </ul>
          </div>

        </div>

        {/* ===== BRAND SECTION (BOTTOM) ===== */}
        <div className="mt-auto">

          {/* Logo Icon */}
          <div className="mb-[50px]">
            <Image
              src="/emoji/logo.png"
              alt="Logo"
              width={120}
              height={120}
            />
          </div>

          {/* Brand Name */}
          <h3 className="text-[48px] leading-[110%] font-semibold mb-[20px]">
            Columbus <br /> Earth
          </h3>

          {/* Description */}
          <p className="text-[14px] text-white/80 leading-[160%] mb-[24px] max-w-[300px]">
            The frontier AI lab building the first production Universal
            Geospatial Model to answer the planet’s toughest questions.
          </p>

          {/* Icons */}
          <div className="flex gap-[20px] mb-[40px]">
            <Mail size={20} />
            <Linkedin size={20} />
          </div>

          {/* Legal */}
          <p className="text-[12px] text-white/60 leading-[160%]">
            Columbus Earth © 2026. For investor relations,
            contact us on email or LinkedIn.
          </p>

          <p className="text-[12px] text-white/60 mt-[8px]">
            Website made by hand, no AI.
          </p>

        </div>

      </div>
    </footer>
  );
};