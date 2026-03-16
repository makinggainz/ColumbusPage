"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { cormorant } from "@/lib/typography";

export const Vision = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

  const stats = [
    { value: "148M", label: "km² covered" },
    { value: "2.3T", label: "training data points" },
    { value: "47×", label: "faster than manual GIS" },
    { value: "99.1%", label: "spatial accuracy" },
  ];

  return (
    <section
      id="research"
      data-navbar-theme="dark"
      className="bg-[#070709] py-32 border-b border-white/[0.05]"
    >
      <Container>
        <div ref={ref}>

          {/* Section marker */}
          <div className="flex items-center gap-4 mb-20" style={fadeIn(0)}>
            <span className="text-[10px] tracking-[0.2em] text-white/20 uppercase font-mono">
              02 / Research
            </span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>

          {/* Two-column */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-24">

            <div style={fadeIn(0.1)}>
              <h2
                className={`${cormorant.className} font-semibold leading-[0.93] tracking-[-0.025em] text-[#EDEDEA]`}
                style={{ fontSize: "clamp(44px, 5.5vw, 76px)" }}
              >
                Not a language<br />
                model.<br />
                A <em>world</em> model.
              </h2>
            </div>

            <div className="flex flex-col gap-6 lg:pt-2" style={fadeIn(0.2)}>
              <p className="text-[15px] text-white/40 leading-[1.85]">
                Large Language Models understand text. GeoContext-1 understands
                space — the relationships between terrain, infrastructure, human
                activity, climate, and time. It reasons natively in coordinates,
                not words.
              </p>
              <p className="text-[15px] text-white/40 leading-[1.85]">
                Where LLMs predict the next token, GeoContext-1 predicts the
                next state of a physical environment. It models cities,
                coastlines, supply chains, and ecosystems as dynamic,
                interconnected systems — at planetary scale.
              </p>
              <a
                href="#"
                className="mt-2 inline-flex items-center gap-2 text-[13px] text-[#1396F3]/70 hover:text-[#1396F3] transition-colors"
              >
                Read the technical whitepaper →
              </a>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]"
            style={fadeIn(0.3)}
          >
            {stats.map((s, i) => (
              <div key={i} className="bg-[#070709] px-8 py-10">
                <div
                  className={`${cormorant.className} font-semibold text-[52px] text-[#EDEDEA] leading-none mb-2 tracking-[-0.02em]`}
                >
                  {s.value}
                </div>
                <div className="text-[11px] text-white/25 tracking-[0.12em] uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
};
