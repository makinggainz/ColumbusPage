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
    { src: "/Icon/more.png", label: "More", href: "#", num: "→" },
  ];

  return (
    <section className="bg-black py-28 lg:py-36">
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
            <p className="text-[10px] font-medium tracking-[0.28em] text-white/25 uppercase mb-5">
              Applications
            </p>
            <h2
              className="font-semibold text-white"
              style={{ fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-0.025em" }}
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
                    className="relative overflow-hidden border border-white/[0.07] group-hover:border-white/20 transition-colors duration-300"
                    style={{ width: index === 4 ? 120 : 295, height: 280 }}
                  >
                    {/* Number label */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="text-[11px] font-medium tracking-[0.18em] text-white/30">
                        {item.num}
                      </span>
                    </div>

                    {index === 4 ? (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(7,17,42,0.6)" }}
                      >
                        <ArrowUpRight size={28} strokeWidth={1.2} className="text-white/40" />
                      </div>
                    ) : (
                      <>
                        <Image
                          src={item.src}
                          alt={item.label}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-300" />
                      </>
                    )}
                  </div>
                </Link>

                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-white/55 hover:text-white transition-colors duration-300"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {item.label}
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </Link>
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
              className="border border-white/[0.07] text-[14px] font-medium text-white/45 hover:text-white hover:border-white/20 transition-all inline-flex items-center justify-center gap-2 px-8 h-12"
            >
              The technology that powers Columbus Pro
              <ArrowUpRight size={15} strokeWidth={1.6} />
            </Link>
            <Link
              href="/platform"
              className="border border-white/[0.07] text-[14px] font-medium text-white/45 hover:text-white hover:border-white/20 transition-all inline-flex items-center justify-center gap-2 px-8 h-12"
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
