"use client";

import { useEffect, useState } from "react";
import { cormorant } from "@/lib/typography";
import { Container } from "@/components/layout/Container";

export const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small rAF to ensure first paint is done before animating
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    filter: mounted ? "blur(0px)" : "blur(8px)",
    transform: mounted ? "translateY(0px)" : "translateY(16px)",
    transition: `opacity 800ms ease, filter 800ms ease, transform 800ms ease`,
    transitionDelay: `${delay}ms`,
  });

  return (
    <section data-navbar-theme="light" className="relative bg-[#F9F9F9] min-h-[calc(100vh-576px)] overflow-hidden">
      <div className="relative z-10 pt-24 md:pt-32">
        <Container>
          <div className="max-w-292">
            <div>
              {/* Eyebrow */}
              <p
                className="text-sm md:text-base font-medium tracking-tight text-[#1C274C]/70 uppercase mb-4 text-left ml-0 pl-0 mt-15"
                style={fadeIn(0)}
              >
                FRONTIER AI RESEARCH AND PRODUCT COMPANY
              </p>

              {/* Main Heading */}
              <h1
                className={`${cormorant.className} font-semibold leading-tight tracking-tight text-[#0A1344] ml-0 pl-0 text-left`}
                style={{ fontSize: "66px", ...fadeIn(120) }}
              >
                The frontier AI Lab building the first in-production Large Geospatial Model.
              </h1>

              {/* Tag */}
              <p
                className="mt-6 text-xs md:text-sm font-medium tracking-widest text-[#1C274C]/70"
                style={fadeIn(260)}
              >
                [ COLUMBUS PRO-1 ]
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};
