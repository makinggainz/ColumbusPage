"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

type LenisInstance = Lenis | null;

const LenisContext = createContext<LenisInstance>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<LenisInstance>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setLenis(null);
      return;
    }

    // Disabled: use native scroll (normal speed) instead of Lenis smooth scroll
    const useSmoothScroll = false;
    if (!useSmoothScroll) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      smoothWheel: true,
      wheelMultiplier: 0.7,
      touchMultiplier: 0.7,
      lerp: 0.12,
      syncTouch: true,
    });
    lenisRef.current = instance;
    setLenis(instance);
    document.documentElement.classList.add("lenis");

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    const onResize = () => instance.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(rafId);
      instance.destroy();
      document.documentElement.classList.remove("lenis");
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
