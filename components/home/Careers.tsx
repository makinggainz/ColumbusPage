"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";

export const Careers = () => {
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

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    filter: visible ? "blur(0px)" : "blur(6px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, filter 0.7s ease ${delay}ms`,
  });

  return (
    <section className="bg-black py-32 lg:py-44">
      <Container>
        <div ref={sectionRef}>

          {/* Eyebrow + big heading */}
          <div className="mb-20 md:mb-28" style={anim(0)}>
            <p className="text-[10px] font-medium tracking-[0.28em] text-white/22 uppercase mb-8">
              Careers
            </p>
            <h2
              className="font-semibold text-white leading-none"
              style={{ fontSize: "clamp(52px, 8vw, 110px)", letterSpacing: "-0.04em" }}
            >
              Hiring
              <br />
              Humans.
            </h2>
            <p className="mt-8 text-[17px] font-normal tracking-[-0.015em] text-white/40 max-w-lg">
              Our team is based in Washington DC and Madrid. We are building the first production
              Large Geospatial Model.
            </p>
          </div>

          {/* Two-column */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start mb-14" style={anim(120)}>
            <div>
              <h3
                className="font-semibold text-white leading-tight"
                style={{ fontSize: "clamp(22px, 2.5vw, 30px)", letterSpacing: "-0.025em" }}
              >
                Careers &amp; investment queries
              </h3>
            </div>
            <p className="text-[16px] font-normal tracking-[-0.015em] text-white/40 leading-relaxed">
              If you're excited about creating paradigm shifts in physical world understanding.{" "}
              <span className="text-white/70">Join us now.</span>
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-16 md:mb-20"
            style={{
              background: "linear-gradient(to right, rgba(255,0,0,0.35) 0%, rgba(255,0,0,0.15) 20%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.04) 55%, rgba(255,0,0,0.15) 80%, rgba(255,0,0,0.35) 100%)",
            }}
            aria-hidden
          />

          {/* Form */}
          <div className="max-w-lg mx-auto" style={anim(200)}>
            <form className="space-y-12">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-white/12 pb-4 text-[15px] text-white outline-none placeholder:text-white/22 focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Message"
                  rows={2}
                  className="w-full bg-transparent border-b border-white/12 pb-4 text-[15px] text-white outline-none resize-none placeholder:text-white/22 focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent border-b border-white/12 pb-4 text-[15px] text-white outline-none placeholder:text-white/22 focus:border-white/30 transition-colors"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-[12px] text-white/22">
                  We accept interns.
                </p>
                <button
                  type="submit"
                  className="h-11 px-8 bg-white text-black text-[13px] font-semibold tracking-tight hover:bg-white/90 transition-colors"
                >
                  Send →
                </button>
              </div>
            </form>
          </div>

        </div>
      </Container>
    </section>
  );
};
