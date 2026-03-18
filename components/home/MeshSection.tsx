

"use client";

import { useEffect, useState } from "react";

export const MeshSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      className="bg-[#F9F9F9] border-0 border-none shadow-none ring-0 ring-offset-0"
      style={{
        opacity: mounted ? 1 : 0,
        filter: mounted ? "blur(0px)" : "blur(8px)",
        transition: "opacity 800ms ease 100ms, filter 800ms ease 100ms",
      }}
    >
      <div className="relative w-full h-[920px] overflow-hidden border-0 border-none shadow-none ring-0 ring-offset-0">

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-top border-0 border-none outline-none shadow-none ring-0 ring-offset-0"
        >
          <source src="/mesh-animation.mp4" type="video/mp4" />
        </video>

        {/* Top fade — blends into Hero above */}
        <div
          className="absolute top-0 left-0 right-0 w-full h-30 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(249,249,249,1) 0%, rgba(249,249,249,0) 100%)`,
          }}
          aria-hidden
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 w-full h-[70px] pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(249, 249, 249, 0) 0%, rgba(251, 251, 251, 0.45) 25%, rgba(253, 253, 253, 0.83) 46%, rgba(254, 254, 254, 0.9) 52%, rgba(254, 254, 254, 0.94) 62%, rgba(254, 254, 254, 1) 100%)`,
          }}
          aria-hidden
        />
      </div>
    </section>
  );
};