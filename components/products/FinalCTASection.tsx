"use client";

import Image from "next/image";

export default function FinalCTASection() {
  const FRAME_WIDTH = 1728;
  const HERO_HEIGHT = 1092;
  const TOTAL_HEIGHT = 1500;

  return (
    <section className="bg-white flex justify-center overflow-hidden">

      {/* Responsive Scaling Wrapper */}
      <div
        className="origin-top"
        style={{
          width: FRAME_WIDTH,
          height: TOTAL_HEIGHT,
          transform: "scale(min(1, 100vw / 1728))",
          transformOrigin: "top center",
        }}
      >
        <div className="relative w-[1728px] h-[1500px]">

          {/* ================= HERO IMAGE ================= */}
          <div
            className="absolute left-0 top-0"
            style={{ width: FRAME_WIDTH, height: HERO_HEIGHT }}
          >
            <Image
              src="/how/city.jpg"
              alt="City"
              fill
              className="object-cover"
              priority
            />

            {/* LEFT DARK HALF */}
            <div
              className="absolute top-0 left-0"
              style={{
                width: FRAME_WIDTH / 2,
                height: HERO_HEIGHT,
                background: "rgba(0,0,0,0.55)",
              }}
            />

            {/* LEFT CONTENT */}
            <div
              className="absolute text-white"
              style={{
                left: 160,
                top: 280,
                width: 420,
              }}
            >
              <p className="text-[18px] opacity-80 mb-8">
                MapsGPT is browser based
              </p>

              <h2 className="text-[64px] font-semibold leading-[1.15] mb-8">
                We’re always
                <br />
                there for you.
              </h2>

              <p className="text-[20px] opacity-80 mb-10 leading-[140%]">
                Access your local AI travel pal
                <br />
                on any browser.
              </p>

              <button
                className="backdrop-blur-md"
                style={{
                  padding: "18px 36px",
                  borderRadius: 50,
                  border: "1px solid rgba(255,255,255,0.7)",
                  background: "rgba(255,255,255,0.15)",
                  fontSize: 18,
                }}
              >
                Try it out! It’s completely free →
              </button>
            </div>

            {/* PHONE */}
            <div
              className="absolute"
              style={{
                left: FRAME_WIDTH * 0.75 - 210,
                top: 180,
              }}
            >
              <Image
                src="/how/mob.png"
                alt="Phone"
                width={420}
                height={820}
                className="object-contain"
              />
            </div>

            {/* FLOATING HEARTS */}
            <Image
              src="/how/heart1.png"
              alt=""
              width={90}
              height={90}
              className="absolute"
              style={{
                left: FRAME_WIDTH * 0.75 - 300,
                top: 200,
              }}
            />

            <Image
              src="/how/heart2.png"
              alt=""
              width={80}
              height={80}
              className="absolute"
              style={{
                left: FRAME_WIDTH * 0.75 + 150,
                top: 300,
              }}
            />
          </div>

          {/* ================= BOTTOM FEEDBACK ================= */}
          <div
            className="absolute text-center"
            style={{
              top: HERO_HEIGHT + 120,
              left: FRAME_WIDTH / 2,
              transform: "translateX(-50%)",
              width: 600,
            }}
          >
            <p className="text-[#4E4E4E] text-[20px] leading-[150%] mb-10">
              MapsGPT is updated regularly.
              <br />
              We’d love to hear your thoughts.
            </p>

            <div className="flex gap-8 justify-center">
              <button
                className="border border-[#CFCFCF]"
                style={{
                  padding: "14px 28px",
                  borderRadius: 8,
                  fontSize: 16,
                }}
              >
                Request a feature
              </button>

              <button
                className="border border-[#CFCFCF]"
                style={{
                  padding: "14px 28px",
                  borderRadius: 8,
                  fontSize: 16,
                }}
              >
                Report a bug
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}