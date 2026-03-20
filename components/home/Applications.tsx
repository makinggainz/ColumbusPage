"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";

export const Applications = () => {
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
    { title: "Residential Real Estate", image: "/UseCases/ResidentialRealEstate.jpg", href: "/applications/residential-real-estate" },
    { title: "Commercial Real Estate", image: "/UseCases/CommercialRealEstate.jpg", href: "/applications/commercial-real-estate" },
    { title: "Generative Geodata", image: "/UseCases/GenDatalayers.png", href: "/applications/generative-geodata" },
    { title: "Logistics Optimization", image: "/UseCases/Logistics.webp", href: "/applications/logistics-optimization" },
    { title: "Urban Planning", image: "/UseCases/UrbanPlanning.jpg", href: "/applications/urban-planning" },
    { title: "Site Selection", image: "/UseCases/SiteSelection.jpg", href: "/applications/site-selection" },
    { title: "Consumer Mapping", image: "/UseCases/ConsumerMapping.jpeg", href: "/applications/consumer-mapping" },
    { title: "Ground Due Diligence", image: "/UseCases/GroundDueDillegence.png", href: "/applications/ground-due-diligence" },
    { title: "More", image: "/UseCases/GeoMarketing.png", href: "/applications" },
  ];

  return (
    <section className="bg-white py-24 md:py-32 lg:py-40">
      <Container>
        <div ref={sectionRef}>

          {/* Header */}
          <div
            className="mb-10 md:mb-12"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              filter: visible ? "blur(0px)" : "blur(6px)",
              transition: "opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease",
            }}
          >
            <p className="text-[10px] font-medium tracking-[0.28em] text-[#A1A1AA] uppercase mb-5">
              Use Cases
            </p>
            <h2
              className="font-bold text-[#09090B] leading-tight tracking-tight"
              style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
            >
              We&apos;re actively exploring
              <br className="hidden md:block" /> various application areas
            </h2>
            <p className="mt-4 text-[15px] font-normal text-[#71717A]">
              We&apos;d love to work within your industry —{" "}
              <a href="mailto:hey@columbus.earth" className="text-[#3F3F46] hover:text-[#09090B] transition-colors underline underline-offset-2">
                hey@columbus.earth
              </a>
            </p>
          </div>

          {/* Grid */}
          <div
            className="overflow-hidden border border-[#E4E4E7]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="relative group aspect-[16/9] w-full overflow-hidden block border-b border-r border-[#E4E4E7]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/25" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center z-20 px-4 pt-6 pb-3">
                    <h3 className="text-[14px] font-semibold text-white drop-shadow-sm">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] text-white/60 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:underline transition-all duration-300 ease-out">
                      Learn more →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
