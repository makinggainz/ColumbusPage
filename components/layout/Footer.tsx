"use client";

import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";
import { Container } from "@/components/layout/Container";

export type FooterProps = {
  variant?: "default" | "compact";
  reveal?: boolean;
};

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false }) => {
  if (variant === "compact") {
    return (
      <footer data-navbar-theme="light" className="relative bg-[#FAFAFA] border-t border-[#E4E4E7] py-16">
        <Container className="flex flex-col items-center text-center gap-6">
          <p className="text-[14px] text-[#71717A] max-w-md leading-relaxed">
            The frontier AI lab building the first production Universal Geospatial Model.
          </p>
          <div className="flex gap-4">
            <Mail size={16} className="cursor-pointer text-[#71717A] hover:text-[#09090B] transition-colors" />
            <Linkedin size={16} className="cursor-pointer text-[#71717A] hover:text-[#09090B] transition-colors" />
          </div>
        </Container>
      </footer>
    );
  }

  return (
    <footer
      data-navbar-theme="light"
      className={`bg-[#FAFAFA] border-t border-[#E4E4E7] ${reveal ? "h-screen" : ""}`}
      style={reveal ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 } : undefined}
    >
      <Container className="py-20 md:py-28 flex flex-col justify-between min-h-[500px]">

        {/* Top: Mission */}
        <div className="mb-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="relative h-8 w-8 shrink-0">
              <Image
                src="/logobueno.png"
                alt="Columbus Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="text-[20px] font-medium leading-none tracking-tight text-[#09090B]">
              Columbus Earth
            </span>
          </div>

          <p className="text-[14px] leading-[1.7] text-[#71717A] max-w-md mb-5">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the geospatial
            intelligence systems of tomorrow.
          </p>
          <p className="text-[14px] leading-[1.7] text-[#71717A] max-w-md">
            GeoContext-1 processes satellite imagery, terrain data, infrastructure networks,
            and temporal patterns to generate actionable intelligence across defence, climate,
            consumer and urban planning domains.
          </p>
        </div>

        {/* Bottom: Nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 border-t border-[#E4E4E7] pt-12">

          <FooterColumn
            title="PRODUCT"
            links={[
              { label: "Columbus Pro", href: "/platform" },
              { label: "Use Cases", href: "/use-cases" },
              { label: "MapsGPT", href: "/maps-gpt" },
            ]}
          />

          <FooterColumn
            title="TECHNOLOGY"
            links={[
              { label: "LGM vs LLM", href: "/technology" },
              { label: "Data Collection", href: "/technology" },
              { label: "Core Reasoning", href: "/technology" },
              { label: "Research Blog", href: "/technology" },
            ]}
          />

          <FooterColumn
            title="COMPANY"
            links={[
              { label: "Our Mission", href: "/our-mission" },
              { label: "Careers", href: "/" },
              { label: "Legal", href: "/" },
            ]}
          />

          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] text-[#A1A1AA] uppercase mb-5">
              Connect
            </p>
            <a
              href="mailto:contact@columbus.earth"
              className="block text-[14px] text-[#71717A] hover:text-[#09090B] transition-colors mb-3"
            >
              contact@columbus.earth
            </a>
            <div className="flex gap-4 mt-6">
              <Mail size={16} className="cursor-pointer text-[#71717A] hover:text-[#09090B] transition-colors" />
              <Linkedin size={16} className="cursor-pointer text-[#71717A] hover:text-[#09090B] transition-colors" />
            </div>
          </div>

        </div>

      </Container>

      {/* Bottom bar */}
      <div className="border-t border-[#E4E4E7]">
        <Container className="flex flex-col sm:flex-row items-center justify-between py-5 gap-3 text-[#A1A1AA] text-[12px] tracking-[-0.01em]">
          <span>Columbus Earth &copy; 2026</span>
          <div className="flex items-center gap-8">
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
  links: { label: string; href: string }[];
}) => (
  <div>
    <p className="text-[11px] font-medium tracking-[0.15em] text-[#A1A1AA] uppercase mb-5">
      {title}
    </p>
    <ul className="space-y-3">
      {links.map((link, i) => (
        <li key={i}>
          <Link
            href={link.href}
            className="text-[14px] text-[#71717A] hover:text-[#09090B] transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
