"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { cormorant } from "@/lib/typography";

export const Careers = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

  return (
    <section
      data-navbar-theme="dark"
      className="bg-[#070709] py-32"
    >
      <Container>
        <div ref={ref}>

          {/* Section marker */}
          <div className="flex items-center gap-4 mb-20" style={fadeIn(0)}>
            <span className="text-[10px] tracking-[0.2em] text-white/20 uppercase font-mono">
              05 / Contact
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left */}
            <div style={fadeIn(0.1)}>
              <h2
                className={`${cormorant.className} font-semibold leading-[0.93] tracking-[-0.025em] text-[#EDEDEA] mb-6`}
                style={{ fontSize: "clamp(52px, 6vw, 84px)" }}
              >
                Hiring<br />
                <em>Humans</em>.
              </h2>
              <p className="text-[15px] text-white/35 leading-[1.8] max-w-sm mb-4">
                Our team is based in Washington DC and Madrid. If you're excited
                about creating paradigm shifts in physical world understanding,
                we want to hear from you.
              </p>
              <p className="text-[12px] font-mono text-white/18 tracking-wider">
                // We accept interns.
              </p>
            </div>

            {/* Right: form */}
            <div style={fadeIn(0.2)}>
              <form className="space-y-10">

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] tracking-[0.18em] text-white/20 uppercase font-mono">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-transparent border-b border-white/10 py-2 text-[14px] text-white/60 outline-none placeholder:text-white/15 focus:border-white/25 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] tracking-[0.18em] text-white/20 uppercase font-mono">Email</label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    className="w-full bg-transparent border-b border-white/10 py-2 text-[14px] text-white/60 outline-none placeholder:text-white/15 focus:border-white/25 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] tracking-[0.18em] text-white/20 uppercase font-mono">Message</label>
                  <textarea
                    placeholder="Tell us about yourself or your inquiry"
                    rows={3}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-[14px] text-white/60 outline-none resize-none placeholder:text-white/15 focus:border-white/25 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 border border-white/15 text-white/70 text-[13px] font-medium tracking-wide hover:bg-white hover:text-black transition-all duration-200"
                >
                  Send Message
                </button>

              </form>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
};
