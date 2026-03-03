"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-[#D2ECF7] overflow-hidden flex justify-center">

      {/* Responsive Scaling Wrapper */}
      <div
        className="origin-top"
        style={{
          width: 1728,
          height: 1756,
          transform: "scale(min(1, 100vw / 1728))",
          transformOrigin: "top center",
        }}
      >

        <div className="relative w-[1728px] h-[1756px]">

          {/* Toggle */}
          <div className="absolute top-[60px] left-1/2 -translate-x-1/2 flex gap-4">
            <button className="w-[130px] h-[43px] bg-[#E8E8E8] rounded-md text-[16px]">
              Enterprise
            </button>
            <button className="w-[130px] h-[43px] bg-black text-white rounded-md text-[16px]">
              Consumer
            </button>
          </div>

          {/* Badge */}
          <div className="absolute top-[140px] left-1/2 -translate-x-1/2 bg-white/60 px-6 py-2 rounded-full text-[14px]">
            Only Available on Earth
          </div>

          {/* Title */}
          <div className="absolute top-[220px] left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-[72px] font-semibold">
              MapsGPT
            </h1>
            <h2 className="text-[72px] font-semibold text-[#4CC4D9]">
              Travel Like a Boss
            </h2>
          </div>

          {/* Floating Icons */}
          <Image src="/product/basketball.png" width={90} height={90}
            className="absolute left-[80px] top-[180px]" alt="" />
          <Image src="/product/martini.png" width={75} height={75}
            className="absolute left-[300px] top-[200px]" alt="" />
          <Image src="/product/emoji.png" width={80} height={80}
            className="absolute right-[300px] top-[180px]" alt="" />
          <Image src="/product/palne.png" width={100} height={100}
            className="absolute right-[60px] top-[160px]" alt="" />
          <Image src="/product/passport.png" width={70} height={70}
            className="absolute right-[200px] top-[350px]" alt="" />
          <Image src="/product/champ.png" width={80} height={80}
            className="absolute left-[350px] top-[520px]" alt="" />
          <Image src="/product/earth.png" width={90} height={90}
            className="absolute right-[250px] top-[550px]" alt="" />

          {/* Phone */}
          <div
            className="absolute"
            style={{ left: 662, top: 420 }}
          >
            <Image
              src="/product/phone.png"
              width={404}
              height={778}
              alt="Phone"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}