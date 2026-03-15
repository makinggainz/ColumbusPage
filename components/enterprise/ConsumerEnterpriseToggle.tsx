"use client";

import Link from "next/link";

export function ConsumerEnterpriseToggle() {
  return (
    <div className="flex items-center rounded-full border border-black/[0.07] bg-black/30 backdrop-blur-sm" style={{ width: "266px", height: "43px", padding: "3px" }}>
      <Link
        href="/products"
        className="flex-1 flex items-center justify-center rounded-full text-[16px] font-medium text-white/70 transition hover:text-white h-full"
      >
        Consumer
      </Link>
      <Link
        href="/enterprise"
        className="flex-1 flex items-center justify-center rounded-full text-[16px] font-medium text-white/70 transition h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.30)" }}
      >
        Enterprise
      </Link>
    </div>
  );
}
