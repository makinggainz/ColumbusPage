"use client";

import Image from "next/image";

export const TravelPromo = () => {
  return (
    <div className="w-full flex justify-center bg-[#F5F5F5]">
      <section className="relative w-[404px] h-[989px] bg-white overflow-hidden">

        {/* TEXT */}
        <div className="absolute top-[470px] left-0 w-full text-center px-[40px]">

          <h2 className="text-[32px] font-semibold leading-[140%] text-[#0E2A2F]">
            Love to travel <br />
            or go out?
          </h2>

          <p className="mt-[26px] text-[20px] leading-[140%] text-[#1E74FF]">
            <span className="font-medium">MapsGPT</span> is answering
            thousands of queries in your area
          </p>

        </div>

        <FloatingEmojis />

      </section>
    </div>
  );
};

const FloatingEmojis = () => {
  return (
    <>
      {/* TOP LEFT CAKE */}
      <Image
        src="/emoji/cake.png"
        alt=""
        width={116}
        height={116}
        className="absolute"
        style={{ top: 120, left: 30 }}
      />

      {/* TOP RIGHT PALM */}
      <Image
        src="/emoji/palm.png"
        alt=""
        width={110}
        height={110}
        className="absolute"
        style={{ top: 120, right: 40 }}
      />

      {/* DRINK */}
      <Image
        src="/emoji/drink.png"
        alt=""
        width={159}
        height={159}
        className="absolute"
        style={{ top: 260, left: 35 }}
      />

      {/* PLANE */}
      <Image
        src="/emoji/plane.png"
        alt=""
        width={150}
        height={150}
        className="absolute"
        style={{ top: 250, right: 35 }}
      />

      {/* BURGER */}
      <Image
        src="/emoji/burger.png"
        alt=""
        width={140}
        height={140}
        className="absolute"
        style={{ top: 350, right: 40 }}
      />

      {/* COCKTAIL */}
      <Image
        src="/emoji/cocktail.png"
        alt=""
        width={130}
        height={130}
        className="absolute"
        style={{ bottom: 220, left: 30 }}
      />

      {/* ARROW (ROTATED LIKE FIGMA) */}
      <Image
        src="/emoji/arrow.png"
        alt=""
        width={105}
        height={95}
        className="absolute rotate-[35deg]"
        style={{ bottom: 220, left: 160 }}
      />

      {/* PASSPORT */}
      <Image
        src="/emoji/book.png"
        alt=""
        width={120}
        height={120}
        className="absolute rotate-[15deg]"
        style={{ bottom: 210, right: 35 }}
      />

      {/* EARTH */}
      <Image
        src="/emoji/earth.png"
        alt=""
        width={133}
        height={139}
        className="absolute"
        style={{ bottom: 60, left: 40 }}
      />

      {/* HAND SIGN */}
      <Image
        src="/emoji/champange.png"
        alt=""
        width={120}
        height={120}
        className="absolute"
        style={{ bottom: 60, right: 30 }}
      />
    </>
  );
};