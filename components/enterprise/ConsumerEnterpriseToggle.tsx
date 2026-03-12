"use client";

export function ConsumerEnterpriseToggle() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-1 py-1 backdrop-blur-sm">
      <button
        type="button"
        className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white"
        aria-current="page"
      >
        Consumer
      </button>
      <button
        type="button"
        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition"
      >
        Enterprise
      </button>
    </div>
  );
}
