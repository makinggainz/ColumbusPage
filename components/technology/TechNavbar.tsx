import Link from "next/link";

function GlobeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1"
        fill="currentColor"
      />
    </svg>
  );
}

export function TechNavbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#0a1628]/10 bg-[#FFFFFF]">
      <div className="mx-auto flex h-[84px] w-full max-w-[1860px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-[#172654]">
          <GlobeMark className="h-7 w-7 text-[#172654]" />
          <span className="text-[22px] font-semibold leading-none tracking-tight">Columbus Earth</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-14 text-[13px] font-medium text-[#0a1628] lg:flex">
          <Link href="#" className="transition-opacity hover:opacity-70">
            Product
          </Link>
          <Link href="#" className="transition-opacity hover:opacity-70">
            Use Cases
          </Link>
          <Link href="/research" className="font-semibold transition-opacity hover:opacity-70" aria-current="page">
            Research
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="h-[46px] min-w-[132px] rounded-button-md border border-[#2a3963]/65 px-5 text-[13px] font-semibold text-[#192957] transition-colors hover:bg-[#192957]/6 sm:min-w-[168px]">
            Start Now
          </button>
          <button
            className="grid h-[46px] w-[46px] place-items-center rounded-button-md border border-[#2a3963]/65 transition-colors hover:bg-[#192957]/6"
            aria-label="Open menu"
            type="button"
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-[5px]">
              <span className="h-[2px] w-5 bg-[#192957]" />
              <span className="h-[2px] w-5 bg-[#192957]" />
              <span className="h-[2px] w-5 bg-[#192957]" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
