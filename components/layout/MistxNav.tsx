"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

// Site-wide nav, ported verbatim from MistX (/Users/alexramirezblonski/
// Documents/MistX/components/nav/Nav.tsx) and adapted for ColumbusPage.
// Replaces the legacy <Navbar /> on every route. Adaptations:
//
//   • `bg-background`           → `bg-[#F1F5FE]`   (MistX pale-blue surface)
//   • `text-mistral-black`      → `text-[#1f1f1f]`
//   • `bg-mistral-black`        → `bg-[#1f1f1f]`
//   • `bg-mistral-beige-deep`   → `bg-[#DCE7FB]`
//   • `text-mistral-orange`     → `text-[#154ACC]` (rebrand blue, not orange)
//   • `border-mistral-orange`   → `border-[#154ACC]`
//   • `md:container`            → `max-w-[1287px] mx-5 md:mx-auto`  (matches this
//                                 project's content bounds; no inner padding so the
//                                 logo / "Try Elio" CTA sit flush with those bounds)
//   • Logo `/images/Columbo.png` → `/logobueno.png` (same asset, this project's
//     filename — verified ~149KB on both)
//
// Behavior, markup, ARIA semantics, hover/scroll dynamics are unchanged.
// Internal link `/enterprise` is repointed to `/products/enterprise` (the
// actual route on this project — a Next.js redirect would normalize the
// original but the direct link avoids a 308 hop).

type DropdownId = "products" | "research" | "blog" | "company";

const dropdowns: Record<
  DropdownId,
  { label: string; href?: string; items: { label: string; href: string }[] }
> = {
  products: {
    label: "Products",
    items: [
      { label: "Enterprise", href: "/products/enterprise" },
      { label: "Elio", href: "/elio" },
    ],
  },
  research: {
    label: "Research",
    href: "/research",
    items: [
      { label: "Models", href: "https://mistral.ai/models" },
      { label: "Magistral", href: "https://mistral.ai/news/magistral" },
      { label: "Open Source", href: "https://mistral.ai/news/open-source" },
      { label: "Papers", href: "https://mistral.ai/research" },
    ],
  },
  blog: {
    label: "Blog",
    href: "https://mistral.ai/news",
    items: [
      { label: "Latest Posts", href: "https://mistral.ai/news" },
      {
        label: "Product Updates",
        href: "https://mistral.ai/news/category/product",
      },
      {
        label: "Research",
        href: "https://mistral.ai/news/category/research",
      },
      {
        label: "Newsroom",
        href: "https://mistral.ai/news/category/newsroom",
      },
    ],
  },
  company: {
    label: "Company",
    items: [
      { label: "About", href: "https://mistral.ai/about" },
      { label: "Mission", href: "https://mistral.ai/mission" },
      { label: "Careers", href: "https://mistral.ai/careers" },
      { label: "Press", href: "https://mistral.ai/press" },
      { label: "Contact", href: "https://mistral.ai/contact" },
    ],
  },
};

/**
 * The double-stacked arrow icon MistX uses on every nav item — slides up
 * on hover (the chevron column rotates inside an h-3 overflow-hidden box).
 */
function NavArrowStack({ className = "" }: { className?: string }) {
  return (
    <div className={"h-3 overflow-hidden relative " + className}>
      <div className="h-6 flex flex-col transition-transform duration-200 group-hover:-translate-y-3">
        <ArrowDot className="rotate-90" />
        <ArrowDot className="-rotate-90" />
      </div>
    </div>
  );
}

