"use client";

import Image from "next/image";
import Link from "next/link";
import { ConsumerEnterpriseToggle } from "./ConsumerEnterpriseToggle";
import { EnterprisePillsToggle } from "./EnterprisePillsToggle";

export default function EnterpriseHero() {
  return (
    <section className="relative w-full overflow-hidden h-[1853px]">

      {/* Background */}
      <Image
        src="/enterprise/heroImage.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[140px] pb-[140px]">

        {/* Toggle */}
        <div className="flex items-center mb-12">
          <ConsumerEnterpriseToggle />
        </div>

        {/* Heading */}
        <h1
          className="
          mt-[40px]
          max-w-[1206px]
          text-white
          font-[Instrument_Serif]
          font-light
          leading-[110%]
          tracking-[-0.02em]
          text-[42px]
          md:text-[64px]
          lg:text-[96px]
        "
        >
          GIS so easy, the janitor could be your new researcher
        </h1>

        {/* Subtext */}
        <p
          className="
          mt-6
          text-white
          leading-[120%]
          max-w-[477px]
          text-[16px]
          md:text-[20px]
          lg:text-[32px]
        "
        >
          Simple, AI powered GIS for Site Selection, and more.
        </p>

        {/* CTA - Group 1390: links to contact page */}
        <Link
          href="/contact"
          className="mt-[25px] w-[184px] h-[47px] flex items-center justify-center bg-white text-black rounded-full text-base font-semibold hover:bg-white/90 transition shrink-0"
        >
          Talk to us
        </Link>

        {/* Pills - toggle section */}
        <EnterprisePillsToggle />

        {/* Product UI */}
        <div className="w-full max-w-[1400px]">

          <Image
            src="/enterprise/hero.png"
            alt="product preview"
            width={1400}
            height={817}
            className="rounded-xl shadow-md w-full h-auto"
          />

        </div>

        {/* Bottom Text */}
        <p className="mt-10 text-white text-[32px] font-bold">
        GIS made effortless
        </p>

      </div>

    </section>
  );
}