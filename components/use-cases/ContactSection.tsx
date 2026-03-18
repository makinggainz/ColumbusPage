"use client";

import Image from "next/image";
import Link from "next/link";
import glassStyles from "@/components/ui/GlassButton.module.css";
import { instrumentSerif } from "@/app/fonts";

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
            text-[40px]
            max-w-[600px]
            mb-8
            max-md:text-[22px]
            "
            style={{ fontFamily: instrumentSerif.style.fontFamily, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: "130%" }}
          >
            We’d love to work with you. Contact us, or
            <br />
            Check out our{" "}
            <Link
              href="/products"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              style={{ borderBottom: "0.5px solid currentColor", paddingBottom: "1px" }}
            >
              Products
            </Link>
          </p>

          <div className={glassStyles.wrap}>
            <div className={glassStyles.shadow} aria-hidden />
            <button type="button" className={`${glassStyles.btn} text-white text-[17px] font-semibold`} style={{ width: 184, height: 47, background: "transparent" }}>
              <span>Talk to us</span>
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}