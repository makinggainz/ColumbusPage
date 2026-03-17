"use client";

import Image from "next/image";
import Link from "next/link";
import glassStyles from "@/components/ui/GlassButton.module.css";

export default function FinalCTASection() {
  const FRAME_WIDTH = 1728;
  const HERO_HEIGHT = 1092;

  return (
    <section className="bg-white flex flex-col items-center overflow-hidden">

      {/* Responsive Scaling Wrapper — hero only */}
      <div
        className="origin-top"
        style={{
          width: FRAME_WIDTH,
          height: HERO_HEIGHT,
          transform: "scale(min(1, 100vw / 1728))",
          transformOrigin: "top center",
        }}
      >
        <div className="relative w-[1728px] h-[1092px]">

          {/* ================= HERO IMAGE ================= */}
          <div
            className="absolute left-0 top-0"
            style={{ width: FRAME_WIDTH, height: HERO_HEIGHT }}
          >
            <Image
              src="/ConsumerPageCity.png"
              alt="City"
              fill
              className="object-cover"
              priority
            />

            {/* Rectangle 3299: left overlay gradient */}
            <div
              className="absolute left-0 top-0"
              style={{
                width: 1018,
                height: 1091,
                background: "linear-gradient(261.31deg, rgba(0, 0, 0, 0) 5.79%, rgba(0, 0, 0, 0.6) 56.37%)",
              }}
            />

            {/* LEFT CONTENT */}
            <div
              className="absolute text-white z-10"
              style={{
                left: 160,
                top: 280,
                width: 680,
              }}
            >
              <p className="text-[32px] font-medium text-white mb-8">
                <span
                  className="inline-block font-semibold"
                  style={{ color: "#8DF7FF" }}
                >
                  MapsGPT
                </span>
                {" "}
                is browser based
              </p>

              <h2 className="text-[80px] font-semibold leading-[105%] mb-8">
                We’re always
                <br />
                there for you.
              </h2>

              <p className="text-[32px] font-medium text-white mb-10 leading-[140%]">
                Access your local AI travel pal
                <br />
                on any browser.
              </p>

              <Link
                href="/maps-gpt"
                className={`${glassStyles.btn} no-underline text-white hover:opacity-90 transition-opacity cursor-pointer`}
                style={{
                  width: 412,
                  height: 71,
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Try it out! It’s completely free →
              </Link>
            </div>

            {/* PHONE SCREEN OVERLAY */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: 1150,
                top: 346,
                width: 274,
                height: 505,
                borderRadius: 24,
              }}
            >
              <Image
                src="/how/mob.png"
                alt="Phone screen"
                fill
                className="object-contain"
              />
            </div>

            {/* FLOATING HEARTS */}
            <Image
              src="/how/heart.png"
              alt=""
              width={180}
              height={180}
              className="absolute"
              style={{
                left: FRAME_WIDTH * 0.75 - 300,
                top: 200,
              }}
            />

            <Image
              src="/how/heart.png"
              alt=""
              width={160}
              height={160}
              className="absolute"
              style={{
                left: FRAME_WIDTH * 0.75 + 150,
                top: 300,
              }}
            />
          </div>

        </div>
      </div>

      {/* ================= CTA: centered in viewport ================= */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center py-16 px-4">
            <p className="text-[#4E4E4E] text-[36px] leading-[150%] mb-10 max-w-[600px] font-semibold">
              MapsGPT is updated regularly.
              <br />
              We’d love to hear your thoughts.
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
              <Link
                href="/feedback"
                className={`${glassStyles.btn} no-underline text-[#2C2C2C] cursor-pointer`}
                style={{
                  padding: "18px 40px",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Request a feature
              </Link>

              <Link
                href="/feedback"
                className={`${glassStyles.btn} no-underline text-[#2C2C2C] cursor-pointer`}
                style={{
                  padding: "18px 40px",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Report a bug
              </Link>
            </div>
      </div>
    </section>
  );
}