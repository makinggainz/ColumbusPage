"use client";

import Image from "next/image";
import glassStyles from "@/components/ui/GlassButton.module.css";
import { useRef, useEffect } from "react";

const EMOJIS = [
  { src: "/how/palm.png",  width: 92,  height: 85,  cls: "absolute left-[2%] top-[22%] w-[13%] h-auto" },
  { src: "/how/glas.png",  width: 129, height: 142, cls: "absolute left-[14%] top-[58%] w-[15%] h-auto" },
  { src: "/how/earth.png", width: 133, height: 109, cls: "absolute right-[14%] top-[58%] w-[15%] h-auto" },
  { src: "/how/pane.png",  width: 134, height: 115, cls: "absolute right-[2%] top-[22%] w-[13%] h-auto" },
];

// Weak magnetic attraction — pulls toward cursor, springs back to home
const SPRING         = 0.04;   // restore force
const DAMPING        = 0.82;   // velocity decay per frame
const MOUSE_STRENGTH = 0.55;   // attraction impulse scale
const MOUSE_RADIUS   = 320;    // px in section space

export default function InspirationStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const stateRef   = useRef(EMOJIS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 })));
  const homesRef   = useRef<{ x: number; y: number }[]>([]);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Record home centers once (before any transforms)
    const sRect = section.getBoundingClientRect();
    homesRef.current = wrapRefs.current.map(el => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return { x: r.left - sRect.left + r.width / 2, y: r.top - sRect.top + r.height / 2 };
    });

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    const loop = () => {
      const mouse  = mouseRef.current;
      const states = stateRef.current;
      const homes  = homesRef.current;

      states.forEach((s, i) => {
        const el = wrapRefs.current[i];
        if (!el || !homes[i]) return;

        // Spring back to rest position
        s.vx += -s.x * SPRING;
        s.vy += -s.y * SPRING;

        // Weak attraction toward mouse (from current displaced position)
        const cx   = homes[i].x + s.x;
        const cy   = homes[i].y + s.y;
        const dx   = mouse.x - cx;
        const dy   = mouse.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 1) {
          const f = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
          s.vx += (dx / dist) * f;
          s.vy += (dy / dist) * f;
        }

        s.vx *= DAMPING;
        s.vy *= DAMPING;
        s.x  += s.vx;
        s.y  += s.vy;

        el.style.transform = `translate(${s.x}px, ${s.y}px)`;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative w-full overflow-visible pb-[100px] lg:pb-[210px]" style={{ background: "#F6F7F8" }}>
      {/* Blending gradient — top, bleeds into section above */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-10"
        style={{
          top: -120,
          height: 120,
          background: "linear-gradient(to bottom, #F9F9F9 0%, rgba(249,249,249,0) 100%)",
        }}
      />
      {/* Blending gradient — bottom, bleeds into section below (#F6F7F8) */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none z-10"
        style={{
          height: 160,
          background: "linear-gradient(to bottom, rgba(246,247,248,0) 0%, #F6F7F8 100%)",
        }}
      />

      <div ref={sectionRef} className="relative w-full aspect-[1730/600]">

        {/* Rectangle 2541: main gradient (270deg = right to left) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(270deg, rgba(0, 255, 38, 0.2) 0%, rgba(33, 140, 206, 0.4) 51.15%, rgba(199, 32, 32, 0.3) 100%)",
          }}
        />

        {/* Rectangle 2628: top edge fade to white */}
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none"
          style={{
            height: "55%",
            background: "linear-gradient(to bottom, #F9F9F9 0%, rgba(249,249,249,0) 100%)",
          }}
        />

        {/* Rectangle 2629: bottom edge fade to section-h background */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            height: "55%",
            background: "linear-gradient(to bottom, rgba(246,247,248,0) 0%, #F6F7F8 100%)",
          }}
        />

        {/* Physics emojis */}
        {EMOJIS.map((emoji, i) => (
          <div
            key={emoji.src}
            ref={el => { wrapRefs.current[i] = el; }}
            className={emoji.cls}
          >
            <Image src={emoji.src} alt="" width={emoji.width} height={emoji.height} draggable={false} />
          </div>
        ))}

        {/* Center Pill */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className={glassStyles.btn}
            style={{ width: "clamp(280px, 80vw, 567px)", height: "clamp(56px, 14vw, 101px)", padding: 0, flexShrink: 0, cursor: "pointer" }}
            onClick={() => document.getElementById("section-see-what-people")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span
              style={{
                fontSize: "clamp(20px, 5vw, 36px)",
                fontWeight: 590,
                whiteSpace: "nowrap",
                background: "linear-gradient(180deg, #063140 0%, #01A35D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Need some travel inspiration?
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}