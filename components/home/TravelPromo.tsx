"use client";

import Image from "next/image";

export const TravelPromo = () => {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 md:py-40">

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1C274C] mb-4 md:mb-6">
          Love to travel or go out?
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#1C274C]/70 max-w-2xl">
          <span className="text-[#1E74FF] font-medium">
            MapsGPT is already answering thousands of queries in your area
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
    { src: "/emoji/ice.png", top: "60%", left: "55%" },
    { src: "/emoji/arrow.png", top: "50%", left: "20%" },
    { src: "/emoji/laugh.png", top: "40%", left: "70%" },
    { src: "/emoji/yo.png", top: "65%", left: "20%" },
    { src: "/emoji/book.png", top: "55%", left: "85%" },
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
          className="
            absolute 
            pointer-events-none 
            select-none 
            w-8 sm:w-10 md:w-14 lg:w-20
            h-auto
            opacity-80
          "
          style={{
            top: emoji.top,
            left: emoji.left,
          }}
        />
      ))}
    </>
  );
};