"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";

export const TravelPromo = () => {
  return (
    <section className="bg-[#F9F9F9] relative overflow-hidden py-24 md:py-32 lg:py-40">

      <Container className="relative min-h-125 md:min-h-162.5">

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">

          <h2 className="text-display font-semibold tracking-[-0.01em] text-[#1C274C] mb-1 md:mb-1.5">
            Love to travel or go out?
          </h2>

          <p className="mt-1.5 text-[40px] font-normal tracking-[-0.02em] whitespace-nowrap bg-gradient-to-r from-[#00BFFF] to-[#1E3A98] bg-clip-text text-transparent">
            <span className="font-semibold">MapsGPT</span>
            <span> is already answering thousands of queries in your area</span>
          </p>

        </div>

        {/* Floating Emojis */}
        <FloatingEmojis />

      </Container>
    </section>
  );
};

const FloatingEmojis = () => {
  const emojis: { src: string; top: string; left: string; width?: number }[] = [
    { src: "/emoji/cake.png",       top: "2%",  left: "1%" },
    { src: "/emoji/palm.png",       top: "8%",  left: "16%" },
    { src: "/emoji/drink.png",      top: "4%",  left: "44%", width: 80 },
    { src: "/emoji/heart.png",      top: "9%",  left: "70%" },
    { src: "/emoji/plane.png",      top: "2%",  left: "89%" },
    { src: "/emoji/basketball.png", top: "40%", left: "1%",  width: 120 },
    { src: "/emoji/cocktail.png",   top: "30%", left: "20%", width: 120 },
    { src: "/emoji/burger.png",     top: "42%", left: "74%" },
    { src: "/emoji/yo.png",         top: "36%", left: "89%" },
    { src: "/emoji/arrow.png",      top: "62%", left: "2%" },
    { src: "/emoji/laugh.png",      top: "70%", left: "24%" },
    { src: "/emoji/champange.png",  top: "72%", left: "60%" },
    { src: "/emoji/book.png",       top: "56%", left: "90%", width: 144 },
    { src: "/emoji/car.png",        top: "87%", left: "2%" },
    { src: "/emoji/ice.png",        top: "88%", left: "42%", width: 136 },
    { src: "/emoji/earth.png",      top: "84%", left: "86%" },
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
          className="absolute pointer-events-none select-none h-auto w-16 sm:w-20 md:w-28 lg:w-40"
          style={{
            top: emoji.top,
            left: emoji.left,
            ...(emoji.width ? { width: emoji.width, minWidth: emoji.width, maxWidth: emoji.width } : {}),
          }}
        />
      ))}
    </>
  );
};