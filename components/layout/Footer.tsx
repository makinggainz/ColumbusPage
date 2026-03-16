"use client";

import type { FC } from "react";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useEffect, useState } from "react";

export type FooterProps = {
  variant?: "default" | "compact";
  reveal?: boolean;
};

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!reveal) {
      setVisible(true);
      return;
    }
    const check = () => {
      const scrolled = window.scrollY;
      const totalHeight = document.body.scrollHeight;
      const viewHeight = window.innerHeight;
      if (scrolled + viewHeight > totalHeight - viewHeight * 0.88) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, [reveal]);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    filter: visible ? "blur(0)" : "blur(8px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s, filter 0.7s ease ${delay}s`,
  });

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
    <footer
      data-navbar-theme="dark"
      className={`text-white overflow-hidden flex flex-col ${reveal ? "h-screen" : "min-h-screen"}`}
      style={reveal ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 } : undefined}
    >
      {/* Background */}
      <Image
        src="/emoji/Footer.png"
        alt="Footer Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <Container className="relative z-10 flex-1 flex flex-col justify-between py-16 md:py-20">

        {/* TOP MISSION TEXT */}
        <div className="text-center max-w-3xl mx-auto space-y-8" style={fadeIn(0.05)}>
          <p className="text-sm sm:text-base leading-relaxed text-white/60">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the
            geospatial intelligence systems of tomorrow.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-white/60">
            We're building foundation models that understand the physical world
            through geospatial reasoning. GeoContext-1 processes satellite imagery,
            terrain data, infrastructure networks, and temporal patterns to generate
            actionable intelligence across defence, climate, consumer and urban
            planning domains.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white/40 text-sm" style={fadeIn(0.2)}>
            <button className="hover:text-white/70 transition">[ Our Mission ]</button>
            <button className="hover:text-white/70 transition">[ Product ]</button>
            <button className="hover:text-white/70 transition">[ Technology ]</button>
            <button className="hover:text-white/70 transition">[ Use Cases ]</button>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">

          {/* LEFT BLOCK */}
          <div style={fadeIn(0.3)}>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
              Columbus Earth
            </h3>
            <p className="text-sm text-white/50 mb-6 max-w-sm">
              The frontier AI lab building the first production Universal
              Geospatial Model to answer the planet's toughest questions.
            </p>
            <div className="flex gap-4">
              <Mail size={20} className="cursor-pointer hover:text-white/70 transition" />
              <Linkedin size={20} className="cursor-pointer hover:text-white/70 transition" />
            </div>
          </div>

          <div style={fadeIn(0.4)}>
            <FooterColumn title="PRODUCT" links={["Columbus Pro", "Use-Cases", "MapsGPT"]} />
          </div>

          <div style={fadeIn(0.5)}>
            <FooterColumn
              title="TECHNOLOGY"
              links={["LGM vs LLM", "Data Collection", "Core Reasoning", "Research Blog"]}
            />
          </div>

          <div style={fadeIn(0.6)}>
            <FooterColumn
              title="COMPANY"
              links={["+ Our Mission", "+ Careers", "Legal", "Report"]}
            />
          </div>

        </div>

      </Container>

      {/* Bottom bar */}
      <div className="relative z-10 w-full border-t border-white/[0.07] py-4" style={fadeIn(0.7)}>
        <Container className="flex items-center justify-between text-white/30 text-[13px] font-light">
          <span>Columbus Earth © 2026. For investor relations, contact us on email or LinkedIn.</span>
          <div className="hidden sm:flex items-center gap-8">
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
    <p className="mb-4 text-white/30 font-medium text-[11px] tracking-[0.18em] uppercase">
      {title}
    </p>
    <ul className="space-y-2 text-sm text-white/55">
      {links.map((link, i) => (
        <li key={i} className="hover:text-white/80 cursor-pointer transition-colors">
          {link}
        </li>
      ))}
    </ul>
  </div>
);
