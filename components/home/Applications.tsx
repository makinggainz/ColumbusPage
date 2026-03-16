"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { cormorant } from "@/lib/typography";

export const Applications = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

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
    <section
      data-navbar-theme="dark"
      className="bg-[#070709] py-32 border-b border-white/5"
    >
      <Container>
        <div ref={ref}>

          {/* Section marker */}
          <div className="flex items-center gap-4 mb-20" style={fadeIn(0)}>
            <span className="text-[10px] tracking-[0.2em] text-white/20 uppercase font-mono">
              04 / Applications
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Header */}
          <div className="grid lg:grid-cols-2 gap-8 items-end mb-16" style={fadeIn(0.1)}>
            <h2
              className={`${cormorant.className} font-bold leading-[0.93] tracking-[-0.04em] text-[#EDEDEA]`}
              style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
            >
              Where GeoContext-1<br />
              goes to work.
            </h2>
            <p className="text-[14px] text-white/35 leading-[1.8] lg:text-right max-w-sm lg:max-w-none lg:ml-auto">
              From defence to real estate to consumer discovery —
              one model powers every domain.{" "}
              <a href="mailto:hey@columbus.earth" className="text-[#1396F3]/60 hover:text-[#1396F3] transition-colors">
                hey@columbus.earth
              </a>
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5" style={fadeIn(0.2)}>
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="relative group aspect-[16/9] w-full overflow-hidden block bg-[#070709]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  priority={index < 3}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Bottom label */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                  <h3 className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors tracking-wide">
                    {item.title}
                  </h3>
                  <span className="block mt-1 text-[11px] text-white/0 group-hover:text-white/45 transition-colors duration-300">
                    Explore →
                  </span>
                </div>

                {/* Top-right index */}
                <span className="absolute top-4 right-4 text-[10px] font-mono text-white/15 group-hover:text-white/30 transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
};
