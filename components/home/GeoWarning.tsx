"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLenis } from "@/components/home/LenisContext";
import { Container } from "@/components/layout/Container";
import { cormorant } from "@/lib/typography";

export const GeoWarning = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const hasTriggeredRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const startTimer = () => {
      if (hasTriggeredRef.current) return;
      if (timeoutRef.current) return;
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        hasTriggeredRef.current = true;
        setTriggerAnimation(true);
      }, 500);
    };

    const clearTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const checkInView = () => {
      const rect = section.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
      if (inView) {
        startTimer();
      } else {
        clearTimer();
      }
    };

    if (lenis) {
      const unsub = lenis.on("scroll", checkInView);
      checkInView(); // run once in case already in view
      return () => {
        unsub();
        clearTimer();
      };
    }

    // No Lenis: use Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          startTimer();
        } else {
          clearTimer();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0 }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [lenis]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F9F9F9] relative overflow-visible py-24 md:py-32 lg:py-40"
    >
      <Container className="relative min-h-125 md:min-h-162.5 overflow-hidden">

        {/* FLOATING ICONS — shake then fall after 0.5s in view */}
        <div
          className={`absolute inset-0 ${triggerAnimation ? "geo-warning-icons-animate" : ""}`}
          aria-hidden
        >
          <Icon src="/Icon/icon-openai.png" className="top-[10%] left-[10%] w-8 md:w-12 lg:w-14" />
          <Icon src="/Icon/xai.png" className="top-[8%] left-[35%] w-8 md:w-12" />
          <Icon src="/Icon/claude.png" className="top-[10%] right-[30%] w-8 md:w-14" />
          <Icon src="/Icon/mistral.png" className="top-[12%] right-[10%] w-8 md:w-12" />

          <Icon src="/Icon/gemini.png" className="top-[30%] left-1/2 -translate-x-1/2 w-10 md:w-14" />
          <Icon src="/Icon/xai2.png" className="top-[60%] left-1/2 -translate-x-1/2 w-8 md:w-12" />

          <Icon src="/Icon/gemini2.png" className="bottom-[10%] left-[12%] w-8 md:w-12" />
          <Icon src="/Icon/claude2.png" className="bottom-[8%] left-[40%] w-8 md:w-12" />
          <Icon src="/Icon/perplexity.png" className="bottom-[10%] right-[35%] w-8 md:w-12" />
          <Icon src="/Icon/icon-openai2.png" className="bottom-[8%] right-[12%] w-8 md:w-12" />
        </div>

        {/* HEADLINE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <h1 className={`${cormorant.className} text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-[#2A0E0E] leading-tight`}>
            Stop using <span className="text-black font-normal">Language models</span> for Geographical work.
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-2xl lg:text-3xl font-normal">
            <span className="text-red-600 font-bold">LLMs</span>{" "}
            <span className="bg-gradient-to-r from-[#CD0A00] to-[#1E4898] bg-clip-text text-transparent">
              hallucinate and cannot be trusted for the real world
            </span>
          </p>
        </div>

      </Container>
    </section>
  );
};

const Icon = ({
  src,
  className,
}: {
  src: string;
  className: string;
}) => (
  <div className={`absolute opacity-40 ${className}`}>
    <Image src={src} alt="" width={80} height={80} />
  </div>
);
