"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const CARD_W = 420;
// Transparent shadow padding baked into each PNG at display scale (~10px per side)
const PAD = 34;

// Heights scaled from 836px source width to CARD_W (420/836)
// 6 columns: 2 | 3 | 4 | 4 | 3 | 2 = 18 images
// Outer columns overflow off-screen left/right
const COLUMNS: { file: string; h: number }[][] = [
  [
    { file: "Group 1106.png", h: 383 },
    { file: "Group 1108.png", h: 468 },
  ],
  [
    { file: "Group 1109.png", h: 483 },
    { file: "Group 1110.png", h: 383 },
    { file: "Group 1111.png", h: 383 },
  ],
  [
    { file: "Group 1112.png", h: 474 },
    { file: "Group 1113.png", h: 446 },
    { file: "Group 1114.png", h: 383 },
    { file: "Group 1115.png", h: 390 },
  ],
  [
    { file: "Group 1116.png", h: 398 },
    { file: "Group 1117.png", h: 365 },
    { file: "Group 1118.png", h: 474 },
    { file: "Group 1325.png", h: 383 },
  ],
  [
    { file: "Group 1326.png", h: 383 },
    { file: "Group 1328.png", h: 383 },
    { file: "Group 1329.png", h: 390 },
  ],
  [
    { file: "Group 1330.png", h: 474 },
    { file: "Group 1331.png", h: 474 },
  ],
];

export default function SeeWhatPeopleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    filter:     visible ? "blur(0px)" : "blur(8px)",
    transform:  visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

  return (
    <section ref={sectionRef} className="bg-[#F6F7F8] pt-20 pb-32 relative overflow-hidden">

      {/* Title */}
      <h2
        className="text-center text-[clamp(28px,4vw,56px)] font-semibold text-[#0E2F44] mb-16 px-4"
        style={fadeIn(0)}
      >
        See what people are asking
      </h2>

      {/* 6-column layout — centered, outer columns bleed off-screen */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 0,
          ...fadeIn(0.15),
        }}
      >
        {COLUMNS.map((col, ci) => (
          <div
            key={ci}
            style={{
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              gap: 0,
            }}
          >
            {col.map(({ file, h }) => (
              // Cropping wrapper: hides transparent PNG shadow padding.
              // Layout size = content size (no gap), image offset inward by PAD.
              <div
                key={file}
                style={{
                  width: CARD_W - PAD * 2,
                  height: h - PAD * 2,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={`/people-asking/${encodeURIComponent(file)}`}
                  width={CARD_W}
                  height={h}
                  alt=""
                  draggable={false}
                  style={{
                    display: "block",
                    marginLeft: -PAD,
                    marginTop: -PAD,
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom fade — white gradient covering last ~2 card rows */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: 770,
          background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%)",
        }}
        aria-hidden
      />
    </section>
  );
}
