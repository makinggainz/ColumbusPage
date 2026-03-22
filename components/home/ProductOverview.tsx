"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ── Abstract navigation-system canvas ── */
const NavigationCanvas = () => {
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
    const t = performance.now() * 0.001;

    ctx.clearRect(0, 0, w, h);

    // Nodes — represent data endpoints / geospatial stations
    const nodes: { x: number; y: number; r: number; pulse: number }[] = [
      { x: w * 0.2, y: h * 0.25, r: 5, pulse: 0 },
      { x: w * 0.45, y: h * 0.15, r: 4, pulse: 0.8 },
      { x: w * 0.7, y: h * 0.2, r: 6, pulse: 1.6 },
      { x: w * 0.85, y: h * 0.4, r: 4, pulse: 2.4 },
      { x: w * 0.6, y: h * 0.5, r: 7, pulse: 0.4 },
      { x: w * 0.3, y: h * 0.55, r: 5, pulse: 1.2 },
      { x: w * 0.15, y: h * 0.7, r: 4, pulse: 2.0 },
      { x: w * 0.5, y: h * 0.75, r: 6, pulse: 0.6 },
      { x: w * 0.75, y: h * 0.65, r: 5, pulse: 1.8 },
      { x: w * 0.4, y: h * 0.38, r: 8, pulse: 1.0 },
    ];

    // Connections between nodes
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [1, 9], [9, 4], [4, 8], [6, 7], [7, 8], [5, 6], [9, 5],
    ];

    // Draw flow lines (connections)
    connections.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);

      // Slight curve for organic feel
      const mx = (na.x + nb.x) / 2 + Math.sin(t + a) * 8;
      const my = (na.y + nb.y) / 2 + Math.cos(t + b) * 6;
      ctx.quadraticCurveTo(mx, my, nb.x, nb.y);

      ctx.strokeStyle = "rgba(10, 19, 68, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Moving dot along connection
      const progress = (Math.sin(t * 0.5 + a * 0.7 + b * 0.3) + 1) / 2;
      const dotT = progress;
      const dx = (1 - dotT) * (1 - dotT) * na.x + 2 * (1 - dotT) * dotT * mx + dotT * dotT * nb.x;
      const dy = (1 - dotT) * (1 - dotT) * na.y + 2 * (1 - dotT) * dotT * my + dotT * dotT * nb.y;

      ctx.beginPath();
      ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(10, 19, 68, 0.2)";
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pulseScale = 1 + Math.sin(t * 1.5 + node.pulse) * 0.15;

      // Outer pulse ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * pulseScale * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 19, 68, ${0.03 + Math.sin(t + node.pulse) * 0.01})`;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(10, 19, 68, 0.15)";
      ctx.fill();

      // Inner bright dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(10, 19, 68, 0.4)";
      ctx.fill();
    });

    // Contour lines — concentric arcs emanating from the central node
    const center = nodes[9];
    for (let i = 1; i <= 4; i++) {
      const radius = i * 55 + Math.sin(t * 0.3 + i) * 5;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, -Math.PI * 0.6, Math.PI * 0.3);
      ctx.strokeStyle = `rgba(10, 19, 68, ${0.04 - i * 0.005})`;
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
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

/* ── Product Overview Section ── */
export const ProductOverview = () => {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-[100px] md:py-[140px]">
      <div ref={ref} className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left — product explanation */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <p className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#0A1344]/35 mb-5">
              The Navigation Engine
            </p>
            <h2 className="text-[36px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1] text-[#0A1344] mb-6">
              One model for the entire physical world.
            </h2>
            <p className="text-[17px] leading-[1.7] text-[#0A1344]/55 mb-5">
              Columbus Earth&rsquo;s Large Geospatial Model ingests satellite imagery,
              terrain data, infrastructure networks, and temporal patterns to produce
              a unified understanding of any location on the planet.
            </p>
            <p className="text-[17px] leading-[1.7] text-[#0A1344]/55 mb-8">
              Think of it as a control deck for geospatial intelligence — not a map,
              but the reasoning engine beneath it.
            </p>
            <Link
              href="/technology"
              className="inline-flex items-center text-[15px] font-medium text-[#0A1344] group"
            >
              Explore the technology
              <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>

          {/* Right — abstract navigation system visual */}
          <div
            className="relative aspect-square rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #F8F9FC 0%, #F0F1F8 100%)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: "opacity 1s ease 0.3s, transform 1s ease 0.3s",
            }}
          >
            <NavigationCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};
