"use client";

/**
 * Blueprint-style structural grid of squares behind content sections.
 * Uses a repeating CSS background so cells are always perfectly square.
 */
export function StructureGrid({ cellSize = 80 }: { cellSize?: number }) {
  const lineColor = "rgba(10,19,68,0.06)";

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
          borderLeft: `1px solid ${lineColor}`,
          borderRight: `1px solid ${lineColor}`,
          backgroundImage:
            `linear-gradient(to right, ${lineColor} 1px, transparent 1px), ` +
            `linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />
    </div>
  );
}
