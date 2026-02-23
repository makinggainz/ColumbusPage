"use client";

import Image from "next/image";

export const TravelPromo = () => {
  return (
    <section className="relative  h-[989px] overflow-hidden">

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">

        <h2 className="text-[40px] font-semibold text-[#1C274C] mb-[18px]">
          Love to travel or go out?
        </h2>

        <p className="text-[18px] text-[#1C274C]/70">
          <span className="text-[#1E74FF] font-medium">MapsGPT 
          is already answering thousands of queries in your area
        </span>
        </p>

      </div>

      {/* Floating Emojis */}
      <FloatingEmojis />

    </section>
  );
};
const FloatingEmojis = () => {
  const emojis = [
    { src: "/emoji/cake.png", top: "8%", left: "6%" },
    { src: "/emoji/palm.png", top: "6%", left: "18%" },
    { src: "/emoji/drink.png", top: "18%", left: "45%" },
    { src: "/emoji/heart.png", top: "14%", left: "62%" },
    { src: "/emoji/plane.png", top: "20%", left: "82%" },
    { src: "/emoji/basketball.png", top: "28%", left: "12%" },
    { src: "/emoji/cocktail.png", top: "35%", left: "25%" },
    { src: "/emoji/burger.png", top: "30%", left: "72%" },
    { src: "/emoji/car.png", top: "75%", left: "8%" },
    { src: "/emoji/champange.png", top: "70%", left: "40%" },
    { src: "/emoji/earth.png", top: "80%", left: "80%" },
    {src: "/emoji/ice.png", top: "60%", left: "55%" },
    {src: "/emoji/arrow.png", top: "50%", left: "30%" },
    {src: "/emoji/laugh.png", top: "40%", left: "70%" },
    {src: "/emoji/yo.png", top: "65%", left: "20%" },
    {src: "/emoji/book.png", top: "55%", left: "85%" },
  ];

  return (
    <>
      {emojis.map((emoji, index) => (
        <Image
          key={index}
          src={emoji.src}
          alt=""
          width={98}
          height={98}
          className="absolute pointer-events-none select-none"
          style={{
            top: emoji.top,
            left: emoji.left,
          }}
        />
      ))}
    </>
  );
};