"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ── Calm mesh canvas — flatter, quieter callback to the hero ── */
const CalmMesh = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const t = performance.now() * 0.0003; // Very slow

    ctx.clearRect(0, 0, w, h);

    // Fill with gradient — white to very subtle lavender
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#FFFFFF");
    bg.addColorStop(1, "#F4F4FA");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Gentle mesh lines — horizontal wave lines
    const lineCount = 12;
    const spacing = h / (lineCount + 1);

    for (let i = 1; i <= lineCount; i++) {
      const baseY = i * spacing;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const normalX = x / w;
        const wave =
          Math.sin(normalX * 4 + t * 2 + i * 0.5) * 3 +
          Math.sin(normalX * 7 - t * 1.2 + i * 0.3) * 1.5;
        const y = baseY + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const alpha = 0.04 + (i / lineCount) * 0.03;
      ctx.strokeStyle = `rgba(10, 19, 68, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export const ClosingCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden py-[120px] md:py-[180px]">
      {/* Background mesh */}
      <CalmMesh />

      <div ref={ref} className="relative z-10 max-w-[640px] mx-auto px-6 text-center">

        <h2
          className="text-[36px] md:text-[52px] font-semibold tracking-[-0.02em] leading-[1.1] text-[#0A1344] mb-6"
          style={{
            opacity: visible ? 1 : 0,
            filter: visible ? "blur(0px)" : "blur(6px)",
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1s ease 0.2s, filter 1s ease 0.2s, transform 1s ease 0.2s",
          }}
        >
          Chart a new course.
        </h2>

        <p
          className="text-[17px] leading-[1.7] text-[#0A1344]/50 mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
          }}
        >
          Start exploring the world through the lens of the first
          Large Geospatial Model.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s",
          }}
        >
          <Link
            href="/maps-gpt"
            className="flex items-center justify-center px-8 py-4 text-[16px] font-semibold leading-none rounded-full bg-[#0A1344] text-white transition-all duration-300 hover:bg-[#0A1344]/85 hover:shadow-lg"
          >
            Start Now
          </Link>
          <Link
            href="/our-mission"
            className="flex items-center justify-center px-8 py-4 text-[16px] font-semibold leading-none rounded-full border border-[#0A1344]/15 text-[#0A1344] transition-all duration-300 hover:border-[#0A1344]/30"
          >
            Our Mission
          </Link>
        </div>
      </div>
    </section>
  );
};
