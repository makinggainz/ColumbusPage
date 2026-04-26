"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PRODUCTS } from "@/lib/products";
import { useDeferredVideoLoad } from "@/lib/useDeferredVideoLoad";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function HeroProductsPopup({ open, onClose }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useDeferredVideoLoad(videoRef, open);

  // Sync Elio video playback to its card hover.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const elioActive = open && hoveredIdx === 1;
    if (elioActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
      if (!open || hoveredIdx !== 1) video.currentTime = 0;
    }
  }, [open, hoveredIdx]);

  useEffect(() => {
    if (!open) setHoveredIdx(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      role="menu"
      aria-hidden={!open}
      style={{
        /* Wraps around the trigger: with padding=24px and offsets of -24,
           the popup's "Products >" header lands at exactly the same x/y
           the trigger occupies — when the trigger fades to 0 the popup's
           internal label takes its place visually. */
        position: "absolute",
        top: -24,
        left: -24,
        zIndex: 40,
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(-4px)",
        transition: open
          ? "opacity 220ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 220ms cubic-bezier(0.05, 0.7, 0.1, 1)"
          : "opacity 150ms ease, transform 150ms ease",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div
        style={{
          width: 520,
          padding: 24,
          background: "#FFFFFF",
          border: "1px solid rgba(10, 19, 68, 0.08)",
          boxShadow: "0 12px 40px rgba(10, 19, 68, 0.08), 0 2px 6px rgba(10, 19, 68, 0.04)",
        }}
      >
        {/* 2-up cards — same style as the navbar dropdown's product cards
            (16:10 image, 18px title, 14px subtitle, navy on light bg).
            The cards leave ~44px of clearance at the top of the popup so
            the actual hero "Products" trigger (raised via z-index above
            this popup) sits in that empty space without overlapping. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginTop: 44,
          }}
        >
          {PRODUCTS.map((p, i) => {
            const isElio = i === 1;
            return (
              <Link
                key={p.href}
                href={p.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                tabIndex={open ? 0 : -1}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx((cur) => (cur === i ? null : cur))}
                onFocus={() => setHoveredIdx(i)}
                onBlur={() => setHoveredIdx((cur) => (cur === i ? null : cur))}
                onClick={onClose}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16 / 10",
                    overflow: "hidden",
                    background: "#F5F5F5",
                  }}
                  aria-hidden
                >
                  <Image
                    src={p.img}
                    alt=""
                    fill
                    sizes="(min-width: 642px) 240px, 50vw"
                    className="object-cover object-top-left"
                    style={{
                      opacity: isElio && hoveredIdx === 1 ? 0 : 1,
                      transition: "opacity 250ms ease",
                    }}
                  />
                  {isElio && p.video && (
                    <video
                      ref={videoRef}
                      src={p.video}
                      loop
                      muted
                      playsInline
                      preload="none"
                      className="absolute inset-0 w-full h-full object-cover object-top-left"
                      style={{
                        opacity: hoveredIdx === 1 ? 1 : 0,
                        transition: "opacity 250ms ease",
                      }}
                    />
                  )}
                </div>
                <h5
                  style={{
                    marginTop: 16,
                    fontSize: 18,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.2,
                    color: "#0A1344",
                  }}
                >
                  {p.title}
                </h5>
                <p
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "rgba(10, 19, 68, 0.55)",
                  }}
                >
                  {p.subtitle}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
