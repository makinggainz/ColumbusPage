"use client";

import Image from "next/image";
import { instrumentSerif, geist } from "@/app/fonts";

export default function ResultsSection() {
  return (
    <section className="relative w-full py-[60px] rounded-b-[33px] overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>

      {/* Background */}
      <Image
        src="/use-cases/resultbg.png"
        alt=""
        fill
        className="object-cover -z-10"
      />

      <div className="max-w-screen-2xl mx-auto px-[var(--page-padding)]">

        {/* TITLE */}
        <h2
          className="text-[64px] leading-[100%] text-[#1F2A44] mb-[24px] max-lg:text-[48px] max-md:text-[36px]"
          style={{
            fontFamily: instrumentSerif.style.fontFamily,
            fontWeight: 400,
            letterSpacing: "0%",
          }}
        >
          Results of our <br /> Large Geospatial Model:
        </h2>

        {/* Two lines below title — side by side, 2px solid #EDEDED */}
        <div className="flex gap-x-6 mb-[12px]">
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
        </div>

        {/* ROW 1 */}
        <div className="grid grid-cols-2 gap-x-[120px] max-lg:gap-x-[60px] max-md:grid-cols-1 pt-[12px] pb-[30px]">

          <Feature
            number="1"
            text={`Fast semantic reasoning in cities. Contextual enrichment.`}
            image="/use-cases/result1.png"
            bg="#FFE4E4"
          />

          <Feature
            number="2"
            text={`Generalist\nmodel, with access to wide catalogue`}
            image="/use-cases/result2.png"
            bg="#E4F0FF"
          />

        </div>

        {/* Two lines decor — between rows */}
        <div className="flex gap-x-6 my-[12px]">
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
          <div className="flex-1 h-0 border-t-2 border-[#EDEDED]" aria-hidden />
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-2 gap-x-[120px] max-lg:gap-x-[60px] max-md:grid-cols-1 pt-[12px] pb-[30px]">

          <Feature
            number="3"
            text={`Generative geospatial data`}
            image="/use-cases/result3.png"
            bg="#E4FFE9"
          />

          <Feature
            number="4"
            text={`Deep spatial reasoning at scale`}
            image="/use-cases/result4.png"
            bg="#FFF8E4"
          />

        </div>

      </div>
    </section>
  );
}


function Feature({ number, text, image, bg }: { number: string; text: string; image: string; bg?: string }) {
  const newlineIdx = text.indexOf("\n");
  const head = newlineIdx === -1 ? text : text.slice(0, newlineIdx);
  const tail = newlineIdx === -1 ? null : text.slice(newlineIdx + 1);

  return (
    <div className="flex items-center justify-between gap-[60px] max-md:flex-col max-md:items-start">

      {/* TEXT */}
      <div className="relative max-w-93 p-4 rounded-lg" style={{ marginLeft: "-5px" }}>

        <span
          className="absolute left-4 top-4 bg-[#1F4ED8] text-white w-[36px] h-[36px] flex items-center justify-center"
          style={{ fontFamily: geist.style.fontFamily, fontSize: 24, fontWeight: 500 }}
        >
          {number}
        </span>

        <div
          className="leading-[140%] text-[#111]"
          style={{ fontFamily: geist.style.fontFamily, fontSize: 30, fontWeight: 500 }}
        >
          <span style={{ display: "block", textIndent: "48px" }}>{head}</span>
          {tail && (
            <span style={{ display: "block", marginTop: "5px", whiteSpace: "pre-line" }}>{tail}</span>
          )}
        </div>

      </div>

      {/* IMAGE */}
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