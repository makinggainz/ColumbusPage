"use client";

import type { FC } from "react";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";
import { Container } from "@/components/layout/Container";

export type FooterProps = {
  variant?: "default" | "compact";
};

export const Footer: FC<FooterProps> = ({ variant = "default" }) => {
  if (variant === "compact") {
    return (
      <footer data-navbar-theme="dark" className="relative w-full min-h-[280px] text-white">
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
    <footer data-navbar-theme="dark" className="text-white overflow-hidden flex flex-col h-screen" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 }}>

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
      <Container className="relative z-10 flex-1 py-12 md:py-16 flex flex-col justify-between">

        {/* TOP MISSION TEXT */}
        <div className="text-center max-w-3xl mx-auto space-y-8" style={{ paddingTop: "50px" }}>

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

          <div className="flex flex-col items-center gap-12 text-white/70 w-full" style={{ fontSize: "20px", fontWeight: 500 }}>
            <button className="hover:text-white transition">[ Our Mission ]</button>
            <div className="flex justify-between w-full max-w-2xl mx-auto" style={{ translate: "10px" }}>
              <button className="hover:text-white transition">[ Product ]</button>
              <button className="hover:text-white transition">[ Technology ]</button>
              <button className="hover:text-white transition">[ Use Cases ]</button>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">

          {/* LEFT BLOCK */}
          <div>
            <h3 className="text-[30px] sm:text-[37.5px] font-semibold mb-4">
              Columbus Earth
            </h3>

            <p className="text-[17.5px] text-white/70 mb-6 max-w-sm">
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

      </Container>

      {/* Bottom bar */}
      <div className="relative z-10 w-full py-4" style={{ fontSize: "18px", letterSpacing: "-0.02em" }}>
        <Container className="flex items-center justify-between text-white/70 font-light">
          <span>Columbus Earth © 2026. For investor relations, contact us on email or LinkedIn.</span>
          <div className="flex items-center gap-10">
            <span>Website made by hand, no AI.</span>
            <span>www.columbus.earth</span>
          </div>
        </Container>
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
    <p className="mb-4 text-white font-medium text-[17.5px] tracking-wide">
      {title}
    </p>
    <ul className="space-y-2 text-[17.5px] text-white/80">
      {links.map((link, i) => (
        <li key={i} className="hover:text-white cursor-pointer">
          {link}
        </li>
      ))}
    </ul>
  </div>
);