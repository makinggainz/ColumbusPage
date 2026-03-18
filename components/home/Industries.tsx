"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";

export const Industries = () => {
  const items = [
    { src: "/Icon/gen.png", label: "Generative Geodata", href: "#" },
    { src: "/Icon/img1.png", label: "Logistics Optimization", href: "#" },
    { src: "/Icon/site.png", label: "Site Selection", href: "#" },
    { src: "/Icon/urban.png", label: "Urban Planning Research", href: "#" },
    { src: "/Icon/more.png", label: "More", href: "#" },
  ];

  return (
    <section className="bg-[#07112A] relative" style={{ height: 656 }}>
      <Container className="h-full flex items-center">
        <div className="pl-16 w-full">

          {/* Heading */}
          <h2 className="font-semibold text-white" style={{ fontSize: 40, letterSpacing: "-0.02em", marginBottom: 30 }}>
            See how Columbus could help you
          </h2>

          {/* Cards Grid */}
          <div className="flex flex-wrap gap-4 mb-16">

            {items.map((item, index) => (
              <div key={index}>

                <Link href={item.href} className="group block">
                  <div className="relative rounded-xl overflow-hidden" style={{ width: index === 4 ? 122 : 300, height: 295 }}>

                    {index === 4 ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2A3F5F]/90 to-[#1C274C]/80 backdrop-blur-sm" />
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover"
                      />
                    )}

                    <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#2A64F6] transition" />
                  </div>
                </Link>

                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-2 text-xl font-medium text-white/80"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {item.label}
                  <ArrowUpRight size={20} strokeWidth={1.6} />
                </Link>

              </div>
            ))}

          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

            <Link
              href="/technology"
              className="border border-white/20 rounded-none text-xl font-semibold text-white/80 hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
              style={{ width: 486, height: 54 }}
            >
              The technology that powers Columbus Pro
              <ArrowUp size={20} strokeWidth={2} />
            </Link>

            <Link
              href="/platform"
              className="border border-white/20 rounded-none text-xl font-semibold text-white/80 hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
              style={{ width: 486, height: 54 }}
            >
              Learn more about Columbus Pro platform
              <ArrowUp size={20} strokeWidth={2} />
            </Link>

          </div>

        </div>
      </Container>
    </section>
  );
};