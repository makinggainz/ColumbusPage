"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const FADE_IN = 250;

const USE_CASES_IMAGES = [
  "comercial.png", "planning.png", "residentila.png", "geomarketing.png",
  "logistics.png", "security.png", "research.png", "tourism.png", "env.png",
];

export default function UseCasesHero() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lockedSet, setLockedSet] = useState<Set<number>>(() => new Set());
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const gridRef = useRef<HTMLDivElement>(null);
  const prevCellRef = useRef<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textCells, setTextCells] = useState<Set<number>>(() => new Set());

  const cellSize = 112;
  const cols = 27;
  const rows = 14;
  const totalCells = cols * rows;

  const activateCell = useCallback((i: number) => {
    const existing = timersRef.current.get(i);
    if (existing) clearTimeout(existing);

    setActiveIndex(i);
    setLockedSet(prev => { const next = new Set(prev); next.add(i); return next; });

    timersRef.current.set(i, setTimeout(() => {
      setLockedSet(prev => { const next = new Set(prev); next.delete(i); return next; });
      timersRef.current.delete(i);
    }, FADE_IN));
  }, []);

  // Bresenham-style interpolation: activate all cells between prev and current
  const activateLine = useCallback((from: number, to: number) => {
    const x0 = from % cols, y0 = Math.floor(from / cols);
    const x1 = to % cols, y1 = Math.floor(to / cols);
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy, cx = x0, cy = y0;
    while (true) {
      const idx = cy * cols + cx;
      if (idx >= 0 && idx < cols * rows) activateCell(idx);
      if (cx === x1 && cy === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; cx += sx; }
      if (e2 < dx) { err += dx; cy += sy; }
    }
  }, [cols, activateCell]);

  const handleGridMove = useCallback((e: React.MouseEvent) => {
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / cellSize);
    const row = Math.floor((e.clientY - rect.top) / cellSize);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return;
    const i = row * cols + col;

    if (prevCellRef.current !== null && prevCellRef.current !== i) {
      activateLine(prevCellRef.current, i);
    } else {
      activateCell(i);
    }
    prevCellRef.current = i;
  }, [cols, rows, cellSize, activateCell, activateLine]);

  const handleGridLeave = useCallback(() => {
    setActiveIndex(null);
    prevCellRef.current = null;
  }, []);

  // Compute which cells sit behind the center text block
  useEffect(() => {
    const grid = gridRef.current;
    const text = textRef.current;
    if (!grid || !text) return;
    const compute = () => {
      const gRect = grid.getBoundingClientRect();
      const tRect = text.getBoundingClientRect();
      const behind = new Set<number>();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = gRect.left + c * cellSize;
          const cy = gRect.top + r * cellSize;
          // Check overlap
          if (cx + cellSize > tRect.left && cx < tRect.right && cy + cellSize > tRect.top && cy < tRect.bottom) {
            behind.add(r * cols + c);
          }
        }
      }
      setTextCells(behind);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [cols, rows, cellSize]);

  return (
    <section className="relative w-full min-h-[1055px] flex items-center justify-center overflow-hidden bg-black">

      {/* Interactive grid: image in a square only visible when that square is hovered */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridAutoRows: `${cellSize}px`,
          maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 90%)",
        }}
        onMouseMove={handleGridMove}
        onMouseLeave={handleGridLeave}
        aria-hidden
      >
        {Array.from({ length: totalCells }, (_, i) => (
          <div
            key={i}
            className="relative w-full h-full overflow-hidden"
            style={{ width: cellSize, height: cellSize }}
          >
            <Image
              src={`/use-cases/${USE_CASES_IMAGES[i % USE_CASES_IMAGES.length]}`}
              alt=""
              fill
              className="object-cover"
              style={{
                opacity: (activeIndex === i || lockedSet.has(i)) ? (textCells.has(i) ? 0.45 : 0.6) : 0,
                transition: (activeIndex === i || lockedSet.has(i))
                  ? `opacity ${FADE_IN}ms ease-out`
                  : "opacity 1000ms ease-out",
              }}
              sizes={`${cellSize}px`}
            />
            {/* Blue accent tint */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "rgba(0, 102, 204, 0.35)",
                mixBlendMode: "color",
                opacity: (activeIndex === i || lockedSet.has(i)) ? 1 : 0,
                transition: (activeIndex === i || lockedSet.has(i))
                  ? `opacity ${FADE_IN}ms ease-out`
                  : "opacity 1000ms ease-out",
              }}
            />
          </div>
        ))}
      </div>

      {/* THIN-LINE GRID — 150px × 150px squares, fades out from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #29303D 1px, transparent 1px),
            linear-gradient(to bottom, #29303D 1px, transparent 1px)
          `,
          backgroundSize: "112px 112px",
          maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 90%)",
        }}
        aria-hidden
      />

      {/* CENTER CONTENT */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center text-center px-6 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      >

        <p className="text-gray-400 text-[32px] mb-4 max-md:text-[14px] font-normal">
          An agentic approach to geography and space
        </p>

        <h1
          className="font-semibold text-[64px] leading-[140%] max-md:text-[36px] bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(to right, #ffffff 0%, #B0B0B0 100%)", fontWeight: 600 }}
        >
          More than Site Selection
        </h1>

        <p className="text-gray-400 text-[32px] mt-3 max-md:text-[16px] font-normal">
          Industry use cases of Columbus Pro
        </p>

      </div>

    </section>
  );
}