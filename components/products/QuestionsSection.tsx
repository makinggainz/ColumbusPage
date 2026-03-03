"use client";

import Image from "next/image";

export default function QuestionsSection() {
  return (
    <section className="relative bg-[#F4F6F8] min-h-[1100px] overflow-hidden">

      {/* CENTER HEADLINE */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
        <h2 className="text-4xl md:text-6xl font-semibold text-[#0F6B6E]">
          We’ve already answered
        </h2>
        <h2 className="text-4xl md:text-6xl font-semibold text-[#0F6B6E] mt-4">
          thousands of questions!
        </h2>
      </div>

      {/* ================= BACKGROUND CARDS ================= */}

      {/* LEFT TOP */}
      <Image
        src="/cards/card1.png"
        width={280}
        height={340}
        alt=""
        className="absolute left-[8%] top-[10%] opacity-40"
      />

      {/* CENTER TOP */}
      <Image
        src="/cards/card2.png"
        width={320}
        height={360}
        alt=""
        className="absolute left-[38%] top-[5%] opacity-40"
      />

      {/* RIGHT TOP */}
      <Image
        src="/cards/card3.png"
        width={320}
        height={360}
        alt=""
        className="absolute right-[10%] top-[8%] opacity-40"
      />

      {/* LEFT BOTTOM */}
      <Image
        src="/cards/card4.png"
        width={300}
        height={360}
        alt=""
        className="absolute left-[5%] bottom-[12%] opacity-40"
      />

      {/* CENTER BOTTOM LARGE */}
      <Image
        src="/cards/card5.png"
        width={480}
        height={360}
        alt=""
        className="absolute left-[30%] bottom-[5%] opacity-100 z-10"
      />

      {/* RIGHT BOTTOM */}
      <Image
        src="/cards/card6.png"
        width={300}
        height={360}
        alt=""
        className="absolute right-[8%] bottom-[15%] opacity-40"
      />

    </section>
  );
}