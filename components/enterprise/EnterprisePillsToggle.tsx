"use client";

export function EnterprisePillsToggle() {
  const pills = ["Site Selection", "Geocoding", "Map Chat"];
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {pills.map((label) => (
        <button
          key={label}
          type="button"
          className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
