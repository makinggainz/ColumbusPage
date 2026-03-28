"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { geist } from "@/app/fonts";

export default function ResultsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section className="relative w-full py-[60px] rounded-b-[33px] overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>

      <Image
        src="/use-cases/resultbg.png"
        alt=""
        fill
        className="object-cover -z-10"
      />

      <div ref={ref} className="max-w-[1287px] mx-auto px-8 md:px-10">

        <h2
          className="text-[48px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1D1D1F] mb-[24px] max-lg:text-[36px] max-md:text-[28px]"
          style={anim(0)}
        >
          Results of our <br /> Large Geospatial Model:
        </h2>

        <div className="flex gap-x-6 mb-[12px]" style={anim(50)}>
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
        </div>

        <div className="grid grid-cols-2 gap-x-[120px] max-lg:gap-x-[60px] max-md:grid-cols-1 pt-[12px] pb-[30px]">
          <Feature number="1" text={`Fast semantic reasoning in cities. Contextual enrichment.`} image="/use-cases/result1.png" anim={anim(100)} />
          <Feature number="2" text={`Generalist\nmodel, with access to wide catalogue`} image="/use-cases/result2.png" anim={anim(150)} />
        </div>

        <div className="flex gap-x-6 my-[12px]" style={anim(200)}>
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
        </div>

        <div className="grid grid-cols-2 gap-x-[120px] max-lg:gap-x-[60px] max-md:grid-cols-1 pt-[12px] pb-[30px]">
          <Feature number="3" text={`Generative geospatial data`} image="/use-cases/result3.png" anim={anim(250)} />
          <Feature number="4" text={`Deep spatial reasoning at scale`} image="/use-cases/result4.png" anim={anim(300)} />
        </div>

      </div>
    </section>
  );
}

function Feature({ number, text, image, anim }: { number: string; text: string; image: string; anim: React.CSSProperties }) {
  const newlineIdx = text.indexOf("\n");
  const head = newlineIdx === -1 ? text : text.slice(0, newlineIdx);
  const tail = newlineIdx === -1 ? null : text.slice(newlineIdx + 1);

  return (
    <div className="flex items-center justify-between gap-[60px] max-md:flex-col max-md:items-start" style={anim}>

      <div className="relative max-w-93 p-4 rounded-lg" style={{ marginLeft: "-5px" }}>
        <span
          className="absolute left-4 top-4 text-white w-[36px] h-[36px] flex items-center justify-center"
          style={{ fontFamily: geist.style.fontFamily, fontSize: 24, fontWeight: 500, backgroundColor: "#2563EB" }}
        >
          {number}
        </span>
        <div
          className="leading-[140%] text-[#1D1D1F]"
          style={{ fontFamily: geist.style.fontFamily, fontSize: 24, fontWeight: 500 }}
        >
          <span style={{ display: "block", textIndent: "48px" }}>{head}</span>
          {tail && (
            <span style={{ display: "block", marginTop: "5px", whiteSpace: "pre-line" }}>{tail}</span>
          )}
        </div>
      </div>

      <Image
        src={image}
        alt=""
        width={349}
        height={276}
        className="rounded-[12px] max-md:w-full max-md:h-auto"
      />

    </div>
  );
}
