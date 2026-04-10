import Image from "next/image";
import Link from "next/link";

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 6H20V18H4V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6.5 10V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 7.25V7.3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M10.5 18V13.6C10.5 12.2 11.4 11.2 12.8 11.2C14.2 11.2 15 12.15 15 13.75V18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 18V13.85C18 12.1 17.05 10.85 15.2 10.85C13.8 10.85 12.95 11.55 12.6 12.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TechFooter() {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f59] via-[#13295f] to-[#48a7e8]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_72%,rgba(31,57,134,0.65),transparent_40%),radial-gradient(circle_at_55%_44%,rgba(39,64,153,0.5),transparent_45%),radial-gradient(circle_at_84%_14%,rgba(119,199,255,0.35),transparent_45%)]" />

      <div className="relative mx-auto max-w-[1860px] px-6 pb-14 pt-14 text-white sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <Image
                  src="/logobueno.png"
                  alt="Columbus Earth logo"
                  fill
                  sizes="64px"
                  className="object-contain brightness-0 invert"
                />
              </div>
              <h2 className="text-5xl font-semibold tracking-tight sm:text-6xl">Columbus Earth</h2>
            </div>
            <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-white/72">
              The frontier AI lab building the first production Universal Geospatial
              Model to answer the planet&apos;s toughest questions.
            </p>
            <div className="mt-6 flex items-center gap-5 text-white/88">
              <a
                href="mailto:contact@columbus.earth"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-white/12"
                aria-label="Email"
              >
                <MailIcon />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-white/12"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          <div className="space-y-4 text-[15px]">
            <p className="text-xs uppercase tracking-wide text-white/65">Product</p>
            <div className="space-y-3 text-[13px]">
              <Link href="#" className="block transition-opacity hover:opacity-80">
                Columbus Platform
              </Link>
              <Link href="#" className="block transition-opacity hover:opacity-80">
                Use-Cases
              </Link>
              <Link href="/maps-gpt" className="block transition-opacity hover:opacity-80">
                MapsGPT
              </Link>
            </div>
          </div>

          <div className="space-y-4 text-[15px]">
            <p className="text-xs uppercase tracking-wide text-white/65">Technology</p>
            <div className="space-y-3 text-[13px]">
              <Link href="#lgm-vs-llm" className="block transition-opacity hover:opacity-80">
                LGM vs LLM
              </Link>
              <Link href="#data-collection" className="block transition-opacity hover:opacity-80">
                Data Collection
              </Link>
              <Link href="#core-reasoning" className="block transition-opacity hover:opacity-80">
                Core Reasoning
              </Link>
              <Link href="#research-blog" className="block transition-opacity hover:opacity-80">
                Research Blog
              </Link>
            </div>
          </div>

          <div className="space-y-4 text-[15px]">
            <p className="text-xs uppercase tracking-wide text-white/65">Company</p>
            <div className="space-y-3 text-[13px]">
              <Link href="/mission" className="block transition-opacity hover:opacity-80">
                + Our Mission
              </Link>
              <Link href="#careers" className="block transition-opacity hover:opacity-80">
                + Careers
              </Link>
              <Link href="#" className="block transition-opacity hover:opacity-80">
                Legal
              </Link>
              <Link href="#" className="block transition-opacity hover:opacity-80">
                Report
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 text-sm text-white/70">
          Columbus Earth © 2026. For investor relations, contact us on email or
          LinkedIn.
        </p>
      </div>
    </footer>
  );
}
