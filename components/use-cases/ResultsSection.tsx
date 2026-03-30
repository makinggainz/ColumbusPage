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
    <section className="relative w-full py-24 rounded-b-[33px] overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>

      <Image
        src="/use-cases/resultbg.png"
        alt=""
        fill
        className="object-cover -z-10"
      />

      <div ref={ref} className="max-w-[1287px] mx-auto px-8 min-[1287px]:px-0">

        <h2
          className="text-[48px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1D1D1F] mb-12 max-lg:text-[36px] max-md:text-[28px]"
          style={anim(0)}
        >
          Results of our <br /> Large Geospatial Model:
        </h2>

        {/* Divider */}
        <div className="flex gap-x-6 mb-[12px]" style={anim(50)}>
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-[1fr_auto_1fr_auto] max-md:grid-cols-1 items-center gap-y-8 pt-[12px] pb-[30px]">
          <FeatureText number="1" text="Fast semantic reasoning in cities. Contextual enrichment." anim={anim(100)} />
          <FeatureImage src="/use-cases/result1.png" anim={anim(100)} />
          <FeatureText number="2" text={`Generalist\nmodel, with access to wide catalogue`} anim={anim(150)} padLeft />
          <FeatureImage src="/use-cases/result2.png" anim={anim(150)} />
        </div>

        {/* Divider */}
        <div className="flex gap-x-6 my-[12px]" style={anim(200)}>
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[1fr_auto_1fr_auto] max-md:grid-cols-1 items-center gap-y-8 pt-[12px] pb-[30px]">
          <FeatureText number="3" text="Generative geospatial data" anim={anim(250)} />
          <FeatureImage src="/use-cases/result3.png" anim={anim(250)} />
          <FeatureText number="4" text="Deep spatial reasoning at scale" anim={anim(300)} padLeft />
          <FeatureImage src="/use-cases/result4.png" anim={anim(300)} />
        </div>

      </div>
    </section>
  );
}

function FeatureText({ number, text, anim, padLeft }: { number: string; text: string; anim: React.CSSProperties; padLeft?: boolean }) {
  const newlineIdx = text.indexOf("\n");
  const head = newlineIdx === -1 ? text : text.slice(0, newlineIdx);
  const tail = newlineIdx === -1 ? null : text.slice(newlineIdx + 1);

  return (
    <div className="relative p-4 rounded-lg" style={{ ...anim, paddingLeft: padLeft ? 40 : undefined }}>
      <span
        className="absolute left-4 top-4 text-white w-9 h-9 flex items-center justify-center"
        style={{ fontFamily: geist.style.fontFamily, fontSize: 24, fontWeight: 500, backgroundColor: "#2563EB", marginLeft: padLeft ? 24 : undefined }}
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
  );
}

function FeatureImage({ src, anim }: { src: string; anim: React.CSSProperties }) {
  return (
    <div className="flex justify-end" style={anim}>
      <Image
        src={src}
        alt=""
        width={349}
        height={276}
        className="rounded-[12px] max-md:w-full max-md:h-auto"
      />
    </div>
  );
}
