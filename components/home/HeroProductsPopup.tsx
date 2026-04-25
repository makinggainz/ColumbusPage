"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PRODUCTS } from "@/lib/products";

type Props = {
  open: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function HeroProductsPopup({ open, onClose, onMouseEnter, onMouseLeave }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        left: -16,
        zIndex: 40,
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(-8px)",
        transition: open
          ? "opacity 220ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 220ms cubic-bezier(0.05, 0.7, 0.1, 1)"
          : "opacity 150ms ease, transform 150ms ease",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 8,
          width: 280,
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(24px) saturate(0.55)",
          WebkitBackdropFilter: "blur(24px) saturate(0.55)",
          border: "1px solid rgba(10, 19, 68, 0.08)",
          boxShadow: "0 12px 40px rgba(10, 19, 68, 0.08), 0 2px 6px rgba(10, 19, 68, 0.04)",
        }}
      >
        {PRODUCTS.map((p, i) => {
          const isHovered = hoveredIdx === i;
          const showDivider = i < PRODUCTS.length - 1;
          return (
            <li key={p.href}>
              <Link
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
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 12px",
                  textDecoration: "none",
                  background: isHovered ? "rgba(10, 19, 68, 0.04)" : "transparent",
                  transition: "background 200ms ease",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    overflow: "hidden",
                    background: "#F5F5F5",
                  }}
                  aria-hidden
                >
                  <Image
                    src={p.img}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover object-top-left"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.2,
                      color: isHovered ? "#2563EB" : "#0A1344",
                      transition: "color 200ms ease",
                    }}
                  >
                    {p.title}
                  </span>
                  <span
                    style={{
                      marginTop: 2,
                      fontSize: 12,
                      lineHeight: 1.4,
                      color: isHovered ? "rgba(37, 99, 235, 0.75)" : "rgba(10, 19, 68, 0.55)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      transition: "color 200ms ease",
                    }}
                  >
                    {p.subtitle}
                  </span>
                </div>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateX(0)" : "translateX(-4px)",
                    transition: "opacity 200ms ease, transform 200ms ease",
                  }}
                >
                  <path d="M3 1l4 4-4 4" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {showDivider && (
                <div
                  aria-hidden
                  style={{
                    height: 1,
                    background: "linear-gradient(to right, var(--grid-line), transparent)",
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
