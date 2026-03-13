"use client";

import Image from "next/image";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="w-full bg-black flex flex-col items-center pt-[240px] pb-[50px] px-6">

      {/* TOP TEXT */}
      <p
        className="
        text-white text-center
        text-[30px] leading-[140%]
        tracking-[0.3em]
        max-w-[491px]
        mb-[140px]
        max-md:text-[22px]
        -mt-[90px]
        "
      >
        We’re at the frontier.
        <br />
        The horizon is wide.
      </p>

      {/* IMAGE CARD */}
      <div
        className="
        relative
        w-full
        max-w-[1296px]
        h-[562px]
        rounded-[9px]
        overflow-hidden
        max-lg:h-[460px]
        max-md:h-[360px]
        "
      >
        <Image
          src="/use-cases/endImage.png"
          alt=""
          fill
          className="object-cover"
          priority
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* CONTENT */}
        <div
          className="
          absolute inset-0
          flex flex-col items-center justify-center
          text-center
          px-6
          "
        >
          <p
            className="
            text-white
            text-[30px]
            leading-[140%]
            font-serif
            max-w-[600px]
            mb-8
            max-md:text-[22px]
            "
          >
            We’d love to work with you. Contact us, or
            <br />
            Check out our{" "}
            <Link
              href="/products"
              className="underline cursor-pointer hover:opacity-80 transition-opacity"
            >
              Products
            </Link>
          </p>

          <button
            type="button"
            className="
            cursor-pointer
            border border-white/40
            text-white
            px-8 py-3
            rounded-full
            text-[14px]
            hover:bg-white hover:text-black
            transition
            "
          >
            Talk to us
          </button>
        </div>
      </div>

    </section>
  );
}