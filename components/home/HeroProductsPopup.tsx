"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { PRODUCTS } from "@/lib/products";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function HeroProductsPopup({ open, onClose }: Props) {
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

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
           the trigger sits in the top-left corner of the popup. The
           original Products link is rendered above this popup via z-index
           so it stays put when the popup appears around it. */
        position: "absolute",
        top: -24,
        left: -24,
        zIndex: 40,
        /* Mirrors the navbar dropdown's open/close motion: maxHeight
           unrolls vertically while opacity fades. Different easings on
           open (decelerate) vs close (accelerate-then-fade-out). */
        overflow: "hidden",
        maxHeight: open ? "80vh" : "0px",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        willChange: "max-height, opacity",
        transition: open
          ? "max-height 500ms cubic-bezier(0.05, 0.7, 0.1, 1), opacity 200ms ease"
          : "max-height 400ms cubic-bezier(0.3, 0, 0.8, 0.15), opacity 250ms ease 200ms",
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
        {/* 2-up cards — 18px title + 14px subtitle, navy on light bg.
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
            return (
              <Link
                key={p.href}
                href={p.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                tabIndex={open ? 0 : -1}
                onClick={onClose}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <h5
                  style={{
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
