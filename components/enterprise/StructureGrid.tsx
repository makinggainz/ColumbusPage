"use client";

/**
 * Blueprint-style structural grid of squares behind content sections.
 * Uses var(--grid-line) to match the home page line color.
 */
export function StructureGrid({ cellSize = 80 }: { cellSize?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "100%",
          maxWidth: 1287,
          borderLeft: "1px solid var(--grid-line)",
          borderRight: "1px solid var(--grid-line)",
          backgroundImage:
            `linear-gradient(to right, var(--grid-line) 1px, transparent 1px), ` +
            `linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />
    </div>
  );
}
