"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";

export const TravelPromo = () => {
  return (
    <section className="bg-[#F9F9F9] relative overflow-hidden py-24 md:py-32 lg:py-40">

      <Container className="relative min-h-125 md:min-h-162.5">

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">

          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-[#1C274C] mb-4 md:mb-6">
            Love to travel or go out?
          </h2>

          <p className="mt-6 text-base sm:text-lg md:text-2xl lg:text-3xl font-normal max-w-5xl bg-gradient-to-r from-[#00BFFF] to-[#1E3A98] bg-clip-text text-transparent">
            <span className="font-medium">MapsGPT</span>
            <span className="font-normal"> is already answering thousands of queries in your area</span>
          </p>

        </div>

        {/* Floating Emojis */}
        <FloatingEmojis />

      </Container>
    </section>
  );
};

const FloatingEmojis = () => {
  const emojis = [
    { src: "/emoji/cake.png", top: "2%", left: "2%" },
    { src: "/emoji/palm.png", top: "3%", left: "18%" },
    { src: "/emoji/drink.png", top: "8%", left: "50%" },
    { src: "/emoji/heart.png", top: "4%", left: "82%" },
    { src: "/emoji/plane.png", top: "10%", left: "97%" },
    { src: "/emoji/basketball.png", top: "28%", left: "1%" },
    { src: "/emoji/cocktail.png", top: "35%", left: "24%" },
    { src: "/emoji/burger.png", top: "22%", left: "96%" },
    { src: "/emoji/car.png", top: "95%", left: "2%" },
    { src: "/emoji/champange.png", top: "90%", left: "35%" },
    { src: "/emoji/earth.png", top: "97%", left: "92%" },
    { src: "/emoji/ice.png", top: "55%", left: "50%" },
    { src: "/emoji/arrow.png", top: "50%", left: "8%" },
    { src: "/emoji/laugh.png", top: "38%", left: "85%" },
    { src: "/emoji/yo.png", top: "78%", left: "10%" },
    { src: "/emoji/book.png", top: "58%", left: "97%" },
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
            travel-promo-float
          "
          style={{
            top: emoji.top,
            left: emoji.left,
            animationDelay: `${(index * 0.4) % 5}s`,
          }}
        />
      ))}
    </>
  );
};