function ArrowDot({ className = "" }: { className?: string }) {
  return (
    <svg
      className={"size-3 shrink-0 transition-transform duration-300 " + className}
      width="24"
      viewBox="0 0 9 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

export function MistxNav() {
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [elioOpen, setElioOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // True while the navbar is still in flow (not stuck to the viewport
  // top). While in flow on a hero page, the navbar stays transparent so
  // the hero image reads through. The moment its top edge reaches
  // viewport y=0 the navbar sticks, swaps to a solid white backdrop,
  // and the hairline divider appears. Pages without the hero marker
  // render the white backdrop on every scroll position.
  const [stuck, setStuck] = useState(false);
  // Optimistic default: assume a hero exists so home doesn't flash a
  // white backdrop on first paint. The effect below re-checks on mount
  // and flips this off on non-hero pages.
  const [hasHero, setHasHero] = useState(true);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setHasHero(!!document.querySelector("[data-hero-section]"));
    let raf = 0;
    const apply = () => {
      const el = headerRef.current;
      if (!el) return;
      setStuck(el.getBoundingClientRect().top <= 0.5);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        apply();
        raf = 0;
      });
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const showBackdrop = stuck || !hasHero;

  const navItemTriggerProps = (id: DropdownId) => ({
    onMouseEnter: () => setOpenDropdown(id),
    onMouseLeave: () => setOpenDropdown((d) => (d === id ? null : d)),
  });

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-100 w-full transition-[background-color] duration-300"
      style={{
        backgroundColor: showBackdrop ? "#FFFFFF" : "transparent",
      }}
    >
      {/* Content row — bounds match the page's content sections
          (max-w-[1287px] mx-5 md:mx-auto), no inner padding, so the logo's
          left edge and the "Try Elio" CTA's right edge sit flush with the
          page's left/right content bounds. */}
      <div className="max-w-[1287px] mx-5 md:mx-auto flex items-center py-6 relative z-10">
        {/* Left: logo + wordmark */}
        <div className="flex-1 flex items-center gap-3">
          <a
            rel="home"
            aria-label="Home"
            className="relative z-10 flex size-[34px] items-center justify-center"
            href="/"
          >
            <img
              alt="Columbus Logo"
              width={34}
              height={34}
              decoding="async"
              className="object-contain transition-[filter] duration-300"
              style={{
                color: "transparent",
                filter:
                  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
              }}
              src="/logobueno.png"
            />
          </a>
          <span
            className="hidden lg:flex items-center font-semibold leading-none whitespace-nowrap text-[#1f1f1f]"
            style={{
              fontFamily: "Axiforma, var(--font-hero), sans-serif",
              fontSize: 18,
              position: "relative",
              top: "3px",
            }}
          >
            Columbus Earth
          </span>
        </div>

        {/* Center: main nav links */}
        <nav
          className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2"
          aria-label="Main navigation"
        >
          {(Object.keys(dropdowns) as Array<DropdownId>).map((id) => {
            const dd = dropdowns[id];
            const isOpen = openDropdown === id;
            const triggerClass =
              "group py-4 flex items-center text-sm gap-2 transition-opacity duration-500 opacity-80 hover:opacity-100 text-[#1f1f1f]";
            return (
              <div key={id} className="relative" {...navItemTriggerProps(id)}>
                {dd.href ? (
                  <a
                    role="menuitem"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    href={dd.href}
                    className={triggerClass}
                  >
                    {dd.label}
                    <NavArrowStack />
                  </a>
                ) : (
                  <button
                    role="menuitem"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenDropdown((d) => (d === id ? null : id))
                    }
                    className={triggerClass}
                  >
                    {dd.label}
                    <NavArrowStack />
                  </button>
                )}
                {isOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full min-w-[240px] bg-[#F1F5FE] text-[#1f1f1f] shadow-lg py-2 z-50 rounded-b-[20px] overflow-hidden"
                    style={{ borderTop: "2px solid #154ACC" }}
                  >
                    <ul>
                      {dd.items.map((item) => (
                        <li key={item.href} role="none">
                          <a
                            role="menuitem"
                            className="block px-4 py-2 text-sm transition-colors hover:bg-[#DCE7FB]"
                            href={item.href}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: CTAs */}
        <div className="flex-1 flex items-center justify-end gap-2">
          {/* Contact */}
          <a
            target="_self"
            className="group rounded-[7px] px-5 py-2 text-sm hidden md:flex items-center truncate gap-2 transition-colors bg-transparent text-[#1f1f1f] hover:text-[#154ACC]"
            href="/contact"
          >
            Contact
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
              <ArrowDot className="text-[#154ACC]" />
            </span>
          </a>

          {/* Try Elio dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setElioOpen(true)}
            onMouseLeave={() => setElioOpen(false)}
          >
            <button
              className="group rounded-[7px] px-5 py-2 text-sm flex items-center gap-2 transition-colors bg-[#1f1f1f] text-white hover:text-[#154ACC]"
              aria-haspopup="menu"
              aria-expanded={elioOpen}
            >
              Try Elio
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                <NavArrowStack className="text-[#154ACC]" />
              </span>
            </button>
            {elioOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 min-w-[180px] bg-[#F1F5FE] text-[#1f1f1f] shadow-lg py-2 z-50 rounded-b-[20px] overflow-hidden"
                style={{ borderTop: "2px solid #154ACC" }}
              >
                <ul>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-4 py-2 text-sm transition-colors hover:bg-[#DCE7FB]"
                      href="#"
                    >
                      Try Elio
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-4 py-2 text-sm transition-colors hover:bg-[#DCE7FB]"
                      href="#"
                    >
                      Try Mapsurf
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-4 py-2 text-sm transition-colors hover:bg-[#DCE7FB]"
                      href="/products/enterprise"
                    >
                      Try Columbus
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            className="lg:hidden md:px-2 cursor-pointer text-[#1f1f1f]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="20"
                viewBox="0 0 75 63"
                fill="none"
                aria-hidden="true"
              >
                <path
                  opacity="0.5"
                  d="M49.76 49.76H0V62.20H49.76V49.76Z"
                  fill="currentColor"
                />
                <path
                  opacity="0.7"
                  d="M74.64 24.88H0V37.32H74.64V24.88Z"
                  fill="currentColor"
                />
                <path d="M74.64 0H0V12.44H74.64V0Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#F1F5FE] text-[#1f1f1f] z-20 px-6 py-6 shadow-lg max-h-[calc(100vh-100px)] overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {(Object.keys(dropdowns) as Array<DropdownId>).map((id) => {
              const dd = dropdowns[id];
              return (
                <li key={id}>
                  <div className="font-semibold mt-3 py-1">{dd.label}</div>
                  <ul className="flex flex-col gap-1 pl-4">
                    {dd.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="text-sm py-1 block hover:underline"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
            <li className="mt-6">
              <a
                href="/products/enterprise"
                className="block rounded-[7px] px-5 py-2 bg-[#1f1f1f] text-white text-sm text-center transition-colors hover:text-[#154ACC]"
              >
                Try Columbus
              </a>
            </li>
            <li className="mt-2">
              <a
                href="#"
                className="block rounded-[7px] px-5 py-2 bg-[#1f1f1f] text-white text-sm text-center transition-colors hover:text-[#154ACC]"
              >
                Try Elio
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
