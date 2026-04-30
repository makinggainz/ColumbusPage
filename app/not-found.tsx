"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";

const UnderwaterScene = dynamic(() => import("@/components/home/UnderwaterScene"), { ssr: false });

export default function NotFound() {
  return (
    <main className="relative min-h-screen">
      {/* Underwater scene — fixed fullscreen background */}
      <UnderwaterScene />

      <Navbar />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        <p
          className="text-[120px] md:text-[180px] font-light leading-none"
          style={{ fontFamily: "var(--font-hero)", color: "rgba(20, 60, 160, 0.15)", letterSpacing: "-0.04em" }}
        >
          404
        </p>
        <h1
          className="font-light leading-[1.15] text-[#0A1344] text-[28px] md:text-[39px] lg:text-[49px] mt-4"
          style={{ fontFamily: "var(--font-hero)", letterSpacing: "-0.02em" }}
        >
          Lost at sea.
        </h1>
        <p
          className="mt-4 text-[16px] md:text-[18px] leading-[1.5]"
          style={{ color: "rgba(10, 19, 68, 0.45)", fontWeight: 400 }}
        >
          This page doesn&apos;t exist — but there&apos;s plenty more to explore.
        </p>
        <Link
          href="/"
          className="group flex items-center justify-between gap-5 leading-none hover:opacity-90 transition-opacity mt-10"
          style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, backgroundColor: "#000000", color: "white" }}
        >
          <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Back to shore</span>
          <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
