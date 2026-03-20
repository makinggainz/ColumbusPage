"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";

export const Industries = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = [
    { src: "/Icon/gen.png", label: "Generative Geodata", href: "#", num: "01" },
    { src: "/Icon/img1.png", label: "Logistics Optimization", href: "#", num: "02" },
    { src: "/Icon/site.png", label: "Site Selection", href: "#", num: "03" },
    { src: "/Icon/urban.png", label: "Urban Planning Research", href: "#", num: "04" },
    { src: "/Icon/more.png", label: "More", href: "#", num: "\u2192" },
  ];

  return (
    <section className="bg-white py-28 lg:py-36">
      <Container>
        <div ref={sectionRef}>

          {/* Header */}
          <div
            className="mb-14"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              filter: visible ? "blur(0px)" : "blur(6px)",
              transition: "opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease",
            }}
          >
            <p className="text-[10px] font-medium tracking-[0.28em] text-[#A1A1AA] uppercase mb-5">
              Applications
            </p>
            <h2
              className="font-bold text-[#09090B] tracking-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}
            >
              See how Columbus could help you
            </h2>
          </div>

          {/* Cards */}
          <div className="flex flex-wrap gap-3 mb-14">
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(14px)",
                  filter: visible ? "blur(0px)" : "blur(4px)",
                  transition: `opacity 0.6s ease ${index * 70 + 150}ms, transform 0.6s ease ${index * 70 + 150}ms, filter 0.6s ease ${index * 70 + 150}ms`,
                }}
              >
                <Link href={item.href} className="group block">
                  <div
                    className="relative overflow-hidden border border-[#E4E4E7] group-hover:border-[#A1A1AA] transition-colors duration-300"
                    style={{ width: index === 4 ? 120 : 295, height: 280 }}
                  >
                    {/* Number label */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="text-[11px] font-medium tracking-[0.18em] text-white/70">
                        {item.num}
                      </span>
                    </div>

                    {index === 4 ? (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-[#FAFAFA]"
                      >
                        <ArrowUpRight size={28} strokeWidth={1.2} className="text-[#A1A1AA]" />
                      </div>
                    ) : (
                      <>
                        <Image
                          src={item.src}
                          alt={item.label}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                        {/* Bottom label overlay */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm px-4 py-3">
                          <span className="text-[13px] font-medium text-[#09090B]">{item.label}</span>
                        </div>
                      </>
                    )}
                  </div>
                </Link>

                {index === 4 && (
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#71717A] hover:text-[#09090B] transition-colors duration-300"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {item.label}
                    <ArrowUpRight size={14} strokeWidth={1.6} />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Bottom links */}
          <div
            className="flex flex-col sm:flex-row gap-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 550ms, transform 0.6s ease 550ms",
            }}
          >
            <Link
              href="/technology"
              className="border border-[#E4E4E7] text-[14px] font-medium text-[#3F3F46] hover:bg-[#FAFAFA] hover:border-[#A1A1AA] transition-all inline-flex items-center justify-center gap-2 px-8 h-12"
            >
              The technology that powers Columbus Pro
              <ArrowUpRight size={15} strokeWidth={1.6} />
            </Link>
            <Link
              href="/platform"
              className="border border-[#E4E4E7] text-[14px] font-medium text-[#3F3F46] hover:bg-[#FAFAFA] hover:border-[#A1A1AA] transition-all inline-flex items-center justify-center gap-2 px-8 h-12"
            >
              Learn more about Columbus Pro platform
              <ArrowUpRight size={15} strokeWidth={1.6} />
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
};
