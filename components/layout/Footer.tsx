"use client";

import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative text-white overflow-hidden">

      {/* Background */}
      <Image
        src="/emoji/Footer.png"
        alt="Footer Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-20 md:py-28 flex flex-col gap-16">

        {/* TOP MISSION TEXT */}
        <div className="text-center max-w-3xl mx-auto space-y-8">

          <p className="text-sm sm:text-base leading-relaxed text-white/80">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the
            geospatial intelligence systems of tomorrow.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-white/80">
            We're building foundation models that understand the physical world
            through geospatial reasoning. GeoContext-1 processes satellite imagery,
            terrain data, infrastructure networks, and temporal patterns to generate
            actionable intelligence across defence, climate, consumer and urban
            planning domains.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            <button className="hover:text-white transition">[ Our Mission ]</button>
            <button className="hover:text-white transition">[ Product ]</button>
            <button className="hover:text-white transition">[ Technology ]</button>
            <button className="hover:text-white transition">[ Use Cases ]</button>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">

          {/* LEFT BLOCK */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
              Columbus Earth
            </h3>

            <p className="text-sm text-white/70 mb-6 max-w-sm">
              The frontier AI lab building the first production Universal
              Geospatial Model to answer the planet’s toughest questions.
            </p>

            <div className="flex gap-4">
              <Mail size={20} className="cursor-pointer hover:text-white/80" />
              <Linkedin size={20} className="cursor-pointer hover:text-white/80" />
            </div>
          </div>

          {/* PRODUCT */}
          <FooterColumn
            title="PRODUCT"
            links={["Columbus Pro", "Use-Cases", "MapsGPT"]}
          />

          {/* TECHNOLOGY */}
          <FooterColumn
            title="TECHNOLOGY"
            links={[
              "LGM vs LLM",
              "Data Collection",
              "Core Reasoning",
              "Research Blog",
            ]}
          />

          {/* COMPANY */}
          <FooterColumn
            title="COMPANY"
            links={[
              "+ Our Mission",
              "+ Careers",
              "Legal",
              "Report",
            ]}
          />

        </div>

      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: string[];
}) => (
  <div>
    <p className="mb-4 text-white font-medium text-sm tracking-wide">
      {title}
    </p>
    <ul className="space-y-2 text-sm text-white/80">
      {links.map((link, i) => (
        <li key={i} className="hover:text-white cursor-pointer">
          {link}
        </li>
      ))}
    </ul>
  </div>
);