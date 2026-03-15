"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { instrumentSerif } from "@/lib/typography";
import { ConsumerEnterpriseToggle } from "./ConsumerEnterpriseToggle";
import { EnterprisePillsToggle } from "./EnterprisePillsToggle";

const fadeIn = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  filter: visible ? "blur(0px)" : "blur(8px)",
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
});

export default function EnterpriseHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} data-navbar-theme="dark" className="relative w-full overflow-hidden h-[1853px]">

      {/* Background */}
      <Image
        src="/enterprise/HeroImage.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[140px] pb-[140px]">

        {/* Toggle */}
        <div className="flex items-center mb-12" style={fadeIn(visible, 0.1)}>
          <ConsumerEnterpriseToggle />
        </div>

        {/* Heading */}
        <h1
          className={`${instrumentSerif.className}
          mt-[40px]
          max-w-[1206px]
          text-white
          font-normal
          leading-[110%]
          tracking-[0em]
          text-[42px]
          md:text-[64px]
          lg:text-[96px]
        `}
          style={{ color: "#ffffff", ...fadeIn(visible, 0.25) }}
        >
          GIS so easy, the janitor could be your new researcher
        </h1>

        {/* Subtext */}
        <p
          className="mt-6 text-white font-normal max-w-[477px]"
          style={{ fontSize: "32px", letterSpacing: "-0.02em", lineHeight: "120%", ...fadeIn(visible, 0.4) }}
        >
          Simple, AI powered GIS for Site Selection, and more.
        </p>

        {/* CTA */}
        <Link
          href="/contact"
          className="mt-[25px] w-[184px] h-[47px] flex items-center justify-center bg-white text-black rounded-full font-semibold hover:bg-white/90 transition shrink-0"
          style={{ fontSize: "17px", letterSpacing: "-0.02em", ...fadeIn(visible, 0.5) }}
        >
          Talk to us
        </Link>

        {/* Pills + product */}
        <div style={{ marginTop: "100px", ...fadeIn(visible, 0.65) }} className="w-full flex flex-col items-center">
          <EnterprisePillsToggle />

          <div data-navbar-theme="light" className="w-full max-w-[1400px]">
            <Image
              src="/enterprise/hero.png"
              alt="product preview"
              width={1400}
              height={817}
              className="rounded-xl shadow-md w-full h-auto"
            />
          </div>

          {/* Bottom Text */}
          <p className="mt-10 text-white text-[32px] font-bold">
            GIS made effortless
          </p>
        </div>

      </div>

    </section>
  );
}
