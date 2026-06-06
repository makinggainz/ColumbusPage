"use client";

import { useEffect, useRef, useState } from "react";
import {
  Clock,
  DollarSign,
  Filter,
  MapPinOff,
  LayoutGrid,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { GridSection, gl } from "../home/ContentGrid";

/* Each pain point pairs with a glyph that hints at its specific frustration.
   Icons + text both render in the same dark red so the strip reads as one
   alarming list. */
const RED = "#7F1D1D";

const PAIN_POINTS: { text: React.ReactNode; Icon: LucideIcon }[] = [
  { text: "A single site selection report takes your team weeks to months.", Icon: Clock },
  { text: "Legacy GIS requires specialists to operate their bulky complex apps.", Icon: DollarSign },
  { text: "Your analysts spend 80% of their time finding, cleaning and organizing data.", Icon: Filter },
  { text: <>Finding the <em>right</em> data to support your research is too difficult.</>, Icon: MapPinOff },
  { text: "You use 10 different complex apps for one single project.", Icon: LayoutGrid },
  { text: "Combining multiple types of large data on a single map is frustrating and costly.", Icon: Layers },
];

export default function ProblemCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ "--grid-line": "var(--ent-border-dark-grid)", backgroundColor: "transparent" } as React.CSSProperties}>
      <GridSection
        style={{
          backgroundColor: "transparent",
        }}
      >
        {/* Header row. This heading rides up onto the hero photo's bled-down
            lower edge, so a soft white radial gradient sits behind it as a
            legibility wash — bright at the centre, fading to transparent so
            the photo still reads around the text. */}
        <div
          className="flex flex-col items-center text-center px-6 md:px-10"
          style={{
            paddingTop: "var(--ent-section-sm)",
            paddingBottom: "var(--ent-section-sm)",
            background:
              "radial-gradient(ellipse 55% 100% at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.78) 42%, rgba(255,255,255,0) 78%)",
          }}
        >
          <h2
            className="leading-[1.1] text-[28px] md:text-[36px] lg:text-[44px]"
            style={{ fontWeight: 500, letterSpacing: "-0.02em", color: RED }}
          >
            Legacy GIS slows you down because...
          </h2>
        </div>
      </GridSection>

      {/* Card strip — edge-to-edge, no fill, no rounded corners. Each
          cell is bounded by hairline rules (top + bottom on the strip,
          right divider between cells) so the six pain points read as
          a grid of outlined boxes. Scrollable on mobile, grid on
          desktop. */}
      <div
        className="w-full overflow-x-auto lg:overflow-x-visible"
        style={{
          borderTop: "1px solid rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          className="flex lg:grid"
          style={{
            gridTemplateColumns: `repeat(${PAIN_POINTS.length}, 1fr)`,
          }}
        >
          {PAIN_POINTS.map(({ text, Icon }, i) => {
            const isLast = i === PAIN_POINTS.length - 1;
            return (
              <div
                key={i}
                className="shrink-0 lg:shrink lg:w-auto! lg:h-auto! px-9 py-5 lg:px-6 lg:py-12"
                style={{
                  width: 210,
                  height: 210,
                  borderRight: !isLast ? "1px solid rgba(0,0,0,0.08)" : undefined,
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: RED,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  textAlign: "center" as const,
                  letterSpacing: "-0.01em",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "9999px",
                    backgroundColor: "rgba(220,38,38,0.06)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} strokeWidth={1.75} color={RED} />
                </span>
                <span>{text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
